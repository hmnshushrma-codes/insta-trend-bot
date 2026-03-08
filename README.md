# 🤖 Insta Trend AI

AI-powered Instagram growth assistant on Telegram.

**2 keys. One command. The bot does the rest.**

---

## Quick Start (Run Locally)

```bash
git clone https://github.com/YOUR_USERNAME/insta-trend-bot.git
cd insta-trend-bot
cp .env.example .env
```

Edit `.env` — just 2 keys:
```env
TELEGRAM_BOT_TOKEN=from_@BotFather
ANTHROPIC_API_KEY=from_console.anthropic.com
```

```bash
npm install
npm start
```

Open Telegram → message your bot → `/start` → bot walks you through setup.

---

## How It Works

```
/start → Bot asks: niche? creators? audience? language?
                    ↓
        Profile saved locally (profiles.json)
                    ↓
     Every response personalized to YOU
```

No database. No complicated config. The bot asks everything via chat.

---

## Commands

| Command | What you get |
|---------|-------------|
| `/start` | Setup profile or welcome back |
| `/trends` | 8 trending ideas for YOUR niche |
| `/hashtags [topic]` | 30 hashtags (high/medium/niche) |
| `/caption [idea]` | 3 captions in YOUR language |
| `/hook [topic]` | 10 scroll-stopping reel hooks |
| `/calendar` | 7-day content plan |
| `/besttimes` | When YOUR audience is online |
| `/tips` | Growth hacks for YOUR niche |
| `/report` | Full weekly strategy report |
| `/profile` | View your saved profile |
| `/setup` | Change niche/creators/audience |

---

## Deploy (Keep It Running 24/7)

Running locally is great for testing, but if you close your laptop the bot stops. Here are 4 ways to keep it running forever:

### Option 1: Railway (Easiest — Free Tier)

[Railway](https://railway.app) gives you a free server. Deploy in 2 clicks.

1. Push your code to GitHub
2. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub**
3. Select your repo
4. Go to **Variables** tab, add:
   - `TELEGRAM_BOT_TOKEN` = your token
   - `ANTHROPIC_API_KEY` = your key
5. Railway auto-deploys. Bot is live 24/7.

**Cost:** Free tier available (500 hours/month). $5/month for always-on.

---

### Option 2: Render (Free Tier)

1. Push code to GitHub
2. Go to [render.com](https://render.com) → **New** → **Background Worker**
3. Connect your GitHub repo
4. Set:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Go to **Environment** → add your 2 keys
6. Deploy.

**Cost:** Free tier spins down after inactivity (bot restarts when messaged). $7/month for always-on.

---

### Option 3: VPS (Full Control — DigitalOcean / Hetzner)

Best if you want full control and multiple bots.

```bash
# SSH into your server
ssh root@your-server-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Clone and setup
git clone https://github.com/YOUR_USERNAME/insta-trend-bot.git
cd insta-trend-bot
cp .env.example .env
nano .env  # add your keys
npm install

# Install PM2 (keeps bot running forever)
npm install -g pm2

# Start bot
pm2 start index.js --name insta-bot

# Auto-restart on server reboot
pm2 startup
pm2 save
```

**Useful PM2 commands:**
```bash
pm2 status          # check if bot is running
pm2 logs insta-bot  # see bot logs
pm2 restart insta-bot  # restart bot
pm2 stop insta-bot  # stop bot
```

**Cost:** DigitalOcean $4/month, Hetzner $3.49/month

---

### Option 4: Run on Your PC Forever

If you have a computer that's always on (old laptop, desktop):

**Linux/Mac:**
```bash
# Install PM2
npm install -g pm2

# Start bot
cd insta-trend-bot
pm2 start index.js --name insta-bot

# Auto-start on boot
pm2 startup
pm2 save
```

**Windows:**
```bash
# Install PM2
npm install -g pm2

# Start bot
cd insta-trend-bot
pm2 start index.js --name insta-bot

# Auto-start on boot (run as admin)
pm2-startup install
pm2 save
```

**Cost:** Free (just your electricity)

---

## Which Deployment Should I Choose?

| Method | Cost | Difficulty | Best For |
|--------|------|-----------|----------|
| **Railway** | Free / $5 | ⭐ Easy | Beginners, quick deploy |
| **Render** | Free / $7 | ⭐ Easy | Beginners, free tier |
| **VPS** | $3-5/mo | ⭐⭐ Medium | Developers, multiple bots |
| **Your PC** | Free | ⭐ Easy | Testing, always-on desktop |

**Our recommendation:** Start with **Railway** — it's free and takes 2 minutes.

---

## Get Your Keys

### Telegram Bot Token (Free)
1. Open Telegram
2. Search for `@BotFather`
3. Send `/newbot`
4. Choose a name and username
5. Copy the token

### Anthropic API Key
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up / Log in
3. Go to API Keys → Create Key
4. Copy it

**Cost:** ~$0.003 per message (very cheap). A heavy user sending 100 messages/day costs ~$9/month.

---

## FAQ

**Q: Can multiple people use the same bot?**
Yes! Each user gets their own profile. The bot remembers everyone's niche and preferences.

**Q: Where are profiles stored?**
In `profiles.json` in the same folder. It's just a file — no database needed.

**Q: Can I change my niche later?**
Yes, send `/setup` to redo the onboarding anytime.

**Q: The bot stopped responding?**
Check if `node index.js` is still running. If you closed the terminal, the bot stops. Use PM2 or deploy to Railway for 24/7 uptime.

**Q: Can I use a different AI model?**
Yes, edit the `model` field in the `askAI` function in `index.js`. You can use `claude-haiku-4-5-20251001` for cheaper/faster responses.

---

## License

MIT — do whatever you want with it.

---

Built by [Oye Nino](https://oyenino.com) 🚀