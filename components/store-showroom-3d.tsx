"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Text, ContactShadows, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { naira } from "@/lib/format";
import type { Product, Variant } from "@/lib/types";

// Realistic 3D Phone Mesh with titanium frame and glowing OLED screen
export function Phone3D({
  color = "#1f2022",
  accent = "#1a73e8",
  hovered = false,
  onClick,
}: {
  color?: string;
  accent?: string;
  hovered?: boolean;
  onClick?: () => void;
}) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      if (hovered) {
        meshRef.current.rotation.y += delta * 1.5;
        meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, 0.25, 0.1);
      } else {
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0.2, 0.05);
        meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, 0, 0.1);
      }
    }
  });

  return (
    <group ref={meshRef} onClick={onClick}>
      {/* Outer Titanium Chassis */}
      <RoundedBox args={[0.9, 1.85, 0.09]} radius={0.06} smoothness={4}>
        <meshStandardMaterial
          color={color}
          roughness={0.25}
          metalness={0.85}
          envMapIntensity={1.2}
        />
      </RoundedBox>

      {/* Screen Glass Face */}
      <RoundedBox args={[0.82, 1.76, 0.01]} radius={0.04} smoothness={4} position={[0, 0, 0.048]}>
        <meshStandardMaterial
          color="#0a0c10"
          emissive={accent}
          emissiveIntensity={hovered ? 0.35 : 0.12}
          roughness={0.1}
          metalness={0.9}
        />
      </RoundedBox>

      {/* Camera Bump */}
      <group position={[-0.22, 0.58, -0.052]}>
        <RoundedBox args={[0.36, 0.38, 0.04]} radius={0.04} smoothness={4}>
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.9} />
        </RoundedBox>
        {/* Lenses */}
        <mesh position={[-0.08, 0.08, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.02, 16]} />
          <meshStandardMaterial color="#050608" roughness={0.05} metalness={0.95} />
        </mesh>
        <mesh position={[0.08, 0.08, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.02, 16]} />
          <meshStandardMaterial color="#050608" roughness={0.05} metalness={0.95} />
        </mesh>
        <mesh position={[-0.08, -0.08, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.02, 16]} />
          <meshStandardMaterial color="#050608" roughness={0.05} metalness={0.95} />
        </mesh>
      </group>
    </group>
  );
}

