import React from 'react';
import Svg, { Circle, Path, Polygon, Rect } from 'react-native-svg';

import { color } from './theme';

export type IconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
};

/**
 * Vuesax-linear-style icon set, redrawn as stroked paths on a 24x24 grid.
 *
 * The artboards embedded these as flattened multi-path SVG groups (one copy per
 * screen). Here they are single stroked shapes that inherit size and colour, so
 * an icon change is one edit rather than twenty-three.
 */
function base(p: IconProps) {
  return {
    size: p.size ?? 24,
    stroke: p.color ?? color.brandStrong,
    strokeWidth: p.strokeWidth ?? 1.6,
  };
}

export function StickyNoteIcon(p: IconProps) {
  const { size, stroke, strokeWidth } = base(p);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M14 21H8c-3.5 0-5-2-5-5V8c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5v6"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M21 14h-4c-2 0-3 1-3 3v4"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M8 9h8M8 13h4" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function LibraryIcon(p: IconProps) {
  const { size, stroke, strokeWidth } = base(p);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 8c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5v8c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V8Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      <Circle cx="10" cy="15" r="2.2" stroke={stroke} strokeWidth={strokeWidth} />
      <Path
        d="M12.2 15V8.4l4.3-1.2v6"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="14.3" cy="13.2" r="2.2" stroke={stroke} strokeWidth={strokeWidth} />
    </Svg>
  );
}

export function ProfileIcon(p: IconProps) {
  const { size, stroke, strokeWidth } = base(p);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="7.5" r="4" stroke={stroke} strokeWidth={strokeWidth} />
      <Path
        d="M4.5 20.5c0-3.6 3.4-6.5 7.5-6.5s7.5 2.9 7.5 6.5"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function SettingsIcon(p: IconProps) {
  const { size, stroke, strokeWidth } = base(p);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="3" stroke={stroke} strokeWidth={strokeWidth} />
      <Path
        d="M3 13.1v-2.2c1.3 0 2.4-1.1 2.4-2.4 0-.4-.1-.8-.3-1.2l1.9-1.1c.7 1.1 2.1 1.5 3.2.9.7-.4 1.1-1.1 1.1-1.9h2.2c0 1.3 1.1 2.4 2.4 2.4.4 0 .8-.1 1.2-.3l1.1 1.9c-1.1.7-1.5 2.1-.9 3.2.4.7 1.1 1.1 1.9 1.1v2.2c-1.3 0-2.4 1.1-2.4 2.4 0 .4.1.8.3 1.2l-1.9 1.1c-.7-1.1-2.1-1.5-3.2-.9-.7.4-1.1 1.1-1.1 1.9h-2.2c0-1.3-1.1-2.4-2.4-2.4-.4 0-.8.1-1.2.3l-1.1-1.9c1.1-.7 1.5-2.1.9-3.2-.4-.7-1.1-1.1-1.9-1.1Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function MicIcon(p: IconProps) {
  const { size, stroke, strokeWidth } = base(p);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2.5a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0v-6a3 3 0 0 0-3-3Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      <Path
        d="M5 10.5v1a7 7 0 0 0 14 0v-1M12 18.5v3"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function TextAlignLeftIcon(p: IconProps) {
  const { size, stroke, strokeWidth } = base(p);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 5h18M3 10h11M3 15h18M3 20h11"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function PlayCircleIcon(p: IconProps) {
  const { size, stroke, strokeWidth } = base(p);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9.2" stroke={stroke} strokeWidth={strokeWidth} />
      <Polygon points="10,8.2 16.4,12 10,15.8" fill={stroke} />
    </Svg>
  );
}

export function PauseCircleIcon(p: IconProps) {
  const { size, stroke, strokeWidth } = base(p);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9.2" stroke={stroke} strokeWidth={strokeWidth} />
      <Rect x="9.2" y="8.2" width="2" height="7.6" rx="0.8" fill={stroke} />
      <Rect x="12.8" y="8.2" width="2" height="7.6" rx="0.8" fill={stroke} />
    </Svg>
  );
}

