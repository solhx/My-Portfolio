import { create } from 'zustand'

const useStore = create((set) => ({
  currentSection: 'home',
  isTransitioning: false,
  isLoading: true,
  previousSection: null,
  
  setCurrentSection: (section) => {
    const validSections = ['home', 'about', 'projects', 'contact']
    if (validSections.includes(section)) {
      set((state) => ({ 
        currentSection: section,
        previousSection: state.currentSection 
      }))
    }
  },
  
  setIsTransitioning: (value) => set({ isTransitioning: value }),
  setIsLoading: (value) => set({ isLoading: value }),
}))

export default useStore