import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { UserMeasurements } from '../../store/onboardingStore';

interface BodyVisualizationProps {
  measurements: UserMeasurements;
  gender: string;
}

function BodyModel({ measurements, gender }: { measurements: UserMeasurements; gender: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  // Calculate proportions based on measurements
  const heightScale = (measurements.height || 170) / 170;
  const chestScale = (measurements.chest || 90) / 90;
  const waistScale = (measurements.waist || 75) / 75;
  const hipScale = (measurements.hips || 95) / 95;

  const bodyColor = gender === 'Male' ? '#4F46E5' : '#EC4899';

  return (
    <group ref={meshRef}>
      {/* Head */}
      <mesh position={[0, 1.7 * heightScale, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color={bodyColor} opacity={0.8} transparent />
      </mesh>
      
      {/* Torso */}
      <mesh position={[0, 1.2 * heightScale, 0]} scale={[chestScale * 0.8, heightScale * 0.6, 0.4]}>
        <boxGeometry args={[0.4, 0.8, 0.2]} />
        <meshStandardMaterial color={bodyColor} opacity={0.8} transparent />
      </mesh>
      
      {/* Waist */}
      <mesh position={[0, 0.8 * heightScale, 0]} scale={[waistScale * 0.6, heightScale * 0.3, 0.3]}>
        <boxGeometry args={[0.35, 0.3, 0.15]} />
        <meshStandardMaterial color={bodyColor} opacity={0.8} transparent />
      </mesh>
      
      {/* Hips */}
      <mesh position={[0, 0.5 * heightScale, 0]} scale={[hipScale * 0.7, heightScale * 0.3, 0.4]}>
        <boxGeometry args={[0.4, 0.3, 0.2]} />
        <meshStandardMaterial color={bodyColor} opacity={0.8} transparent />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-0.3 * chestScale, 1.3 * heightScale, 0]} scale={[0.3, heightScale * 0.8, 0.3]}>
        <cylinderGeometry args={[0.08, 0.08, 0.6]} />
        <meshStandardMaterial color={bodyColor} opacity={0.8} transparent />
      </mesh>
      <mesh position={[0.3 * chestScale, 1.3 * heightScale, 0]} scale={[0.3, heightScale * 0.8, 0.3]}>
        <cylinderGeometry args={[0.08, 0.08, 0.6]} />
        <meshStandardMaterial color={bodyColor} opacity={0.8} transparent />
      </mesh>
      
      {/* Legs */}
      <mesh position={[-0.15, 0.1 * heightScale, 0]} scale={[0.3, heightScale * 0.8, 0.3]}>
        <cylinderGeometry args={[0.1, 0.08, 0.8]} />
        <meshStandardMaterial color={bodyColor} opacity={0.8} transparent />
      </mesh>
      <mesh position={[0.15, 0.1 * heightScale, 0]} scale={[0.3, heightScale * 0.8, 0.3]}>
        <cylinderGeometry args={[0.1, 0.08, 0.8]} />
        <meshStandardMaterial color={bodyColor} opacity={0.8} transparent />
      </mesh>
    </group>
  );
}

function BodyVisualization({ measurements, gender }: BodyVisualizationProps) {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 1, 3], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <BodyModel measurements={measurements} gender={gender} />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}

export default BodyVisualization;