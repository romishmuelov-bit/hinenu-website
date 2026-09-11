# HINENU Hebrew Site — Claude Handoff (v5, dark)

## What this is
One-page RTL Hebrew marketing site for **הננו (Hinenu) — חלוציות כדרך חיים**: national-entrepreneurship evenings + an incubator (חממה) for young Israelis. Built July 2026 by Itamar + Claude. Fully redesigned 12.7 to a pitch-black cinematic one-pager.

- **Live:** https://hinenu-website.vercel.app — this is the deployment that is actually current.
  `hinenu-site.vercel.app` still resolves but is a build from before the shared footer landed
  (`assets/hinenu-common.js` 404s there); it does not rebuild on push. The hardcoded `og:image`
  URLs still point at that stale host, so share cards pull months-old images — worth fixing.
- **Repos:** `romi` → github.com/romishmuelov-bit/hinenu-website is what `main` tracks and what
  Vercel builds; `origin` → github.com/Itamargend/hinenu-site is kept in sync by hand. Push both.
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
5. **Tracks (#tracks)** — two side-by-side sheets in a `1fr 1fr` grid, each a photo card (`track-a-bg.avif` / `negev-track-bg.avif`) with a translucent panel on top. The pair is kept symmetric on purpose: `align-items:stretch` gives both the same height, `.track-actions{margin-top:auto}` lines the two buttons up along the bottom, the two panels share one alpha, and the sheets tilt by the same ±.5deg in opposite directions. Change one of those and the pair starts to drift.
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
- The apply modal posts into the contact Google Form **"טופס התעניינות דף נחיתה"**
  (`1FAIpQLScwekWYxeq32W6NTyIqAtag3YfI4pgbmclfrPuLaL5WLtj-pA`), five questions, all optional:
  `entry.834284576` שם מלא · `entry.947166453` טלפון · `entry.247289337` מייל ·
  `entry.2138204294` במה מעוניין? · `entry.1594498855` משהו נוסף?.
  Google refuses the **whole** response when a multiple-choice value is not one of the question's
  options, so the three radio `value=` strings have to match the form exactly — and the form's
  wording does get edited. To check them, fetch the form and read the options out of
  `FB_PUBLIC_LOAD_DATA_`; posting from a shell mangles Hebrew, so build the request in Python with
  an explicit UTF-8 body. Verified end to end on 10.9.2026: all three options accepted (HTTP 200)
  with the full five-field payload.
- `assets/hora.mov` is the 138MB archive master for the lectures page's "פעם ידענו לעשות את זה"
  band; `*.mov` is gitignored. What ships is `assets/hora-bg.mp4` (30s, 1080x828, ~3.4MB) plus
  `hora-poster.jpg`. Re-encode with the CapCut ffmpeg and *plain* AMF flags —
  `-c:v h264_amf -b:v 900k`; adding `-quality`/`-rc vbr_peak` or `+faststart` in the same pass
  hangs the encoder at close. Do faststart as a separate `-c copy` remux.
- One Roee headshot for the whole site: `assets/roee-azizi.webp`, a 600×600 square crop used by
  the lectures byline and the מי אנחנו block on the Mitzpe page. Both round it with CSS
  `border-radius:50%`, so the file itself has to stay square — the retired `roee-portrait.webp` had a
  circle and a pale-blue ground baked in, which read as a ring inside the CSS circle. It is cropped
  from a 1206×1292 PNG that sits in `assets/` untracked; `roee-azizi.jpg` is still the signature photo
  on the manifesto.
- `og:image` URLs are absolute and hardcoded to `hinenu-site.vercel.app`. A custom domain means updating them in all four pages.

## Open items
- Google Form: turn on email notification per response (Formspree already mails each one, so this is belt-and-braces).
- No analytics beyond the Meta pixel (`901591649440894`), which now fires `Lead` on submit plus `trackCustom` events via `data-track="Name"` on any element. GA4 still missing.
- Phone-only "keep me posted" capture has nowhere to go — the quiet-channel strip links to the WhatsApp group instead. Needs its own Google Form if Romi wants the field.
- Letter text may still be revised by Roee Azizi.
- "אני רוצה עזרה לעבור לדרום או לצפון" fan item links to hinenupioneers.com pending a better target.
- Photos/videos wanted for כיף בעוטף + שמונה venture cards; videos from the 16.6 evening can be added to the past-event popup (`EV[2].gallery`).
- Custom domain not configured.
- `.hn-foot` is a `<footer>`, and index/more still carry the old site's `footer{ padding:230px 0 52px }`
  rule. The shared footer resets `padding:0` and `font-weight:inherit` on its links to shake that
  off — an element selector from the page will keep reaching it, so watch for it.
- "השארת פרטים" (contact dialog row, on every page) opens the on-site apply modal
  ("רוצים להתחיל? השאירו פרטים"), which posts into the contact Google Form
  (`1FAIpQLScwekWYxeq32W6NTyIqAtag3YfI4pgbmclfrPuLaL5WLtj-pA`) + Formspree — see Forms above.
  index/more: `href="#" data-apply`; harzaot (common.js fallback dialog, via `data-apply` on the
  script tag) and mitzpe: `index.html#apply`, which opens the modal on arrival. Romi asked for
  this on 11.9.2026 — it used to open the Google Form itself in a new tab.
- The tracks section is laid **over** the end of the manifesto like a fresh sheet: `--cover`
  (82vh, 58vh on phones) is added as `padding-bottom` on `.letter-track` — which keeps the sticky
  letter pinned through it — and pulled straight back off with `margin-top:calc(-1 * var(--cover))`
  on `.tracks`, so the page is no taller than before. `updateLetter()` subtracts that same padding
  from its scrollable range. Change one of the three and the other two have to follow.
  Inside that range the ink is not linear: `WRITE_END` (0.5) is the share of it the handwriting
  takes, and the rest is the finished letter held still in front of the reader before the sheet
  starts to arrive. `buildLetter()` sizes `.letter-track` for all three stretches
  (`190vh + 0.62vh per glyph`, `150 + 0.5` on phones) — sizing it for the writing alone leaves the
  sheet landing on a half-written page.
- **One language for the whole site.** All four pages read and write the same localStorage key,
  `hinenu-lang` — they used to have three (`hinenu-lang`, `harzaot-lang`, `mg-lang`), so English
  fell back to Hebrew every time you moved between pages. Each page's `applyLang()` also translates
  `src`, which is how the header logo swaps to `assets/logo-white-en.png` in the English view.
- The header bars carry only הנני + / צרו קשר / נגישות / EN — the ניווט + fan was removed from
  every page, and so was the matching ניווט section inside the ☰ drawer. What is left on all four
  pages is הנני (the five actions) and עוד (צרו קשר / נגישות / view switch / EN).
- Accessibility officer of record: רומי שמואלוב (romishmuelov@gmail.com) — named in the toolbar,
  in the statement modal and on `mitzpe-gvolot/accessibility.html`.
- The lectures page ends on the hora: the light "מתי תרצו שנגיע?" band (with the hill illustration
  and its `#hill` parallax) is gone, and the single CTA now sits over the film inside `.history`.
  That section carries `id="cta"` because the floating `.dock` hides itself once the real CTA is on
  screen — repoint `ctaSec` if the CTA ever moves again.
- The hero video's pause button is `display:none` under 760px. WCAG 2.2.2 is still satisfied there
  by the accessibility toolbar's "עצירת אנימציות", which pauses every `<video>` on the page — don't
  remove that from `hinenu-common.js` without putting the button back.
- The ventures rail on `more.html` is a ring: the markup holds one set of seven cards (one
  "את/אתה?" card, six founders) and the script appends two `aria-hidden` clones of it, keeping
  `scrollLeft` folded into the middle lap (`vlap` = first clone's `offsetLeft` minus the first
  original's). Drift, drag, wheel and the position bar all go through `vWrite()`/the `scroll`
  handler, so nothing ever reaches the scroller's real ends and the seam is pixel-identical.
  The edge fades (`.vrail::before/::after`, 120px) are always on — there is no start or end to
  reveal. Don't add a second "you" card to the markup; the ring brings the first one back around.
