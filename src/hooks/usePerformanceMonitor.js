import { useEffect, useRef } from 'react';

export function usePerformanceMonitor() {
  const fpsRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const framesRef = useRef(0);

  useEffect(() => {
    let animationFrameId;

    const measureFPS = () => {
      framesRef.current++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTimeRef.current + 1000) {
        fpsRef.current = Math.round((framesRef.current * 1000) / (currentTime - lastTimeRef.current));
        
        // Log performance warnings
        if (fpsRef.current < 30) {
          console.warn(`⚠️ Low FPS detected: ${fpsRef.current}`);
        }

        framesRef.current = 0;
        lastTimeRef.current = currentTime;
      }

      animationFrameId = requestAnimationFrame(measureFPS);
    };

    measureFPS();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return fpsRef.current;
}