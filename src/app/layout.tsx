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
    let animationFrameId: number | null = null;

    const animateScroll = () => {
      const currentScrollY = window.scrollY;
      const distance = targetScrollY - currentScrollY;
      const scrollStep = distance * 0.1;

      if (Math.abs(distance) > 1) {
        window.scrollTo(0, currentScrollY + scrollStep);
        animationFrameId = requestAnimationFrame(animateScroll);
      } else {
        window.scrollTo(0, targetScrollY);
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetScrollY += e.deltaY * 0.5;
      targetScrollY = Math.max(0, Math.min(targetScrollY, document.body.scrollHeight - window.innerHeight));
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(animateScroll);
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
          if (!animationFrameId) {
            animationFrameId = requestAnimationFrame(animateScroll);
          }
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('click', handleAnchorClick, true); // Use capture phase

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.fade-in');
    elements.forEach((el) => observer.observe(el));
    
    // La lógica del menú de hamburguesa ha sido eliminada de aquí y movida a Header.tsx

    return () => {
      window.removeEventListener('wheel', handleWheel);
      document.removeEventListener('click', handleAnchorClick, true);
      elements.forEach((el) => observer.unobserve(el));
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <html lang="es">
      <head>
        <title>Eduardo Téllez - Visualización de Datos & Música</title>
        <meta name="description" content="Portafolio de Eduardo Téllez, especialista en visualización de datos y músico." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className} data-theme="dark">
        <CustomCursor />
        <ThemeToggle />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
