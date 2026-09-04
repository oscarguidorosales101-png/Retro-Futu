import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconLock, IconLightning } from '../components/Icons';

const Login = ({ setAuthUser }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Intentar validar contra json-server
    try {
      const res = await fetch('http://localhost:3001/usuarios');
      const usuarios = await res.json();
      const found = usuarios.find((u) => u.usuario === user && u.contrasena === pass);
      if (found) {
        localStorage.setItem('volt_session', JSON.stringify(found));
        setAuthUser(found);
        navigate('/admin');
        return;
      }
    } catch {
      // Fallback: validar localmente si el server no está corriendo
      if (user === 'admin' && pass === 'retro123') {
        const demoUser = { usuario: 'admin', rol: 'tecnico_master' };
        localStorage.setItem('volt_session', JSON.stringify(demoUser));
        setAuthUser(demoUser);
        navigate('/admin');
        return;
      }
    }

    setError('Usuario o contraseña incorrectos.');
    setLoading(false);
  };

  return (
    <div className="page-container" style={{ maxWidth: '420px', marginTop: '4rem' }}>
      <div className="form-card" style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
          <IconLock size={48} color="var(--emerald-glow)" />
        </div>
        <h2 style={{ marginBottom: '0.5rem', color: 'var(--emerald-glow)' }}>Acceso Técnico</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.8rem', fontSize: '0.9rem' }}>
          Ingresa para administrar el laboratorio de mods
        </p>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="user">Usuario</label>
            <input
              id="user"
              type="text"
              placeholder="admin"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="pass">Contraseña</label>
            <input
              id="pass"
              type="password"
              placeholder="••••••••"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', marginTop: '0.5rem', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            disabled={loading}
          >
            <IconLightning size={18} color="white" />
            {loading ? 'Verificando...' : 'Entrar al Sistema'}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Demo: <strong style={{ color: 'var(--amber-light)' }}>admin</strong> / <strong style={{ color: 'var(--amber-light)' }}>retro123</strong>
        </p>
      </div>
    </div>
  );
};

export default Login;
