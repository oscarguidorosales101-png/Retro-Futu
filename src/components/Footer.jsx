import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      textAlign: 'center',
      padding: '2rem 1rem',
      marginTop: 'auto',
      borderTop: '1px solid var(--border-color)',
      color: 'var(--text-muted)',
      fontSize: '0.9rem',
      background: 'rgba(17, 24, 39, 0.4)',
      backdropFilter: 'blur(10px)',
    }}>
      <div style={{ marginBottom: '1rem' }}>
        <span style={{ color: 'var(--text-light)', fontWeight: 700, letterSpacing: '1px' }}>
          VOLT<span style={{ color: 'var(--amber-light)' }}>GARAGE</span>
        </span>
        {' '}— Modificando el pasado, construyendo el futuro.
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <a href="#" style={{ color: 'var(--emerald-glow)', textDecoration: 'none' }}>Términos y Condiciones</a>
        <a href="#" style={{ color: 'var(--emerald-glow)', textDecoration: 'none' }}>Política de Privacidad</a>
        <a href="#" style={{ color: 'var(--emerald-glow)', textDecoration: 'none' }}>Contacto</a>
      </div>
      <div>
        &copy; {new Date().getFullYear()} Retro-Futuristic Tech Garage. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
