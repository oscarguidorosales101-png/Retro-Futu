import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IconLogout, IconCog, IconDocument, IconUser } from './Icons';

const Navbar = ({ authUser, onLogoutRequest }) => {
  const location = useLocation();
  const isAdmin = !!authUser;

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to={isAdmin ? '/admin' : '/'}>VOLT<span>GARAGE</span></Link>
      </div>

      <div className="nav-links">
        {isAdmin ? (
          // Navegación exclusiva de Admin
          <>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Panel Administrador
            </span>
            <Link
              to="/admin"
              style={{ color: location.pathname === '/admin' ? 'var(--emerald-glow)' : undefined }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <IconDocument size={15} /> Cotizaciones
              </span>
            </Link>
            <button
              onClick={onLogoutRequest}
              className="btn-logout"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <IconLogout size={15} /> Salir
            </button>
          </>
        ) : (
          // Navegación pública de Cliente
          <>
            <Link to="/">Catálogo</Link>
            <Link to="/cotizar">Cotizador</Link>
            <Link to="/estadisticas">Métricas</Link>
            <Link to="/login" className="btn-login-link">Acceso Tech</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
