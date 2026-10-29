# ThreeJS Components

Names to use when referencing effects in chat or code. Route: `/test`.

## Host

| Name | What it is | File |
|------|------------|------|
| **ThreeJSPlayground** | `/test` shell (canvas only) | `src/components/ThreeJSPlayground.tsx` |
| **ThreeJSCanvas** | Shared WebGL canvas + control panel | `src/components/ThreeJSCanvas.tsx` |
| **threeJSControls** | All default values / knobs in one file | `src/components/threejs/threeJSControls.ts` |
| **threeJSColors** | Effect / shader color tokens (not UI `color.ts`) | `src/components/threejs/threeJSColors.ts` |

Effects are **separate factories** on one canvas. Each gets **only its own params** — changing one effect never updates another.

**Tune defaults:** edit `threeJSControls.ts` (`PSGRID_DEFAULTS`, `STARLIGHT_DEFAULTS`, `SUNGLOW_DEFAULTS`, `FILMGRAIN_DEFAULTS`, `GRADIENTCLOUD_DEFAULTS`, `RED_SUNRISE_GLASS_DEFAULTS`, `PINK_SUNRISE_GLASS_DEFAULTS`).  
**Effect colors:** edit `threeJSColors.ts` (UI palette stays in `src/utils/DesignSystem/color.ts`).

---

## Effects

### PSGrid

**Call it:** `PSGrid`

Full-screen wallpaper: PlayStation-style □ △ ○ ✕ outlines on a brick-staggered grid. Glyphs scroll top→bottom; size noise scrolls up. Drawn behind SunGlow / StarlightRibbon on the shared canvas. Warped by **Bend** (3D Z sine on the mesh).

| | |
|--|--|
| Factory | `createPSGrid` |
| File | `src/components/threejs/createPSGrid.ts` |
| Params | `PSGRID_DEFAULTS` in `threeJSControls.ts` |
| Colors | `ThreeColorPSGridGlyph` (home) / `ThreeColorPSGridGlyphError` (404) in `threeJSColors.ts` — transparent plane, page bg shows through |
| FilmGrain | **No** |

**Controls:** `scale`, `glyph_size`, `stroke`, `opacity`, `opacity_to`, `noise_scale`, `noise_amount`, `noise_speed`, `glyph_speed`, `size_min`, `fade_top`, `parallax`, `bend`, `bend_to`  
Size varies per cell via fbm noise (halftone-style). Top fade (`fade_top`) goes opacity 0→1. **Parallax** — page `scrollY` shifts grid UV Y (small depth behind fixed canvas). **Bend** — 3D Z sine; wheel scroll lerps `bend` → `bend_to`.

---

### StarlightRibbon

**Call it:** `StarlightRibbon`

Bottom edge: multi-color standing-wave ribbon (guitar-string up/down) **plus** its own warm bloom (part of this component only).

| | |
|--|--|
| Factory | `createStarlightRibbon` |
| File | `src/components/threejs/createStarlightRibbon.ts` |
| Params | `STARLIGHT_DEFAULTS` in `threeJSControls.ts` |
| FilmGrain | **Yes** (opt-in) |

**Controls:** `wavelength`, `amplitude`, `scroll_intensity`, `curve_width`, `ribbon_sun_glow`, `ribbon_sun_on_scroll`, `ribbon_sun_opacity`, `wave_offset_y`, `blend_height`, `blend_strength`

**Blend:** page-bg veil (`ThreeColorStarlightBlend`) above the ribbon — transparent at the glow, dark upward — for a soft dark→light fade into the scene.

---

### SunGlow

**Call it:** `SunGlow`

Top edge: straight orange/yellow sun bloom. No ribbon. Fully independent.

| | |
|--|--|
| Factory | `createSunGlow` |
| File | `src/components/threejs/createSunGlow.ts` |
| Params | `SUNGLOW_DEFAULTS` in `threeJSControls.ts` → panel keys `sun_glow` / `sun_glow_on_scroll` / `sun_opacity` |
| FilmGrain | **No** |

**Controls:** `sun_glow`, `sun_glow_on_scroll`, `sun_opacity` (top only)

---

### FilmGrain

**Call it:** `FilmGrain`

Static filmic grain. **Opt-in per effect** — not fullscreen, not automatic on every effect. **Always** mask with coverage so grain hits the drawn effect/element only — never blank/bg.

| | |
|--|--|
| Module | `filmGrainGlsl` / `filmGrainUniform` |
| File | `src/components/threejs/createFilmGrain.ts` |
| Params | `FILMGRAIN_DEFAULTS` in `threeJSControls.ts` → `grain_intensity` in the panel |

**Controls:** `grain_intensity` (default `0.13`)

#### Effects with FilmGrain (keep this list updated)

