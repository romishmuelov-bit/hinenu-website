# HINENU Hebrew Site — Claude Handoff (v5, dark)

## What this is
One-page RTL Hebrew marketing site for **הננו (Hinenu) — חלוציות כדרך חיים**: national-entrepreneurship evenings + an incubator (חממה) for young Israelis. Built July 2026 by Itamar + Claude. Fully redesigned 12.7 to a pitch-black cinematic one-pager.

- **Live:** https://hinenu-site.vercel.app (currently serving `main`; the dark redesign lives on branch `redesign-hero` — merge when Itamar approves)
- **Repo:** github.com/Itamargend/hinenu-site — push to `main` auto-deploys (Vercel Git integration).
- Local preview: Itamar runs a static server on `localhost:8934` from this folder.

## Architecture — deliberately simple
**Shared across every page:** `assets/hinenu-common.js` — a plain (non-defer) script included
right before each page's own inline script. It injects the site footer (partners marquee with
hover names, then one closing row: צרו קשר · הרצאות · חזרה למעלה · הצהרת נגישות, with nothing
below it), the accessibility toolbar (font size, contrast, link highlight, readable font, stop-motion; saved in
localStorage `hinenu-a11y`), and the idle scroll cue. The footer's צרו קשר opens the page's own
`#contactModal` where there is one, and a dialog the script builds itself where there isn't
(harzaot) — so the mail / Instagram / WhatsApp / leave-details rows exist in exactly one place. Everything it
writes carries `data-en`, so each page's own `applyLang()` translates it — which is why the tag
must load *before* that inline script, not with `defer`. Opt-outs live on the tag:
`data-lecture="no"` (harzaot — hides the הרצאות button on the lectures page itself) and
`data-apply="…"` (pages with no apply modal of their own).
The partner list lives there once; no page should hardcode logos again.

Everything else lives in **one `index.html`**: one `<style>` block, one vanilla-JS IIFE. No frameworks, no build step. Optimized assets in `assets/` (webp/jpg ≤1920px, hero video mp4). Local fonts in `fonts/` (Aduma, Asakim, MigdalHaemek, Heebo variable) + `dana-yad-alefalefalef/` for the manifesto handwriting.

