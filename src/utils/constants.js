export const SECTIONS = {
  HOME: 'home',
  ABOUT: 'about',
  PROJECTS: 'projects',
  CONTACT: 'contact',
}

export const CAMERA_CONFIGS = {
  home: {
    position: [0, 0, 8],
    target: [0, 0, 0],
    fov: 50,
  },
  about: {
    position: [0, 0, 4],
    target: [0, 0, 0],
    fov: 60,
  },
  projects: {
    position: [0, 0, 1.5],
    target: [0, 0, 0],
    fov: 70,
  },
  contact: {
    position: [0, 0, 3],
    target: [0, 0, 0],
    fov: 65,
  },
}

export const SECTION_COLORS = {
  home: {
    primary: '#3498db',
    secondary: '#2980b9',
    background: '#0a0e27',
    ambient: '#1a237e',
  },
  about: {
    primary: '#e74c3c',
    secondary: '#c0392b',
    background: '#1a1a2e',
    ambient: '#880e4f',
  },
  projects: {
    primary: '#f39c12',
    secondary: '#d68910',
    background: '#16213e',
    ambient: '#f57f17',
  },
  contact: {
    primary: '#9b59b6',
    secondary: '#8e44ad',
    background: '#0f3460',
    ambient: '#4a148c',
  },
}