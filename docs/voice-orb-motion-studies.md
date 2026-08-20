# RE:SELF — Voice Orb Motion Studies

Context handoff for the listening-orb motion exploration. Captures what was
asked, what was built, the design decisions (including the colour question),
the technical approach, and how it maps back to the app.

> **Live prototypes** (served from this folder):
> - `orb.html` — 10 "decomposition" studies, original brand palette
> - `orb-warm.html` — 10 welcoming/warm studies + a live palette switcher
>
> ```sh
> # from david-lafond-designs/
> python3 -m http.server 8842 --directory public/reself-motion
> # → http://127.0.0.1:8842/orb.html
> # → http://127.0.0.1:8842/orb-warm.html
> ```

Both files are **self-contained single HTML files** (no build, no deps beyond
the Afacad Flux webfont). Everything is Canvas 2D + `requestAnimationFrame`.

---

## Why this exists

RE:SELF is voice-first journaling. The core interaction is the **recorder
screen** (`mobile/src/app/session/talk.tsx` in the app): a listening orb you
talk to. Today that screen draws a flat **230 pt brand halo** behind a **56 pt
`m:ss` timer**. The goal of this exploration: give the orb *motion* — make it
feel like it is genuinely listening (a bit like the ChatGPT voice orb) while
staying **therapeutic and friendly**, not clinical or twitchy.

Two requirements drove every study:
1. The orb should **respond to the voice** and **decompose / come apart** as you
   speak (point cloud / bloc feel), then re-form in the silences.
2. There must be a visible **recording-time indicator** — a wave, ring, timer,
   or similar — so you can feel how long you've been talking.

---

## The shared engine (both files)

A single **voice bus** drives every orb on the page at once, so variants are
directly comparable.

- **Sources:** a *simulated* voice (phrase model — 1.4–4.5 s of syllables, then
  a breath, so the idle page always looks like someone actually talking) **or**
  the *real microphone* via `getUserMedia` + `AnalyserNode`. Audio never leaves
  the page and nothing is recorded/uploaded. Mic denial falls back to the
  simulated voice with a notice.
- **Signal:** RMS level with rolling auto-gain, a 24-band log-spaced spectrum,
  and an onset/spike detector for syllables.
- **Character = "therapeutic, not twitchy":** asymmetric followers —
  **attack ≈ 55 ms, release ≈ 220 ms**. Fast enough to feel heard, slow enough
  to never feel nervous. The orb also **breathes at idle** and never looks off.
- **Controls (deck):** voice source (Simulated / Microphone), mood
  (Calm / Talking / Opening up), motion amount (Full / Gentle), a global
  **record** button that starts every timer in sync, and a live level meter.
- **Performance:** capped DPR, pre-rendered glow **sprites** (≈20× faster than
  `shadowBlur`), one global RAF loop, `IntersectionObserver` + `content-visibility`
  so off-screen cards don't render, RAF paused on tab hide. Measured **60 fps**.
- **Focus dialog:** hover a card → *Focus* opens a full-size `<dialog>` with
  `@starting-style` + `transition-behavior: allow-discrete` entry/exit.
- **A11y:** `prefers-reduced-motion` preselects the calmest settings; controls
  are real buttons with `aria-pressed`.

---

## Part 1 — `orb.html`: ten decomposition studies

Original brand palette (`#F0F9FF / #7EBFEC / #4A93C6 / #1F5378`). Each study
comes apart differently and carries its own way of showing elapsed time.

| # | Study | Decomposition | Time indicator |
|---|---|---|---|
| 01 | Fracture bloom | 16 plates spring out, re-knit | minute dial + sweep head |
| 02 | Nebula breath | volume inflates & blurs | 60-bead ring, one bead/sec |
| 03 | Voxel bloc | lattice cubes pop in whole grid steps | 30-cell bloc bar, 2 s each |
| 04 | Ribbon orbit | 9 great circles wobble per band | second hand with trail |
| 05 | Tide droplet | surface harmonics, sheds droplets | tide line rising inside body |
| 06 | Constellation weave | proximity threads stretch and snap | 5-second arc + nodes |
| 07 | Exhale dust | syllables puff dust off the shell | scrolling amplitude wave |
| 08 | Spectral petals | 40 mirrored petals on a phyllotaxis core | inner ring fills per minute |
| 09 | Gravity swarm | well loosens, orbits widen | orbiting mark, 1 lap/min |
| 10 | Strata slices | 17 layers shear + counter-rotate | sediment stack, 1 bar/6 s |

