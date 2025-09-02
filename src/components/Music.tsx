import React from 'react';

interface MusicProps {
  openModal: (type: 'video' | 'image', src: string) => void;
}

const Music: React.FC<MusicProps> = ({ openModal }) => {
  return (
    <section id="trayectoria-musical" className="fade-in">
      <div className="video-container">
        {/* ... (contenido existente de video-container) ... */}
      </div>
      <div className="music-intro">
        <p>Además de la visualización de datos, la música ha sido una parte fundamental de mi vida. Como bajista, he explorado diferentes géneros y he tenido la oportunidad de formar parte de proyectos que han enriquecido mi creatividad.</p>
      </div>

      <div className="bands-grid">
        <div className="band-card">
          <h3 className="band-name">Sahkil</h3>
          <p className="band-role">🎸 Bajista</p>
          <p className="band-description">Proyecto musical actual donde exploro sonidos contemporáneos y experimentales. Sahkil representa mi evolución como músico.</p>
          <div className="band-media">
            <div className="media-placeholder" onClick={() => openModal('video', `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/sahkil-video.mp4`)}>🎥 Video</div>
            <div className="media-placeholder" onClick={() => openModal('image', `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/sahkil-fotos.jpg`)}>📸 Fotos</div>
          </div>
          <div className="band-links">
            <a href="https://open.spotify.com/intl-es/artist/5x5SPiyrPuoNo3kNRAmnu7?si=oDgc8UzQShqUoeWBDpwxkA" className="band-link" target="_blank">🎵 Spotify</a>

            <div className="social-media-group">
              <a href="#" className="band-link social-media-toggle">📱 Redes Sociales</a>
              <div className="social-media-dropdown">
                <a href="https://www.facebook.com/sahkilmexico" target="_blank" className="social-media-item"><span>Facebook</span></a>
                <a href="https://instagram.com/sahkilband" target="_blank" className="social-media-item"><span>Instagram</span></a>
                <a href="https://twitter.com/sahkilband" target="_blank" className="social-media-item"><span>Twitter/X</span></a>
              </div>
            </div>
          </div>
        </div>

        <div className="band-card">
          <h3 className="band-name">Soulfers</h3>
          <p className="band-role">🎸 Bajista</p>
          <p className="band-description">Banda con la que exploré los géneros del soul, funk y R&B. Una experiencia que me enseñó la importancia del groove.</p>
          <div className="band-media">
            <div className="media-placeholder" onClick={() => openModal('video', `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/soulfers-video.mp4`)}>🎥 Video</div>
            <div className="media-placeholder" onClick={() => openModal('image', `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/soulfers-fotos.jpg`)}>📸 Fotos</div>
          </div>
          <div className="band-links">
            <a href="#" className="band-link">🎵 Música</a>

            <div className="social-media-group">
              <a href="#" className="band-link social-media-toggle">📱 Redes Sociales</a>
              <div className="social-media-dropdown">
                <a href="https://www.facebook.com/96soulfers" target="_blank" className="social-media-item"><span>Facebook</span></a>
                <a href="https://instagram.com/soulfersband" target="_blank" className="social-media-item"><span>Instagram</span></a>
                <a href="https://twitter.com/soulfersband" target="_blank" className="social-media-item"><span>Twitter/X</span></a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="spotify-section">
        <h3 className="spotify-title">🎵 Escucha Sahkil en Spotify</h3>
        <div className="spotify-player">
          <iframe style={{ borderRadius: '12px' }} src="https://open.spotify.com/embed/artist/5x5SPiyrPuoNo3kNRAmnu7?utm_source=generator" width="100%" height="352" frameBorder="0" allowFullScreen={true} allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
        </div>
      </div>
    </section>
  );
};

export default Music;