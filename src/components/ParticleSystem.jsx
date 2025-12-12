import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import useStore from "../store/useStore";

function ParticleSystem() {
  const meshRef = useRef();
  const glowRef = useRef();
  const currentSection = useStore((state) => state.currentSection);
  
  // 🎯 RESPONSIVE PARTICLE COUNT
  const particleCount = useMemo(() => {
    const width = window.innerWidth;
    if (width < 768) return 200;
    if (width < 1024) return 500;
    return 1200;
  }, []);

  const { positions, dummy } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const dummy = new THREE.Object3D();

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 25;
    }

    return { positions, dummy };
  }, [particleCount]);

  useEffect(() => {
    if (!meshRef.current) return;
    
    for (let i = 0; i < particleCount; i++) {
      dummy.position.set(
        positions[i * 3],
        positions[i * 3 + 1],
        positions[i * 3 + 2]
      );
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [particleCount, positions, dummy]);

  const colors = {
    home: "#4da3ff",
    about: "#ff6b6b",
    projects: "#f7b733",
    contact: "#c77dff",
  };

  const targetColor = useMemo(
    () => new THREE.Color(colors[currentSection] || "#4da3ff"),
    [currentSection]
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.05;
      meshRef.current.rotation.x = t * 0.02;
    }

    if (glowRef.current) {
      glowRef.current.material.opacity = 0.3 + Math.sin(t * 2) * 0.15;
    }

    if (meshRef.current?.material) {
      meshRef.current.material.color.lerp(targetColor, 0.05);
    }
  });

  return (
    <group>
      <mesh ref={glowRef}>
        <sphereGeometry args={[10, 32, 32]} />
        <meshBasicMaterial
          color={targetColor}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <instancedMesh ref={meshRef} args={[null, null, particleCount]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial
          transparent
          opacity={0.75}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </instancedMesh>
    </group>
  );
}

export default ParticleSystem;