## Page structure (top to bottom)
1. **Header** — damngood-style spread: right = "הנני +" fan (3 actions: apply modal / #event / hinenupioneers.com), center = logo, left = "תצוגה +" fan (אנושית / בינה מלאכותית → machine-mode overlay). Fans animate dock-style.
2. **Hero (`.hero5`)** — pitch black, fullscreen muted looping bg video (`assets/hero-bg.mp4`, from the "מעבר לצפון" campaign) under a dark shade; huge title "הננו / חלוציות כדרך חיים" in MigdalHaemek with a blue Highlights-mask on "כדרך חיים".
3. **Challenges (`.chal` ×5)** — full-screen photo scenes (negev/housing/food/hasbara/trauma; Magnific-generated, unified warm grade). Big white statements with black hand-drawn highlight masks (`assets/hlk-1..5.webp`, one per scene) behind the keyword. Ken Burns zoom; text reveals via CSS scroll-driven animations (IO fallback). Fixed torn CTA appears through this range.
4. **Manifesto (#letter)** — white torn sheet on black; scroll-inks the handwriting. Text = the "צעירים בישראל מסיימים את הצבא..." version (updated 12.7). Roee Azizi signature in white.
5. **Tracks (#tracks)** — cover-flow of 2 cards skinned with ripped-paper strips (`torn-white.webp` / `torn-white-b.webp`, white paper with torn bottom on black). Cards min-height 915px so content stays inside the white zone; `.tflow` height is set inline by JS.
6. **Events (#event)** — grid of 2 flyer cards (`ev-michael.webp` future 28.7 / `ev-yoel.webp` past 16.6). Click opens `#evOverlay` popup: future = chips+lede+questions+calendar CTA; past = photo gallery. Data lives in the `EV` array in JS.
7. **Ventures (#ventures)** — cover-flow: Ben Namer / Meirov / Pitluk / dor-hameyasdot (B&W photo) / kef-baotef / shmona (typographic cards) / "אתם?".
8. **Footer** — from `hinenu-common.js` (see Architecture). The old 150vh `.scroll-end` with the
   pinned partner bar is gone; the footer's marquee is the single partner strip for the whole site.
9. **FAQ** — dark navy ramp into brand blue.
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
- `index.html` and `more.html` are near-identical 2.6k-line files (shared header, modals, apply form, machine mode). Every fix here has to be made twice — unless it belongs in `assets/hinenu-common.js`, which is the place for anything that has to be identical on all four pages.
- `applyLang()` overwrites `textContent` on every `[data-en]` element, so an icon must never be an element child of one. The channel marks (mail / Instagram / WhatsApp) are `::before` masks keyed off the href, exactly for that reason.
- **Forms.** Every submission now goes out twice, through `window.hinenuSend()` in
  `assets/hinenu-common.js`: to **Formspree** (`xnjygrae`) as JSON — the only leg that answers
  with a readable response, so success/failure is actually knowable and the team gets an email —
  and to the **Google Form** as a mirror, so the existing sheet keeps filling. A cross-origin
  form POST into a hidden iframe can never be read: `fetch(..., {mode:'no-cors'})` resolves
  opaque even when Google refused, and even the iframe's `load` event fires for a network-error
  page. So the Google leg alone can only ever say "the browser finished something" — when
  Formspree answers, that answer wins. Two forms use it: the apply modal (index/more) and the
  booking form (mitzpe). Event registration is an external Google Form link that opens in a new
  tab and shows Google's own confirmation.
- Neither endpoint can be exercised from a sandbox without internet — after any change to the
  form plumbing, do one real submission per form and confirm it lands.
- The Google Form still holds the long questions that were dropped from the page (`entry.823481406/1746048607/720430898`). While they are marked required over there, an empty answer is refused — `FILL_IF_EMPTY` sends a dash for each. Once Romi clears the "required" flags, delete that list.
- `assets/hora.mov` is the 138MB archive master for the lectures page's "פעם ידענו לעשות את זה"
  band; `*.mov` is gitignored. What ships is `assets/hora-bg.mp4` (30s, 1080x828, ~3.4MB) plus
  `hora-poster.jpg`. Re-encode with the CapCut ffmpeg and *plain* AMF flags —
  `-c:v h264_amf -b:v 900k`; adding `-quality`/`-rc vbr_peak` or `+faststart` in the same pass
  hangs the encoder at close. Do faststart as a separate `-c copy` remux.
- `og:image` URLs are absolute and hardcoded to `hinenu-site.vercel.app`. A custom domain means updating them in all four pages.

## Open items
- Google Form: mark the retired questions optional, turn on email notification per response, then drop `FILL_IF_EMPTY`.
- No analytics beyond the Meta pixel (`901591649440894`), which now fires `Lead` on submit plus `trackCustom` events via `data-track="Name"` on any element. GA4 still missing.
- Phone-only "keep me posted" capture has nowhere to go — the quiet-channel strip links to the WhatsApp group instead. Needs its own Google Form if Romi wants the field.
- Letter text may still be revised by Roee Azizi.
- "אני רוצה עזרה לעבור לדרום או לצפון" fan item links to hinenupioneers.com pending a better target.
- Photos/videos wanted for כיף בעוטף + שמונה venture cards; videos from the 16.6 evening can be added to the past-event popup (`EV[2].gallery`).
- Custom domain not configured.
- `.hn-foot` is a `<footer>`, and index/more still carry the old site's `footer{ padding:230px 0 52px }`
  rule. The shared footer resets `padding:0` and `font-weight:inherit` on its links to shake that
  off — an element selector from the page will keep reaching it, so watch for it.
- "השארת פרטים" everywhere opens the contact Google Form
  (`1FAIpQLScwekWYxeq32W6NTyIqAtag3YfI4pgbmclfrPuLaL5WLtj-pA`) in a new tab; Google shows its own
  confirmation. The on-site apply modal still posts to its own form + Formspree. If that modal should
  feed the contact form instead, its entry IDs are needed.
- The tracks section is laid **over** the end of the manifesto like a fresh sheet: `--cover`
  (82vh, 58vh on phones) is added as `padding-bottom` on `.letter-track` — which keeps the sticky
  letter pinned through it — and pulled straight back off with `margin-top:calc(-1 * var(--cover))`
  on `.tracks`, so the page is no taller than before. `updateLetter()` subtracts that same padding
  from its scrollable range, so the handwriting finishes just before the sheet arrives. Change one
  of the three and the other two have to follow.
- The header bars carry only הנני + / צרו קשר / נגישות / EN — the ניווט + fan was removed from
  every page; navigation lives in the ☰ drawer.
- Accessibility officer of record: רומי שמואלוב (romishmuelov@gmail.com) — named in the toolbar,
  in the statement modal and on `mitzpe-gvolot/accessibility.html`.
