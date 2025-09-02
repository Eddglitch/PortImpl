import React from 'react';

const Contact: React.FC = () => {
  return (
    <section id="contacto" className="contact">
      <h2 className="section-title">Hablemos</h2>
      <div className="contact-content">
        <p>¿Tienes un proyecto interesante? Me encantaría saber cómo puedo ayudarte a transformar tus datos en insights visuales impactantes.</p>
        <div className="contact-links">
          <a href="mailto:eduardotelv@gmail.com" className="contact-link" id="email-link"><span>📧</span>Email</a>
          <a href="https://www.linkedin.com/feed/" className="contact-link" id="linkedin-link" target="_blank"><span>💼</span>LinkedIn</a>
          <a href="https://github.com/Eddglitch" className="contact-link" id="github-link" target="_blank"><span>💻</span>GitHub</a>
          <a href="https://wa.me/525545321487" className="contact-link" id="whatsapp-link" target="_blank"><span>📱</span>WhatsApp</a>
        </div>
      </div>
    </section>
  );
};

export default Contact;