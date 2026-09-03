import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ authUser, setAuthUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuthUser(null);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">VOLT<span>GARAGE</span></Link>
      </div>
      <div className="nav-links">
        <Link to="/">Catálogo</Link>
        <Link to="/cotizar">Cotizador</Link>
        <Link to="/estadisticas">Métricas</Link>
        {authUser ? (
          <>
            <Link to="/admin">Panel Admin</Link>
            <button onClick={handleLogout} className="btn-logout">Salir</button>
          </>
        ) : (
          <Link to="/login" className="btn-login-link">Acceso Tech</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
