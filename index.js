// ============================================
// 🤖 INSTA TREND AI — Your Instagram Growth Assistant
// ============================================
// Only needs: TELEGRAM_BOT_TOKEN + ANTHROPIC_API_KEY
// Everything else is configured via chat!
// ============================================

require('dotenv').config();
const fs = require('fs');
const path = require('path');

// ============ LOAD API KEYS ============
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

if (!TELEGRAM_TOKEN || TELEGRAM_TOKEN.includes('your_') || !ANTHROPIC_KEY || ANTHROPIC_KEY.includes('your_')) {
  console.log('\n🤖 INSTA TREND AI — Setup Required\n');
  console.log('1. cp .env.example .env');
  console.log('2. Add your TELEGRAM_BOT_TOKEN and ANTHROPIC_API_KEY');
  console.log('3. npm start\n');
  console.log('That\'s it! The bot will ask users for their niche, creators, etc. via chat.\n');
  process.exit(1);
}

// ============ USER PROFILES (saved to disk) ============
const PROFILES_FILE = path.join(__dirname, 'profiles.json');
let profiles = {};

function loadProfiles() {
  try {
    if (fs.existsSync(PROFILES_FILE)) {
      profiles = JSON.parse(fs.readFileSync(PROFILES_FILE, 'utf8'));
      console.log('   📁 Loaded ' + Object.keys(profiles).length + ' user profiles');
    }
  } catch (e) { profiles = {}; }
}

function saveProfiles() {
  try { fs.writeFileSync(PROFILES_FILE, JSON.stringify(profiles, null, 2)); } catch (e) {}
}

function getProfile(chatId) {
  return profiles[chatId] || null;
}

function setProfile(chatId, data) {
  profiles[chatId] = { ...profiles[chatId], ...data, updatedAt: new Date().toISOString() };
  saveProfiles();
}

loadProfiles();

// ============ ONBOARDING FLOW ============
const SETUP_STEPS = {
  niche: {
    question: '📌 *What\'s your Instagram niche?*\n\nBe specific! The more specific, the better my advice.\n\n_Examples:_\n• fitness for working moms\n• street food reviews\n• tech gadgets under ₹5000\n• minimal home decor\n• personal finance for 20s\n\nJust type your niche:',
    field: 'niche',
    next: 'creators',
  },
  creators: {
    question: '⭐ *Which creators do you admire?*\n\nShare 2-5 Instagram handles of creators in your niche whose strategy you want to learn from.\n\n_Example:_ @beerbiceps, @ranveerallahbadia, @tanmaybhat\n\nType the handles (comma separated):',
    field: 'creators',
    next: 'audience',
  },
  audience: {
    question: '👥 *Who\'s your target audience?*\n\nDescribe who you\'re creating content for.\n\n_Examples:_\n• 18-25 year old Indian men into fitness\n• women entrepreneurs in tier 2 cities\n• college students interested in tech\n• working professionals who want to cook\n\nDescribe your audience:',
    field: 'audience',
    next: 'language',
  },
  language: {
    question: '🗣️ *What language do you create content in?*\n\nThis helps me write captions and hooks in your style.\n\n1️⃣ English\n2️⃣ Hindi\n3️⃣ Hinglish (mix)\n4️⃣ Tamil\n5️⃣ Telugu\n6️⃣ Other\n\nType your language:',
    field: 'language',
    next: 'done',
  },
};

// ============ TELEGRAM POLLING ============
let offset = 0;

