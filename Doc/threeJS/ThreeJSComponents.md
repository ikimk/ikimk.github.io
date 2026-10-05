# ThreeJS Components

Names to use when referencing effects in chat or code. Route: `/threejs`.

## Host

| Name | What it is | File |
|------|------------|------|
| **ThreeJSPlayground** | Page shell (HELLO + canvas) | `src/components/ThreeJSPlayground.tsx` |
| **ThreeJSCanvas** | Single shared WebGL canvas + control panel | `src/components/ThreeJSCanvas.tsx` |
| **threeJSControls** | All default values / knobs in one file | `src/components/threejs/threeJSControls.ts` |

Effects are **separate factories** on one canvas. Each gets **only its own params** — changing one effect never updates another.

**Tune defaults:** edit `threeJSControls.ts` (`STARLIGHT_DEFAULTS`, `SUNGLOW_DEFAULTS`, `FILMGRAIN_DEFAULTS`, `GRADIENTCLOUD_DEFAULTS`).

---

## Effects

### StarlightRibbon

**Call it:** `StarlightRibbon`

Bottom edge: multi-color standing-wave ribbon (guitar-string up/down) **plus** its own warm bloom (part of this component only).

| | |
|--|--|
| Factory | `createStarlightRibbon` |
| File | `src/components/threejs/createStarlightRibbon.ts` |
| Params | `STARLIGHT_DEFAULTS` in `threeJSControls.ts` |
| FilmGrain | **Yes** (opt-in) |

**Controls:** `wavelength`, `amplitude`, `scroll_intensity`, `curve_width`, `ribbon_sun_glow`, `ribbon_sun_on_scroll`, `ribbon_sun_opacity`, `wave_offset_y`

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

Static filmic grain. **Opt-in per effect** — not fullscreen, not automatic on every effect.

| | |
|--|--|
| Module | `filmGrainGlsl` / `filmGrainUniform` |
| File | `src/components/threejs/createFilmGrain.ts` |
| Params | `FILMGRAIN_DEFAULTS` in `threeJSControls.ts` → `grain_intensity` in the panel |

**Controls:** `grain_intensity` (default `0.13`)

#### Effects with FilmGrain (keep this list updated)

| Effect | Has FilmGrain? |
|--------|----------------|
| **StarlightRibbon** | Yes |
| **SunGlow** | No |
| **GradientCloud** | Yes (own canvas; not mounted on `/threejs`) |

When adding grain to another effect: include `filmGrainGlsl` + `filmGrainUniform` in that effect’s shader, pass `filmGrain` from `ThreeJSCanvas`, and mark **Yes** in this table.

---

## Quick reference

| Chat name | Edge / layer | File | FilmGrain? |
|-----------|--------------|------|------------|
| **StarlightRibbon** | Shared canvas, bottom | `createStarlightRibbon.ts` | Yes |
| **SunGlow** | Shared canvas, top | `createSunGlow.ts` | No |
| **FilmGrain** | Opt-in on selected shared effects | `createFilmGrain.ts` | — |

---

## Not mounted (ready later / legacy)

| Name | Note | File |
|------|------|------|
| **GradientCloud** | Completed look — remount via `<CTADiv>` / `<GradientCloud />` when needed | `GradientCloud.tsx`, `createGradientCloud.ts` |
| **CTADiv** | Div + GradientCloud bg wrapper | `CTADiv.tsx` |
| SiriWaveCanvas | Older full-canvas setup; not used by `/threejs` | `src/components/SiriWaveCanvas.tsx` |
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
