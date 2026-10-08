/**
 * ARCHIVED — ProjectDistortion (not mounted)
 *
 * Good idea, wrong fit for now. DOM-synced project image planes on one overlay
 * canvas; scroll velocity (lerped) drives −Z sine bend only while scrolling.
 *
 * Revive: move back under `src/components/projects/`, wire canvas in `Projects.tsx`,
 * add `PROJECT_DISTORTION_DEFAULTS.bend` in `threeJSControls.ts`.
 *
 * Saved: Oct 2026
 */

import * as THREE from 'three';

/** Z bend strength while scrolling (0 = flat). Higher = deeper −Z wave. */
const BEND_DEFAULT = 130;

const LerpEase = 0.07;
const CameraZ = 1000;
const PlaneSegments = 31;

const vertexShader = `
  uniform float uScrollLerpAbs;
  uniform float uBend;
  uniform vec2 uResolution;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;

    vec4 modPos = modelMatrix * vec4(position, 1.0);
    vec2 bumpUv = (modPos.xy - (-uResolution * 0.5)) / uResolution;

    float PI = 3.1415926535897;
    // −Z bend only while scrolling (flat at rest)
    pos.z -= sin(PI * bumpUv.y) * uBend * uScrollLerpAbs * 0.0013;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  varying vec2 vUv;

  void main() {
    gl_FragColor = texture2D(uTexture, vUv);
  }
`;

export type ProjectDistortion = {
  dispose: () => void;
};

type Options = {
  canvas: HTMLCanvasElement;
  /** Element that actually scrolls (Projects shell) */
  scrollRoot: HTMLElement;
  /** Hidden <img> nodes to sync planes to */
  images: HTMLImageElement[];
};

export function createProjectDistortion(
  options: Options,
): ProjectDistortion {
  const { canvas, scrollRoot, images } = options;

  let windowW = window.innerWidth;
  let windowH = window.innerHeight;
  let scrollTarget = scrollRoot.scrollTop;
  let scrollCurrent = scrollTarget;

  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'low-power',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(windowW, windowH);
  renderer.setClearColor(0x000000, 0);
  // ShaderMaterial samples PNG bytes as-is (no auto sRGB decode).
  // LinearSRGBColorSpace = no output encode either → pixels match the file
  // (same idea as the old demo; NoColorSpace crashes Three r169 on render).
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

  const fov =
    (180 * (2 * Math.atan(windowH / 2 / CameraZ))) / Math.PI;
  const camera = new THREE.PerspectiveCamera(
    fov,
    windowW / windowH,
    0.1,
    3100,
  );
  camera.position.set(0, 0, CameraZ);

  const loader = new THREE.TextureLoader();
  const meshes: THREE.Mesh[] = [];
  const materials: THREE.ShaderMaterial[] = [];
  const textures: THREE.Texture[] = [];

  images.forEach((img) => {
    img.style.visibility = 'hidden';

    const texture = loader.load(img.currentSrc || img.src);
    texture.colorSpace = THREE.LinearSRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    textures.push(texture);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: texture },
        uScrollLerpAbs: { value: 0 },
        uBend: { value: BEND_DEFAULT },
        uResolution: { value: new THREE.Vector2(windowW, windowH) },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
    });
    materials.push(material);

    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1, PlaneSegments, PlaneSegments),
      material,
    );
    mesh.frustumCulled = false;
    scene.add(mesh);
    meshes.push(mesh);
  });

  function syncMeshes() {
    const scrollDelta = scrollCurrent - scrollTarget;

    meshes.forEach((mesh, i) => {
      const img = images[i];
      if (!img) return;

      const rect = img.getBoundingClientRect();
      const offsetLeft = rect.left - windowW / 2 + rect.width / 2;
      const offsetTop = -rect.top + windowH / 2 - rect.height / 2;

      mesh.position.x = offsetLeft;
      mesh.position.y = offsetTop;
      mesh.scale.set(rect.width, rect.height, 1);

      const mat = materials[i];
      mat.uniforms.uScrollLerpAbs.value = Math.abs(scrollDelta);
      mat.uniforms.uBend.value = BEND_DEFAULT;
      mat.uniforms.uResolution.value.set(windowW, windowH);
    });
  }

  let raf = 0;

  function loop() {
    scrollTarget = scrollRoot.scrollTop;
    scrollCurrent =
      scrollCurrent * (1 - LerpEase) + scrollTarget * LerpEase;

    syncMeshes();
    renderer.render(scene, camera);
    raf = requestAnimationFrame(loop);
  }
  loop();

  function onResize() {
    windowW = window.innerWidth;
    windowH = window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(windowW, windowH);
    camera.fov = (180 * (2 * Math.atan(windowH / 2 / CameraZ))) / Math.PI;
    camera.aspect = windowW / windowH;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', onResize);

  return {
    dispose() {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      meshes.forEach((mesh) => {
        scene.remove(mesh);
        mesh.geometry.dispose();
      });
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      renderer.dispose();
    },
  };
}
