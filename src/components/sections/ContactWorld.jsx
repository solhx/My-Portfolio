import { motion, useInView } from 'framer-motion'
import { useState, useRef } from 'react'
import './Sections.css'

function ContactWorld() {
  const ref = useRef(null)
  const isInView = useInView(ref, { amount: 0.2, once: false })
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      alert('Message sent! 🚀')
      setFormData({ name: '', email: '', message: '' })
    }, 2000)
  }

  const contactMethods = [
    { 
      icon: '📧', 
      label: 'Email', 
      value: 'hossamhassan112003@gmail.com', 
      link: 'mailto:hossamhassan112003@gmail.com' 
    },
    { 
      icon: '💼', 
      label: 'LinkedIn', 
      value: 'linkedin.com/in/Hossam Hassan', 
      link: 'https://www.linkedin.com/in/hossam-hassan-132055244/' 
    },
    { 
      icon: '🐙', 
      label: 'GitHub', 
      value: 'github.com/Hossam Hassan', 
      link: 'https://github.com/solhx' 
    },
  ]

  return (
    <section
      id="contact"
      ref={ref}
      className="section-full contact-world"
      style={{ minHeight: '100vh' }}
    >
      <div className="content-wrapper">
        <motion.div
          className="contact-header"
          initial={{ y: -30, opacity: 0 }}
          animate={{ 
            y: isInView ? 0 : -30, 
            opacity: isInView ? 1 : 0 
          }}
          transition={{ duration: 0.6 }}
        >
          <h2>Let's Connect</h2>
          <p>Ready to start your next project? Let's make it happen together</p>
        </motion.div>

        <motion.div 
          className="contact-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <motion.div
            className="contact-info"
            initial={{ x: -50, opacity: 0 }}
            animate={{ 
              x: isInView ? 0 : -50, 
              opacity: isInView ? 1 : 0 
            }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h3>Get in Touch</h3>
            <p className="contact-description">
              I'm always interested in hearing about new projects and opportunities.
              Whether you have a question or just want to say hi, feel free to reach out!
            </p>

            <div className="contact-methods">
              {contactMethods.map((method, index) => (
                <motion.a
                  key={method.label}
                  href={method.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-method"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: isInView ? 1 : 0, 
                    x: isInView ? 0 : -20 
                  }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                  whileHover={{ x: 10, scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="method-icon">{method.icon}</span>
                  <div className="method-info">
                    <span className="method-label">{method.label}</span>
                    <span className="method-value">{method.value}</span>
                  </div>
                </motion.a>
              ))}
            </div>

            <motion.div
              className="availability"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                opacity: isInView ? 1 : 0,
                scale: isInView ? 1 : 0.9
              }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <div className="status-indicator">
                <motion.div
                  className="status-dot"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span>Available for freelance</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.form
            className="contact-form"
            onSubmit={handleSubmit}
            initial={{ x: 50, opacity: 0 }}
            animate={{ 
              x: isInView ? 0 : 50, 
              opacity: isInView ? 1 : 0 
            }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Your name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="your.email@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                placeholder="Tell me about your project..."
                rows="5"
              />
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? '⏳ Sending...' : 'Send Message 🚀'}
            </button>
          </motion.form>
        </motion.div>
      </div>
    </section>
  )
}

export default ContactWorld