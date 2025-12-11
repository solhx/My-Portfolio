import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useStore from '../store/useStore'

function InteractiveSphere() {
  const meshRef = useRef()
  const materialRef = useRef()
  const currentSection = useStore((state) => state.currentSection)

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return

    const time = state.clock.elapsedTime

    // Auto-rotation
    meshRef.current.rotation.y = time * 0.5
    meshRef.current.rotation.x = time * 0.3

    // Pulsing
    const pulse = 1 + Math.sin(time * 2) * 0.1
    meshRef.current.scale.set(pulse, pulse, pulse)

    // Color change
    const colors = {
      home: '#3498db',
      about: '#e74c3c',
      projects: '#f39c12',
      contact: '#9b59b6'
    }
    
    const targetColor = new THREE.Color(colors[currentSection] || '#3498db')
    materialRef.current.color.lerp(targetColor, 0.05)
    materialRef.current.emissive.lerp(targetColor, 0.05)
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        ref={materialRef}
        color="#3498db"
        emissive="#3498db"
        emissiveIntensity={0.5}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  )
}

export default InteractiveSphere