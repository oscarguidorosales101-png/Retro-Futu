import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const FALLBACK_MODS = [
  { id: '1', hardware: 'Game Boy Color', categoria: 'Consola Portátil', tipoMod: 'Carcasa Transparente Amber + Pantalla IPS V3', precioEstimado: 135, tiempoDias: 3 },
  { id: '2', hardware: 'Control PS5 DualSense', categoria: 'Mandos', tipoMod: 'Back Paddles Programables + Joysticks Hall Effect', precioEstimado: 85, tiempoDias: 2 },
  { id: '3', hardware: 'Nintendo Switch OLED', categoria: 'Consola Portátil', tipoMod: 'Carcasa Holográfica Emerald + Botones Aluminio', precioEstimado: 160, tiempoDias: 4 },
  { id: '4', hardware: 'Custom Mechanical Keyboard 75%', categoria: 'Teclados Mecánicos', tipoMod: 'Placa de Latón + Switches Lubricados Lube/Film', precioEstimado: 190, tiempoDias: 5 },
  { id: '5', hardware: 'Game Boy Advance SP', categoria: 'Consola Portátil', tipoMod: 'Pantalla IPS + USB-C Mod', precioEstimado: 110, tiempoDias: 3 },
  { id: '6', hardware: 'Control Xbox Elite', categoria: 'Mandos', tipoMod: 'Grips Custom + Pintura Cyberpunk', precioEstimado: 95, tiempoDias: 3 },
];

const Home = () => {
  const [mods, setMods] = useState([]);
  const [filtroCat, setFiltroCat] = useState('Todos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/modificaciones')
      .then((res) => res.json())
      .then((data) => { setMods(data); setLoading(false); })
      .catch(() => { setMods(FALLBACK_MODS); setLoading(false); });
  }, []);

  const categorias = ['Todos', ...new Set(mods.map((m) => m.categoria))];
  const modsFiltrados = filtroCat === 'Todos' ? mods : mods.filter((m) => m.categoria === filtroCat);

  return (
    <div className="page-container">
      {/* Hero */}
      <section className="hero">
        <h1>CUSTOM HARDWARE <span>LAB & MODS</span></h1>
        <p>
          Potencia tus consolas, controles y teclados con carcasas de precisión,
          pantallas de alto refresco y electrónica de última generación.
        </p>
        <div className="hero-btns">
          <Link to="/cotizar" className="btn-primary">Cotizar Proyecto</Link>
          <Link to="/estadisticas" className="btn-secondary">Ver Métricas</Link>
        </div>
      </section>

      {/* Stats rápidas */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-number">{mods.length}+</div>
          <div className="stat-label">Mods disponibles</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">6m</div>
          <div className="stat-label">Garantía en trabajos</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">48h</div>
          <div className="stat-label">Entrega express</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">100%</div>
          <div className="stat-label">Clientes satisfechos</div>
        </div>
      </div>

      {/* Filtros */}
      <div style={{ marginTop: '3rem' }}>
        <h2 style={{ marginBottom: '1.2rem', fontSize: '1.5rem', color: 'var(--amber-light)' }}>
          Catálogo de Modificaciones
        </h2>
        <div className="filter-bar">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setFiltroCat(cat)}
              className={`filter-btn ${filtroCat === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="loading-text">Cargando módulos de hardware...</p>
      ) : (
        <div className="grid-cards">
          {modsFiltrados.map((mod) => (
            <div key={mod.id} className="card-mod">
              <span className="badge-cat">{mod.categoria}</span>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.05rem' }}>{mod.hardware}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.2rem', lineHeight: '1.5' }}>
                {mod.tipoMod}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--amber-light)' }}>
                  ${mod.precioEstimado} USD
                </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--emerald-glow)' }}>
                  ⏱ {mod.tiempoDias} días
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
