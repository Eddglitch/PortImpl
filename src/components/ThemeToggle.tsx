import React, { useState, useEffect, useRef } from 'react';

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState('dark');
  const [isBlinking, setIsBlinking] = useState(false);
  const eyeContainerWrapperRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number>();

  // 1. Inicializar el tema desde localStorage o el sistema del usuario
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
  }, []);

  // 2. Aplicar el tema al body y guardarlo en localStorage cuando cambie
  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  // 3. Manejar el clic para cambiar el tema y parpadear
  const handleToggle = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
    setIsBlinking(true);
    setTimeout(() => setIsBlinking(false), 200);
  };

  // 4. Animación de seguimiento del ratón
  useEffect(() => {
    const eyes = eyeContainerWrapperRef.current?.querySelectorAll('.eye-sphere');
    if (!eyes) return;

    const animateEyes = (e: MouseEvent) => {
      const targetX = e.clientX;
      const targetY = e.clientY;

      eyes.forEach(eye => {
        const eyeIris = eye.querySelector<HTMLElement>('.eye-iris');
        if (!eyeIris) return;

        const { left, top, width, height } = eye.getBoundingClientRect();
        const eyeCenterX = left + width / 2;
        const eyeCenterY = top + height / 2;

        const deltaX = targetX - eyeCenterX;
        const deltaY = targetY - eyeCenterY;
        const angle = Math.atan2(deltaY, deltaX);

        const irisRange = 8;
        const irisX = Math.cos(angle) * irisRange;
        const irisY = Math.sin(angle) * irisRange;

        eyeIris.style.transform = `translate(${irisX}px, ${irisY}px)`;
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      animationFrameId.current = requestAnimationFrame(() => animateEyes(e));
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <div
      className="eye-container-wrapper"
      role="button"
      aria-label="Toggle day/night mode"
      ref={eyeContainerWrapperRef}
      onClick={handleToggle}
    >
      {[...Array(2)].map((_, i) => (
        <div className="eye-sphere" key={i}>
          <div className="eye-iris">
            <div className={`eye-pupil ${theme === 'light' ? 'day-mode-pupil' : 'night-mode-pupil'}`}></div>
          </div>
          <div className={`eye-lid top ${isBlinking ? 'closed' : ''}`}></div>
          <div className={`eye-lid bottom ${isBlinking ? 'closed' : ''}`}></div>
        </div>
      ))}
    </div>
  );
};

export default ThemeToggle;
