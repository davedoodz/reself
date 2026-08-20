/**
 * Design tokens for RE:SELF.
 *
 * Mirrors the token set defined in the Paper file `RESELF` — keep the two in
 * sync. Values were extracted from the artboards with `get_computed_styles`,
 * not eyeballed from screenshots.
 *
 * Accessibility note: the source artboards drew every single piece of text in
 * `#81BFE9` / `#7EBFEC`, which measure 1.87:1 and 1.99:1 against the canvas and
 * card fills. That fails WCAG AA for text (4.5:1) and even the non-text UI
 * threshold (3:1). The brand blue is therefore kept for large fills only, and
 * `ink` / `inkMuted` / `brandStrong` carry anything that has to be legible.
 */

export const color = {
  /** App background. Every artboard fill. */
  canvas: '#F0F9FF',
  /** Card, entry row, and field fill. */
  surface: '#FFFFFF',
  /** Primary text. 8.18:1 on surface, 7.67:1 on canvas. */
  ink: '#1F5378',
  /** Secondary text: timestamps, counts, day headers. 5.13:1 / 4.81:1. */
  inkMuted: '#33739F',
  /** Brand fill for large shapes only — never text, never icon strokes. */
  brand: '#7EBFEC',
  /** Icon strokes and borders. 3.34:1 on surface, clears the 3:1 rule. */
  brandStrong: '#4A93C6',
  /** Hairline borders on cards and fields. */
  line: '#7EBFEC',
  /** Content sitting on `brand`. */
  onBrand: '#FFFFFF',
  /** Destructive affordances. */
  danger: '#B4483F',
  /** Translucent scrim behind coach marks and sheets. */
  scrim: 'rgba(31, 83, 120, 0.32)',
} as const;

export const font = {
  body: 'AfacadFlux_400Regular',
  medium: 'AfacadFlux_500Medium',
  semibold: 'AfacadFlux_600SemiBold',
  extrabold: 'AfacadFlux_800ExtraBold',
} as const;

/** Font sizes present in the artboards: 14 / 16 / 20 / 32 / 48. */
export const text = {
  caption: 14,
  body: 16,
  lead: 20,
  title: 32,
  display: 48,
} as const;

export const leading = {
  caption: 18,
  body: 24,
  lead: 26,
  title: 40,
  /** 56, not the 26 in the file — that value clipped the 48px avatar initial. */
  display: 56,
} as const;

/**
 * Spacing scale. Names map to the Paper tokens `--spacing-1` .. `--spacing-6`
 * (4/8/12/16/24) — identifiers here because `space.sm` is not valid syntax.
 */
export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  /** (402 artboard − 316 content) / 2. */
  gutter: 43,
} as const;

export const radius = {
  field: 12,
  /** Entry row. The traced SVG path was an asymmetric 24 top / 29 bottom. */
  card: 24,
  pill: 999,
} as const;

export const layout = {
  screen: 402,
  content: 316,
  rowHeight: 53,
  tabBarHeight: 54,
  fabSize: 75,
} as const;

export const type = {
  title: {
    fontFamily: font.body,
    fontSize: text.title,
    lineHeight: leading.title,
    letterSpacing: text.title * -0.03,
    color: color.ink,
  },
  lead: {
    fontFamily: font.medium,
    fontSize: text.lead,
    lineHeight: leading.lead,
    color: color.ink,
  },
  body: {
    fontFamily: font.medium,
    fontSize: text.body,
    lineHeight: leading.body,
    color: color.ink,
  },
  bodyMuted: {
    fontFamily: font.medium,
    fontSize: text.body,
    lineHeight: leading.body,
    color: color.inkMuted,
  },
  caption: {
    fontFamily: font.medium,
    fontSize: text.caption,
    lineHeight: leading.caption,
    color: color.inkMuted,
  },
} as const;