// Interactive Wooden Display Stand with Acrylic holder
export function TableStand({
  position,
  label,
  price,
  phoneColor,
  accent,
  active,
  onSelect,
}: {
  position: [number, number, number];
  label: string;
  price: number;
  phoneColor: string;
  accent: string;
  active: boolean;
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position}>
      {/* Acrylic angled stand base */}
      <mesh
        position={[0, 0.1, 0]}
        rotation={[-0.22, 0, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onSelect}
      >
        <boxGeometry args={[0.7, 0.12, 0.5]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.85}
          opacity={1}
          transparent
          roughness={0.15}
          ior={1.5}
        />
      </mesh>

      {/* Floating 3D Phone */}
      <group position={[0, 1.05, 0]} rotation={[0.1, 0, 0]}>
        <Phone3D
          color={phoneColor}
          accent={accent}
          hovered={hovered || active}
          onClick={onSelect}
        />
      </group>

      {/* Price & Name 3D Tag */}
      <Text
        position={[0, 0.35, 0.45]}
        rotation={[-0.3, 0, 0]}
        fontSize={0.11}
        color={hovered || active ? "#1a73e8" : "#202124"}
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/plusjakartasans/v8/LDIbaomQNQcsA88c7O9yZ4KMCoOg4Ko20yygg_Pb.woff"
      >
        {label}
      </Text>
      <Text
        position={[0, 0.18, 0.45]}
        rotation={[-0.3, 0, 0]}
        fontSize={0.09}
        color="#137333"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/plusjakartasans/v8/LDIbaomQNQcsA88c7O9yZ4KMCoOg4Ko20yygg_Pb.woff"
      >
        {naira(price)}
      </Text>

      {/* Spotlight Ring when active */}
      {(hovered || active) && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.65, 0.72, 32]} />
          <meshBasicMaterial color="#1a73e8" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

// Complete 3D Architectural Showroom matching the user's reference image
export function ShowroomScene({
  featured,
  selectedIndex,
  onSelectProduct,
}: {
  featured: { product: Product; variant: Variant }[];
  selectedIndex: number;
  onSelectProduct: (index: number) => void;
}) {
  return (
    <>
      {/* Lighting: Overhead modern LED strips & accent spotlights */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[0, 10, 5]} intensity={1.4} castShadow shadow-mapSize={2048} />
      <pointLight position={[0, 4, 0]} intensity={1.5} color="#ffffff" distance={10} />
      <pointLight position={[-4, 3, -2]} intensity={0.8} color="#e8f0fe" distance={8} />
      <pointLight position={[4, 3, -2]} intensity={0.8} color="#e8f0fe" distance={8} />

      {/* Matte Black Back Wall with Illuminated 3D "Fzmobile" Logo */}
      <mesh position={[0, 3, -4.5]}>
        <planeGeometry args={[16, 8]} />
        <meshStandardMaterial color="#0f1115" roughness={0.8} />
      </mesh>

      {/* 3D Backlit Fzmobile Lettering */}
      <Float speed={1.2} rotationIntensity={0} floatIntensity={0.15}>
        <Text
          position={[0, 4.4, -4.38]}
          fontSize={0.7}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.04}
          font="https://fonts.gstatic.com/s/plusjakartasans/v8/LDIbaomQNQcsA88c7O9yZ4KMCoOg4Ko20yygg_Pb.woff"
        >
          Fzmobile
        </Text>
      </Float>

      {/* Modern Light Bar on Ceiling */}
      <mesh position={[0, 6.8, -1]}>
        <boxGeometry args={[10, 0.1, 0.15]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={3} />
      </mesh>

      {/* Polished Showroom Floor */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#d4d7dc" roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Central Oak/Ash Wooden Display Table */}
      <group position={[0, 0, 0]}>
        {/* Table top */}
        <mesh position={[0, 0.95, 0]}>
          <boxGeometry args={[7.2, 0.18, 2.2]} />
          <meshStandardMaterial color="#8e8982" roughness={0.5} metalness={0.1} />
        </mesh>

        {/* 4 Sturdy Square Wooden Legs */}
        <mesh position={[-3.3, 0.47, -0.9]}>
          <boxGeometry args={[0.28, 0.95, 0.28]} />
          <meshStandardMaterial color="#7a756f" roughness={0.5} />
        </mesh>
        <mesh position={[3.3, 0.47, -0.9]}>
          <boxGeometry args={[0.28, 0.95, 0.28]} />
          <meshStandardMaterial color="#7a756f" roughness={0.5} />
        </mesh>
        <mesh position={[-3.3, 0.47, 0.9]}>
          <boxGeometry args={[0.28, 0.95, 0.28]} />
          <meshStandardMaterial color="#7a756f" roughness={0.5} />
        </mesh>
        <mesh position={[3.3, 0.47, 0.9]}>
          <boxGeometry args={[0.28, 0.95, 0.28]} />
          <meshStandardMaterial color="#7a756f" roughness={0.5} />
        </mesh>

        {/* Display Phone Stands Array on the Table */}
        {featured.slice(0, 5).map((item, idx) => {
          const xPos = -2.4 + idx * 1.2;
          return (
            <TableStand
              key={item.variant.id}
              position={[xPos, 1.05, 0]}
              label={item.product.name.replace("Google ", "")}
              price={item.variant.price}
              phoneColor={item.variant.colorHex}
              accent={idx % 2 === 0 ? "#1a73e8" : "#c2e7ff"}
              active={selectedIndex === idx}
              onSelect={() => onSelectProduct(idx)}
            />
          );
        })}
      </group>

      {/* Realistic Soft Contact Shadows */}
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.65}
        scale={14}
        blur={1.8}
        far={6}
        resolution={512}
        color="#000000"
      />

      {/* Orbit & Drag Controls */}
      <OrbitControls
        enableZoom={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.1}
        minAzimuthAngle={-Math.PI / 4}
        maxAzimuthAngle={Math.PI / 4}
        dampingFactor={0.05}
      />
    </>
  );
}

// Main 3D Showroom Component exported to Homepage
export function StoreShowroom3D({
  featured,
  selectedIndex,
  onSelectProduct,
}: {
  featured: { product: Product; variant: Variant }[];
  selectedIndex: number;
  onSelectProduct: (index: number) => void;
}) {
  return (
    <div className="relative h-[480px] w-full overflow-hidden rounded-3xl border border-[#dadce0] bg-[#0f1115] shadow-xl md:h-[540px]">
      <Canvas
        shadows
        camera={{ position: [0, 2.8, 4.8], fov: 42 }}
        className="h-full w-full"
      >
        <ShowroomScene
          featured={featured}
          selectedIndex={selectedIndex}
          onSelectProduct={onSelectProduct}
        />
      </Canvas>

      {/* 3D Experience Floating Overlay Badge */}
      <div className="pointer-events-none absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-3.5 py-1.5 backdrop-blur-md">
        <span className="size-2 animate-pulse rounded-full bg-[#1a73e8]" />
        <span className="text-xs font-medium text-white/90">Interactive 3D Showroom</span>
      </div>

      <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-xs text-white/70">
        <span>Drag to rotate · Click device to inspect</span>
        <span className="hidden sm:inline">Lagos Flagship Store</span>
      </div>
    </div>
  );
}
