# HINENU Hebrew Site — Claude Handoff (v5, dark)

## What this is
One-page RTL Hebrew marketing site for **הננו (Hinenu) — חלוציות כדרך חיים**: national-entrepreneurship evenings + an incubator (חממה) for young Israelis. Built July 2026 by Itamar + Claude. Fully redesigned 12.7 to a pitch-black cinematic one-pager.

- **Live:** https://hinenu-site.vercel.app (currently serving `main`; the dark redesign lives on branch `redesign-hero` — merge when Itamar approves)
- **Repo:** github.com/Itamargend/hinenu-site — push to `main` auto-deploys (Vercel Git integration).
- Local preview: Itamar runs a static server on `localhost:8934` from this folder.

## Architecture — deliberately simple
Everything lives in **one `index.html`**: one `<style>` block, one vanilla-JS IIFE. No frameworks, no build step. Optimized assets in `assets/` (webp/jpg ≤1920px, hero video mp4). Local fonts in `fonts/` (Aduma, Asakim, MigdalHaemek, Heebo variable) + `dana-yad-alefalefalef/` for the manifesto handwriting.

## Page structure (top to bottom)
1. **Header** — damngood-style spread: right = "הנני +" fan (3 actions: apply modal / #event / hinenupioneers.com), center = logo, left = "תצוגה +" fan (אנושית / בינה מלאכותית → machine-mode overlay). Fans animate dock-style.
2. **Hero (`.hero5`)** — pitch black, fullscreen muted looping bg video (`assets/hero-bg.mp4`, from the "מעבר לצפון" campaign) under a dark shade; huge title "הננו / חלוציות כדרך חיים" in MigdalHaemek with a blue Highlights-mask on "כדרך חיים".
3. **Challenges (`.chal` ×5)** — full-screen photo scenes (negev/housing/food/hasbara/trauma; Magnific-generated, unified warm grade). Big white statements with black hand-drawn highlight masks (`assets/hlk-1..5.webp`, one per scene) behind the keyword. Ken Burns zoom; text reveals via CSS scroll-driven animations (IO fallback). Fixed torn CTA appears through this range.
4. **Manifesto (#letter)** — white torn sheet on black; scroll-inks the handwriting. Text = the "צעירים בישראל מסיימים את הצבא..." version (updated 12.7). Roee Azizi signature in white.
5. **Tracks (#tracks)** — cover-flow of 2 cards skinned with ripped-paper strips (`torn-white.webp` / `torn-white-b.webp`, white paper with torn bottom on black). Cards min-height 915px so content stays inside the white zone; `.tflow` height is set inline by JS.
6. **Events (#event)** — grid of 2 flyer cards (`ev-michael.webp` future 28.7 / `ev-yoel.webp` past 16.6). Click opens `#evOverlay` popup: future = chips+lede+questions+calendar CTA; past = photo gallery. Data lives in the `EV` array in JS.
7. **Ventures (#ventures)** — cover-flow: Ben Namer / Meirov / Pitluk / dor-hameyasdot (B&W photo) / kef-baotef / shmona (typographic cards) / "אתם?".
8. **Backers** — marquee, logos inverted to white.
9. **FAQ + Footer** — dark navy ramp into brand blue.
10. **Apply modal** — Formspree `xnjygrae`. **Machine mode** — full-text overlay via the תצוגה fan.

## Design tokens & tools
- `:root`: `--bg:#000`, `--ink` (light), `--ink-dark` (for white-paper surfaces), `--hl-blue` (bright accent + ::selection + keyword masks), `--coral`, `--blue`.
- **Theme panel**: floating 🎨 button (localhost only), triple-click logo, or `?theme`. Color tokens + display-font switcher (MigdalHaemek default). Saved in localStorage `hinenu-theme-v5`.
- **QA audit**: `qa-audit.js` (gitignored). In console: `eval(await (await fetch('/qa-audit.js')).text()); await hinenuAudit()` → checks assets, fonts, palette conformity, layout, wiring. Keep it green.

## Gotchas — don't regress
- `body{overflow-x:clip}` — never `hidden` (kills the manifesto position:sticky). Carousels overflow horizontally by design; `.tracks`/`.ventures` have `overflow:clip`, `.chal` has `contain:paint`.
- Chrome freezes transitions/rAF and defers video loading in background tabs — QA in a focused window.
- Fonts are local TTFs; `document.fonts.load` before checking availability.
- White-surface elements (letter paper, track cards, modals) must use `--ink-dark` text, not `--ink`.
- Hebrew-named cwd breaks Vercel CLI — deploy via git push (or ASCII /tmp copy fallback).
- Downloading from Freepik CDNs via automation gets blocked by Chrome — give Itamar direct links to click.

## Open items
- Letter text may still be revised by Roee Azizi.
- "אני רוצה עזרה לעבור לדרום או לצפון" fan item links to hinenupioneers.com pending a better target.
- Photos/videos wanted for כיף בעוטף + שמונה venture cards; videos from the 16.6 evening can be added to the past-event popup (`EV[1].gallery`).
- Custom domain not configured.
