/**
 * Golden Ratio scale — design harmony for font-size, padding, margin,
 * height, width, and gap. Base 1400px ÷ φ (1.618) each step.
 *
 * Freestyle → measure → snap to nearest scale (e.g. ~100px → Scale6 / Scale7).
 */

export const GOLDEN_RATIO = 1.618;
export const GOLDEN_BASE_PX = 1400;

/** Scale index → px (exact project values) */
export const GOLDEN_SCALE = {
  1: 1400,
  2: 865.28,
  3: 534.54,
  4: 330.44,
  5: 204.26,
  6: 126.23,
  7: 78,
  8: 48.23,
  9: 29.78,
  10: 18.41,
  11: 11.37,
  12: 7.04,
  13: 4.35,
  14: 2.69,
  15: 1.66,
  16: 1.03,
  17: 0.63,
  18: 0.39,
} as const;

export type GoldenScaleIndex = keyof typeof GOLDEN_SCALE;

/** Named aliases — prefer these when picking a step by eye */
export const Scale1 = GOLDEN_SCALE[1];
export const Scale2 = GOLDEN_SCALE[2];
export const Scale3 = GOLDEN_SCALE[3];
export const Scale4 = GOLDEN_SCALE[4];
export const Scale5 = GOLDEN_SCALE[5];
export const Scale6 = GOLDEN_SCALE[6];
export const Scale7 = GOLDEN_SCALE[7];
export const Scale8 = GOLDEN_SCALE[8];
export const Scale9 = GOLDEN_SCALE[9];
export const Scale10 = GOLDEN_SCALE[10];
export const Scale11 = GOLDEN_SCALE[11];
export const Scale12 = GOLDEN_SCALE[12];
export const Scale13 = GOLDEN_SCALE[13];
export const Scale14 = GOLDEN_SCALE[14];
export const Scale15 = GOLDEN_SCALE[15];
export const Scale16 = GOLDEN_SCALE[16];
export const Scale17 = GOLDEN_SCALE[17];
export const Scale18 = GOLDEN_SCALE[18];

const SCALE_ENTRIES = (
  Object.entries(GOLDEN_SCALE) as [string, number][]
).map(([k, v]) => [Number(k) as GoldenScaleIndex, v] as const);

/** px value for a scale step */
export function goldenPx(scale: GoldenScaleIndex): number {
  return GOLDEN_SCALE[scale];
}

/** `"78px"` for Tailwind arbitrary classes / inline styles */
export function goldenPxString(scale: GoldenScaleIndex): string {
  return `${GOLDEN_SCALE[scale]}px`;
}

/** Nearest scale index to a freestyle px measurement */
export function nearestGoldenScale(px: number): GoldenScaleIndex {
  let best: GoldenScaleIndex = 1;
  let bestDist = Infinity;

  for (const [index, value] of SCALE_ENTRIES) {
    const dist = Math.abs(value - px);
    if (dist < bestDist) {
      bestDist = dist;
      best = index;
    }
  }

  return best;
}

/** Snap a freestyle px value to the nearest golden scale px */
export function snapToGolden(px: number): number {
  return GOLDEN_SCALE[nearestGoldenScale(px)];
}

/** `"126.23px"` — freestyle measure → snapped CSS length */
export function snapToGoldenPxString(px: number): string {
  return `${snapToGolden(px)}px`;
}