**Three fixes worth remembering** (real bugs, not polish):
- The gravity swarm collapsed to a dot under free integration → rebuilt with
  per-particle orbit planes + a radius spring (stable, never repeats).
- The ribbon rings bunched at the equator → rebuilt on Gram-Schmidt bases so
  they're true great circles (armillary sphere).
- The voxel lattice read as a solid disc → hollowed to a shell and depth-sorted.

---

## Part 2 — `orb-warm.html`: warmth + the colour question

Feedback: *"make them more welcoming and inviting — therapeutic good vibes —
perhaps we need to change the color?"*

**Answer: yes, change it.** Cool blue is clean but on a listening screen it can
read like a waiting room. This page keeps the same engine and the same
legibility rules (ink ≥ 7:1 on the canvas) but swaps the accent family for
warmth, and adds a **live palette switch** so all four can be compared in-page:

- **Dawn** *(default)* — peach → apricot → coral on warm cream. Most inviting.
- **Sage** — soft green / moss on warm off-white. Grounded, natural.
- **Blush** — rose / mauve / lilac. Tender, spa-like.
- **Sky** — the original brand blue, softened (one click away).

Switching palette recolours the whole page **and regenerates the orb glow
sprites live**. Recording is shown as **soft light**, not a red dot.

Motion does as much work as hue: everything is slower, rounder and
gradient-filled, default mood is **Calm**.

| # | Study | Why it feels welcoming |
|---|---|---|
| 01 | Sunrise breath | warm gradient orb breathing like easy lungs |
| 02 | Aurora veil | soft curtains of light swaying — dreamy |
| 03 | Warm bloom | rounded petals opening like a flower |
| 04 | Ripple pool | calm water, each phrase drops a ring |
| 05 | Drifting embers | motes rising over a low glow — cosy |
| 06 | Gel bloom | soft gel body swelling gently; rising fill = the minute |
| 07 | Halo pulse | concentric halos breathing — meditative |
| 08 | Dawn wash | a whole sunrise sky; the sun lifts on your voice |
| 09 | Lantern glow | floating points of light gathering inward |
| 10 | Soft cloud | pillowy, out-of-focus warmth |

Recording indicators here are gentle: soft minute rings, a light seam sweeping
the aurora, a rising tide in the gel body, a sun arc, an orbiting glint.

---

## How it maps back to the app

The recorder screen (`mobile/src/app/session/talk.tsx`) already renders the
230 pt brand halo + 56 pt `m:ss` timer. Every study keeps that halo and that
timer type and layers the motion on top, so a chosen direction drops in without
disturbing the surrounding layout. Design tokens come straight from
`mobile/src/theme.ts` — the studies do not eyeball colours.

Token reference (original / Sky):

| Token | Value | Use |
|---|---|---|
| `canvas` | `#F0F9FF` | screen background |
| `brand` | `#7EBFEC` | large fills only (fails text contrast) |
| `brandStrong` | `#4A93C6` | icon strokes, borders (3.34:1) |
| `ink` | `#1F5378` | primary text (7.67:1 on canvas) |
| `inkMuted` | `#33739F` | secondary text |

---

## Verified in-browser (headless Chromium)

- `orb.html`: 10/10 canvases painting, timers advancing in sync, **60 fps**,
  zero console errors; mic-denied fallback; Focus dialog open/animate/close;
  mood & motion toggles; reduced-motion preselects Calm + Gentle.
- `orb-warm.html`: 10/10 warm orbs painting across all four palettes; palette
  swap recolours chrome **and** regenerates orb sprites live; Focus dialog
  full-size; record toggles Start↔Stop; no errors.

---

## Open questions / next steps

- **Pick a direction** (or a small shortlist) to prototype natively in the
  Expo app. Strong "good vibes" candidates: *Sunrise breath*, *Dawn wash*,
  *Warm bloom*, *Halo pulse*.
- **Confirm the palette.** Dawn is the recommended warm default; Sage/Blush are
  alternatives; Sky stays available.
- **Native port:** the Canvas 2D math ports cleanly to `react-native-skia` or an
  `expo-gl` canvas; the voice bus maps onto `expo-audio` metering + an FFT.

---

*Generated as a context handoff from the motion-exploration session. Prototypes
live in `david-lafond-designs/public/reself-motion/` (`orb.html`,
`orb-warm.html`).*
