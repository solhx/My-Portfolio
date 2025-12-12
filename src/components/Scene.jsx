import { useEffect, useRef, useMemo } from 'react'
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

// 🎯 DEVICE DETECTION
const getDeviceQuality = () => {
  const width = window.innerWidth;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile || width < 768) {
    return {
      quality: 'low',
      bloomIntensity: 0.15,
      starsCount: 200,
      enableStars: false,
    };
  } else if (width < 1024) {
    return {
      quality: 'medium',
      bloomIntensity: 0.2,
      starsCount: 300,
      enableStars: true,
    };
  }
  return {
    quality: 'high',
    bloomIntensity: 0.3,
    starsCount: 500,
    enableStars: true,
  };
};

function Scene() {
  const { scene } = useThree()
  const cameraRef = useRef()
  const currentSection = useStore((state) => state.currentSection)

  const pointLightRef = useRef()
  const ambientLightRef = useRef()

  const deviceQuality = useMemo(() => getDeviceQuality(), []);

  useEffect(() => {
    scene.background = new THREE.Color('#0a0e27')
    scene.fog = new THREE.Fog('#0a0e27', 8, 20)
  }, [scene])

  useFrame((state) => {
    if (!cameraRef.current) return

    const scrollY = window.scrollY
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    const scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0

    const sections = ['home', 'about', 'projects', 'contact']
    const sectionIndex = scrollProgress * (sections.length - 1)
    const idx1 = Math.floor(sectionIndex)
    const idx2 = Math.min(idx1 + 1, sections.length - 1)
    const blend = sectionIndex - idx1

    const config1 = CAMERA_CONFIGS[sections[idx1]]
    const config2 = CAMERA_CONFIGS[sections[idx2]]
    const color1 = SECTION_COLORS[sections[idx1]]
    const color2 = SECTION_COLORS[sections[idx2]]

    const targetX = THREE.MathUtils.lerp(config1.position[0], config2.position[0], blend)
    const targetY = THREE.MathUtils.lerp(config1.position[1], config2.position[1], blend)
    const targetZ = THREE.MathUtils.lerp(config1.position[2], config2.position[2], blend)
    const targetFov = THREE.MathUtils.lerp(config1.fov, config2.fov, blend)

    const lerpSpeed = deviceQuality.quality === 'low' ? 0.08 : 0.05;

    cameraRef.current.position.x += (targetX - cameraRef.current.position.x) * lerpSpeed
    cameraRef.current.position.y += (targetY - cameraRef.current.position.y) * lerpSpeed
    cameraRef.current.position.z += (targetZ - cameraRef.current.position.z) * (lerpSpeed * 0.6)

    cameraRef.current.fov += (targetFov - cameraRef.current.fov) * lerpSpeed
    cameraRef.current.updateProjectionMatrix()

    const bgColor1 = new THREE.Color(color1.background)
    const bgColor2 = new THREE.Color(color2.background)
    const targetBgColor = new THREE.Color().lerpColors(bgColor1, bgColor2, blend)
    scene.background.lerp(targetBgColor, 0.03)
    scene.fog.color.copy(scene.background)

    if (pointLightRef.current) {
      const lightColor1 = new THREE.Color(color1.primary)
      const lightColor2 = new THREE.Color(color2.primary)
      const targetLightColor = new THREE.Color().lerpColors(lightColor1, lightColor2, blend)
      pointLightRef.current.color.lerp(targetLightColor, 0.03)
    }

    if (ambientLightRef.current) {
      const intensity1 = sections[idx1] === 'home' ? 0.5 : 0.8
      const intensity2 = sections[idx2] === 'home' ? 0.5 : 0.8
      const targetIntensity = THREE.MathUtils.lerp(intensity1, intensity2, blend)
      ambientLightRef.current.intensity += (targetIntensity - ambientLightRef.current.intensity) * 0.03
    }

    if (deviceQuality.quality !== 'low') {
      const time = state.clock.elapsedTime
      const floatX = Math.sin(time * 0.2) * 0.01
      const floatY = Math.cos(time * 0.3) * 0.01
      const mouseX = state.mouse.x * 0.2 + floatX
      const mouseY = state.mouse.y * 0.2 + floatY
      cameraRef.current.lookAt(mouseX, mouseY, 0)
    } else {
      cameraRef.current.lookAt(0, 0, 0)
    }
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

      {currentSection === 'home' && deviceQuality.enableStars && (
        <Stars 
          radius={100} 
          depth={50} 
          count={deviceQuality.starsCount} 
          factor={4} 
          saturation={0} 
          fade 
          speed={1} 
        />
      )}

      <Environment preset="night" />

      <EffectComposer>
        <Bloom
          intensity={deviceQuality.bloomIntensity}
          luminanceThreshold={0.9}
          luminanceSmoothing={0.9}
          blendFunction={BlendFunction.ADD}
        />
      </EffectComposer>
    </>
  )
}

export default Scene