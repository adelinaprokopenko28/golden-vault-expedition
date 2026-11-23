/** Plain integer with space grouping: 12480 -> "12 480". No currency, ever. */
export function groupNumber(value: number): string {
  const safe = Number.isFinite(value) ? Math.round(value) : 0;
  const sign = safe < 0 ? '-' : '';
  return sign + String(Math.abs(safe)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/** "x1.5" style multiplier label - ASCII only. */
export function multiplierLabel(multiplier: number): string {
  const rounded = Math.round(multiplier * 100) / 100;
  return 'x' + (Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1));
}

/** 0.4213 -> "42%" */
export function percentLabel(ratio: number): string {
  if (!Number.isFinite(ratio) || ratio <= 0) {
    return '0%';
  }
  return String(Math.round(ratio * 100)) + '%';
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Percentage width for a progress bar. Cast is deliberate: RN's DimensionValue
 *  type only accepts template-literal percentages, never a computed string. */
export function pct(ratio: number): any {
  return Math.round(clamp(ratio, 0, 1) * 100) + '%';
}
