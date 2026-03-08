// ============================================
// 🤖 INSTA TREND AI — Your Instagram Growth Assistant
// ============================================

require('dotenv').config();

// ============ LOAD CONFIG ============
const CONFIG = {
  telegramToken: process.env.TELEGRAM_BOT_TOKEN,
  anthropicKey: process.env.ANTHROPIC_API_KEY,
  niche: process.env.MY_NICHE || 'general',
  creators: process.env.MY_FAVORITE_CREATORS || '',
  audience: process.env.MY_AUDIENCE || 'general audience',
  language: process.env.MY_LANGUAGE || 'english',
  instagram: process.env.MY_INSTAGRAM || '',
};

// ============ VALIDATE ============
function validateConfig() {
  const missing = [];
  if (!CONFIG.telegramToken || CONFIG.telegramToken.includes('your_')) missing.push('TELEGRAM_BOT_TOKEN');
  if (!CONFIG.anthropicKey || CONFIG.anthropicKey.includes('your_')) missing.push('ANTHROPIC_API_KEY');

  if (missing.length > 0) {
    console.log('\n🤖 INSTA TREND AI — Setup Required\n');
    console.log('Missing keys:', missing.join(', '));
    console.log('\n📋 Quick Setup:');
    console.log('   1. cp .env.example .env');
    console.log('   2. Edit .env with your keys');
    console.log('   3. npm start\n');
    console.log('📌 Get your keys:');
    console.log('   Telegram: Message @BotFather → /newbot');
    console.log('   Anthropic: https://console.anthropic.com\n');
    process.exit(1);
  }
}

validateConfig();

// ============ PERSONALIZED SYSTEM PROMPT ============
function getSystemPrompt() {
  let prompt = `You are an expert Instagram growth strategist and content advisor. You give actionable, specific advice — never generic fluff.

📌 CREATOR PROFILE:
- Niche: ${CONFIG.niche}
- Target Audience: ${CONFIG.audience}
- Content Language: ${CONFIG.language}`;

  if (CONFIG.creators) {
    prompt += `\n- Creators they admire: ${CONFIG.creators}`;
  }
  if (CONFIG.instagram) {
    prompt += `\n- Their handle: ${CONFIG.instagram}`;
  }

  prompt += `

📋 RULES:
- Every suggestion must be specific to their "${CONFIG.niche}" niche
- Reference strategies used by creators like ${CONFIG.creators || 'top creators in this niche'}
- Content ideas should work for their audience: ${CONFIG.audience}
- Write captions/hooks in ${CONFIG.language} language
- Use emojis for Telegram readability
- Format for Telegram Markdown (*bold*, _italic_)
- Think about the Instagram algorithm: saves > shares > comments > likes
- Give actionable steps, not theory
- If relevant, suggest trending audio/format ideas`;

  return prompt;
}

const SYS = getSystemPrompt();

