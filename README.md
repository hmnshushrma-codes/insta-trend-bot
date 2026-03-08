# 🤖 Insta Trend AI

AI-powered Instagram growth assistant on Telegram.

**Configure your niche. Add your favorite creators. Get personalized growth strategies.**

## Setup (3 minutes)

### Step 1 — Clone

```bash
git clone https://github.com/YOUR_USERNAME/insta-trend-bot.git
cd insta-trend-bot
```

### Step 2 — Configure

```bash
cp .env.example .env
```

Open `.env` and fill in:

```env
# Get from @BotFather on Telegram
TELEGRAM_BOT_TOKEN=7123456789:AAH_your_token_here

# Get from console.anthropic.com
ANTHROPIC_API_KEY=sk-ant-your_key_here

# YOUR niche — be specific!
MY_NICHE=fitness for working professionals

# Creators you admire (comma separated)
MY_FAVORITE_CREATORS=@beerbiceps,@ranveerallahbadia,@tanmaybhat

# Your target audience
MY_AUDIENCE=25-35 year old Indian professionals interested in fitness

# Content language
MY_LANGUAGE=hinglish
```

### Step 3 — Run

```bash
npm install
npm start
```

```
🤖 Insta Trend AI is running!

   📌 Niche:    fitness for working professionals
   👥 Audience: 25-35 year old Indian professionals
   🗣️  Language: hinglish
   ⭐ Creators: @beerbiceps,@ranveerallahbadia

   Open your bot on Telegram and send /start
```

That's it. Open Telegram → message your bot → 🚀

## Commands

| Command | What you get |
|---------|-------------|
| `/start` | Welcome + your configured profile |
| `/trends` | 8 trending ideas for YOUR niche |
| `/hashtags [topic]` | 30 hashtags (high/medium/niche mix) |
| `/caption [idea]` | 3 captions in YOUR language |
| `/hook [topic]` | 10 scroll-stopping reel hooks |
| `/calendar` | 7-day plan for YOUR niche |
| `/besttimes` | When YOUR audience is online |
| `/tips` | Growth hacks for YOUR niche |
| `/report` | 📊 Full weekly strategy report |
| *any text* | Ask anything — it knows your niche |

## The `/report` Command

This is the killer feature. Send `/report` and get a full weekly strategy including:

- 📊 Niche analysis — what's working, what's oversaturated
- 👥 Audience insights — what your target audience engages with
- 🔥 This week's strategy — 3 must-try content ideas
- 📈 Creator analysis — what your favorite creators are doing
- 🎯 Action items — 5 things to do THIS WEEK

## How It Works

```
.env (your niche, audience, language, creators)
     ↓
You message the bot on Telegram
     ↓
AI generates advice personalized to YOUR setup
     ↓
Response in YOUR language on Telegram
```

Everything is personalized. The AI knows your niche, your audience, your language, and the creators you admire.

## Run in Background

```bash
# Linux/Mac
nohup npm start &

# With PM2 (recommended)
npm install -g pm2
pm2 start index.js --name insta-bot
pm2 save
```

## Requirements

- Node.js 18+
- Telegram Bot Token (free from @BotFather)
- Anthropic API Key (pay per use — ~$0.003 per message)

## License

MIT

---

Built by [Oye Nino](https://oyenino.com) 🚀