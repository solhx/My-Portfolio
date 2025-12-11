import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import "./Sections.css";

function AboutWorld() {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.2, once: false });

  const skills = [
    { name: "React & Next.js", level: 90, icon: "⚛️", color: "#61DAFB" },
  
    { name: "UI/UX Design", level: 85, icon: "🎯", color: "#FF6B6B" },
    { name: "Node.js & APIs", level: 60, icon: "🔧", color: "#68A063" },
    { name: "TypeScript", level: 80, icon: "📘", color: "#3178C6" },
  ];

  const stats = [
    { number: "10+", label: "Projects Completed", icon: "🚀" },
    { number: "1-2", label: "Years Experience", icon: "⏱️" },
    { number: "100%", label: "Client Satisfaction", icon: "⭐" },
    { number: "9+", label: "Happy Clients", icon: "🤝" },
  ];

  return (
    <section
      id="about"
      ref={ref}
      className="section-full about-world"
      style={{ minHeight: "100vh" }}
    >
      <div className="content-wrapper">
        <motion.div
          className="about-content"
          initial={{ y: 50, opacity: 0 }}
          animate={{
            y: isInView ? 0 : 50,
            opacity: isInView ? 1 : 0,
          }}
          transition={{ duration: 0.6 }}
        >
          <div className="about-header">
            <h2>About Me</h2>
            <p className="about-subtitle">
              Crafting Digital Experiences with Passion
            </p>
            <div className="header-line" />
          </div>

          <div className="about-main-grid">
            <div className="about-left-column">
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

              <div className="quick-info">
                <div className="info-card">
                  <span className="info-icon">📍</span>
                  <div>
                    <p className="info-label">Location</p>
                    <p className="info-value">Egypt</p>
                  </div>
                </div>
                <div className="info-card">
                  <span className="info-icon">💼</span>
                  <div>
                    <p className="info-label">Experience</p>
                    <p className="info-value">1-2</p>
                  </div>
                </div>
                <div className="info-card">
                  <span className="info-icon">🎓</span>
                  <div>
                    <p className="info-label">Specialization</p>
                    <p className="info-value">React & Node.js</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="about-right-column">
              <div className="about-bio">
                <h3>Hello! I'm Hossam Hassan 👋</h3>
                <p>
                  A{" "}
                  <strong className="gradient-text">
                    Junior MERN Stack Developer
                  </strong>{" "}
                  with hands-on experience building full-stack web applications
                  using
                  <strong className="gradient-text"> MongoDB, Express.js, React, and Node.js</strong>.
                  Skilled in creating scalable backend APIs, secure server-side
                  logic, and responsive front-end interfaces.
                </p>
                <p>
                  Previously worked as a Front-End Developer, delivering
                  optimized and accessible user experiences with
                  <strong className="gradient-text"> React and Next.js</strong>. Strong ability to
                  translate UI/UX designs into clean, maintainable code and
                  collaborate effectively within agile development teams.
                </p>
                <p>
                  Passionate about building modern web applications, writing
                  efficient code, and continuously improving my development
                  workflow.
                </p>
                <div className="cta-badge">
                  <span>✨</span> Let's build something amazing together!
                </div>
              </div>

              <div className="skills-section">
                <h3>
                  <span className="section-icon">🛠️</span>
                  Skills & Expertise
                </h3>
                <div className="skills-grid">
                  {skills.map((skill, index) => (
                    <motion.div
                      key={skill.name}
                      className="skill-item"
                      initial={{ opacity: 0, x: -50 }}
                      animate={{
                        opacity: isInView ? 1 : 0,
                        x: isInView ? 0 : -50,
                      }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                      <div className="skill-header">
                        <span className="skill-icon">{skill.icon}</span>
                        <span className="skill-name">{skill.name}</span>
                        <span className="skill-percentage">{skill.level}%</span>
                      </div>
                      <div className="skill-bar">
                        <motion.div
                          className="skill-progress"
                          initial={{ width: 0 }}
                          animate={{ width: isInView ? `${skill.level}%` : 0 }}
                          transition={{
                            delay: index * 0.1 + 0.3,
                            duration: 0.8,
                          }}
                          style={{
                            background: `linear-gradient(90deg, ${skill.color}, ${skill.color}dd)`,
                            boxShadow: `0 0 10px ${skill.color}40`,
                          }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="about-stats-section">
            <div className="about-stats">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="stat"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: isInView ? 1 : 0,
                    scale: isInView ? 1 : 0,
                  }}
                  transition={{ delay: index * 0.1 + 0.5, type: "spring" }}
                >
                  <span className="stat-icon">{stat.icon}</span>
                  <span className="stat-number">{stat.number}</span>
                  <span className="stat-label">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default AboutWorld;
