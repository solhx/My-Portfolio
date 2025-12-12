import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useState, useMemo } from 'react'
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

  // 🎯 DETECT MOBILE DEVICE
  const isMobile = useMemo(() => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
           || window.innerWidth < 768;
  }, []);

  // 🎯 ADAPTIVE DPR (Device Pixel Ratio)
  const canvasDpr = useMemo(() => {
    if (isMobile) return [0.5, 1]; // Lower quality on mobile
    return [1, 2]; // High quality on desktop
  }, [isMobile]);

  useEffect(() => {
    if (isLoaded && isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isLoaded, isLoading, setIsLoading])

  // 🎯 OPTIMIZED SCROLL HANDLER
  useEffect(() => {
  if (isLoading) return

  let ticking = false;

  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
        const scrolled = window.scrollY
        const progress = scrollHeight > 0 ? Math.min(Math.max(scrolled / scrollHeight, 0), 1) : 0
        
        setScrollProgress(progress)

        // 🎯 IMPROVED: Use actual section positions
        const sections = ['home', 'about', 'projects', 'contact'];
        let detectedSection = 'home';

        // Check each section's position
        for (let i = sections.length - 1; i >= 0; i--) {
          const element = document.getElementById(sections[i]);
          if (element) {
            const rect = element.getBoundingClientRect();
            // If section is in viewport (with 200px threshold)
            if (rect.top <= 200) {
              detectedSection = sections[i];
              break;
            }
          }
        }

        if (currentSection !== detectedSection) {
          setCurrentSection(detectedSection)
        }

        ticking = false;
      });

      ticking = true;
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()

  return () => {
    window.removeEventListener('scroll', handleScroll)
  }
}, [isLoading, setCurrentSection, currentSection])
  return (
    <div className="app">
      {/* 🎯 DISABLE CUSTOM CURSOR ON MOBILE */}
      {!isMobile && <CustomCursor />}
      
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="loading" loadingProgress={loadingProgress} />}
      </AnimatePresence>

      {!isLoading && (
        <>
          <Navigation />

          <div className="canvas-container">
            <Canvas
              dpr={canvasDpr}
              gl={{
                antialias: !isMobile,
                alpha: false,
                powerPreference: 'high-performance',
                stencil: false,
              }}
              camera={{ position: [0, 0, 8], fov: isMobile ? 60 : 50 }}
              performance={{ min: 0.5 }}
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

          {/* Scroll Hint - Hide on mobile */}
          {currentSection === 'home' && !isMobile && (
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
              Scroll to explore
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