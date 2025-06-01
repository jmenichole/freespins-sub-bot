FreeSpins Finder (Discord Bot)

FreeSpins Finder is a Discord bot that automates the submission and announcement of non-referral free spin links from community members. It streamlines the process, prevents chat spam, and routes new casino links for mod approval — so your community stays clean, fair, and focused.

Features
Slash command `/submitspin` for submitting free spins
Automatically posts vetted links to the #free-spins-announcements channel
Routes unvetted casinos to a mod channel for approval
Blocks referral links (except Seal-approved)
Easy to expand casino vetting list (via JSON or DB later)

Slash Commands 
```bash
/submitspin casino_name:<casino> link:<url> description:<optional>
```

Setup
1. Clone repo:
```bash
git clone https://github.com/jmenichole/freespins-sub-bot.git
cd freespins-sub-bot
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
DISCORD_TOKEN=your_bot_token_here
MOD_CHANNEL=mod-review
ANNOUNCE_CHANNEL=free-spins-announcements
```

4. Run bot:
```bash
node index.js
```


Structure
```
/FreeSpinsFinderBot
├── index.js                # Bot entry point
├── vettedCasinos.json      # List of pre-approved casinos
├── .env                    # Secrets (not tracked in git)
├── colder ommands/
│   └── submitspin.js       # Slash command logic
└── .gitignore              # Environment protection
```

Contributing
This project was originally built for internal use by the StakeStats mod team — but contributions, ideas, and forks are welcome!

Disclaimer
This bot does not promote gambling. It's meant to manage free community promos in Discord servers where such sharing is already allowed. Use responsibly.

Credits
Built by [@jmenichole](https://github.com/jmenichole) and powered by Discord.js.
