import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import useStore from '../store/useStore'
import { SECTIONS } from '../utils/constants'
import './Navigation.css'

function Navigation() {
  const currentSection = useStore((state) => state.currentSection)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { id: SECTIONS.HOME, label: 'Home', icon: '🌍' },
    { id: SECTIONS.ABOUT, label: 'About', icon: '👨‍🚀' },
    { id: SECTIONS.PROJECTS, label: 'Projects', icon: '🚀' },
    { id: SECTIONS.CONTACT, label: 'Contact', icon: '📡' },
  ]

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const navHeight = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = sectionId === 'home' ? elementPosition : elementPosition - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Close mobile menu after navigation
      setMobileMenuOpen(false);
    }
  }

  return (
    <>
      <motion.nav
        className="navigation"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
      >
        <div 
          className="nav-logo"
          onClick={() => scrollToSection('home')}
          style={{ cursor: 'pointer' }}
        >
          <img 
    src="/my photo/0d42c51c82fca7b2a1360ffec4747b2a.jpg" 
    alt="Hossam Hassan Logo" 
    className="nav-logo-img"
  />
          <span>Hossam Hassan</span>
        </div>

        {/* Desktop Navigation */}
        <ul className="nav-items desktop-nav">
          {navItems.map((item) => (
            <motion.li
              key={item.id}
              className={currentSection === item.id ? 'active' : ''}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                onClick={() => scrollToSection(item.id)}
                className="nav-button"
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {currentSection === item.id && (
                  <motion.div
                    className="nav-underline"
                    layoutId="underline"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            </motion.li>
          ))}
        </ul>

        <div className="nav-status desktop-status">
          <motion.div
            className="status-pulse"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="status-text">{currentSection.toUpperCase()}</span>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <span className={mobileMenuOpen ? 'open' : ''}></span>
          <span className={mobileMenuOpen ? 'open' : ''}></span>
          <span className={mobileMenuOpen ? 'open' : ''}></span>
        </button>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="mobile-menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Mobile Menu */}
            <motion.div
              className="mobile-menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <ul className="mobile-nav-items">
                {navItems.map((item) => (
                  <motion.li
                    key={item.id}
                    className={currentSection === item.id ? 'active' : ''}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * navItems.indexOf(item) }}
                  >
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className="mobile-nav-button"
                    >
                      <span className="nav-icon">{item.icon}</span>
                      <span className="nav-label">{item.label}</span>
                    </button>
                  </motion.li>
                ))}
              </ul>

              {/* Mobile Status */}
              <div className="mobile-status">
                <div className="status-pulse" />
                <span className="status-text">Current: {currentSection.toUpperCase()}</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navigation