// ============ PROMPTS ============
const prompts = {
  trends: (niche) => `${SYS}

Give 8 trending content ideas for the "${niche || CONFIG.niche}" niche on Instagram RIGHT NOW (March 2026).

For each idea:
1️⃣ *Content Idea* — specific, not vague
2️⃣ *Format* — Reel / Carousel / Post
3️⃣ *Hook* — first 3 seconds or first line
4️⃣ *Why it works* — algorithm + audience psychology
5️⃣ *Engagement potential* — 🔥 high / ⚡ medium / 💡 safe bet
6️⃣ *Reference* — which creator does something similar

Make it specific to ${CONFIG.audience}. Write hooks in ${CONFIG.language}.`,

  hashtags: (topic) => `${SYS}

Generate 30 Instagram hashtags for: "${topic}" in the ${CONFIG.niche} niche.

Organize:
🔥 *High Volume (1M+)* — 10 hashtags for maximum reach
⚡ *Medium (100K-1M)* — 10 for discovery page
🎯 *Niche (<100K)* — 10 for targeted ${CONFIG.audience}

Then give 3 copy-paste ready sets of 10 hashtags each:
- Set 1: For Reels
- Set 2: For Carousels/Posts
- Set 3: For Stories/Engagement posts

Format with # — make them instantly copyable.`,

  caption: (idea) => `${SYS}

Write 3 Instagram captions for: "${idea}"

All captions should be in *${CONFIG.language}* language, targeting ${CONFIG.audience}.

*Caption 1 — Short & Punchy* (2-3 lines)
*Caption 2 — Storytelling* (5-7 lines)
*Caption 3 — Long Value Post* (10+ lines)

Each caption needs:
- Strong hook (first line)
- Body with personality
- CTA (save/share/comment/follow)
- 5 relevant hashtags
- Emoji usage that fits the vibe`,

  hook: (topic) => `${SYS}

Generate 10 scroll-stopping hooks for Instagram Reels about: "${topic}"

Write hooks in *${CONFIG.language}* language.

For each:
🎣 *Hook* — exact words for first 3 seconds
📝 *Text Overlay* — what to show on screen
🎬 *Visual* — what to film/show
💡 *Psychology* — why it stops the scroll

Mix:
- 2 Controversy/Hot takes
- 2 Secret/Hack reveals
- 2 Storytelling ("I did X and this happened...")
- 2 Relatable/Funny
- 2 Educational/Value bombs

Target audience: ${CONFIG.audience}`,

  calendar: (niche) => `${SYS}

Create a 7-day Instagram content calendar for "${niche || CONFIG.niche}" niche.

For each day:
📅 *Day & Theme*
📱 *Format:* Reel / Carousel / Story / Post
💡 *Content Idea* — specific topic (not vague)
🎣 *Hook* — in ${CONFIG.language}
⏰ *Best Time to Post* (IST)
#️⃣ *5 Hashtags*
📊 *Goal:* Reach / Saves / Comments / Shares

Strategic mix:
- Mon: Educational Reel (reach)
- Tue: Carousel (saves)
- Wed: Trending/Relatable Reel (shares)
- Thu: Story series (engagement)
- Fri: Value Post or Carousel (saves)
- Sat: Fun/Behind-the-scenes Reel (reach)
- Sun: Community/Q&A post (comments)

Make it executable — creator should be able to start filming immediately.`,

  bestTimes: (niche) => `${SYS}

Best posting times for "${niche || CONFIG.niche}" targeting ${CONFIG.audience}:

⏰ *Daily Schedule (IST):*
Give specific times for each day — Mon through Sun.

📱 *By Format:*
- Reels: best times
- Carousels: best times
- Stories: best posting windows
- Lives: when to go live

🌍 *If targeting global audience:*
- US audience times
- UK audience times

🚫 *Worst times to post*

💡 *Pro Tips:*
- How to use Instagram Insights to find YOUR best times
- The 30-minute rule after posting
- Story timing for maximum views`,

  tips: (niche) => `${SYS}

10 actionable Instagram growth tips for "${niche || CONFIG.niche}" creators targeting ${CONFIG.audience}.

For each tip:
💡 *The Tip* — specific and actionable
📈 *Impact* — what this does for growth
🛠️ *Steps* — exactly how to do it
⏱️ *Effort:* Quick Win / Medium / Long Game
🔍 *Example* — reference how ${CONFIG.creators || 'top creators'} use this

Cover:
- 3 Algorithm hacks
- 2 Content strategies
- 2 Engagement tactics
- 1 Monetization angle
- 1 Profile optimization
- 1 Collaboration strategy

NO generic advice. Everything must be specific to ${CONFIG.niche}.`,

  report: () => `${SYS}

Generate a weekly Instagram growth report and strategy for a "${CONFIG.niche}" creator.

📊 *NICHE ANALYSIS:*
- Current state of ${CONFIG.niche} on Instagram
- What's working right now in this space
- What's oversaturated / to avoid
- Emerging sub-niches or angles

👥 *AUDIENCE INSIGHTS:*
- What ${CONFIG.audience} engages with most
- Content preferences (format, length, tone)
- Peak activity patterns

🔥 *THIS WEEK'S STRATEGY:*
- 3 must-try content ideas
- 1 trending format to jump on
- 1 collaboration idea
- Best performing content type prediction

📈 *CREATOR ANALYSIS:*
Analyze what ${CONFIG.creators || 'top creators in ' + CONFIG.niche} are doing:
- Their recent winning content patterns
- What you can learn from them
- How to differentiate from them

🎯 *ACTION ITEMS:*
Give 5 specific things to do THIS WEEK, prioritized by impact.

Make this feel like a personalized consulting report.`,

  freeChat: (q) => `${SYS}

Creator asks: "${q}"

Give a helpful, specific, actionable response personalized to their ${CONFIG.niche} niche and ${CONFIG.audience} audience.

Write in a conversational tone. If relevant, suggest commands:
/trends, /hashtags, /caption, /hook, /calendar, /besttimes, /tips, /report`,
};

// ============ TELEGRAM POLLING ============
let offset = 0;

