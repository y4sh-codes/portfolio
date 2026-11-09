"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { experienceState } from "@/lib/animations/experienceState";
import type { DeviceProfile } from "@/lib/device";
import { generateBuildingParticles } from "@/lib/particles/buildingSampler";
import { sampleImageToParticles } from "@/lib/particles/imageSampler";
import { sampleSVGToParticles } from "@/lib/particles/svgSampler";
import {
  createColors,
  createRandoms,
  scatterFormation,
  type FormationSet,
} from "@/lib/particles/particleUtils";
import { mulberry32 } from "@/lib/particles/rng";

type ParticleFieldProps = {
  device: DeviceProfile;
  onReady: () => void;
};

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uStage;
  uniform float uTurbulence;
  uniform float uOpacity;
  uniform float uPixelRatio;
  uniform float uPortraitScale;
  uniform float uIndiaScale;

  attribute vec3 aScatter;
  attribute vec3 aPortrait;
  attribute vec3 aBuilding;
  attribute vec3 aIndia;
  attribute vec3 aColor;
  attribute vec3 aRandom;
  attribute float aBrightness;

  varying vec3 vColor;
  varying float vAlpha;

  float easeInOut(float t) {
    return t * t * (3.0 - 2.0 * t);
  }

  void main() {
    float stage = clamp(uStage, 0.0, 4.0);
    vec3 portrait = aPortrait * uPortraitScale;
    vec3 india = aIndia * uIndiaScale;
    vec3 p;

    if (stage <= 1.0) {
      p = mix(aScatter, portrait, easeInOut(stage));
    } else if (stage <= 2.0) {
      p = mix(portrait, aBuilding, easeInOut(stage - 1.0));
    } else if (stage <= 3.0) {
      p = mix(aBuilding, india, easeInOut(stage - 2.0));
    } else {
      p = mix(india, aScatter, easeInOut(stage - 3.0));
    }

    float time = uTime * (0.22 + aRandom.x * 0.35);
    float amp = uTurbulence * (0.012 + aRandom.y * 0.02);
    p.x += sin(time + aRandom.y * 6.2831) * amp;
    p.y += cos(time * 1.13 + aRandom.z * 6.2831) * amp;
    p.z += sin(time * 0.77 + aRandom.x * 6.2831) * amp * 1.8;

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float size = mix(0.7, 2.1, aRandom.z);
    gl_PointSize = clamp(size * uPixelRatio * (9.0 / -mvPosition.z), 1.0, 3.4);

    vColor = aColor;
    // Portrait points inherit their source luminance so facial shading is
    // visible. Other formations stay at full brightness.
    float portraitMask = 1.0 - smoothstep(0.35, 0.65, abs(stage - 1.0));
    float luminance = mix(
      1.0,
      0.3 + 0.7 * sqrt(clamp(aBrightness, 0.0, 1.0)),
      portraitMask
    );
    vAlpha = uOpacity * (0.32 + aRandom.x * 0.68) * luminance;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 point = gl_PointCoord - vec2(0.5);
    float distanceToCenter = length(point);
    float core = smoothstep(0.5, 0.04, distanceToCenter);
    float glow = smoothstep(0.5, 0.0, distanceToCenter) * 0.45;
    float alpha = (core + glow) * vAlpha;

    if (alpha < 0.01) discard;

    gl_FragColor = vec4(vColor, alpha);
    #include <colorspace_fragment>
  }
`;

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Unable to load ${src}`));
    image.src = src;
  });
}

