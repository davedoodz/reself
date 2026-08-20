# Agent guide — RE:SELF

Voice-first journaling app for breaking negative thought cycles, backed by MIT/Harvard
research. Two deliverables in one repo.

```
reself/
├── mobile/   Expo (React Native) app — iOS + Android
├── web/      static landing page → https://reself.davidlafond.xyz
└── vercel.json   outputDirectory: "web"
```

- **Repo:** <https://github.com/davedoodz/reself> (public, `main`)
- **Live:** <https://reself.davidlafond.xyz>
- **Design source:** Paper file `RESELF` — <https://app.paper.design/file/01M0CBVGTDBQG07J378EA5BAZZ/1-0>

## Current state

| | |
| --- | --- |
| App | Builds and runs. `tsc --noEmit` clean. iOS 3.9MB + Android 4.1MB Hermes bundles. |
| Landing page | Deployed, zero console errors, zero failed requests, no overflow at 390 or 1440. |
| Native runtime | **Never executed.** No Xcode and no Android SDK on this machine. |
| App Store | Not submitted. No App ID exists. |

Stack: Expo SDK 57, expo-router, React 19.2, RN 0.86, TypeScript. Recording via
`expo-audio`, files via `expo-file-system`, metadata via AsyncStorage.

## How the design got here — read before touching UI

The Paper file's 23 artboards are absolutely-positioned Figma imports: **2559 nodes, no
components, no design tokens**, card borders drawn as ~800-character hand-traced SVG
outline paths, phantom triple-nested wrappers, and the iOS status bar redrawn as ~15
vector nodes on every single frame.

They were used as a **spec source** — exact values pulled with `get_computed_styles` —
and the structure was rebuilt. **Do not transpile artboards with `get_jsx`.** It emits
percentage-positioned soup that renders correctly at exactly 402×874 and nowhere else.

Screenshots are for verifying output only, never as input.

### 23 artboards → 8 routes + 2 state axes

Most artboards are duplicates differing by one piece of state:

| Artboards | Difference | Implementation |
| --- | --- | --- |
| `m4/m5` `m6/m7` `m8/m9` `m12/m13` `m14/m15` | tutorial overlay on/off | one `<CoachMark>`, `tutorial.step` |
| `m10` `m11` | row playing / row armed to delete | `playing` + `armedForDelete` props |
| `m16`–`m19` | mode picked / style picked | one two-step `<RecorderSheet>` |
| `m20`–`m23` | talking\|writing × free-form\|guided | `mode × style` route params |

If you find yourself adding a screen, check first whether it is state on an existing one.

## Token contract

`mobile/src/theme.ts` mirrors the 39 design tokens in the Paper file **1:1**. Change one,
change the other. The Paper file had zero tokens before these were added.

### Do not "restore" the original colours

Every text node in the artboards was `#81BFE9` or `#7EBFEC`, measuring **1.87:1** and
**1.99:1** against the canvas and card fills. That fails WCAG AA for text (4.5:1) and
fails the non-text floor (3:1) as well. Corrected, deliberately:

| Token | Value | Contrast | Use |
| --- | --- | --- | --- |
| `ink` | `#1F5378` | 8.18:1 on surface | primary text |
| `inkMuted` | `#33739F` | 5.13:1 / 4.81:1 | timestamps, counts, headers |
| `brand` | `#7EBFEC` | 1.99:1 — **fails** | large fills ONLY: FAB, avatar disc, tab bar |
| `brandStrong` | `#4A93C6` | 3.34:1 | icon strokes, borders, waveform |

Two other artboard defects were corrected, not reproduced:

- Screen titles were set in **`Tamil MN`** — a local macOS Tamil-script face with only
  400/700, applied to Latin text. It does not resolve on iOS or Android. Now Afacad Flux.
- The 48px avatar initial sat on a **26px line-height**, clipping the glyph. Now 56px.

A third was a content bug: the `m8` coach-mark body was `m6`'s copy pasted, describing
"behavioural goals" on the Journal Entries step. Rewritten in `src/store/tutorial.tsx`.

## Layout of mobile/

| Path | Contents |
| --- | --- |
| `app/` | expo-router routes — `index`, `welcome`, `(tabs)/×4`, `session/{talk,write}`, `entry/[id]` |
| `src/theme.ts` | tokens |
| `src/icons.tsx` | vuesax-linear set as stroked SVG on a 24×24 grid |
| `src/components/` | 11 components |
| `src/store/` | `entries` `intentions` `profile` `tutorial` — context + AsyncStorage |
| `src/audio/useEntryPlayback.ts` | one shared player for the whole list |
| `src/prompts.ts` | guided prompts, deterministic per-day pick |

