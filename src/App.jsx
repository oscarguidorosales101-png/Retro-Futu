import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AnimatedBackground from './components/AnimatedBackground';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import Cotizador from './pages/Cotizador';
import Estadisticas from './pages/Estadisticas';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Footer from './components/Footer';
import { IconPause, IconPlay, IconX, IconDoorOut } from './components/Icons';

// Modal de confirmación de logout — Cyberpunk, sin window.confirm
const ModalLogout = ({ onConfirm, onCancel }) => (
  <div className="modal-overlay" onClick={onCancel}>
    <div className="modal-content modal-confirm" onClick={(e) => e.stopPropagation()}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <IconDoorOut size={52} color="var(--cyan-pulse)" />
      </div>
      <h2 style={{ textAlign: 'center', color: 'var(--text-main)', marginBottom: '0.5rem', fontSize: '1.4rem' }}>
        Cerrar sesión
      </h2>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>
        ¿Seguro que deseas salir del Panel Administrador?
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={onCancel}
          style={{ flex: 1, padding: '0.8rem', background: '#374151', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          className="btn-primary"
          style={{ flex: 1, padding: '0.8rem', background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}
        >
          Salir
        </button>
      </div>
    </div>
  </div>
);

function App() {
  const [authUser, setAuthUser] = useState(() => {
    const saved = localStorage.getItem('volt_session');
    return saved ? JSON.parse(saved) : null;
  });
  const [bgPaused, setBgPaused] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('volt_session');
    setAuthUser(null);
    setShowLogoutModal(false);
  };

  return (
    <Router>
      <div className="app-container">
        <AnimatedBackground isPaused={bgPaused} />

        {/* Botón accesibilidad - pausa el fondo */}
        <button
          onClick={() => setBgPaused(prev => !prev)}
          aria-label={bgPaused ? 'Reanudar fondo animado' : 'Pausar fondo animado (accesibilidad)'}
          title={bgPaused ? 'Reanudar animación' : 'Pausar animación'}
          style={{
            position: 'fixed',
            bottom: '25px',
            left: '25px',
            zIndex: 1002,
            background: bgPaused ? 'linear-gradient(135deg, #059669, #047857)' : 'rgba(17, 24, 39, 0.9)',
            border: bgPaused ? '2px solid #10b981' : '2px solid rgba(245, 158, 11, 0.6)',
            color: 'white',
            padding: '0.45rem 0.9rem',
            borderRadius: '30px',
            cursor: 'pointer',
            fontSize: '0.78rem',
            fontWeight: '700',
            backdropFilter: 'blur(10px)',
            boxShadow: bgPaused ? '0 0 14px rgba(16,185,129,0.5)' : '0 0 10px rgba(245,158,11,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            transition: 'all 0.3s ease',
          }}
        >
          {bgPaused ? <IconPlay size={14} color="white" /> : <IconPause size={14} color="white" />}
          {bgPaused ? 'Reanudar' : 'Pausar'}
        </button>

        <Navbar
          authUser={authUser}
          setAuthUser={setAuthUser}
          onLogoutRequest={() => setShowLogoutModal(true)}
        />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cotizar" element={<Cotizador />} />
            <Route path="/estadisticas" element={<Estadisticas />} />
            <Route path="/login" element={<Login setAuthUser={setAuthUser} />} />
            <Route
              path="/admin"
              element={authUser
                ? <Admin authUser={authUser} setAuthUser={setAuthUser} onLogoutRequest={() => setShowLogoutModal(true)} />
                : <Navigate to="/login" replace />}
            />
          </Routes>
        </main>

        {showLogoutModal && (
          <ModalLogout
            onConfirm={handleLogout}
            onCancel={() => setShowLogoutModal(false)}
          />
        )}

        <Chatbot />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