export default function ParticleField({ device, onReady }: ParticleFieldProps) {
  const [formations, setFormations] = useState<FormationSet | null>(null);
  const { viewport } = useThree();
  const group = useRef<THREE.Group>(null);
  const readyCalled = useRef(false);
  const current = useRef({
    stage: 0,
    opacity: 0,
    turbulence: 1.2,
    groupX: 0,
    groupY: 0,
    groupScale: 1,
    rotationX: 0,
    rotationY: 0,
  });
  const time = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const count = device.particleCount;
    const random = mulberry32(20261109);

    async function build() {
      try {
        const [portraitImage, indiaImage] = await Promise.all([
          loadImage("/images/portrait-cutout.png"),
          loadImage("/images/india-map.svg"),
        ]);

        if (cancelled) return;

        const portraitSample = sampleImageToParticles(portraitImage, {
          count,
          seed: 23,
        });
        const building = generateBuildingParticles(count, 137);
        const india = sampleSVGToParticles(indiaImage, {
          count,
          seed: 71,
        });
        const scatter = scatterFormation(count, random);
        const colors = createColors(count, random);
        const randoms = createRandoms(count, random);

        if (cancelled) return;

        setFormations({
          count,
          portrait: portraitSample.positions,
          building,
          india,
          scatter,
          colors,
          randoms,
          brightness: portraitSample.brightness,
        });
      } catch (error) {
        console.warn("Particle formations could not be loaded.", error);
        if (cancelled) return;
        const scatter = scatterFormation(count, random);
        const brightness = new Float32Array(count).fill(1);
        setFormations({
          count,
          portrait: scatter,
          building: scatter,
          india: scatter,
          scatter,
          colors: createColors(count, random),
          randoms: createRandoms(count, random),
          brightness,
        });
      } finally {
        if (!cancelled && !readyCalled.current) {
          readyCalled.current = true;
          onReady();
        }
      }
    }

    build();

    return () => {
      cancelled = true;
    };
  }, [device.particleCount, onReady]);

  const geometry = useMemo(() => {
    if (!formations) return null;
    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute(
      "position",
      new THREE.BufferAttribute(formations.scatter, 3),
    );
    buffer.setAttribute(
      "aScatter",
      new THREE.BufferAttribute(formations.scatter, 3),
    );
    buffer.setAttribute(
      "aPortrait",
      new THREE.BufferAttribute(formations.portrait, 3),
    );
    buffer.setAttribute(
      "aBuilding",
      new THREE.BufferAttribute(formations.building, 3),
    );
    buffer.setAttribute(
      "aIndia",
      new THREE.BufferAttribute(formations.india, 3),
    );
    buffer.setAttribute(
      "aColor",
      new THREE.BufferAttribute(formations.colors, 3),
    );
    buffer.setAttribute(
      "aRandom",
      new THREE.BufferAttribute(formations.randoms, 3),
    );
    buffer.setAttribute(
      "aBrightness",
      new THREE.BufferAttribute(formations.brightness, 1),
    );
    buffer.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 30);
    return buffer;
  }, [formations]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uStage: { value: 0 },
          uTurbulence: { value: 1.2 },
          uOpacity: { value: 0 },
          uPixelRatio: { value: device.dpr[1] },
          uPortraitScale: {
            value: device.isMobile ? 1.42 : device.isTablet ? 1.1 : 1,
          },
          uIndiaScale: {
            value: device.isMobile ? 1.35 : device.isTablet ? 1.08 : 1,
          },
        },
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.NormalBlending,
        toneMapped: false,
      }),
    [device.dpr, device.isMobile, device.isTablet],
  );

  useEffect(() => {
    return () => {
      geometry?.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      if (device.reducedMotion) return;
      experienceState.pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      experienceState.pointerY = (event.clientY / window.innerHeight) * 2 - 1;
    };
    const onPointerLeave = () => {
      experienceState.pointerX = 0;
      experienceState.pointerY = 0;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [device.reducedMotion]);

  useFrame((state, delta) => {
    if (!group.current) return;

    const target = experienceState;
    const stageDamp = 1 - Math.exp(-delta * 2.3);
    const damp = 1 - Math.exp(-delta * 3.4);
    const motion = device.reducedMotion ? 0 : 1;

    current.current.stage +=
      (target.stage - current.current.stage) * stageDamp;
    current.current.opacity +=
      (target.opacity - current.current.opacity) * damp;
    current.current.turbulence +=
      (target.turbulence - current.current.turbulence) * damp;
    current.current.groupX +=
      (target.groupX - current.current.groupX) * damp;
    current.current.groupY +=
      (target.groupY - current.current.groupY) * damp;
    current.current.groupScale +=
      (target.groupScale - current.current.groupScale) * damp;

    if (!device.reducedMotion) time.current += delta;

    const baseScale = Math.min(1, viewport.width / 4.7);
    group.current.position.x = current.current.groupX * viewport.width;
    group.current.position.y = -current.current.groupY * viewport.height;
    group.current.scale.setScalar(baseScale * current.current.groupScale);

    const targetRotationY =
      target.pointerX * 0.12 * motion +
      Math.sin(time.current * 0.12) * 0.018 * motion;
    const targetRotationX = -target.pointerY * 0.055 * motion;

    current.current.rotationY +=
      (targetRotationY - current.current.rotationY) * damp;
    current.current.rotationX +=
      (targetRotationX - current.current.rotationX) * damp;

    group.current.rotation.y = current.current.rotationY;
    group.current.rotation.x = current.current.rotationX;

    material.uniforms.uTime.value = time.current;
    material.uniforms.uStage.value = current.current.stage;
    material.uniforms.uTurbulence.value = current.current.turbulence;
    material.uniforms.uOpacity.value = current.current.opacity;
    material.uniforms.uPixelRatio.value = Math.min(
      state.gl.getPixelRatio(),
      2,
    );
  });

  if (!geometry || !material) return null;

  return (
    <group ref={group}>
      <points geometry={geometry} material={material} frustumCulled={false} />
    </group>
  );
}
