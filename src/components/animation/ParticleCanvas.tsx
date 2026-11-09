"use client";

import { Canvas } from "@react-three/fiber";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getDeviceProfile, type DeviceProfile } from "@/lib/device";
import CanvasErrorBoundary from "./CanvasErrorBoundary";
import ParticleField from "./ParticleField";

function StaticFallback() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute left-1/2 top-1/2 h-[72vh] w-[42vw] min-w-[260px] -translate-x-1/2 -translate-y-1/2 opacity-45 blur-[0.4px] md:left-[58%]">
        <Image
          src="/images/portrait-cutout.png"
          alt=""
          fill
          priority
          sizes="(max-width: 768px) 70vw, 42vw"
          className="object-contain"
        />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_58%_45%,rgba(138,180,248,0.08),transparent_38%)]" />
    </div>
  );
}

export default function ParticleCanvas({ onReady }: { onReady: () => void }) {
  const [device, setDevice] = useState<DeviceProfile | null>(null);

  useEffect(() => {
    setDevice(getDeviceProfile());
  }, []);

  useEffect(() => {
    if (device && !device.webgl) onReady();
  }, [device, onReady]);

  if (!device) return null;

  if (!device.webgl) {
    return <StaticFallback />;
  }

  return (
    <CanvasErrorBoundary fallback={<StaticFallback />} onError={onReady}>
      <div
        className="pointer-events-none fixed inset-0 z-0"
        aria-hidden="true"
      >
        <Canvas
          dpr={device.dpr}
          camera={{ position: [0, 0, 6], fov: 45, near: 0.1, far: 100 }}
          gl={{
            alpha: true,
            antialias: false,
            powerPreference: "high-performance",
            stencil: false,
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
          style={{ background: "transparent" }}
        >
          <ParticleField device={device} onReady={onReady} />
        </Canvas>
      </div>
    </CanvasErrorBoundary>
  );
}
