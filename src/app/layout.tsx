'use client';

import React, { useEffect } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CustomCursor from '../components/CustomCursor';
import ThemeToggle from '../components/ThemeToggle';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Lógica de Smooth Scroll y Fade-in
    document.documentElement.style.scrollBehavior = 'auto';
    let targetScrollY = window.scrollY;
    let animationFrameID: number | null = null;

    const animateScroll = () => {
      const currentScrollY = window.scrollY;
      const distance = targetScrollY - currentScrollY;
      const scrollStep = distance * 0.1;

      if (Math.abs(distance) > 1) {
        window.scrollTo(0, currentScrollY + scrollStep);
        animationFrameID = requestAnimationFrame(animateScroll);
      } else {
        window.scrollTo(0, targetScrollY);
        if (animationFrameID) {
          cancelAnimationFrame(animationFrameID);
          animationFrameID = null;
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetScrollY += e.deltaY * 0.5;
      targetScrollY = Math.max(0, Math.min(targetScrollY, document.body.scrollHeight - window.innerHeight));
      if (!animationFrameID) {
        animationFrameID = requestAnimationFrame(animateScroll);
      }
    };

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(target.getAttribute('href')!);
        if (targetElement) {
          // @ts-ignore
          targetScrollY = targetElement.offsetTop;
          if (!animationFrameID) {
            animationFrameID = requestAnimationFrame(animateScroll);
          }
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('click', handleAnchorClick);

    // Lógica para el cursor personalizado
    const customCursor = document.querySelector('.custom-cursor') as HTMLElement;
    if (customCursor) {
      const handleMouseMove = (e: MouseEvent) => {
        customCursor.style.left = `${e.clientX}px`;
        customCursor.style.top = `${e.clientY}px`;
      };

      const handleMouseEnter = () => customCursor.classList.add('hover');
      const handleMouseLeave = () => customCursor.classList.remove('hover');

      document.addEventListener('mousemove', handleMouseMove);

      // Añadir eventos a elementos interactivos
      const interactiveElements = document.querySelectorAll('a, button, .skill-item, .project-card, .theme-toggle, .scroll-to-top, .hamburger-menu');
      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
      });

      // Cleanup para cursor personalizado
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        interactiveElements.forEach(el => {
          el.removeEventListener('mouseenter', handleMouseEnter);
          el.removeEventListener('mouseleave', handleMouseLeave);
        });
      };
    }

    // Lógica para el botón de scroll-to-top
    const scrollToTopButton = document.querySelector('.scroll-to-top') as HTMLElement;
    if (scrollToTopButton) {
      const handleScroll = () => {
        if (window.scrollY > 200) {
          scrollToTopButton.classList.add('visible');
        } else {
          scrollToTopButton.classList.remove('visible');
        }
      };

      const handleScrollToTopClick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };

      window.addEventListener('scroll', handleScroll);
      scrollToTopButton.addEventListener('click', handleScrollToTopClick);

      // Cleanup para scroll-to-top
      return () => {
        window.removeEventListener('scroll', handleScroll);
        scrollToTopButton.removeEventListener('click', handleScrollToTopClick);
      };
    }

    // Lógica para el tema (claro/oscuro)
    const themeToggle = document.querySelector('.theme-toggle') as HTMLElement;
    if (themeToggle) {
      const currentTheme = localStorage.getItem('theme') || 'dark';
      document.body.setAttribute('data-theme', currentTheme);

      const handleThemeToggle = () => {
        const newTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
      };

      themeToggle.addEventListener('click', handleThemeToggle);

      // Cleanup para theme toggle
      return () => {
        themeToggle.removeEventListener('click', handleThemeToggle);
      };
    }

    // Lógica para animaciones fade-in al hacer scroll
    const fadeInElements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('appear');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });

    fadeInElements.forEach(el => {
      observer.observe(el);
    });

    // Cleanup principal
    return () => {
      window.removeEventListener('wheel', handleWheel);
      document.removeEventListener('click', handleAnchorClick);
      observer.disconnect();
    };
  }, []);

  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Eduardo Téllez - Especialista en visualización de datos y creación de contenido gráfico" />
        <title>Eduardo Téllez - Visualización de Datos & Música</title>
      </head>
      <body className={inter.className}>
        <CustomCursor />
        <ThemeToggle />
        <Header />
        <main>
          {children}
        </main>
        <Footer />
        
        {/* Botón de scroll to top */}
        <button className="scroll-to-top" aria-label="Volver arriba">
          ↑
        </button>
      </body>
    </html>
  );
}

