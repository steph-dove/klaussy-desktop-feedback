# Klaussy — Landing Page & Feedback

This repo hosts two things:

1. The landing page for [Klaussy](https://github.com/steph-dove/klausify-desktop) (served via GitHub Pages).
2. The public issue tracker for bug reports and feature requests.

## Report a bug / request a feature

Open an issue in the [Issues tab](https://github.com/steph-dove/klausify-desktop-feedback/issues). Include:
- OS and version (macOS / Windows / Linux distro)
- Klaussy version (About → Version)
- Steps to reproduce
- What you expected vs. what happened
- Logs if relevant:
  - macOS: `~/Library/Logs/Klaussy/main.log`
  - Windows: `%APPDATA%\Klaussy\logs\main.log`
  - Linux: `~/.config/Klaussy/logs/main.log`

## Development

Plain HTML + CSS — no build step.

```bash
# Preview locally
python3 -m http.server 8000
# Then open http://localhost:8000
```

## Deployment (GitHub Pages)

1. Push to `main`.
2. On GitHub → this repo → **Settings → Pages**.
3. **Source**: Deploy from a branch → **main** / **(root)** → Save.
4. Wait ~60s; your site is live at `https://steph-dove.github.io/klausify-desktop-feedback/`.

Optional — custom domain:
1. Add a `CNAME` file in the repo root containing just the domain (e.g. `klaussy.app`).
2. Add a DNS CNAME record pointing `klaussy.app` at `steph-dove.github.io`.
3. Enable HTTPS in the Pages settings after the DNS propagates.

## Privacy & EULA pages

`privacy.html` and `eula.html` are linked from the footer. The source Markdown lives in the app repo at `klausify-desktop/docs/{PRIVACY,EULA}.md` — regenerate the HTML from there if either changes.

## Pricing CTAs

All three pricing CTAs in `index.html` point to the Lemon Squeezy checkout at `https://klaussy.lemonsqueezy.com/checkout/buy/c7d797d4-85e2-4f5f-81bc-a360739a3358`. The Lemon Squeezy product surfaces all enabled tiers (Founder / Team — Small / Team — Large) on that single page. Toggle tiers on or off in the Lemon Squeezy dashboard rather than editing the HTML.
