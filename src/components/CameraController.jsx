
import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const CAMERA_CONFIGS = {
  home: { position: [0, 0, 8], fov: 50 },
  about: { position: [0, 0, 4], fov: 60 },
  projects: { position: [0, 0, 1.5], fov: 70 },
  contact: { position: [0, 0, 3], fov: 65 },
}

function CameraController() {
  const { camera } = useThree()
  const frameCount = useRef(0)
  const currentZ = useRef(8)
  const targetZ = useRef(8)
  const currentFov = useRef(50)
  const targetFov = useRef(50)

  // Get scroll progress
  const getScrollProgress = () => {
    const scrolled = window.scrollY
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
    return scrollHeight > 0 ? Math.min(Math.max(scrolled / scrollHeight, 0), 1) : 0
  }

  // Update target values based on scroll
  const updateCameraTargets = () => {
    const progress = getScrollProgress()
    
    const sections = ['home', 'about', 'projects', 'contact']
    const sectionProgress = progress * (sections.length - 1)
    const idx1 = Math.floor(sectionProgress)
    const idx2 = Math.min(idx1 + 1, sections.length - 1)
    const blend = sectionProgress - idx1

    const config1 = CAMERA_CONFIGS[sections[idx1]]
    const config2 = CAMERA_CONFIGS[sections[idx2]]

    // Update targets
    targetZ.current = THREE.MathUtils.lerp(config1.position[2], config2.position[2], blend)
    targetFov.current = THREE.MathUtils.lerp(config1.fov, config2.fov, blend)

    return { progress, sectionIndex: idx1, blend }
  }

  useEffect(() => {
    // Force immediate camera position set
    if (camera) {
      camera.position.set(0, 0, 8)
      camera.fov = 50
      camera.updateProjectionMatrix()
      currentZ.current = 8
      currentFov.current = 50
      console.log('🎬 CameraController: Camera initialized at Z=8')
    }
  }, [camera])

  useFrame(() => {
    if (!camera) return

    frameCount.current++

    const { progress, sectionIndex, blend } = updateCameraTargets()

    // Debug log every second
    if (frameCount.current % 60 === 0) {
      console.log('🎥 CameraController DEBUG - Target Z:', targetZ.current.toFixed(2), 'Current Z:', camera.position.z.toFixed(2), 'Progress:', (progress * 100).toFixed(1) + '%')
      
      // Force position if still not moving
      if (Math.abs(camera.position.z - targetZ.current) > 0.5) {
        console.log('⚠️ Forcing camera position! Current:', camera.position.z.toFixed(2), 'Target:', targetZ.current.toFixed(2))
        camera.position.z = targetZ.current
        camera.updateProjectionMatrix()
      }
    }

    // AGGRESSIVE interpolation to target position
    const lerpSpeed = 0.25 // Even faster
    currentZ.current += (targetZ.current - currentZ.current) * lerpSpeed
    currentFov.current += (targetFov.current - currentFov.current) * lerpSpeed

    // Apply directly to camera
    camera.position.z = currentZ.current
    camera.fov = currentFov.current
    camera.updateProjectionMatrix()
  })

  return null // This component doesn't render anything
}

export default CameraController
