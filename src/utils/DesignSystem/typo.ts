/**
 * Typo — font size, tracking, weight tokens for type harmony.
 * Font sizes use golden Scales from `goldenRatio.ts`.
 * `FontSizeN` === `ScaleN` (same number). Tracking uses named steps.
 * When chat does not specify tracking / weight / line-height → use *Auto.
 */

import {
  Scale1,
  Scale2,
  Scale3,
  Scale4,
  Scale5,
  Scale6,
  Scale7,
  Scale8,
  Scale9,
  Scale10,
} from '@/utils/DesignSystem/goldenRatio';

/** Letter-spacing — Auto = browser/normal when not specified */
export const TrackingAuto = 'normal';
export const Tracking1 = '-0.13em'; // header / nav
export const Tracking2 = '-0.09em'; // display / hero

/**
 * Type sizes — number matches golden Scale index (`FontSize10` = `Scale10`).
 * Display (current): FontSize5 desktop → FontSize6 tablet → FontSize8 mobile
 */
export const FontSize1 = Scale1; // 1400
export const FontSize2 = Scale2; // 865.28
export const FontSize3 = Scale3; // 534.54
export const FontSize4 = Scale4; // 330.44
export const FontSize5 = Scale5; // 204.26 — display / hero (desktop)
export const FontSize6 = Scale6; // 126.23 — display / hero (tablet)
export const FontSize7 = Scale7; // 78
export const FontSize8 = Scale8; // 48.23 — display / hero (mobile)
export const FontSize9 = Scale9; // 29.78
export const FontSize10 = Scale10; // 18.41 — header / UI

/** Font weights (Open Sans) — Auto when not specified */
export const FontWeightLight = 300;
export const FontWeightAuto = 400;
export const FontWeightRegular = 400;
export const FontWeightSemiBold = 600;
export const FontWeightBold = 700;
export const FontWeightExtraBold = 800;

/** Line-height — Auto when not specified */
export const LineHeightAuto = 'normal';
export const LineHeightSolid = 1; // tight display lines
