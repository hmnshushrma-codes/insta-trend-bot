# 🤖 Insta Trend AI

AI-powered Instagram growth assistant on Telegram.

**2 keys. One command. The bot does the rest.**

## Setup (2 minutes)

```bash
git clone https://github.com/YOUR_USERNAME/insta-trend-bot.git
cd insta-trend-bot
cp .env.example .env
```

Edit `.env` — add your 2 keys:
```env
TELEGRAM_BOT_TOKEN=from_@BotFather
ANTHROPIC_API_KEY=from_console.anthropic.com
```

Run:
```bash
npm install
npm start
```

Open Telegram → message your bot → `/start`

The bot asks you 4 questions:
1. 📌 Your niche
2. ⭐ Creators you admire
3. 👥 Your target audience
4. 🗣️ Your content language

Then everything is personalized. Done.

## Commands

| Command | What you get |
|---------|-------------|
| `/start` | Setup your profile (first time) or welcome back |
| `/trends` | 8 trending ideas for YOUR niche |
| `/hashtags [topic]` | 30 hashtags (high/medium/niche) |
| `/caption [idea]` | 3 captions in YOUR language |
| `/hook [topic]` | 10 scroll-stopping reel hooks |
| `/calendar` | 7-day plan for YOUR niche |
| `/besttimes` | When YOUR audience is online |
| `/tips` | Growth hacks for YOUR niche |
| `/report` | Full weekly strategy report |
| `/profile` | View your saved profile |
| `/setup` | Change your niche/creators/audience |
| *any text* | Ask anything — it knows your niche |

## How It Works

```
/start → Bot asks: niche? creators? audience? language?
                    ↓
        Profile saved to profiles.json
                    ↓
     Every response personalized to YOU
```

- Profiles persist across restarts (saved to `profiles.json`)
- Multiple users supported — each gets their own profile
- No database needed — just a JSON file

## Requirements

- Node.js 18+
- Telegram Bot Token (free from @BotFather)
- Anthropic API Key (pay per use)

## License

MIT

---

Built by [Oye Nino](https://oyenino.com) 🚀