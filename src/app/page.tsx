'use client';
import React, { useState } from 'react';
import Hero from '../components/Hero';
import About from '../components/about_me/About';
import Projects from '../components/Projects';
import Interests from '../components/Interests';
import Music from '../components/Music';
import Contact from '../components/Contact';
import MediaModal from '../components/MediaModal';

export default function Home() {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mediaType: 'video' | 'image' | null;
    mediaSrc: string | null;
  }>({
    isOpen: false,
    mediaType: null,
    mediaSrc: null,
  });

  const openModal = (type: 'video' | 'image', src: string) => {
    setModalState({
      isOpen: true,
      mediaType: type,
      mediaSrc: src,
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      mediaType: null,
      mediaSrc: null,
    });
  };

  return (
    <>
      <Hero />
      <About />
      <Projects openModal={openModal} />
      <Interests />
      <Music openModal={openModal} />
      <Contact />
      <MediaModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        mediaType={modalState.mediaType}
        mediaSrc={modalState.mediaSrc}
      />
    </>
  );
}