| Effect | Has FilmGrain? |
|--------|----------------|
| **PSGrid** | No |
| **StarlightRibbon** | Yes |
| **SunGlow** | No |
| **GradientCloud** | Yes (own canvas; not mounted on `/test`) |
| **PinkSunriseGlassEffect** | No |
| **RedSunriseGlassEffect** | No |

When adding grain to another effect: include `filmGrainGlsl` + `filmGrainUniform` in that effect’s shader, pass **coverage = drawn element mask** (not 1.0 on empty/bg), give the effect its own intensity key, and mark **Yes** in this table.

---

### RedSunriseGlassEffect

**Call it:** `RedSunriseGlassEffect`

Own-canvas effect: DesignSystem red/orange/yellow/light-blue sun-at-bottom motion + vertical fluted glass.

| | |
|--|--|
| Component | `RedSunriseGlassEffect` |
| Factory | `createRedSunriseGlassEffect` |
| Files | `RedSunriseGlassEffect.tsx`, `createRedSunriseGlassEffect.ts` |
| Saved copy | `Doc/threeJS/saved/createRedSunriseGlassEffect.ts` |
| Params | `RED_SUNRISE_GLASS_DEFAULTS` / `redSunriseGlassLive` in `threeJSControls.ts` |
| Colors | `ThreeColorRedSunrise*` → ColorRed / ColorOrange / ColorYellow / ColorLightBlue |
| FilmGrain | **No** |

**Controls:** `speed`, `ribs`, `glass`, `spread`, `wave` (in `threeJSControls.ts`; not mounted on `/test`)

---

### PinkSunriseGlassEffect

**Call it:** `PinkSunriseGlassEffect`

Own-canvas card effect: a sun at the bottom center spreads pink/orange light in expanding circles, seen through static vertical reeded glass. Colors are **out of design system** (sampled from a reference image).

| | |
|--|--|
| Component | `PinkSunriseGlassEffect` |
| Factory | `createPinkSunriseGlassEffect` |
| Files | `PinkSunriseGlassEffect.tsx`, `createPinkSunriseGlassEffect.ts` |
| Saved copy | `Doc/threeJS/saved/createPinkSunriseGlassEffect.ts` |
| Params | `PINK_SUNRISE_GLASS_DEFAULTS` / `pinkSunriseGlassLive` in `threeJSControls.ts` |
| Colors | `ThreeColorPinkSunrise*` in `threeJSColors.ts` (commented “out of design system color”) |
| FilmGrain | **No** |

**Controls:** `speed`, `ribs`, `glass`, `spread`, `wave` (in `threeJSControls.ts`; not mounted on `/test`)

---

## Quick reference

| Chat name | Edge / layer | File | FilmGrain? |
|-----------|--------------|------|------------|
| **PSGrid** | Shared canvas, full-screen BG (+ Bend) | `createPSGrid.ts` | No |
| **StarlightRibbon** | Shared canvas, bottom | `createStarlightRibbon.ts` | Yes |
| **SunGlow** | Shared canvas, top | `createSunGlow.ts` | No |
| **FilmGrain** | Opt-in on selected shared effects | `createFilmGrain.ts` | — |
| **RedSunriseGlassEffect** | Own canvas — saved off `/test` | `createRedSunriseGlassEffect.ts` | No |
| **PinkSunriseGlassEffect** | Own canvas — saved off `/test` | `createPinkSunriseGlassEffect.ts` | No |

---

## Not mounted (ready later / legacy)

| Name | Note | File |
|------|------|------|
| **GradientCloud** | Completed look — remount via `<CTADiv>` / `<GradientCloud />` when needed | `GradientCloud.tsx`, `createGradientCloud.ts` |
| **CTADiv** | Div + GradientCloud bg wrapper | `CTADiv.tsx` |
| **ProjectDistortion** | Saved idea — DOM-synced −Z scroll bend; not working well enough yet | `Doc/threeJS/saved/createProjectDistortion.ts` |
| SiriWaveCanvas | Older full-canvas setup; not used by `/test` | `src/components/SiriWaveCanvas.tsx` |
| FluidScrollCanvas | Saved fluid experiment; unused | `src/components/FluidScrollCanvas.tsx` |

---

## How to ask

- “Bump **SunGlow** opacity” → top only (`sun_opacity`)
- “Move **StarlightRibbon** up 2px” → `wave_offset_y`
- “Make **StarlightRibbon** sun weaker” → `ribbon_sun_glow` / `ribbon_sun_opacity` — does **not** touch SunGlow
- “Change **SunGlow** strength” → `sun_glow` — does **not** touch StarlightRibbon
- “More / less **FilmGrain** on Starlight” → FilmGrain panel `grain_intensity` ↔ `grain_intensity_to` (animates between)
- “Add **FilmGrain** to [effect]” → opt-in that effect like StarlightRibbon
- “Bring back **GradientCloud**” → mount `<CTADiv>` / `<GradientCloud />` (defaults in `GRADIENTCLOUD_DEFAULTS`)
