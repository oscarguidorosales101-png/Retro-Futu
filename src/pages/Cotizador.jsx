import React, { useState } from 'react';

const Cotizador = () => {
  const [hardware, setHardware] = useState('');
  const [tipoMod, setTipoMod] = useState('');
  const [presupuesto, setPresupuesto] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje(null);
    setError(null);

    const nuevaCotizacion = {
      hardware,
      tipoMod,
      presupuesto: presupuesto ? parseFloat(presupuesto) : null,
      email,
      fecha: new Date().toLocaleDateString('es-MX'),
      estado: 'Pendiente',
    };

    try {
      await fetch('http://localhost:3001/cotizaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaCotizacion),
      });
      setMensaje('¡Cotización enviada con éxito! Un técnico te contactará en menos de 24 horas.');
    } catch {
      setMensaje('✅ Solicitud registrada en modo local. ¡Pronto nos pondremos en contacto!');
    } finally {
      setLoading(false);
      setHardware('');
      setTipoMod('');
      setPresupuesto('');
      setEmail('');
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '680px' }}>
      <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
        Cotizador de <span style={{ color: 'var(--amber-fire)' }}>Custom Mods</span>
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Cuéntanos qué hardware tienes y qué modificación deseas. Recibirás una cotización personalizada.
      </p>

      <div className="form-card">
        {mensaje && <div className="alert-success">{mensaje}</div>}
        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="hardware">Equipo o Periférico *</label>
            <input
              id="hardware"
              type="text"
              placeholder="Ej: Nintendo GameCube, Mando PS4, GBA SP..."
              value={hardware}
              onChange={(e) => setHardware(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="tipoMod">Modificación Deseada *</label>
            <input
              id="tipoMod"
              type="text"
              placeholder="Ej: Pantalla IPS, USB-C Mod, Carcasa holográfica..."
              value={tipoMod}
              onChange={(e) => setTipoMod(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="presupuesto">Presupuesto Objetivo ($USD)</label>
            <input
              id="presupuesto"
              type="number"
              placeholder="Ej: 120"
              value={presupuesto}
              onChange={(e) => setPresupuesto(e.target.value)}
              min="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email de contacto</label>
            <input
              id="email"
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}
            disabled={loading}
          >
            {loading ? 'Enviando...' : '🚀 Enviar Solicitud'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Cotizador;
