# Klaussy

**Run your AI coding agent across every worktree. In one window.**
For the 20× developer.

A desktop app for **macOS, Windows, and Linux**. Run multiple AI coding agents (**Claude Code, Codex, Gemini, Copilot**) across git worktrees, review PRs with AI, and get local tab-autocomplete that never leaves your machine.

### [⬇ Download Klaussy](https://www.klaussy.com/#download-btn) · [Join the Discord](https://discord.gg/ZxNhsuMyYu)

The download page auto-detects your OS and architecture and gives you the right file — or pick one yourself from the [latest release](https://github.com/steph-dove/klausify-desktop-feedback/releases/latest).

Free to try. **$39 lifetime access** unlocks an access key for every platform.

---

## What it does

- **Any agent, your choice.** Run each task on **Claude Code, OpenAI Codex, Google Gemini, or GitHub Copilot** — pick a global default, switch it per terminal, or run the same task in two agents side by side. PR review, implement, CI-debug, and ask all follow your selected agent + model.
- **Parallel worktrees, one view.** Spawn a worktree per task, each with its own agent instance. Columns, grid, or single-pane view. Switch with a click; no more juggling `cd`s.
- **Auto-debug CI failures.** Klaussy connects to your PR's CI checks. When one goes red, pull the logs in with a click and your agent runs a focused debug pass — likely cause, suggested fix, applied straight to the worktree.
- **Full PR review surface.** Pull in a PR, read the diff with inline comments, run an AI review that breaks into per-finding cards — ignore, implement, or append to PR.
- **Plan · Debug · Review.** A dropdown on every worktree that spawns a dedicated agent tab running Klaussy's guided **Plan** flow, a **Debug** pass, or a multi-phase PR **Review** — each on the same worktree, no context loss.
- **Inline AI — locally.** Tab-autocomplete as you type, powered by `qwen2.5-coder` running on your machine via Ollama. ~100ms latency. No code leaves your laptop.
- **Built-in editor.** Monaco editor with LSP diagnostics. Open any file, edit, commit straight from the diff panel. AI-generated commit messages optional.

## Requirements

Klaussy runs on **macOS 12+** (Apple Silicon or Intel), **Windows 10/11**, or **Ubuntu 22.04+** (other modern Linux distros generally work).

You'll also need **at least one supported agent CLI** — [Claude Code](https://claude.ai/code), [OpenAI Codex](https://github.com/openai/codex), [Google Gemini](https://github.com/google-gemini/gemini-cli), or [GitHub Copilot](https://github.com/github/copilot-cli) — and the [GitHub CLI (`gh`)](https://cli.github.com), all authenticated. Ollama is optional and only needed for local inline autocomplete.

## Install

Easiest: open **[klaussy.com](https://www.klaussy.com/#download-btn)** — it detects your OS and offers the right file directly.

Or grab the matching file from the [latest release](https://github.com/steph-dove/klausify-desktop-feedback/releases/latest) using the picker below.

<details>
<summary><b>macOS</b> — pick by chip type</summary>

Open the Apple menu → **About This Mac** and look at the **Chip** (or **Processor**) row.

| Your Mac says | Download |
| --- | --- |
| Apple M1 / M2 / M3 / M4 (Apple Silicon) | `Klaussy-<ver>-macOS-arm64.dmg` |
| Intel | `Klaussy-<ver>-macOS-x64.dmg` |

Open the `.dmg`, drag **Klaussy** into **Applications**, done. Klaussy is signed and notarized — no quarantine workaround needed.

</details>

<details>
<summary><b>Windows</b> — installer or portable</summary>

| Want | Download |
| --- | --- |
| Standard install on Windows 10/11 | `Klaussy-<ver>-Windows-Setup.exe` |
| Portable (no install) | `Klaussy-<ver>-Windows-Portable.exe` |

Signed with an SSL.com EV certificate — Windows SmartScreen should pass cleanly.

</details>

<details>
<summary><b>Linux</b> — by distro</summary>

| Distro | Download |
| --- | --- |
| Ubuntu, Debian, Mint, Pop!_OS | `Klaussy-<ver>-Linux-Debian-Ubuntu.deb` |
| Fedora, Arch, openSUSE, anything else | `Klaussy-<ver>-Linux.AppImage` |

`.deb`: `sudo dpkg -i Klaussy-<ver>-Linux-Debian-Ubuntu.deb`

AppImage: `chmod +x Klaussy-<ver>-Linux.AppImage && ./Klaussy-<ver>-Linux.AppImage`

</details>

Klaussy auto-updates after install — no need to manually grab future versions.

## Setup

After installing Klaussy, install **at least one agent CLI** plus the GitHub CLI. Klaussy's first-run check tells you what's missing.

### Agents — install whichever you use (at least one)

All four are npm packages, so they need Node.js (`brew install node` on macOS, `winget install OpenJS.NodeJS` on Windows, `sudo apt install nodejs npm` on Ubuntu/Debian).

```bash
npm install -g @anthropic-ai/claude-code   # Claude Code   (Anthropic)
npm install -g @openai/codex               # OpenAI Codex
npm install -g @google/gemini-cli          # Google Gemini
npm install -g @github/copilot             # GitHub Copilot
```

Run each agent once to sign in (e.g. `claude`, `codex`, `gemini`, `copilot`) — they use your own account/subscription.

### GitHub CLI (for PR review, checkout, CI)

```bash
# macOS
brew install gh && gh auth login
# Windows
winget install --id GitHub.cli && gh auth login
# Linux (Ubuntu/Debian)
sudo apt install gh && gh auth login
```

### Ollama (optional — only for local inline autocomplete)

```bash
# macOS
brew install ollama
# Linux
curl -fsSL https://ollama.com/install.sh | sh
# Windows — download from https://ollama.com/download
```

## Pricing

One-time purchase. Unlocks an access key that works on macOS, Windows, and Linux — and includes every future update.

| Tier | Price | Seats |
| --- | --- | --- |
| **Founder** *(early-access price; rises to $69, then $99)* | $39 | 1 |
| **Team — Small** | $349 | 5 |
| **Team — Large** | $599 | 10 |

[**→ Get an access key**](https://klaussy.lemonsqueezy.com/checkout/buy/c7d797d4-85e2-4f5f-81bc-a360739a3358)

Klaussy is free to download and try. An access key is required to keep using it past the trial.

## FAQ

**Does my code get sent to third parties?**
When you use an agent, prompts + repo context go to that agent's provider via the CLI you already trust — Anthropic (Claude), OpenAI (Codex), Google (Gemini), or GitHub (Copilot). GitHub operations go through your local `gh`. Inline autocomplete runs entirely locally via Ollama and `qwen2.5-coder:1.5b` — nothing per-keystroke leaves your machine. There is no Klaussy server.

**Do I need a subscription for the agents?**
You need whatever plan each agent CLI you use is configured for — Claude, Codex, Gemini, and Copilot all run on your own accounts. Klaussy doesn't bill separately for AI usage — your purchase is a one-time license for the app itself.

**How does the access key work?**
After purchase you'll receive a license key. Paste it into Klaussy → Settings → License once, on any of your machines. The key is tied to you, not to a single OS — the same key activates Klaussy on macOS, Windows, and Linux.

**What does "lifetime" mean here?**
One-time payment, no subscription. Every future update is included for as long as the app exists. AI usage (your agents, GitHub) still runs on your own accounts.

**What happens to my data if I uninstall?**
- macOS: remove `~/Library/Application Support/Klaussy` and `~/Library/Logs/Klaussy`
- Windows: remove `%APPDATA%\Klaussy`
- Linux: remove `~/.config/Klaussy` and `~/.local/share/Klaussy`

Ollama and its models persist independently — uninstall it through your package manager and remove `~/.ollama`.

**Is this open source?**
The application itself is commercial, closed-source. Feedback and bug reports live in this public repo. Bundled open-source components are listed in About → Licenses.

## Report a bug / request a feature

Open an issue in the [Issues tab](https://github.com/steph-dove/klausify-desktop-feedback/issues) or drop it in the [Discord](https://discord.gg/ZxNhsuMyYu). Both get read.

Please include:
- OS and version (macOS / Windows / Linux distro)
- Klaussy version (About → Version)
- Steps to reproduce, expected vs. actual behavior
- Logs if relevant:
  - macOS: `~/Library/Logs/Klaussy/main.log`
  - Windows: `%APPDATA%\Klaussy\logs\main.log`
  - Linux: `~/.config/Klaussy/logs/main.log`

---

[Privacy](https://steph-dove.github.io/klausify-desktop-feedback/privacy.html) · [EULA](https://steph-dove.github.io/klausify-desktop-feedback/eula.html) · © 2026 Stephanie Dover.
