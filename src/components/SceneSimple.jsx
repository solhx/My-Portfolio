// import { useEffect, useRef } from 'react'
// import { useThree, useFrame } from '@react-three/fiber'
// import { Environment, Stars } from '@react-three/drei'
// import { EffectComposer, Bloom } from '@react-three/postprocessing'
// import { BlendFunction } from 'postprocessing'
// import * as THREE from 'three'
// import useStore from '../store/useStore'
// import InteractiveSphere from './InteractiveSphere'
// import ParticleSystem from './ParticleSystem'

// const CAMERA_Z_POSITIONS = [8, 4, 1.5, 3] // home, about, projects, contact

// function SceneSimple() {
//   const { scene, camera } = useThree()
//   const currentSection = useStore((state) => state.currentSection)
//   const frameCount = useRef(0)

//   useEffect(() => {
//     if (camera) {
//       camera.position.set(0, 0, 8)
//       camera.fov = 50
//       camera.updateProjectionMatrix()
//       console.log('🎬 Simple Scene: Camera initialized')
//     }
//   }, [camera])

//   useFrame(() => {
//     if (!camera) return

//     frameCount.current++

//     // Get scroll position
//     const scrolled = window.scrollY
//     const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
//     const progress = scrollHeight > 0 ? scrolled / scrollHeight : 0

//     // Calculate which section we're in
//     const sectionProgress = progress * 3 // 3 transitions between 4 sections
//     const sectionIndex = Math.floor(sectionProgress)
//     const blend = sectionProgress - sectionIndex

//     // Get target Z position
//     const currentZ = CAMERA_Z_POSITIONS[sectionIndex] || 8
//     const nextZ = CAMERA_Z_POSITIONS[Math.min(sectionIndex + 1, 3)] || 3
//     const targetZ = currentZ + (nextZ - currentZ) * blend

//     // Apply camera position
//     camera.position.z += (targetZ - camera.position.z) * 0.1
    
//     // Debug every 2 seconds
//     if (frameCount.current % 120 === 0) {
//       console.log('🎥 Simple Camera - Target Z:', targetZ.toFixed(2), 'Current Z:', camera.position.z.toFixed(2), 'Progress:', (progress * 100).toFixed(1) + '%')
//     }
//   })

//   return (
//     <>
//       <ambientLight intensity={0.5} />
//       <pointLight position={[10, 10, 10]} intensity={1.5} color="#3498db" />
//       <pointLight position={[-10, -10, -10]} intensity={0.8} color="#9b59b6" />

//       <InteractiveSphere />
//       <ParticleSystem />

//       {currentSection === 'home' && (
//         <Stars radius={100} depth={50} count={500} factor={4} saturation={0} fade speed={1} />
//       )}

//       <Environment preset="night" />

//       <EffectComposer>
//         <Bloom
//           intensity={0.3}
//           luminanceThreshold={0.9}
//           luminanceSmoothing={0.9}
//           blendFunction={BlendFunction.ADD}
//         />
//       </EffectComposer>
//     </>
//   )
// }

// export default SceneSimple
