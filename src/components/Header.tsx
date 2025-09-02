'use client';

import React, { useState, useEffect } from 'react';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Función para alternar el menú móvil
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Función para cerrar el menú móvil cuando se hace clic en un enlace
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Cerrar el menú móvil cuando se redimensiona la ventana a escritorio
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevenir scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup al desmontar el componente
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <header>
      <nav className="navbar">
        {/* Logo */}
        <a href="#inicio" className="logo" onClick={closeMobileMenu}>
          EddGlitch
        </a>

        {/* Enlaces de navegación para escritorio */}
        <ul className="nav-links">
          <li><a href="#inicio">Inicio</a></li>
          <li><a href="#sobre-mi">Sobre Mí</a></li>
          <li><a href="#proyectos">Proyectos</a></li>
          <li><a href="#intereses">Intereses</a></li>
          <li><a href="#musica">Música</a></li>
          <li><a href="#contacto">Contacto</a></li>
        </ul>

        {/* Botón del menú hamburguesa */}
        <button 
          className={`hamburger-menu ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Menú de navegación"
          aria-expanded={isMobileMenuOpen}
        >
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </button>

        {/* Menú de navegación móvil */}
        <ul className={`mobile-nav ${isMobileMenuOpen ? 'active' : ''}`}>
          <li><a href="#inicio" onClick={closeMobileMenu}>Inicio</a></li>
          <li><a href="#sobre-mi" onClick={closeMobileMenu}>Sobre Mí</a></li>
          <li><a href="#proyectos" onClick={closeMobileMenu}>Proyectos</a></li>
          <li><a href="#intereses" onClick={closeMobileMenu}>Intereses</a></li>
          <li><a href="#musica" onClick={closeMobileMenu}>Música</a></li>
          <li><a href="#contacto" onClick={closeMobileMenu}>Contacto</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

