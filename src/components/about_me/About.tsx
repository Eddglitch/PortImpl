import React, { useEffect, useState, Suspense } from 'react';

// Lazy load showcases
const PythonShowcase = React.lazy(() => import('./cards_about/PythonShowcase'));
const TableauShowcase = React.lazy(() => import('./cards_about/TableauShowcase'));
const PowerBIShowcase = React.lazy(() => import('./cards_about/PowerBIShowcase'));
const D3jsShowcase = React.lazy(() => import('./cards_about/D3jsShowcase'));
const ExcelShowcase = React.lazy(() => import('./cards_about/ExcelShowcase'));
const FigmaShowcase = React.lazy(() => import('./cards_about/FigmaShowcase'));

// CSS Module import is removed

const About: React.FC = () => {
  const [activeShowcase, setActiveShowcase] = useState<string | null>(null);

  // This useEffect is kept as it controls body scroll during modal view
  useEffect(() => {
    if (activeShowcase) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeShowcase]);

  const renderShowcase = () => {
    switch (activeShowcase) {
      case 'python':
        return <PythonShowcase onClose={() => setActiveShowcase(null)} />;
      case 'tableau':
        return <TableauShowcase onClose={() => setActiveShowcase(null)} />;
      case 'powerbi':
        return <PowerBIShowcase onClose={() => setActiveShowcase(null)} />;
      case 'd3':
        return <D3jsShowcase onClose={() => setActiveShowcase(null)} />;
      case 'excel':
        return <ExcelShowcase onClose={() => setActiveShowcase(null)} />;
      case 'figma':
        return <FigmaShowcase onClose={() => setActiveShowcase(null)} />;
      default:
        return null;
    }
  };

  return (
    <>
      <section id="sobre-mi" className="about-section">
        <h2 className="section-title">Sobre Mí</h2>
        <div className="about-content">
          <div className="about-text">
            <p>Soy un apasionado creador de contenido gráfico especializado en análisis de datos, con más de 5 años de experiencia transformando información compleja en visualizaciones claras y atractivas.</p>
            <p>Mi enfoque combina principios de diseño sólidos con conocimiento técnico profundo, permitiéndome crear no solo gráficos hermosos, sino también funcionalmente efectivos.</p>
            <p>Trabajo con empresas de todos los tamaños, ayudándoles a comunicar sus datos de manera que generen impacto y faciliten la toma de decisiones estratégicas.</p>
          </div>
          <div className="skills-grid">
            <div className="skill-item" onClick={() => setActiveShowcase('tableau')}><div>📊</div><div>Tableau</div></div>
            <div className="skill-item" onClick={() => setActiveShowcase('python')}>
              <div>🐍</div>
              <div>Python</div>
            </div>
            <div className="skill-item" onClick={() => setActiveShowcase('powerbi')}><div>📈</div><div>Power BI</div></div>
            <div className="skill-item" onClick={() => setActiveShowcase('d3')}><div>🎨</div><div>D3.js</div></div>
            <div className="skill-item" onClick={() => setActiveShowcase('excel')}><div>📋</div><div>Excel</div></div>
            <div className="skill-item" onClick={() => setActiveShowcase('figma')}><div>🎯</div><div>Figma</div></div>
          </div>
        </div>
      </section>
      {activeShowcase && (
        <div className="showcase-overlay">
          <Suspense fallback={<div style={{ color: 'white', fontSize: '2rem' }}>Cargando...</div>}>
            {renderShowcase()}
          </Suspense>
        </div>
      )}
    </>
  );
};

export default About;