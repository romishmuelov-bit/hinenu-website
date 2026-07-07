# HINENU Hebrew Site — Claude Handoff

## What this is
One-page RTL Hebrew marketing site for **הננו (Hinenu) — חלוצים של תקווה**: national-entrepreneurship evenings + an incubator (חממה) for young Israelis building ventures and NGOs. Built July 2026 by Itamar + Claude.

- **Live:** https://hinenu-site.vercel.app
- **Repo:** github.com/Itamargend/hinenu-site — **push to `main` auto-deploys** (Vercel Git integration, project `hinenu-site` on Itamar's Vercel account).
- Related sites: investor site (English, separate folder, not this repo), movement site https://www.hinenupioneers.com (Wix).

## Architecture — deliberately simple
Everything lives in **one `index.html`**: one `<style>` block, one vanilla-JS IIFE. No frameworks, no build step. Optimized images in `assets/` (webp/jpg, ≤1400px wide). Local handwriting font in `dana-yad-alefalefalef/`. Keep it single-file unless Itamar says otherwise.

## Page structure (top to bottom)
1. **Header** — fixed; two CTAs: "אני רוצה להגיש מועמדות לחממה" (opens apply modal) + "אני רוצה להגיע לערב יזמות הבא" (#event).
2. **Hero** — floating "national problems" wall + headline on a strong white halo. Problems are placed randomly but excluded from the middle band (top 26–70%) with min-distance scoring; they repel away from the cursor. User-added problems post to a Google Form (`SHEETS.problems`).
3. **Manifesto letter (#letter)** — scroll-driven handwriting ink effect on a sticky notebook, Dana Yad font, Roee Azizi's B&W photo at the signature. **The text is placeholder — final version is awaited from Roee Azizi.**
4. **Tracks (#tracks)** — cover-flow of 2 cards: מסלול א׳ ערבי יזמות / מסלול ב׳ החממה (solid blue, 2-col perks). Click/arrows/swipe to switch.
5. **Event (#event)** — the next evening: Michael Eisenberg, **Tue 28.7 · 19:30 · בית בן-גוריון, תל אביב** (flyer is source of truth). Photo is a transparent Magnific-upscaled cutout (`assets/michael-cutout.webp`) with drop-shadow. Main CTA = "הוסיפו ליומן" (Google Calendar link). "רוצים לדעת עוד?" expands questions + photo gallery from the 16.6 event (Yoel Zilberman).
6. **Ventures (#ventures)** — "כבר התחלנו" cover-flow on near-black `#101009` (matches investor site): Ben Namer / Meirov / Pitluk / "אתם?" card → apply modal.
7. **Backers (#backers)** — auto-scrolling marquee of grayscale institution logos.
8. **FAQ (#faq)** — sits on the *start* of the footer gradient (its background fades white→pale periwinkle).
9. **Footer** — continues the gradient into solid blue; Instagram + hinenupioneers.com pills.
10. **Apply modal** — full candidacy form, POSTs to **Formspree `xnjygrae`** (same endpoint as investor site) via fetch; confetti on success.

## Gotchas — learned the hard way, don't regress
- `body{overflow-x:clip}` — **never change to `hidden`**: it silently kills `position:sticky` (breaks the manifesto effect). The clip is needed because the carousel fans overflow horizontally, which in RTL creates a page-breaking scroll track.
- Carousels are RTL-adapted: cards fan with **negative** translateX; back-card clicks are intercepted in the capture phase so their buttons stay inert until front.
- Don't put `.reveal` on carousel cards (inline transforms conflict with the reveal transition).
- `.tiltable` = pressed-lean hover (±7°, scale .982, springy return). Photos only, not flow cards.
- Fade-ins look "broken" in hidden/background tabs (Chrome freezes transitions) — test in a focused tab.
- Deploying from a Hebrew-named cwd breaks Vercel CLI (empty project slug). Auto-deploy via git avoids this; manual fallback: `rm -rf /tmp/hinenu-site && cp -R "<folder>/" /tmp/hinenu-site && cd /tmp/hinenu-site && npx vercel --prod`.

## Conventions
- Hebrew copy: direct, energetic, second person ("דוגרי") — match existing tone.
- New images: optimize into `assets/` (webp, quality ~85, ≤1400px).
- The WhatsApp/PNG files at repo root are source material, not referenced by the site.

## Open items
- Replace manifesto placeholder text when Roee Azizi delivers his letter.
- `fonts/OHNettaEpstein*` is referenced but the folder doesn't exist (silent fallback — harmless; clean up or add the files someday).
- Custom domain not yet configured (Vercel → Settings → Domains).
