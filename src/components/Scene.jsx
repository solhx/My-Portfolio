import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { Environment, PerspectiveCamera, Stars } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import useStore from '../store/useStore'
import InteractiveSphere from './InteractiveSphere'
import ParticleSystem from './ParticleSystem'

const CAMERA_CONFIGS = {
  home: { position: [0, 0, 7], fov: 50 },
about: { position: [0, 0, 5], fov: 55 },
projects: { position: [0, 0, 3.5], fov: 60 },
contact: { position: [0, 0, 2], fov: 65 },

}

const SECTION_COLORS = {
  home: { primary: '#3498db', background: '#0a0e27' },
  about: { primary: '#e74c3c', background: '#1a1a2e' },
  projects: { primary: '#f39c12', background: '#16213e' },
  contact: { primary: '#9b59b6', background: '#0f3460' },
}

function Scene() {
  const { scene } = useThree()
  const cameraRef = useRef()
  const currentSection = useStore((state) => state.currentSection)

  const pointLightRef = useRef()
  const ambientLightRef = useRef()

  useEffect(() => {
    scene.background = new THREE.Color('#0a0e27')
    scene.fog = new THREE.Fog('#0a0e27', 8, 20)
   
  }, [scene])

  // THIS IS THE KEY FIX - Read scroll DIRECTLY every frame
  useFrame((state) => {
    if (!cameraRef.current) return
    

    // 🔥 READ SCROLL DIRECTLY - NO EVENT LISTENERS
    const scrollY = window.scrollY
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    const scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0

    // Calculate section index
    const sections = ['home', 'about', 'projects', 'contact']
    const sectionIndex = scrollProgress * (sections.length - 1)
    const idx1 = Math.floor(sectionIndex)
    const idx2 = Math.min(idx1 + 1, sections.length - 1)
    const blend = sectionIndex - idx1

    const config1 = CAMERA_CONFIGS[sections[idx1]]
    const config2 = CAMERA_CONFIGS[sections[idx2]]
    const color1 = SECTION_COLORS[sections[idx1]]
    const color2 = SECTION_COLORS[sections[idx2]]

    // Calculate target camera position
    const targetX = THREE.MathUtils.lerp(config1.position[0], config2.position[0], blend)
    const targetY = THREE.MathUtils.lerp(config1.position[1], config2.position[1], blend)
    const targetZ = THREE.MathUtils.lerp(config1.position[2], config2.position[2], blend)
    const targetFov = THREE.MathUtils.lerp(config1.fov, config2.fov, blend)

    // Log every 2 seconds
  

    // SMOOTH LERP to target position
    cameraRef.current.position.x += (targetX - cameraRef.current.position.x) * 0.05
    cameraRef.current.position.y += (targetY - cameraRef.current.position.y) * 0.05
    cameraRef.current.position.z += (targetZ - cameraRef.current.position.z) * 0.03

    // FOV animation
    cameraRef.current.fov += (targetFov - cameraRef.current.fov) * 0.05
    cameraRef.current.updateProjectionMatrix()

    // Background color
    const bgColor1 = new THREE.Color(color1.background)
    const bgColor2 = new THREE.Color(color2.background)
    const targetBgColor = new THREE.Color().lerpColors(bgColor1, bgColor2, blend)
    scene.background.lerp(targetBgColor, 0.03)
    scene.fog.color.copy(scene.background)

    // Light colors
    if (pointLightRef.current) {
      const lightColor1 = new THREE.Color(color1.primary)
      const lightColor2 = new THREE.Color(color2.primary)
      const targetLightColor = new THREE.Color().lerpColors(lightColor1, lightColor2, blend)
      pointLightRef.current.color.lerp(targetLightColor, 0.03)
    }

    // Ambient light intensity
    if (ambientLightRef.current) {
      const intensity1 = sections[idx1] === 'home' ? 0.5 : 0.8
      const intensity2 = sections[idx2] === 'home' ? 0.5 : 0.8
      const targetIntensity = THREE.MathUtils.lerp(intensity1, intensity2, blend)
      ambientLightRef.current.intensity += (targetIntensity - ambientLightRef.current.intensity) * 0.03
    }

    // Mouse parallax
    const time = state.clock.elapsedTime
    const floatX = Math.sin(time * 0.2) * 0.01
    const floatY = Math.cos(time * 0.3) * 0.01
    const mouseX = state.mouse.x * 0.2 + floatX
    const mouseY = state.mouse.y * 0.2 + floatY
    cameraRef.current.lookAt(mouseX, mouseY, 0)
  })

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, 0, 8]}
        fov={50}
      />

      <ambientLight ref={ambientLightRef} intensity={0.5} />
      <pointLight ref={pointLightRef} position={[10, 10, 10]} intensity={1.5} color="#3498db" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#9b59b6" />

      <InteractiveSphere />
      <ParticleSystem />

      {currentSection === 'home' && (
        <Stars radius={100} depth={50} count={500} factor={4} saturation={0} fade speed={1} />
      )}

      <Environment preset="night" />

      <EffectComposer>
        <Bloom
          intensity={0.3}
          luminanceThreshold={0.9}
          luminanceSmoothing={0.9}
          blendFunction={BlendFunction.ADD}
        />
      </EffectComposer>
    </>
  )
}

export default Scene