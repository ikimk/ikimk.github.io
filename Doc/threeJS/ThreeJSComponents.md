# ThreeJS Components

Names to use when referencing effects in chat or code. Route: `/threejs`.

## Host

| Name | What it is | File |
|------|------------|------|
| **ThreeJSPlayground** | Page shell (HELLO + canvas) | `src/components/ThreeJSPlayground.tsx` |
| **ThreeJSCanvas** | Single shared WebGL canvas + control panel | `src/components/ThreeJSCanvas.tsx` |
| **threeJSControls** | All default values / knobs in one file | `src/components/threejs/threeJSControls.ts` |

Effects are **separate factories** on one canvas. Each gets **only its own params** — changing one effect never updates another.

**Tune defaults:** edit `threeJSControls.ts` (`STARLIGHT_DEFAULTS`, `SUNGLOW_DEFAULTS`, `FILMGRAIN_DEFAULTS`).

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

**Controls:** `wavelength`, `amplitude`, `scrollIntensity`, `curveWidth`, `sunGlow`, `sunScroll`, `sunOpacity`, `waveOffsetY`

---

### SunGlow

**Call it:** `SunGlow`

Top edge: straight orange/yellow sun bloom. No ribbon. Fully independent.

| | |
|--|--|
| Factory | `createSunGlow` |
| File | `src/components/threejs/createSunGlow.ts` |
| Params | `SUNGLOW_DEFAULTS` in `threeJSControls.ts` → panel keys `sunGlowTop` / `sunScrollTop` / `sunOpacityTop` |
| FilmGrain | **No** |

**Controls:** `sunGlow`, `sunScroll`, `sunOpacity` (top only)

---

### FilmGrain

**Call it:** `FilmGrain`

Static filmic grain. **Opt-in per effect** — not fullscreen, not automatic on every effect.

| | |
|--|--|
| Module | `filmGrainGlsl` / `filmGrainUniform` |
| File | `src/components/threejs/createFilmGrain.ts` |
| Params | `FILMGRAIN_DEFAULTS` in `threeJSControls.ts` → `grainIntensity` in the panel |

**Controls:** `intensity` (default `0.18`)

#### Effects with FilmGrain (keep this list updated)

| Effect | Has FilmGrain? |
|--------|----------------|
| **StarlightRibbon** | Yes |
| **SunGlow** | No |

When adding grain to another effect: include `filmGrainGlsl` + `filmGrainUniform` in that effect’s shader, pass `filmGrain` from `ThreeJSCanvas`, and mark **Yes** in this table.

---

## Quick reference

| Chat name | Edge / layer | File | FilmGrain? |
|-----------|--------------|------|------------|
| **StarlightRibbon** | Bottom | `createStarlightRibbon.ts` | Yes |
| **SunGlow** | Top | `createSunGlow.ts` | No |
| **FilmGrain** | Opt-in overlay on selected effects | `createFilmGrain.ts` | — |

---

## Not mounted (legacy / saved)

| Name | Note | File |
|------|------|------|
| SiriWaveCanvas | Older full-canvas setup; not used by `/threejs` | `src/components/SiriWaveCanvas.tsx` |
| FluidScrollCanvas | Saved fluid experiment; unused | `src/components/FluidScrollCanvas.tsx` |

---

## How to ask

- “Bump **SunGlow** opacity” → top only (`sunOpacityTop`)
- “Move **StarlightRibbon** up 2px” → `waveOffsetY`
- “Make **StarlightRibbon** sun weaker” → ribbon `sunGlow` / `sunOpacity` — does **not** touch SunGlow
- “Change **SunGlow** strength” → `sunGlowTop` — does **not** touch StarlightRibbon
- “More / less **FilmGrain**” → `grainIntensity` (affects only effects in the FilmGrain table)
- “Add **FilmGrain** to [effect]” → opt-in that effect like StarlightRibbon
