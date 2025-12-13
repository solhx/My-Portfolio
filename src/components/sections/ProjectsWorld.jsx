import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import './Sections.css'

function ProjectsWorld() {
  const ref = useRef(null)
  const isInView = useInView(ref, { amount: 0.2, once: false })
  const [selectedProject, setSelectedProject] = useState(null)

  const projects = [
    {
      id: 1,
      icon: '🌐',
      category: 'Web Development',
      title: '3D Portfolio Experience',
      description: 'Interactive 3D portfolio built with React, Three Fiber and GSAP animations',
      tech: ['React', 'Three.js', 'GSAP', 'WebGL'],
      color: '#3498db',
      link: 'https://github.com/solhx/My-Portfolio',
      demo: 'https://hossam-hassan-portfolio.netlify.app/'
    },
    {
      id: 2,
      icon: '🛍️',
      category: 'E-Commerce',
      title: 'ShopHub',
      description: '3D product customization tool with real-time rendering',
      tech: ['React', 'Three.js', 'Redux', 'Node.js'],
      color: '#e74c3c',
      link: 'https://github.com/solhx/ecommerce-project',
      demo: 'https://hossam-ecommerce-webs.netlify.app/'
    },
    {
      id: 3,
      icon: '✅',
      category: 'Task Management',
      title: 'ToDo.list',
      description: 'A modern, responsive Todo app with a clean, gradient UI built using Material-UI.',
      tech: ['React 19', 'React Router', 'Material-UI', 'local storage'],
      color: '#2ecc71',
      link: 'https://github.com/solhx/Todo-react',
      demo: 'https://todo-taskkk.netlify.app/'
    },
  ]

  const openModal = (project) => {
    setSelectedProject(project)
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setSelectedProject(null)
    document.body.style.overflow = 'auto'
  }

  return (
    <>
      <section id="projects" ref={ref} className="section-full projects-world">
        <div className="content-wrapper">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
            transition={{ duration: 0.6 }}
          >
            <div className="projects-header">
              <h2>My Projects</h2>
              <p>Some of the things I've built</p>
            </div>

            <div className="projects-grid">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  className="project-card"
                  style={{ '--project-color': project.color }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => openModal(project)}
                >
                  <div className="project-icon">{project.icon}</div>
                  <div className="project-category">{project.category}</div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-tech">
                    {project.tech.map(tech => (
                      <span key={tech} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                  <button className="project-link">
                    View Project →
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 🎯 CRITICAL: Modal rendered at body level using Portal */}
      {selectedProject && createPortal(
        <motion.div
          className="project-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
        >
          <motion.div
            className="modal-content"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={closeModal}>×</button>
            
            <div className="modal-icon">{selectedProject.icon}</div>
            <h2>{selectedProject.title}</h2>
            <div className="modal-category">{selectedProject.category}</div>
            <p className="modal-description">{selectedProject.description}</p>
            
            <div className="modal-tech">
              {selectedProject.tech.map(tech => (
                <span key={tech} className="tech-tag">{tech}</span>
              ))}
            </div>

            <div className="modal-actions">
              <a 
                href={selectedProject.demo} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Live Demo
              </a>
              <a 
                href={selectedProject.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                View Code
              </a>
            </div>
          </motion.div>
        </motion.div>,
        document.body
      )}
    </>
  )
}

export default ProjectsWorld