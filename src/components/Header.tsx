'use client';

import React, { useState } from 'react';
import Image from 'next/image';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header>
      <nav className="navbar">
        <div className="logo">
          <a href="#inicio" onClick={handleLinkClick}>
            <Image 
              src={`${basePath}/logeed.png`} 
              alt="Logo" 
              width={90} 
              height={80} 
              style={{ marginRight: '1px', height: 'auto' }} // Corregido para el warning
              priority // Priorizar la carga del logo
            />
            <span style={{ color: 'gray', opacity: 0.6, filter: 'blur(1px)' }}>EddGlitch</span>
          </a>
        </div>

        {/* Navegación para Escritorio */}
        <ul className="nav-links">
          <li><a href="#inicio">Inicio</a></li>
          <li><a href="#sobre-mi">Sobre Mí</a></li>
          <li><a href="#proyectos">Proyectos</a></li>
          <li><a href="#intereses">Intereses</a></li>
          <li><a href="#trayectoria-musical">Música</a></li>
          <li><a href="#contacto">Contacto</a></li>
        </ul>

        {/* Botón de Hamburguesa */}
        <div 
          className={`hamburger-menu ${isMenuOpen ? 'active' : ''}`} 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </nav>

      {/* Navegación para Móvil */}
      <ul className={`mobile-nav ${isMenuOpen ? 'active' : ''}`}>
        <li><a href="#inicio" onClick={handleLinkClick}>Inicio</a></li>
        <li><a href="#sobre-mi" onClick={handleLinkClick}>Sobre Mí</a></li>
        <li><a href="#proyectos" onClick={handleLinkClick}>Proyectos</a></li>
        <li><a href="#intereses" onClick={handleLinkClick}>Intereses</a></li>
        <li><a href="#trayectoria-musical" onClick={handleLinkClick}>Música</a></li>
        <li><a href="#contacto" onClick={handleLinkClick}>Contacto</a></li>
      </ul>
    </header>
  );
};

export default Header;