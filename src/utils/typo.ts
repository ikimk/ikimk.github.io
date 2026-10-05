/**
 * Typo — font size, tracking, weight tokens for type harmony.
 * Font sizes use golden Scales from `goldenRatio.ts`.
 * Tracking uses named steps (Tracking1, Tracking2…) — never invent em values.
 * When chat does not specify tracking / weight / line-height → use *Auto.
 */

import { Scale5, Scale10 } from '@/utils/goldenRatio';

/** Letter-spacing — Auto = browser/normal when not specified */
export const TrackingAuto = 'normal';
export const Tracking1 = '-0.13em'; // header / nav
export const Tracking2 = '-0.09em'; // display / hero

/** Type sizes (px via golden Scale) — add FontSizeN as new roles appear */
export const FontSize1 = Scale5; // 204.26 — display / hero
export const FontSize2 = Scale10; // 18.41 — header / UI

/** Font weights (Open Sans) — Auto when not specified */
export const FontWeightAuto = 400;
export const FontWeightRegular = 400;
export const FontWeightSemiBold = 600;
export const FontWeightBold = 700;

/** Line-height — Auto when not specified */
export const LineHeightAuto = 'normal';
export const LineHeightSolid = 1; // tight display lines
