import { motion } from 'framer-motion'
import useStore from '../store/useStore'
import { SECTIONS } from '../utils/constants'
import './Navigation.css'

function Navigation() {
  const currentSection = useStore((state) => state.currentSection)

  const navItems = [
    { id: SECTIONS.HOME, label: 'Home', icon: '🌍' },
    { id: SECTIONS.ABOUT, label: 'About', icon: '👨‍🚀' },
    { id: SECTIONS.PROJECTS, label: 'Projects', icon: '🚀' },
    { id: SECTIONS.CONTACT, label: 'Contact', icon: '📡' },
  ]

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
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
      
        <span>Hossam Hassan</span>
      </div>

      <ul className="nav-items">
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

      <div className="nav-status">
        <motion.div
          className="status-pulse"
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="status-text">{currentSection.toUpperCase()}</span>
      </div>
    </motion.nav>
  )
}

export default Navigation