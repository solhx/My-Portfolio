import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import './Sections.css'

function ProjectsWorld() {
  const ref = useRef(null)
  const isInView = useInView(ref, { amount: 0.2, once: false })
  const [selectedProject, setSelectedProject] = useState(null)

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden'
      const navigation = document.querySelector('.navigation')
      if (navigation) {
        navigation.style.opacity = '0'
        navigation.style.pointerEvents = 'none'
      }
    } else {
      document.body.style.overflow = ''
      const navigation = document.querySelector('.navigation')
      if (navigation) {
        navigation.style.opacity = '1'
        navigation.style.pointerEvents = 'auto'
      }
    }
    return () => {
      document.body.style.overflow = ''
      const navigation = document.querySelector('.navigation')
      if (navigation) {
        navigation.style.opacity = '1'
        navigation.style.pointerEvents = 'auto'
      }
    }
  }, [selectedProject])

  const projects = [
    {
      id: 1,
      title: '3D Portfolio Experience',
      category: 'Web Development',
      description: 'Interactive 3D portfolio built with React Three Fiber and GSAP animations',
      tech: ['React', 'Three.js', 'GSAP', 'WebGL'],
      color: '#3498db',
      icon: '🌐'
    },
    {
      id: 2,
      title: 'ShopHub',
      category: 'E-commerce',
      description: '3D product customization tool with real-time rendering',
      tech: ['React', 'Three.js', 'Redux', 'Node.js'],
      color: '#f39c12',
      icon: '🛍️',
      liveDemo: 'https://hossam-ecommerce-webs.netlify.app',
      github: 'https://github.com/hossamhassan811/ecommerce-project'
    },
    {
      id: 3,
      title: 'ToDo list',
      category: 'Task Management',
      description: 'A modern, responsive Todo app with a clean, gradient UI built using Material-UI.',
      tech: ['React 19', 'React Router', 'Material-UI', 'local storage'],
      color: '#f31c12',
      icon: '✅',
      liveDemo: 'https://todo-taskkk.netlify.app/',
      github: 'https://github.com/hossamhassan811/Todo-react'
    },
  ]

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { 
      opacity: 1, scale: 1, y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    exit: { 
      opacity: 0, scale: 0.8, y: 50,
      transition: { duration: 0.2 }
    }
  }

  return (
    <section
      id="projects"
      ref={ref}
      className="section-full projects-world"
      style={{ minHeight: '100vh' }}
    >
      <div className="content-wrapper">
        <motion.div
          className="projects-header"
          initial={{ y: -30, opacity: 0 }}
          animate={{ 
            y: isInView ? 0 : -30, 
            opacity: isInView ? 1 : 0 
          }}
          transition={{ duration: 0.6 }}
        >
          <h2>Featured Projects</h2>
          <p>Explore my latest work and creative experiments</p>
        </motion.div>

        <motion.div
          className="projects-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className="project-card"
              onClick={() => setSelectedProject(project)}
              style={{ '--project-color': project.color }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ 
                opacity: isInView ? 1 : 0,
                y: isInView ? 0 : 50
              }}
              transition={{ 
                delay: index * 0.15, 
                duration: 0.5,
                type: 'spring',
                stiffness: 100
              }}
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div 
                className="project-icon"
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.2 }}
              >
                {project.icon}
              </motion.div>
              <div className="project-category">{project.category}</div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-tech">
                {project.tech.map((tech) => (
                  <span key={tech} className="tech-tag">{tech}</span>
                ))}
              </div>
              <div className="project-link">View Project →</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {selectedProject && (
          <motion.div
            className="project-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              className="modal-content"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="modal-close" 
                onClick={() => setSelectedProject(null)}
              >
                ×
              </button>
              
              <div className="modal-icon">{selectedProject.icon}</div>
              <h2>{selectedProject.title}</h2>
              <p className="modal-category">{selectedProject.category}</p>
              <p className="modal-description">{selectedProject.description}</p>
              
              <div className="modal-tech">
                {selectedProject.tech.map((tech) => (
                  <span key={tech} className="tech-tag">{tech}</span>
                ))}
              </div>
              
              <div className="modal-actions">
                {selectedProject.liveDemo && (
                  <button
                    className="btn-primary"
                    onClick={() => window.open(selectedProject.liveDemo, '_blank')}
                  >
                    Live Demo
                  </button>
                )}
                {selectedProject.github && (
                  <button 
                    className="btn-secondary"
                    onClick={() => window.open(selectedProject.github, '_blank')}
                  >
                    GitHub
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default ProjectsWorld