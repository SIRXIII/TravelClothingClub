import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { AvatarConfig } from '../../types/avatar';

interface Avatar3DProps {
  config: AvatarConfig;
}

function Avatar3D({ config }: Avatar3DProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  // Convert hex color to RGB values for Three.js
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255,
    } : { r: 1, g: 1, b: 1 };
  };

  const skinColor = hexToRgb(config.appearance.skinTone);
  const hairColor = hexToRgb(config.appearance.hair.color);

  return (
    <group ref={meshRef}>
      {/* Head */}
      <mesh position={[0, 1.7, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={[skinColor.r, skinColor.g, skinColor.b]} />
      </mesh>
      
      {/* Hair */}
      <mesh position={[0, 1.85, 0]}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial color={[hairColor.r, hairColor.g, hairColor.b]} />
      </mesh>
      
      {/* Body */}
      <mesh position={[0, 1.0, 0]}>
        <boxGeometry args={[0.6, 1.0, 0.3]} />
        <meshStandardMaterial color={[0.3, 0.5, 0.8]} />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-0.4, 1.2, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.8]} />
        <meshStandardMaterial color={[skinColor.r, skinColor.g, skinColor.b]} />
      </mesh>
      <mesh position={[0.4, 1.2, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.8]} />
        <meshStandardMaterial color={[skinColor.r, skinColor.g, skinColor.b]} />
      </mesh>
      
      {/* Legs */}
      <mesh position={[-0.15, 0.2, 0]}>
        <cylinderGeometry args={[0.1, 0.08, 0.8]} />
        <meshStandardMaterial color={[0.2, 0.3, 0.6]} />
      </mesh>
      <mesh position={[0.15, 0.2, 0]}>
        <cylinderGeometry args={[0.1, 0.08, 0.8]} />
        <meshStandardMaterial color={[0.2, 0.3, 0.6]} />
      </mesh>
    </group>
  );
}

export default Avatar3D;