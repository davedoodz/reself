/** `1:05`, or `12:05` past ten minutes. Never `0:5`. */
export function formatDuration(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/** `1:43PM`, matching the timestamps drawn on the entry rows. */
export function formatTimeOfDay(epochMs: number): string {
  const d = new Date(epochMs);
  const hours = d.getHours();
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${d.getMinutes().toString().padStart(2, '0')}${suffix}`;
}
