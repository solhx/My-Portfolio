
import { useEffect, useRef, useState } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { Environment, Stars, Html } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import useStore from '../store/useStore'
import InteractiveSphere from './InteractiveSphere'
import ParticleSystem from './ParticleSystem'

const CAMERA_CONFIGS = [
  { z: 8, fov: 50 },   // home
  { z: 4, fov: 60 },   // about
  { z: 1.5, fov: 70 }, // projects
  { z: 3, fov: 65 },   // contact
]

function FinalCamera() {
  const { scene, camera } = useThree()
  const currentSection = useStore((state) => state.currentSection)
  const [scrollProgress, setScrollProgress] = useState(0)
  const frameCount = useRef(0)
  const cameraRef = useRef()
  
  // Force scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollHeight > 0 ? Math.min(Math.max(scrolled / scrollHeight, 0), 1) : 0
      
      setScrollProgress(progress)
      
      // Force camera update immediately
      if (camera) {
        const sectionProgress = progress * 3 // 3 transitions between 4 sections
        const sectionIndex = Math.floor(sectionProgress)
        const blend = sectionProgress - sectionIndex
        
        const currentConfig = CAMERA_CONFIGS[sectionIndex] || CAMERA_CONFIGS[0]
        const nextConfig = CAMERA_CONFIGS[Math.min(sectionIndex + 1, 3)]
        
        const targetZ = currentConfig.z + (nextConfig.z - currentConfig.z) * blend
        const targetFov = currentConfig.fov + (nextConfig.fov - currentConfig.fov) * blend
        
        // Force immediate position update
        camera.position.z = targetZ
        camera.fov = targetFov
        camera.updateProjectionMatrix()
        
        // Debug log
        if (frameCount.current % 60 === 0) {
          console.log('🎥 FinalCamera - FORCED UPDATE:', {
            targetZ: targetZ.toFixed(2),
            currentZ: camera.position.z.toFixed(2),
            targetFov: targetFov.toFixed(1),
            currentFov: camera.fov.toFixed(1),
            progress: (progress * 100).toFixed(1) + '%',
            sectionIndex,
            blend: blend.toFixed(2)
          })
        }
      }
    }

    // Multiple scroll listeners for reliability
    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('scroll', handleScroll, { passive: true })
    document.body.addEventListener('scroll', handleScroll, { passive: true })
    
    // Initial call
    handleScroll()
    
    // Periodic check
    const interval = setInterval(handleScroll, 100)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('scroll', handleScroll)
      document.body.removeEventListener('scroll', handleScroll)
      clearInterval(interval)
    }
  }, [camera])

  // Camera initialization
  useEffect(() => {
    if (camera) {
      camera.position.set(0, 0, 8)
      camera.fov = 50
      camera.updateProjectionMatrix()
      console.log('🎬 FinalCamera: Camera initialized at Z=8')
    }
  }, [camera])

  useFrame(() => {
    if (!camera) return

    frameCount.current++

    // Additional smoothing in render loop
    const targetZ = CAMERA_CONFIGS[Math.floor(scrollProgress * 3)]?.z || 8
    const lerpSpeed = 0.1
    
    camera.position.z += (targetZ - camera.position.z) * lerpSpeed
    camera.updateProjectionMatrix()
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#3498db" />
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

      {/* Debug display */}
      <mesh position={[0, -5, 0]}>
        <planeGeometry args={[2, 0.5]} />
        <meshBasicMaterial color="red" />
      </mesh>
      <HtmlDebug progress={scrollProgress} />
    </>
  )
}

// Debug component
function HtmlDebug({ progress }) {
  const [debugInfo, setDebugInfo] = useState({ z: 8, fov: 50 })

  useEffect(() => {
    const handleCameraUpdate = (event) => {
      setDebugInfo({
        z: event.detail.z.toFixed(2),
        fov: event.detail.fov.toFixed(1),
        progress: (event.detail.progress * 100).toFixed(1) + '%'
      })
    }

    window.addEventListener('cameraUpdate', handleCameraUpdate)
    return () => window.removeEventListener('cameraUpdate', handleCameraUpdate)
  }, [])

  return (
    <Html>
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 1000
      }}>
        <div>Camera Z: {debugInfo.z}</div>
        <div>FOV: {debugInfo.fov}</div>
        <div>Progress: {debugInfo.progress}</div>
        <div>Scroll Y: {Math.round(window.scrollY)}px</div>
      </div>
    </Html>
  )
}

export default FinalCamera