### Non-obvious decisions

- **Audio storage.** Only the *filename* goes in AsyncStorage; the URI is resolved at
  read time. An iOS app-container path changes between installs and OS upgrades, so a
  stored absolute URI would break.
- **Lazy `Paths.document`.** `getAudioDir()` resolves on first use, not at module scope,
  so importing the store never touches the filesystem. This is what lets the app boot on
  web, where `expo-file-system`'s `File`/`Directory` are no-op stubs.
- **One player, re-pointed.** `useEntryPlayback` creates a single player with a `null`
  source and calls `replace()`. Passing a changing source to `useAudioPlayer` tears down
  and rebuilds the native object on every selection.
- **Duration captured before `stop()`.** `state.durationMillis` resets on stop.
- **No `@react-navigation/bottom-tabs` import.** expo-router vendors react-navigation
  and does not re-export it at a stable path; `TabBar.tsx` derives its props from
  `typeof Tabs` instead.
- **No `babel.config.js`.** SDK 57 supplies the preset internally. Adding one requires
  `babel-preset-expo` as an explicit dependency, and omitting it breaks Metro.
- **Fixed-width slots everywhere.** Icons and trailing values sit in `flexShrink: 0`
  slots so lanes align across rows of different kinds. Do not replace with `gap` alone.
- **`react-dom` / `react-native-web` are intentional.** They enable `npm run web` for
  quick design review in a browser. Not needed to ship.

## Landing page

One static file plus a favicon package. No build step, no framework.

Direction: *laboratory glass* — deliberately not the broadsheet look that "media lab"
usually collapses into. Type is **Afacad Flux** (the app's own face) + **IBM Plex Mono**,
continuing from `reself-vision.html` in the portfolio repo. Palette is the app's tokens
so web and product read as one system.

- **Signature:** a real plotted waveform — 132 amplitude samples of a synthesised speech
  envelope, five phrases with breath pauses, labelled as a specimen. Traces in once on
  load, gated behind `prefers-reduced-motion: no-preference`.
- **Spec table, not a 3-up.** Every row is a true fact about the shipped build. Numbered
  `01/02/03` markers were considered and cut — they would have been decoration.
- **Favicon** is the wordmark's colon on an ink disc, drawn as *geometry not text* so it
  has no font dependency. Tuned to a 3px inter-dot gap; at the original spacing the two
  dots merged into a figure-8 at 16px.
- Bars decimate to every other sample under 40rem — 132 bars at 1px plus 2px gaps need
  ~394px and overflowed a 390px viewport.

### Deploying

GitHub is connected. **A push to `main` deploys.** `vercel.json` sets
`outputDirectory: "web"`, which is load-bearing: without it Vercel builds from the repo
root, finds no `index.html`, and serves nothing. `mobile/` is never served — verify with
`curl -o /dev/null -w '%{http_code}' https://reself.davidlafond.xyz/mobile/package.json`
returning 404.

## Open items

1. **Activate the App Store button.** It ships inert because there is no App ID and a
   fabricated link would 404. In `web/index.html`, set `href` on `a.appstore` to
   `https://apps.apple.com/app/id<APP_ID>` and delete `aria-disabled`. A comment marks
   the line. Also replace the "Submitted for review shortly" note.
2. **Run the app natively.** Needs Xcode. The record → save → play → delete loop is
   verified in a browser with a fake mic device; the `File.move` into `Paths.document`
   and playback-from-disk are native-only paths, proven to bundle and API-conformant but
   never executed. `npx expo run:ios`.
3. **Placeholder URLs in Settings.** `example.com/reself/{privacy,terms}`, and "Read our
   Research" points at `media.mit.edu`.
4. **App icon.** `mobile/assets/` still holds the Expo template icons.
5. **Cross-repo.** `david-lafond-designs` has a `reself` project slug in
   `src/explorations.ts`. If you build design explorations for this app, register them
   there per that repo's own `AGENTS.md` — not here.

## Verifying work here

There is no test suite. Verification is running the thing.

```sh
cd mobile && npm run tsc                                  # typecheck
cd mobile && npx expo export --platform ios --platform android --output-dir /tmp/x
cd mobile && npm run web                                  # drive it in a browser
cd web && npx serve .                                     # landing page
```

For the app in a browser: AsyncStorage maps to localStorage so persistence is real, and
`expo-audio` records via MediaRecorder. Chrome needs `--use-fake-device-for-media-stream`
to supply a microphone headlessly. Filesystem writes are stubs on web, so saving a *voice*
entry will not complete there — text entries exercise the full create/list/read/delete
loop.

Check contrast numerically before shipping a colour. This design's history is that
nobody did.