async function poll() {
  while (true) {
    try {
      const res = await fetch(
        `https://api.telegram.org/bot${CONFIG.telegramToken}/getUpdates?offset=${offset}&timeout=30`
      );
      const data = await res.json();

if (data.ok && data.result.length > 0) {
  console.log('Got', data.result.length, 'updates');
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

  await sendAction(chatId, 'typing');

  if (text === '/start') return send(chatId, welcomeMsg(name));
  if (text === '/help') return send(chatId, helpMsg());

  if (text === '/report') {
    await send(chatId, '📊 Generating your personalized weekly report...');
    await sendAction(chatId, 'typing');
    return send(chatId, await askAI(prompts.report()));
  }

  const commands = {
    '/trends': prompts.trends,
    '/hashtags': prompts.hashtags,
    '/caption': prompts.caption,
    '/hook': prompts.hook,
    '/calendar': prompts.calendar,
    '/besttimes': prompts.bestTimes,
    '/tips': prompts.tips,
  };

  for (const [cmd, fn] of Object.entries(commands)) {
    if (text.startsWith(cmd)) {
      const arg = text.replace(cmd, '').trim();
      if (!arg && ['/hashtags', '/caption', '/hook'].includes(cmd)) {
        return send(chatId, `💡 Usage: \`${cmd} your topic here\``);
      }
      return send(chatId, await askAI(fn(arg)));
    }
  }

  // Free text
  return send(chatId, await askAI(prompts.freeChat(text)));
}

// ============ AI ============
async function askAI(prompt) {
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CONFIG.anthropicKey,
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
      const res = await fetch(`https://api.telegram.org/bot${CONFIG.telegramToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: chunk, parse_mode: 'Markdown', disable_web_page_preview: true }),
      });
      const data = await res.json();
      // If Markdown fails, retry plain
      if (!data.ok && data.description && data.description.includes('parse')) {
        await fetch(`https://api.telegram.org/bot${CONFIG.telegramToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: chunk }),
        });
      }
    } catch (err) {
      console.error('Send error:', err.message);
    }
  }
}

async function sendAction(chatId, action) {
  await fetch(`https://api.telegram.org/bot${CONFIG.telegramToken}/sendChatAction`, {
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

// ============ WELCOME ============
function welcomeMsg(name) {
  return `🔥 *Hey ${name}! Welcome to Insta Trend AI*

I'm your personal Instagram growth assistant, configured for *${CONFIG.niche}* niche.

*Your Profile:*
📌 Niche: ${CONFIG.niche}
👥 Audience: ${CONFIG.audience}
🗣️ Language: ${CONFIG.language}
${CONFIG.creators ? '⭐ Learning from: ' + CONFIG.creators : ''}

*Commands:*
📈 /trends — Trending ideas for ${CONFIG.niche}
#️⃣ /hashtags \`[topic]\` — 30 optimized hashtags
✍️ /caption \`[idea]\` — 3 viral captions in ${CONFIG.language}
🎣 /hook \`[topic]\` — 10 scroll-stopping hooks
📅 /calendar — 7-day content plan
⏰ /besttimes — When to post
💡 /tips — Growth hacks for ${CONFIG.niche}
📊 /report — Weekly strategy report

Or just *type any question!*

🚀 *Try:* \`/trends\` or \`/report\``;
}

function helpMsg() {
  return `🤖 *Insta Trend AI — Commands*

📈 /trends \`[niche]\` — Trending ideas (default: ${CONFIG.niche})
#️⃣ /hashtags \`[topic]\` — 30 hashtags
✍️ /caption \`[idea]\` — 3 caption styles
🎣 /hook \`[topic]\` — 10 reel hooks
📅 /calendar \`[niche]\` — Week plan
⏰ /besttimes — Posting schedule
💡 /tips — Growth strategies
📊 /report — Full weekly strategy report

💬 Or *type anything* — I know your niche is *${CONFIG.niche}*`;
}

// ============ START ============
console.log('');
console.log('🤖 Insta Trend AI is running!');
console.log('');
console.log('   📌 Niche:    ' + CONFIG.niche);
console.log('   👥 Audience: ' + CONFIG.audience);
console.log('   🗣️  Language: ' + CONFIG.language);
if (CONFIG.creators) console.log('   ⭐ Creators: ' + CONFIG.creators);
console.log('');
console.log('   Open your bot on Telegram and send /start');
console.log('   Press Ctrl+C to stop');
console.log('');

poll();