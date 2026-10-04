# ThreeJS Components

Names to use when referencing effects in chat or code. Route: `/threejs`.

## Host

| Name | What it is | File |
|------|------------|------|
| **ThreeJSPlayground** | Page shell (HELLO + canvas) | `src/components/ThreeJSPlayground.tsx` |
| **ThreeJSCanvas** | Single shared WebGL canvas + control panel | `src/components/ThreeJSCanvas.tsx` |

Effects are **separate factories** on one canvas. Each gets **only its own params** — changing SunGlow never updates StarlightRibbon, and vice versa.

---

## Effects

### StarlightRibbon

**Call it:** `StarlightRibbon`

Bottom edge: multi-color standing-wave ribbon (guitar-string up/down) **plus** its own warm bloom (part of this component only).

| | |
|--|--|
| Factory | `createStarlightRibbon` |
| File | `src/components/threejs/createStarlightRibbon.ts` |
| Params | `STARLIGHT_DEFAULTS` in `ThreeJSCanvas.tsx` |

**Controls:** `wavelength`, `amplitude`, `scrollIntensity`, `curveWidth`, `sunGlow`, `sunScroll`, `sunOpacity`, `waveOffsetY`

---

### SunGlow

**Call it:** `SunGlow`

Top edge: straight orange/yellow sun bloom. No ribbon. Fully independent from StarlightRibbon.

| | |
|--|--|
| Factory | `createSunGlow` |
| File | `src/components/threejs/createSunGlow.ts` |
| Params | `SUNGLOW_DEFAULTS` → stored as `sunGlowTop` / `sunScrollTop` / `sunOpacityTop` in the panel |

**Controls:** `sunGlow`, `sunScroll`, `sunOpacity` (top only)

---

## Quick reference

| Chat name | Edge | File | Independent? |
|-----------|------|------|--------------|
| **StarlightRibbon** | Bottom | `createStarlightRibbon.ts` | Yes |
| **SunGlow** | Top | `createSunGlow.ts` | Yes |

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
