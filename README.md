# RE:SELF

Voice-first journaling for breaking negative thought cycles. Built on research from MIT and Harvard.

```
reself/
├── mobile/   Expo (React Native) app — iOS and Android
└── web/      Landing page — reself.davidlafond.xyz
```

## mobile

Expo SDK 57, expo-router, TypeScript. Recordings are captured with `expo-audio` and
stored in the app's private container; only filenames go into AsyncStorage.

```sh
cd mobile
npm install
npm run ios       # needs Xcode
npm run android   # needs Android SDK
npm run web       # browser, for quick design review
npm run tsc       # typecheck
```

### Structure

| Path | Contents |
| --- | --- |
| `app/` | expo-router routes |
| `src/theme.ts` | design tokens, mirroring the `RESELF` Paper file 1:1 |
| `src/icons.tsx` | vuesax-linear icon set as stroked SVG |
| `src/components/` | 11 shared components |
| `src/store/` | entries, intentions, profile, tutorial — AsyncStorage-backed |
| `src/audio/` | shared playback hook |

### Where the design came from

The 23 artboards in the `RESELF` Paper file are absolutely-positioned imports:
2559 nodes, no components, no tokens, card borders drawn as hand-traced SVG
outlines. They were used as a **spec source** — exact values pulled with
`get_computed_styles` — and rebuilt with real layout. The artboards map onto
8 routes plus two orthogonal state axes:

- `m4/m5`, `m6/m7`, `m8/m9`, `m12/m13`, `m14/m15` differ only by the tutorial
  overlay → one `<CoachMark>` driven by `tutorial.step`
- `m10`, `m11` are entry-row states → `playing` / `armedForDelete` props
- `m16`–`m19` are one two-step `<RecorderSheet>`
- `m20`–`m23` are `mode × style` route params

Three defects in the source artboards were corrected rather than reproduced:

1. **Contrast.** Every text node was `#81BFE9` or `#7EBFEC` — 1.87:1 and 1.99:1
   against the canvas and card fills, below even the 3:1 non-text floor. The
   brand blue is now large fills only; `ink` (8.18:1) and `inkMuted` (5.13:1)
   carry anything that has to be read.
2. **Font.** Screen titles were set in `Tamil MN`, a local macOS Tamil-script
   face applied to Latin text. It does not exist on iOS or Android.
3. **Line height.** The 48px avatar initial sat on a 26px line-height, clipping
   the glyph.

## web

One static file, no build step.

```sh
cd web
npx serve .
```

The App Store button ships in a pending state because the app has not been
submitted. To activate it, set the `href` on `a.appstore` in `web/index.html`
to `https://apps.apple.com/app/id<APP_ID>` and delete its `aria-disabled`
attribute. There is a comment at that line.

### Deploying

`vercel.json` at the repo root sets `outputDirectory` to `web`, so a push to
`main` publishes <https://reself.davidlafond.xyz> with no build step and with no
Root Directory setting needed in the Vercel dashboard. `mobile/` is never served.
