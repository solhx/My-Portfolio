import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import useStore from "../store/useStore";

function ParticleSystem() {
  const pointsRef = useRef();
  const glowRef = useRef();
  const currentSection = useStore((state) => state.currentSection);
  const particleCount = 1200;

  // Generate particle positions
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 25;

      speeds[i] = 0.002 + Math.random() * 0.003; // drifting effect
    }

    return { positions, speeds };
  }, []);

  // Smooth color transitions
  const colors = {
    home: "#4da3ff",
    about: "#ff6b6b",
    projects: "#f7b733",
    contact: "#c77dff",
  };

  const targetColor = new THREE.Color(colors[currentSection] || "#4da3ff");

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Rotation movement
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.05;
      pointsRef.current.rotation.x = t * 0.02;
    }

    // Glow pulsing effect
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.3 + Math.sin(t * 2) * 0.15;
    }

    // Color lerp
    if (pointsRef.current?.material) {
      pointsRef.current.material.color.lerp(targetColor, 0.05);
    }
  });

  return (
    <group>
      {/* GLOW SPHERE */}
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

      {/* PARTICLES */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={particles.positions}
            count={particleCount}
            itemSize={3}
          />
        </bufferGeometry>

        <pointsMaterial
          size={0.06}
          transparent
          opacity={0.75}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export default ParticleSystem;
