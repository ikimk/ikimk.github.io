/**
 * Typo — font size, tracking, weight tokens for type harmony.
 * Font sizes use golden Scales from `goldenRatio.ts`.
 * Tracking uses named steps (Tracking1, Tracking2…) — never invent em values.
 * When chat does not specify tracking / weight / line-height → use *Auto.
 */

import { Scale5, Scale6, Scale8, Scale10 } from '@/utils/DesignSystem/goldenRatio';

/** Letter-spacing — Auto = browser/normal when not specified */
export const TrackingAuto = 'normal';
export const Tracking1 = '-0.13em'; // header / nav
export const Tracking2 = '-0.09em'; // display / hero

/**
 * Type sizes (px via golden Scale) — add FontSizeN as new roles appear.
 * Display: FontSize1 desktop → FontSize3 tablet → FontSize4 mobile
 */
export const FontSize1 = Scale5; // 204.26 — display / hero (desktop)
export const FontSize2 = Scale10; // 18.41 — header / UI
export const FontSize3 = Scale6; // 126.23 — display / hero (tablet)
export const FontSize4 = Scale8; // 48.23 — display / hero (mobile)

/** Font weights (Open Sans) — Auto when not specified */
export const FontWeightAuto = 400;
export const FontWeightRegular = 400;
export const FontWeightSemiBold = 600;
export const FontWeightBold = 700;

/** Line-height — Auto when not specified */
export const LineHeightAuto = 'normal';
export const LineHeightSolid = 1; // tight display lines
