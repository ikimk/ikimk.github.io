import * as THREE from 'three';
import { filmGrainGlsl, filmGrainUniform } from '@/components/threejs/createFilmGrain';

/**
 * GradientCloud — calm gradient wash (no halftone dots).
 * Field is an expressive winding S + dark ribbon carve. FilmGrain opt-in.
 * Rotation spins continuously via rotation_speed.
 */

const fieldGlsl = `
  // expects uniforms: uResolution, uNoiseSize, uRotation (radians)
  float calmField(vec2 uv, float t) {
    float aspect = uResolution.x / max(uResolution.y, 0.0001);
    vec2 p = vec2(uv.x * aspect, uv.y);
    vec2 center = vec2(0.5 * aspect, 0.5);

    // continuous spin around box center
    float ca = cos(uRotation);
    float sa = sin(uRotation);
    p = center + mat2(ca, sa, -sa, ca) * (p - center);

    // noise_size: larger = bigger features (1 = default)
    float ns = max(uNoiseSize, 0.15);
    p = center + (p - center) / ns;

    p.x += sin(p.y * 2.6 + t * 0.42) * 0.14 * aspect;
    p.y += cos(p.x * 2.1 - t * 0.38) * 0.11;

    float u = p.x / max(aspect, 0.0001);
    float v = p.y;

    float rx = u * 0.86 - v * 0.51;
    float ry = u * 0.51 + v * 0.86;
    float s = rx - 0.22 * sin(ry * 5.1 + t * 0.5) - 0.10 * sin(ry * 2.3 - t * 0.28);
    float ribbon = exp(-s * s * 3.4);

    float s2 = (v * 0.92 - u * 0.42) - 0.24 * sin(u * 4.5 + t * 0.36);
    float carve = exp(-s2 * s2 * 4.8);

    vec2 a = vec2(0.74 * aspect + sin(t * 0.33) * 0.16, 0.78 + cos(t * 0.29) * 0.12);
    vec2 b = vec2(0.18 * aspect + cos(t * 0.31) * 0.14, 0.18 + sin(t * 0.37) * 0.10);
    vec2 c = vec2(0.52 * aspect + sin(t * 0.27) * 0.12, 0.48 + cos(t * 0.34) * 0.14);
    float d1 = exp(-dot(p - a, p - a) * 3.8);
    float d2 = exp(-dot(p - b, p - b) * 4.2);
    float d3 = exp(-dot(p - c, p - c) * 4.6);

    float h = ribbon * 0.78 + d1 * 0.30 + d2 * 0.26 + d3 * 0.20;
    h -= carve * 0.50;
    return clamp(h, 0.0, 1.0);
  }
`;

const colorGlsl = `
  vec3 gradientColor(float h) {
    // ~60% red outer / ~40% yellow core (short orange bridge)
    vec3 col = mix(vec3(0.0), uColor0, smoothstep(0.02, 0.36, h));
    col = mix(col, uColor1, smoothstep(0.30, 0.62, h));
    return mix(col, uColor2, smoothstep(0.60, 0.88, h));
  }
`;

const gradientVertex = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const gradientFragment = `
  uniform float uTime;
  uniform float uSpeed;
  uniform float uOpacity;
  uniform float uNoiseSize;
  uniform float uRotation;
  uniform vec2 uResolution;
  uniform vec3 uColor0;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  varying vec2 vUv;

  ${filmGrainGlsl}
  ${fieldGlsl}
  ${colorGlsl}

  void main() {
    float h = calmField(vUv, uTime * uSpeed);
    vec3 col = gradientColor(h);
    float coverage = smoothstep(0.18, 0.48, h);
    col = applyFilmGrain(col, coverage);
    gl_FragColor = vec4(col, uOpacity * smoothstep(0.02, 0.22, h));
  }
`;

export type GradientCloudParams = {
  speed: number;
  opacity: number;
  colors: [string, string, string];
  grain_intensity: number;
  noise_size: number;
  rotation_speed: number; // degrees per second
};

export type GradientCloudEffect = {
  update: (time: number, params: GradientCloudParams) => void;
  resize: (viewW: number, viewH: number, screenW?: number, screenH?: number) => void;
  dispose: () => void;
};

const TmpColor = new THREE.Color();

function SetColorUniform(target: THREE.Vector3, hex: string) {
  TmpColor.set(hex);
  target.set(TmpColor.r, TmpColor.g, TmpColor.b);
}

function MakeMaterial(
  vertexShader: string,
  fragmentShader: string,
  uniforms: Record<string, THREE.IUniform>,
) {
  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.NormalBlending,
  });
}

export function createGradientCloud(
  scene: THREE.Scene,
  defaults: GradientCloudParams,
): GradientCloudEffect {
  function ColorVec(hex: string) {
    const v = new THREE.Vector3();
    SetColorUniform(v, hex);
    return v;
  }

  const washMaterial = MakeMaterial(gradientVertex, gradientFragment, {
    uTime: { value: 0 },
    uSpeed: { value: defaults.speed },
    uOpacity: { value: defaults.opacity },
    uNoiseSize: { value: defaults.noise_size },
    uRotation: { value: 0 },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uColor0: { value: ColorVec(defaults.colors[0]) },
    uColor1: { value: ColorVec(defaults.colors[1]) },
    uColor2: { value: ColorVec(defaults.colors[2]) },
    ...filmGrainUniform(defaults.grain_intensity),
  });

  const wash = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), washMaterial);
  wash.renderOrder = -2;
  wash.frustumCulled = false;
  scene.add(wash);

  return {
    update(time, params) {
      washMaterial.uniforms.uTime.value = time;
      washMaterial.uniforms.uSpeed.value = params.speed;
      washMaterial.uniforms.uOpacity.value = params.opacity;
      washMaterial.uniforms.uGrainIntensity.value = params.grain_intensity;
      washMaterial.uniforms.uNoiseSize.value = params.noise_size;
      // keep spinning from rotation_speed (°/s)
      washMaterial.uniforms.uRotation.value =
        ((time * params.rotation_speed) * Math.PI) / 180;
      SetColorUniform(washMaterial.uniforms.uColor0.value, params.colors[0]);
      SetColorUniform(washMaterial.uniforms.uColor1.value, params.colors[1]);
      SetColorUniform(washMaterial.uniforms.uColor2.value, params.colors[2]);
    },
    resize(viewW, viewH) {
      wash.scale.set(viewW, viewH, 1);
      wash.position.set(0, 0, 0);
      washMaterial.uniforms.uResolution.value.set(viewW, viewH);
    },
    dispose() {
      scene.remove(wash);
      wash.geometry.dispose();
      washMaterial.dispose();
    },
  };
}