async function poll() {
  while (true) {
    try {
      const res = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_TOKEN}/getUpdates?offset=${offset}&timeout=30`
      );
      const data = await res.json();
      if (data.ok && data.result.length > 0) {
        for (const update of data.result) {
          offset = update.update_id + 1;
          handleUpdate(update).catch(err => console.error('Error:', err.message));
        }
      }
    } catch (err) {
      console.error('Poll error:', err.message);
      await new Promise(r => setTimeout(r, 3000));
    }
  }
}

// ============ HANDLER ============
async function handleUpdate(update) {
  const msg = update.message;
  if (!msg || !msg.text) return;

  const chatId = msg.chat.id;
  const text = msg.text.trim();
  const name = msg.from?.first_name || 'Creator';
  const profile = getProfile(chatId);

  await sendAction(chatId, 'typing');

  // /start — always works
  if (text === '/start') {
    if (profile && profile.niche) {
      return send(chatId, welcomeBack(name, profile));
    }
    // Start onboarding
    setProfile(chatId, { name, setupStep: 'niche' });
    await send(chatId, `🔥 *Hey ${name}! Welcome to Insta Trend AI*\n\nI'm your AI-powered Instagram growth assistant. Let me personalize everything for you.\n\nQuick setup — just 4 questions! 👇`);
    return send(chatId, SETUP_STEPS.niche.question);
  }

  // /setup — redo onboarding
  if (text === '/setup') {
    setProfile(chatId, { name, setupStep: 'niche' });
    return send(chatId, SETUP_STEPS.niche.question);
  }

  // /profile — show current profile
  if (text === '/profile') {
    if (!profile || !profile.niche) return send(chatId, '⚠️ No profile yet. Send /start to set up!');
    return send(chatId, profileCard(profile));
  }

  // /help
  if (text === '/help') return send(chatId, helpMsg(profile));

  // Handle onboarding answers
  if (profile && profile.setupStep && SETUP_STEPS[profile.setupStep]) {
    const step = SETUP_STEPS[profile.setupStep];
    setProfile(chatId, { [step.field]: text });

    if (step.next === 'done') {
      // Onboarding complete
      setProfile(chatId, { setupStep: null });
      const p = getProfile(chatId);
      return send(chatId, `✅ *All set! Here\'s your profile:*\n\n` + profileCard(p) + `\n\n🚀 *You\'re ready!* Try these:\n• /trends — trending ideas for ${p.niche}\n• /report — full weekly strategy\n• /caption \`your idea\` — viral captions\n\nOr just type any question about Instagram growth!`);
    }

    // Next step
    setProfile(chatId, { setupStep: step.next });
    return send(chatId, `✅ Got it!\n\n` + SETUP_STEPS[step.next].question);
  }

  // Not set up yet
  if (!profile || !profile.niche) {
    setProfile(chatId, { name, setupStep: 'niche' });
    await send(chatId, '👋 Looks like we haven\'t met! Let me set up your profile.\n\nQuick setup — 4 questions:');
    return send(chatId, SETUP_STEPS.niche.question);
  }

  // ============ COMMANDS (only work after setup) ============

  if (text === '/report') {
    await send(chatId, '📊 Generating your personalized weekly report...');
    await sendAction(chatId, 'typing');
    return send(chatId, await askAI(buildPrompt('report', null, profile)));
  }

  const cmds = {
    '/trends': 'trends',
    '/hashtags': 'hashtags',
    '/caption': 'caption',
    '/hook': 'hook',
    '/calendar': 'calendar',
    '/besttimes': 'bestTimes',
    '/tips': 'tips',
  };

  for (const [cmd, key] of Object.entries(cmds)) {
    if (text.startsWith(cmd)) {
      const arg = text.replace(cmd, '').trim();
      if (!arg && ['hashtags', 'caption', 'hook'].includes(key)) {
        return send(chatId, `💡 Usage: \`${cmd} your topic here\``);
      }
      return send(chatId, await askAI(buildPrompt(key, arg, profile)));
    }
  }

  // Free text
  return send(chatId, await askAI(buildPrompt('freeChat', text, profile)));
}

// ============ BUILD PERSONALIZED PROMPTS ============
function buildSystemPrompt(profile) {
  return `You are an expert Instagram growth strategist and content advisor. You give actionable, specific advice — never generic fluff.

📌 CREATOR PROFILE:
- Niche: ${profile.niche}
- Target Audience: ${profile.audience || 'general'}
- Content Language: ${profile.language || 'english'}
- Creators they admire: ${profile.creators || 'top creators'}

📋 RULES:
- Every suggestion must be specific to "${profile.niche}" niche
- Reference strategies used by ${profile.creators || 'top creators in this niche'}
- Content ideas for audience: ${profile.audience || 'general'}
- Write captions/hooks in ${profile.language || 'english'}
- Use emojis for Telegram readability
- Format for Telegram Markdown (*bold*, _italic_)
- Algorithm priority: saves > shares > comments > likes
- Give actionable steps, not theory`;
}

