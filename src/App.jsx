import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Scene from './components/Scene'
import Navigation from './components/Navigation'
import LoadingScreen from './components/LoadingScreen'
import CustomCursor from './components/CustomCursor'
import HomeWorld from './components/sections/HomeWorld'
import AboutWorld from './components/sections/AboutWorld'
import ProjectsWorld from './components/sections/ProjectsWorld'
import ContactWorld from './components/sections/ContactWorld'
import useStore from './store/useStore'
import { useAssetLoader } from './hooks/useAssetLoader'
import './index.css'

function App() {
  const currentSection = useStore((state) => state.currentSection)
  const isLoading = useStore((state) => state.isLoading)
  const setIsLoading = useStore((state) => state.setIsLoading)
  const setCurrentSection = useStore((state) => state.setCurrentSection)
  const { loadingProgress, isLoaded } = useAssetLoader()

  const [scrollProgress, setScrollProgress] = useState(0)
  const [showDebug, setShowDebug] = useState(true) // Toggle debug
  const [cameraZ, setCameraZ] = useState(8)

  // Update loading screen
  useEffect(() => {
    if (isLoaded && isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isLoaded, isLoading, setIsLoading])

  // Enhanced scroll detection
  useEffect(() => {
    if (isLoading) return

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = window.scrollY
      const progress = scrollHeight > 0 ? Math.min(Math.max(scrolled / scrollHeight, 0), 1) : 0
      
      setScrollProgress(progress)

      

      // Calculate camera Z
      const cameraConfigs = [8, 4, 1.5, 3]
      const sectionProgress = progress * (cameraConfigs.length - 1)
      const idx1 = Math.floor(sectionProgress)
      const idx2 = Math.min(idx1 + 1, cameraConfigs.length - 1)
      const blend = sectionProgress - idx1
      
      const interpolatedZ = cameraConfigs[idx1] + (cameraConfigs[idx2] - cameraConfigs[idx1]) * blend
      setCameraZ(interpolatedZ)

      // Determine section
      let detectedSection = 'home'
      if (progress > 0.75) detectedSection = 'contact'
      else if (progress > 0.5) detectedSection = 'projects'
      else if (progress > 0.25) detectedSection = 'about'

      if (currentSection !== detectedSection) {
       
        setCurrentSection(detectedSection)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    const interval = setInterval(handleScroll, 100)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('scroll', handleScroll)
      clearInterval(interval)
    }
  }, [isLoading, setCurrentSection, currentSection])

  // Keyboard toggle debug
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'd' || e.key === 'D') {
        setShowDebug(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  return (
    <div className="app">
      <CustomCursor />
      
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="loading" loadingProgress={loadingProgress} />}
      </AnimatePresence>

      {!isLoading && (
        <>
          <Navigation />

          <div className="canvas-container">
            <Canvas
              dpr={[1, 2]}
              gl={{
                antialias: true,
                alpha: false,
                powerPreference: 'high-performance',
              }}
              camera={{ position: [0, 0, 8], fov: 50 }}
            >
              <Suspense fallback={null}>
                <Scene />
              </Suspense>
            </Canvas>
          </div>

          <div className="scroll-container">
            <HomeWorld />
            <AboutWorld />
            <ProjectsWorld />
            <ContactWorld />
          </div>

          {/* Progress Bar */}
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: `${scrollProgress * 100}%`,
            height: '4px',
            background: `linear-gradient(90deg, #3498db 0%, #e74c3c 33%, #f39c12 66%, #9b59b6 100%)`,
            zIndex: 9999,
            transition: 'width 0.1s ease-out',
            boxShadow: `0 0 20px ${
              currentSection === 'home' ? '#3498db' :
              currentSection === 'about' ? '#e74c3c' :
              currentSection === 'projects' ? '#f39c12' : '#9b59b6'
            }`
          }} />

          {/* Scroll Hint */}
          {currentSection === 'home' && (
            <div style={{
              position: 'fixed',
              bottom: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 100,
              textAlign: 'center',
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '16px',
              fontWeight: '600',
              animation: 'bounce 2s infinite',
              pointerEvents: 'none',
              textShadow: '0 0 10px rgba(52, 152, 219, 0.8)'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>↓</div>
            
            </div>
          )}
        </>
      )}

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-15px); }
        }
      `}</style>
    </div>
  )
}

export default App