"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls, Stars, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { CountryFlag } from "@/components/shared/country-flag";

type Destination = {
  name: string;
  code: string;
  latitude: number;
  longitude: number;
  color: string;
  href: string;
};

const destinations: Destination[] = [
  {
    name: "Canada",
    code: "CA",
    latitude: 56,
    longitude: -106,
    color: "#d7192d",
    href: "/destinations/canada",
  },
  {
    name: "United Kingdom",
    code: "GB",
    latitude: 54,
    longitude: -2,
    color: "#3978ff",
    href: "/destinations/uk",
  },
  {
    name: "Australia",
    code: "AU",
    latitude: -25,
    longitude: 134,
    color: "#1687d9",
    href: "/destinations/australia",
  },
  {
    name: "United States",
    code: "US",
    latitude: 39,
    longitude: -98,
    color: "#6955f5",
    href: "/destinations/usa",
  },
];

const earthTextureUrl =
  "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg";

function getCoordinates(latitude: number, longitude: number, radius: number) {
  const phi = THREE.MathUtils.degToRad(90 - latitude);
  const theta = THREE.MathUtils.degToRad(longitude + 180);

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function DestinationMarker({
  destination,
  selected,
  onSelect,
}: {
  destination: Destination;
  selected: boolean;
  onSelect: (destination: Destination) => void;
}) {
  const point = getCoordinates(
    destination.latitude,
    destination.longitude,
    1.015,
  );

  return (
    <group position={point}>
      <mesh
        onClick={(event) => {
          event.stopPropagation();
          onSelect(destination);
        }}
      >
        <sphereGeometry args={[0.035, 20, 20]} />
        <meshBasicMaterial color={destination.color} />
      </mesh>

      <mesh scale={selected ? 2.8 : 2}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshBasicMaterial
          color={destination.color}
          transparent
          opacity={0.18}
        />
      </mesh>

      <Html
        position={point.clone().normalize().multiplyScalar(0.18).toArray()}
        center
        distanceFactor={5.5}
        zIndexRange={[20, 0]}
        style={{ pointerEvents: "auto" }}
      >
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onSelect(destination);
          }}
          className={`earth-destination-label ${
            selected ? "earth-destination-label-active" : ""
          }`}
          aria-label={`Explore study opportunities in ${destination.name}`}
        >
          <span
            className="earth-destination-flag"
            style={{ borderColor: `${destination.color}25` }}
          >
            <CountryFlag iso2={destination.code} name={destination.name} className="h-6 w-8 rounded-sm" />
          </span>
          <span className="earth-destination-copy">
            <span className="earth-destination-name">{destination.name}</span>
            <span className="earth-destination-caption">
              Explore destination
            </span>
          </span>
        </button>
      </Html>
    </group>
  );
}

function EarthModel({
  selected,
  onSelect,
}: {
  selected: Destination | null;
  onSelect: (destination: Destination) => void;
}) {
  const earthRef = useRef<THREE.Group>(null);
  const texture = useTexture(earthTextureUrl);
  const earthTexture = useMemo(() => {
    const nextTexture = texture.clone();
    nextTexture.colorSpace = THREE.SRGBColorSpace;
    nextTexture.anisotropy = 8;
    return nextTexture;
  }, [texture]);

  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.075;
    }
  });

  return (
    <group ref={earthRef}>
      <mesh>
        <sphereGeometry args={[1, 96, 96]} />
        <meshStandardMaterial map={earthTexture} roughness={0.88} metalness={0.02} />
      </mesh>

      <mesh scale={1.018}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial
          color="#5ca9ff"
          transparent
          opacity={0.09}
          side={THREE.BackSide}
        />
      </mesh>

      <mesh scale={1.035}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial
          color="#6eb9ff"
          transparent
          opacity={0.09}
          side={THREE.BackSide}
        />
      </mesh>

      {destinations.map((destination) => (
        <DestinationMarker
          key={destination.code}
          destination={destination}
          selected={selected?.code === destination.code}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}

function LoadingEarth() {
  return (
    <mesh>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="#b9d5f2" roughness={0.8} />
    </mesh>
  );
}

export default function EarthScene({
  onDestinationChange,
}: {
  onDestinationChange?: (destination: Destination) => void;
}) {
  const [selected, setSelected] = useState<Destination | null>(null);

  function selectDestination(destination: Destination) {
    setSelected(destination);
    onDestinationChange?.(destination);
  }

  return (
    <div className="earth-scene-shell">
      <div className="earth-scene-glow" />

      <Canvas
        camera={{ position: [0, 0, 3.35], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.setClearColor("#f6f9fd", 0);
        }}
      >
        <ambientLight intensity={1.5} />

        <directionalLight
          position={[4, 3, 5]}
          intensity={2.2}
          color="#ffffff"
        />

        <pointLight position={[-4, -2, 3]} intensity={1.8} color="#6eaeff" />

        <pointLight position={[2, 1, -4]} intensity={2} color="#d7192d" />

        <Stars
          radius={35}
          depth={20}
          count={450}
          factor={1.5}
          saturation={0}
          fade
          speed={0.25}
        />

        <Suspense fallback={<LoadingEarth />}>
          <EarthModel selected={selected} onSelect={selectDestination} />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate
          rotateSpeed={0.65}
          minPolarAngle={Math.PI * 0.2}
          maxPolarAngle={Math.PI * 0.8}
          enableDamping
          dampingFactor={0.06}
          touches={{
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_ROTATE,
          }}
        />
      </Canvas>

      <div className="earth-scene-hint">
        <span className="earth-scene-hint-dot" />
        Drag the globe or select a destination
      </div>

      {selected && (
        <div className="earth-selection-panel">
          <span className="earth-selection-flag">
            <CountryFlag iso2={selected.code} name={selected.name} className="h-6 w-8 rounded-sm" />
          </span>

          <div className="earth-selection-copy">
            <span className="earth-selection-eyebrow">YOUR DESTINATION</span>
            <span className="earth-selection-name">{selected.name}</span>
          </div>

          <a href={selected.href} className="earth-selection-link">
            Explore
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      )}
    </div>
  );
}