function buildPrompt(type, arg, profile) {
  const SYS = buildSystemPrompt(profile);
  const n = arg || profile.niche;

  const templates = {
    trends: `${SYS}\n\nGive 8 trending content ideas for "${n}" niche on Instagram RIGHT NOW (March 2026).\n\nFor each:\n1️⃣ *Content Idea* — specific\n2️⃣ *Format* — Reel/Carousel/Post\n3️⃣ *Hook* — first 3 seconds in ${profile.language || 'english'}\n4️⃣ *Why it works*\n5️⃣ *Engagement potential* — 🔥/⚡/💡\n6️⃣ *Reference* — similar creator\n\nMake it specific to ${profile.audience || 'general audience'}.`,

    hashtags: `${SYS}\n\nGenerate 30 Instagram hashtags for: "${arg}" in ${profile.niche} niche.\n\n🔥 *High Volume (1M+)* — 10 hashtags\n⚡ *Medium (100K-1M)* — 10 hashtags\n🎯 *Niche (<100K)* — 10 hashtags\n\nPlus 3 copy-paste sets of 10 each:\n- Set 1: Reels\n- Set 2: Carousels\n- Set 3: Stories\n\nFormat with #.`,

    caption: `${SYS}\n\nWrite 3 Instagram captions for: "${arg}" in *${profile.language || 'english'}*\n\n*Caption 1 — Short* (2-3 lines)\n*Caption 2 — Story* (5-7 lines)\n*Caption 3 — Long Value* (10+ lines)\n\nEach needs: hook, body, CTA, 5 hashtags, emojis.`,

    hook: `${SYS}\n\nGenerate 10 scroll-stopping Reel hooks for: "${arg}" in *${profile.language || 'english'}*\n\nFor each:\n🎣 *Hook* — exact words\n📝 *Text Overlay*\n🎬 *Visual*\n💡 *Why it works*\n\nMix: 2 controversy, 2 hacks, 2 story, 2 relatable, 2 educational.`,

    calendar: `${SYS}\n\n7-day Instagram content calendar for "${n}" niche.\n\nPer day:\n📅 *Day & Theme*\n📱 *Format*\n💡 *Content Idea*\n🎣 *Hook* in ${profile.language || 'english'}\n⏰ *Post Time (IST)*\n#️⃣ *5 Hashtags*\n📊 *Goal*\n\nMix: 3 Reels, 2 Carousels, 1 Story, 1 Community post.`,

    bestTimes: `${SYS}\n\nBest posting times for "${n}" targeting ${profile.audience || 'general'}.\n\n⏰ Daily schedule (IST) Mon-Sun\n📱 By format: Reels/Carousels/Stories\n🌍 Global audience times\n🚫 Worst times\n💡 How to find YOUR best times`,

    tips: `${SYS}\n\n10 actionable growth tips for "${n}" creators targeting ${profile.audience || 'general'}.\n\nPer tip:\n💡 *Tip*\n📈 *Impact*\n🛠️ *Steps*\n⏱️ *Effort:* Quick Win/Medium/Long\n🔍 *Example* from ${profile.creators || 'top creators'}\n\n3 algorithm hacks, 2 content, 2 engagement, 1 monetization, 1 profile, 1 collab.`,

    report: `${SYS}\n\nGenerate a weekly Instagram growth report for "${profile.niche}" creator.\n\n📊 *NICHE ANALYSIS:* What's working, what's oversaturated, emerging angles\n👥 *AUDIENCE INSIGHTS:* What ${profile.audience || 'the audience'} engages with\n🔥 *THIS WEEK:* 3 must-try ideas, 1 trending format, 1 collab idea\n📈 *CREATOR ANALYSIS:* What ${profile.creators || 'top creators'} are doing, what to learn, how to differentiate\n🎯 *ACTION ITEMS:* 5 specific things to do THIS WEEK\n\nMake it feel like a personalized consulting report.`,

    freeChat: `${SYS}\n\nCreator asks: "${arg}"\n\nGive helpful, specific, actionable response for ${profile.niche} niche. Suggest commands where useful: /trends /hashtags /caption /hook /calendar /besttimes /tips /report`,
  };

  return templates[type] || templates.freeChat;
}