export function CloseIcon(p: IconProps) {
  const { size, stroke, strokeWidth } = base(p);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5.5 5.5l13 13M18.5 5.5l-13 13"
        stroke={stroke}
        strokeWidth={strokeWidth + 0.4}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function PlusIcon(p: IconProps) {
  const { size, stroke, strokeWidth } = base(p);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 4.5v15M4.5 12h15"
        stroke={stroke}
        strokeWidth={strokeWidth + 0.4}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function ArrowDownIcon(p: IconProps) {
  const { size, stroke, strokeWidth } = base(p);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3.5v17M6 14.8l6 6 6-6"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ChevronIcon({ open, ...p }: IconProps & { open?: boolean }) {
  const { size, stroke, strokeWidth } = base(p);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d={open ? 'M6 14.5 12 8.5l6 6' : 'M6 9.5 12 15.5l6-6'}
        stroke={stroke}
        strokeWidth={strokeWidth + 0.3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function TrashIcon(p: IconProps) {
  const { size, stroke, strokeWidth } = base(p);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 6.5h16M9.5 6.5V4.8c0-.7.6-1.3 1.3-1.3h2.4c.7 0 1.3.6 1.3 1.3v1.7M6.5 6.5l.8 12c.1 1.1 1 1.9 2 1.9h5.4c1 0 1.9-.8 2-1.9l.8-12"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function DocumentIcon(p: IconProps) {
  const { size, stroke, strokeWidth } = base(p);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 8v8c0 3-1.5 5-5 5H9c-3.5 0-5-2-5-5V8c0-3 1.5-5 5-5h6c3.5 0 5 2 5 5Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      <Path d="M8 9h8M8 13h8M8 17h5" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function ShieldIcon(p: IconProps) {
  const { size, stroke, strokeWidth } = base(p);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2.6 4.8 5.4v6c0 4.3 3 8.3 7.2 9.9 4.2-1.6 7.2-5.6 7.2-9.9v-6L12 2.6Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function CandleIcon(p: IconProps) {
  const { size, stroke, strokeWidth } = base(p);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2.5c1.8 1.7 2.7 3 2.7 4.1a2.7 2.7 0 1 1-5.4 0c0-1.1.9-2.4 2.7-4.1Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <Rect x="7.8" y="10.5" width="8.4" height="11" rx="2.4" stroke={stroke} strokeWidth={strokeWidth} />
    </Svg>
  );
}

export function QuestionIcon(p: IconProps) {
  const { size, stroke, strokeWidth } = base(p);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20.5 11.6c0 4.5-3.8 8.1-8.5 8.1-.7 0-1.4-.1-2-.2l-4.5 2 1.2-3.6a7.9 7.9 0 0 1-3.2-6.3c0-4.5 3.8-8.1 8.5-8.1s8.5 3.6 8.5 8.1Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <Path
        d="M9.9 9.4a2.2 2.2 0 1 1 3 2.1v1.2"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <Circle cx="12" cy="15.2" r="0.9" fill={stroke} />
    </Svg>
  );
}

export function BellIcon(p: IconProps) {
  const { size, stroke, strokeWidth } = base(p);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18.4 15.7V10.4a6.4 6.4 0 0 0-12.8 0v5.3l-1.4 2.3h15.6l-1.4-2.3Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <Path d="M9.6 18v.6a2.4 2.4 0 0 0 4.8 0V18" stroke={stroke} strokeWidth={strokeWidth} />
    </Svg>
  );
}

export function ProfileDeleteIcon(p: IconProps) {
  const { size, stroke, strokeWidth } = base(p);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="10" cy="7.5" r="4" stroke={stroke} strokeWidth={strokeWidth} />
      <Path
        d="M3 20.5c0-3.4 3.1-6.2 7-6.2 1 0 1.9.2 2.8.5"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <Path
        d="M15.5 17.5h5.5"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
}
