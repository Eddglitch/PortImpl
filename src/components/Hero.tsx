import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const Hero: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile || !videoRef.current) return;

    const video = videoRef.current;
    const handleEnded = () => {
      video.style.opacity = '0';
      video.currentTime = 0;
      video.play();
    };

    const handlePlaying = () => {
      if (video.currentTime < 0.1) {
        video.style.opacity = '0.65';
      }
    };

    video.addEventListener('ended', handleEnded);
    video.addEventListener('playing', handlePlaying);
    video.style.opacity = '0.65';

    return () => {
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('playing', handlePlaying);
    };
  }, [isMobile]);

  return (
    <section id="inicio" className="hero-section">
      <div className="hero-bg"></div>
      <div className="hero-content">
        <h1 className="hero-main-title">Eduardo Téllez Valverde</h1>
        <p className="hero-subtitle">Graphic content creator for data analisis and optimization</p>
        <p className="description">Transformo datos complejos en narrativas visuales comprensibles y atractivas. Especializado en crear visualizaciones que comunican insights de manera efectiva.</p>
      </div>

      <div className="hero-video-background">
        {isMobile ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_PATH}/Edd.png`}
            alt="Imagen de fondo estática"
            fill
            style={{ objectFit: 'cover' }}
            quality={85}
            className="hero-fallback-image"
            priority
          />
        ) : (
          <video autoPlay muted loop id="heroVideo" ref={videoRef}>
            <source src={`${process.env.NEXT_PUBLIC_BASE_PATH}/video2.mp4`} type="video/mp4" />
            Tu navegador no soporta el video.
          </video>
        )}
        <div className="video-overlay"></div>
        <a href="#proyectos" className="cta-button">Ver Mi Trabajo</a>
      </div>
    </section>
  );
};

export default Hero;