// ============ AI ============
async function askAI(prompt) {
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await res.json();
    return data.content?.[0]?.text || '⚠️ Could not generate response. Try again.';
  } catch (err) {
    console.error('AI error:', err.message);
    return '⚠️ AI temporarily unavailable. Try again.';
  }
}

// ============ TELEGRAM ============
async function send(chatId, text) {
  const chunks = splitMsg(text);
  for (const chunk of chunks) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: chunk, parse_mode: 'Markdown', disable_web_page_preview: true }),
      });
      const data = await res.json();
      if (!data.ok && data.description && data.description.includes('parse')) {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: chunk }),
        });
      }
    } catch (err) { console.error('Send error:', err.message); }
  }
}

async function sendAction(chatId, action) {
  await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendChatAction`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, action }),
  }).catch(() => {});
}

function splitMsg(text) {
  if (text.length <= 4000) return [text];
  const chunks = [];
  let r = text;
  while (r.length > 0) {
    if (r.length <= 4000) { chunks.push(r); break; }
    let i = r.lastIndexOf('\n', 4000);
    if (i < 2000) i = r.lastIndexOf(' ', 4000);
    if (i < 0) i = 4000;
    chunks.push(r.substring(0, i));
    r = r.substring(i + 1);
  }
  return chunks;
}

// ============ MESSAGE TEMPLATES ============
function profileCard(p) {
  let card = `📌 *Niche:* ${p.niche}`;
  if (p.creators) card += `\n⭐ *Creators:* ${p.creators}`;
  if (p.audience) card += `\n👥 *Audience:* ${p.audience}`;
  if (p.language) card += `\n🗣️ *Language:* ${p.language}`;
  card += `\n\n_Send /setup to change your profile_`;
  return card;
}

function welcomeBack(name, p) {
  return `👋 *Welcome back, ${name}!*\n\n` + profileCard(p) + `\n\n*Commands:*\n📈 /trends — Trending ideas for ${p.niche}\n#️⃣ /hashtags \`[topic]\` — 30 hashtags\n✍️ /caption \`[idea]\` — 3 viral captions\n🎣 /hook \`[topic]\` — Reel hooks\n📅 /calendar — 7-day plan\n⏰ /besttimes — When to post\n💡 /tips — Growth hacks\n📊 /report — Weekly strategy\n⚙️ /setup — Change profile\n\nOr just *type any question!*`;
}

function helpMsg(p) {
  const n = p && p.niche ? p.niche : 'your niche';
  return `🤖 *Insta Trend AI — Commands*\n\n📈 /trends — Trending ideas for ${n}\n#️⃣ /hashtags \`[topic]\` — 30 hashtags\n✍️ /caption \`[idea]\` — 3 caption styles\n🎣 /hook \`[topic]\` — 10 reel hooks\n📅 /calendar — Week plan\n⏰ /besttimes — Posting schedule\n💡 /tips — Growth strategies\n📊 /report — Full weekly report\n⚙️ /setup — Change your profile\n👤 /profile — View your profile\n\n💬 Or *type anything!*`;
}

// ============ START ============
console.log('');
console.log('🤖 Insta Trend AI is running!');
console.log('');
console.log('   Bot asks users for niche, creators, audience via chat');
console.log('   Profiles saved to profiles.json');
console.log('');
console.log('   Open your bot on Telegram and send /start');
console.log('   Press Ctrl+C to stop');
console.log('');

poll();