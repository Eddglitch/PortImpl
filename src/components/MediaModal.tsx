'use client';

import React, { useEffect, useRef } from 'react';

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaType: 'video' | 'image' | null;
  mediaSrc: string | null;
}

const MediaModal: React.FC<MediaModalProps> = ({ isOpen, onClose, mediaType, mediaSrc }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.classList.add('modal-open');
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal" style={{ display: isOpen ? 'flex' : 'none' }}>
      <div className="modal-content" ref={modalRef}>
        <button className="close-modal" onClick={onClose} aria-label="Cerrar modal">×</button>
        {mediaType === 'video' && mediaSrc && (
          <video controls autoPlay src={mediaSrc} style={{ width: '100%', height: 'auto', borderRadius: '10px' }} />
        )}
        {mediaType === 'image' && mediaSrc && (
          <img src={mediaSrc} alt="Modal Media" style={{ width: '100%', height: 'auto', borderRadius: '10px' }} />
        )}
      </div>
    </div>
  );
};

export default MediaModal;
