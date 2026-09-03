import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AnimatedBackground from './components/AnimatedBackground';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import Cotizador from './pages/Cotizador';
import Estadisticas from './pages/Estadisticas';
import Admin from './pages/Admin';
import Login from './pages/Login';

function App() {
  const [authUser, setAuthUser] = useState(null);
  const [bgPaused, setBgPaused] = useState(false);

  return (
    <Router>
      <div className="app-container">
        <AnimatedBackground isPaused={bgPaused} />

        {/* Botón accesibilidad - pausa el fondo (para personas con fotosensibilidad) */}
        <button
          onClick={() => setBgPaused(prev => !prev)}
          aria-label={bgPaused ? 'Reanudar fondo animado' : 'Pausar fondo animado (accesibilidad)'}
          title={bgPaused ? 'Reanudar animación' : 'Pausar animación (recomendado para fotosensibles)'}
          style={{
            position: 'fixed',
            bottom: '95px',
            right: '25px',
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
          <span>{bgPaused ? '▶' : '⏸'}</span>
          {bgPaused ? 'Reanudar' : 'Pausar'}
        </button>

        <Navbar authUser={authUser} setAuthUser={setAuthUser} />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cotizar" element={<Cotizador />} />
            <Route path="/estadisticas" element={<Estadisticas />} />
            <Route path="/login" element={<Login setAuthUser={setAuthUser} />} />
            <Route
              path="/admin"
              element={authUser ? <Admin authUser={authUser} /> : <Navigate to="/login" replace />}
            />
          </Routes>
        </main>

        <Chatbot />
      </div>
    </Router>
  );
}

export default App;
