import { motion, useInView } from 'framer-motion'
import { useRef, useMemo } from 'react'
import './Sections.css'

function HomeWorld() {
  const ref = useRef(null)
  const isInView = useInView(ref, { amount: 0.3, once: false })

  const isMobile = useMemo(() => {
    return window.innerWidth < 768
  }, [])

  const downloadResume = () => {
    const link = document.createElement('a')
    link.href = '/my resume/Hossam_Hassan_CV.pdf'
    link.download = 'Hossam_Hassan_CV.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section
      id="home"
      ref={ref}
      className="section-full home-world"
    >
      <div className="content-wrapper-home">
        <motion.div
          className="hero-content"
          initial={{ y: 100, opacity: 0 }}
          animate={{ 
            y: isInView ? 0 : 100, 
            opacity: isInView ? 1 : 0 
          }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <motion.h1
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ 
              scale: isInView ? 1 : 0.5, 
              opacity: isInView ? 1 : 0 
            }}
            transition={{ delay: 0.5, duration: 0.6, type: 'spring' }}
          >
            Welcome to My
            <br />
            <span className="gradient-text">Portfolio</span>
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0 }}
            transition={{ delay: 0.8 }}
          >
            Creative Developer & 3D Experience Designer
          </motion.p>

          <motion.div
            className="hero-cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: isInView ? 1 : 0, 
              y: isInView ? 0 : 20 
            }}
            transition={{ delay: 1 }}
          >
            <motion.button
              className="cta-button primary"
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(52, 152, 219, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              onClick={downloadResume}
            >
              Download Resume
            </motion.button>
            <motion.button
              className="cta-button secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection('projects')}
            >
              View Work
            </motion.button>
          </motion.div>
        </motion.div>

        {!isMobile && (
          <div className="floating-elements">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="float-orb"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: isInView ? [0.3, 0.7, 0.3] : 0,
                  y: [0, -30, 0],
                  x: [0, Math.random() * 20 - 10, 0],
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
                style={{
                  left: `${Math.min(20 + i * 12, 80)}%`,
                  bottom: `${10 + i * 8}%`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default HomeWorld