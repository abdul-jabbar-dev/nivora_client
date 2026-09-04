"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Lightformer, Environment } from "@react-three/drei";
import * as THREE from "three";

function AbstractProduct() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Float
      speed={2} 
      rotationIntensity={0.5} 
      floatIntensity={1} 
      floatingRange={[-0.1, 0.1]} 
    >
      <mesh ref={meshRef} castShadow receiveShadow>
        <torusKnotGeometry args={[1, 0.3, 128, 32]} />
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={0.1}
          roughness={0.2}
          transmission={0.9}
          thickness={0.5}
          ior={1.5}
          envMapIntensity={1}
          clearcoat={1}
        />
      </mesh>
    </Float>
  );
}

export default function HeroScene() {
  return (
    <div className="w-full h-[400px] lg:h-[600px] relative pointer-events-none sm:pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={1024}
        />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} />
        
        <AbstractProduct />

        <Environment preset="city">
          <Lightformer
            form="rect"
            intensity={1}
            position={[2, 5, 2]}
            scale={[10, 10, 1]}
            target={[0, 0, 0]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}
