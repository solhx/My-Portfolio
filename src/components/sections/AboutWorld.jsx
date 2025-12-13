import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect, useMemo } from 'react'
import './Sections.css'

function AboutWorld() {
  const ref = useRef(null)
  
  // 🎯 Detect iPhone 13 Pro specifically (390x844, 3x pixel ratio)
  const isIPhone13Pro = useMemo(() => {
    return (
      window.innerWidth === 390 &&
      window.innerHeight === 844 &&
      window.devicePixelRatio === 3
    );
  }, []);

  // 🎯 FIX: Use 'once: true' to prevent content from disappearing on scroll up
  const isInView = useInView(ref, { 
    amount: isIPhone13Pro ? 0.1 : 0.2, 
    once: true // Content stays visible after first view
  })

  // 🎯 Track if section has been viewed to keep content visible
  const [hasBeenViewed, setHasBeenViewed] = useState(false)

  useEffect(() => {
    if (isInView && !hasBeenViewed) {
      setHasBeenViewed(true)
    }
  }, [isInView, hasBeenViewed])

  // Use this for all animations - content stays visible once viewed
  const shouldAnimate = hasBeenViewed || isInView

  const skills = [
    { name: 'JavaScript/TypeScript', percentage: 95, icon: '⚡', color: '#f7df1e' },
    { name: 'React.js & Next.js', percentage: 90, icon: '⚛️', color: '#61dafb' },
    { name: 'Node.js & Express', percentage: 85, icon: '🟢', color: '#339933' },
    { name: 'MongoDB & SQL', percentage: 80, icon: '🍃', color: '#47a248' },
  ]

  // 🎯 Simplified animation props for iPhone 13 Pro
  const getAnimationProps = (initialProps, animateProps) => {
    if (isIPhone13Pro) {
      // Instant animations on iPhone 13 Pro
      return {
        initial: { opacity: shouldAnimate ? 1 : 0 },
        animate: { opacity: shouldAnimate ? 1 : 0 },
        transition: { duration: 0.1 }
      };
    }
    // Normal animations on other devices
    return {
      initial: initialProps,
      animate: animateProps,
      transition: animateProps.transition || { duration: 0.6 }
    };
  };

  return (
    <section id="about" ref={ref} className="section-full about-world">
      <div className="content-wrapper">
        <motion.div
          className="about-content"
          {...getAnimationProps(
            { opacity: 0, y: 50 },
            { 
              opacity: shouldAnimate ? 1 : 0, 
              y: shouldAnimate ? 0 : 50,
              transition: { duration: 0.6 }
            }
          )}
        >
          {/* Header */}
          <div className="about-header">
            <motion.h2
              {...getAnimationProps(
                { opacity: 0, scale: 0.8 },
                { 
                  opacity: shouldAnimate ? 1 : 0, 
                  scale: shouldAnimate ? 1 : 0.8,
                  transition: { delay: 0.2 }
                }
              )}
            >
              About Me
            </motion.h2>
            <p className="about-subtitle">Crafting Digital Experiences with Passion</p>
            <div className="header-line" />
          </div>

          {/* Main Grid */}
          <div className="about-main-grid">
            {/* Left Column */}
            <motion.div
              className="about-left-column"
              {...getAnimationProps(
                { opacity: 0, x: -50 },
                { 
                  opacity: shouldAnimate ? 1 : 0, 
                  x: shouldAnimate ? 0 : -50,
                  transition: { delay: 0.3 }
                }
              )}
            >
              {/* Photo */}
              <div className="about-photo-container">
                <div className="about-photo">
                  <img 
                    src="/my photo/me.jpg" 
                    alt="Hossam Hassan" 
                    loading="lazy"
                  />
                  <div className="photo-overlay">
                    <span className="photo-badge">Full-Stack Developer</span>
                  </div>
                </div>
              </div>

              {/* Quick Info */}
              <div className="quick-info">
                <div className="info-card">
                  <div className="info-icon">📍</div>
                  <div>
                    <div className="info-label">Location</div>
                    <div className="info-value">Egypt</div>
                  </div>
                </div>
                <div className="info-card">
                  <div className="info-icon">💼</div>
                  <div>
                    <div className="info-label">Experience</div>
                    <div className="info-value">2+ Years</div>
                  </div>
                </div>
                <div className="info-card">
                  <div className="info-icon">🎓</div>
                  <div>
                    <div className="info-label">Education</div>
                    <div className="info-value">Bachelor's Degree</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column */}
            <motion.div
              className="about-right-column"
              {...getAnimationProps(
                { opacity: 0, x: 50 },
                { 
                  opacity: shouldAnimate ? 1 : 0, 
                  x: shouldAnimate ? 0 : 50,
                  transition: { delay: 0.4 }
                }
              )}
            >
              {/* Bio */}
              <div className="about-bio">
                <h3>Hello! I'm Hossam Hassan 👋</h3>
                <p>
                  A <strong>Junior MERN Stack Developer</strong> with hands-on experience building full-stack web applications using
                  <strong> MongoDB, Express.js, React, and Node.js</strong>.
                  Skilled in creating scalable backend APIs, secure server-side logic, and responsive front-end interfaces.
                </p>
                <p>
                  Previously worked as a Front-End Developer, delivering optimized and accessible user experiences with
                  <strong> React and Next.js</strong>. Strong ability to translate UI/UX designs into clean, maintainable code and collaborate effectively within agile development teams.
                </p>
                <p>
                  Passionate about building modern web applications, writing efficient code, and continuously improving my development workflow.
                </p>
                <div className="cta-badge">
                  <span>🚀</span>
                  <span>Open to New Opportunities</span>
                </div>
              </div>

              {/* Skills */}
              <div className="skills-section">
                <h3>
                  <span className="section-icon">🛠️</span>
                  Technical Skills
                </h3>
                <div className="skills-grid">
                  {skills.map((skill, index) => (
                    <motion.div
                      key={skill.name}
                      className="skill-item"
                      {...getAnimationProps(
                        { opacity: 0, x: -20 },
                        { 
                          opacity: shouldAnimate ? 1 : 0, 
                          x: shouldAnimate ? 0 : -20,
                          transition: { delay: 0.5 + index * 0.1 }
                        }
                      )}
                    >
                      <div className="skill-header">
                        <span className="skill-icon">{skill.icon}</span>
                        <span className="skill-name">{skill.name}</span>
                        <span className="skill-percentage">{skill.percentage}%</span>
                      </div>
                      <div className="skill-bar">
                        <motion.div
                          className="skill-progress"
                          style={{ 
                            background: `linear-gradient(90deg, ${skill.color}, ${skill.color}dd)`,
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: shouldAnimate ? `${skill.percentage}%` : 0 }}
                          transition={{ 
                            delay: isIPhone13Pro ? 0 : 0.6 + index * 0.1, 
                            duration: isIPhone13Pro ? 0.3 : 0.8 
                          }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Stats Section */}
          <motion.div
            className="about-stats-section"
            {...getAnimationProps(
              { opacity: 0, y: 30 },
              { 
                opacity: shouldAnimate ? 1 : 0, 
                y: shouldAnimate ? 0 : 30,
                transition: { delay: 0.7 }
              }
            )}
          >
            <div className="about-stats">
              {[
                { icon: '💼', number: '10+', label: 'Projects Completed' },
                { icon: '🏆', number: '2+', label: 'Years Experience' },
                { icon: '☕', number: '1000+', label: 'Cups of Coffee' },
                { icon: '⭐', number: '100%', label: 'Client Satisfaction' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="stat"
                  whileHover={isIPhone13Pro ? {} : { scale: 1.05 }}
                  whileTap={isIPhone13Pro ? {} : { scale: 0.95 }}
                  {...getAnimationProps(
                    { opacity: 0, scale: 0.5 },
                    { 
                      opacity: shouldAnimate ? 1 : 0, 
                      scale: shouldAnimate ? 1 : 0.5,
                      transition: { delay: 0.8 + index * 0.1 }
                    }
                  )}
                >
                  <span className="stat-icon">{stat.icon}</span>
                  <span className="stat-number">{stat.number}</span>
                  <span className="stat-label">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default AboutWorld