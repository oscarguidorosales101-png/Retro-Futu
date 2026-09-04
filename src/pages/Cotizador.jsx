import React, { useState, useMemo } from 'react';
import { IconSend, IconCheck } from '../components/Icons';

// Contador de solicitud persistente en localStorage
const getNextSolicitudId = () => {
  const current = parseInt(localStorage.getItem('volt_solicitud_counter') || '0', 10);
  const next = current + 1;
  localStorage.setItem('volt_solicitud_counter', String(next));
  const year = new Date().getFullYear();
  return `VG-${year}-${String(next).padStart(4, '0')}`;
};

// Catálogo de personalizaciones por equipo
const MODS_CATALOG = {
  'Game Boy Advance': [
    { id: 'gba-1', nombre: 'Pantalla IPS', desc: 'Panel retroiluminado de alta luminancia.', precio: 85, tiempo: 1 },
    { id: 'gba-2', nombre: 'Carcasa personalizada', desc: 'Carcasa completa custom a elección de color.', precio: 35, tiempo: 1 },
    { id: 'gba-3', nombre: 'Botones personalizados', desc: 'D-pad y botones A/B en colores alternativos.', precio: 15, tiempo: 0 },
    { id: 'gba-4', nombre: 'Batería recargable', desc: 'Sustituye las pilas AA por celda Li-ion.', precio: 40, tiempo: 1 },
    { id: 'gba-5', nombre: 'Puerto USB-C', desc: 'Carga moderna vía USB-C.', precio: 45, tiempo: 1 },
    { id: 'gba-6', nombre: 'Amplificador de audio', desc: 'Altavoz y amplificador de alta fidelidad.', precio: 45, tiempo: 1 },
    { id: 'gba-7', nombre: 'LED de botones', desc: 'Iluminación LED bajo los botones de acción.', precio: 30, tiempo: 1 },
    { id: 'gba-8', nombre: 'Paquete completo', desc: 'IPS + USB-C + Batería + Carcasa + Audio.', precio: 260, tiempo: 4 },
  ],
  'Game Boy Color': [
    { id: 'gbc-1', nombre: 'Pantalla IPS', desc: 'Panel IPS retroiluminado V3.', precio: 75, tiempo: 1 },
    { id: 'gbc-2', nombre: 'Carcasa transparente', desc: 'Shell clear amber o smoke.', precio: 30, tiempo: 1 },
    { id: 'gbc-3', nombre: 'Carcasa personalizada', desc: 'Impresión o pintura custom.', precio: 45, tiempo: 2 },
    { id: 'gbc-4', nombre: 'Botones de resina', desc: 'Botones artesanales o colores custom.', precio: 20, tiempo: 0 },
    { id: 'gbc-5', nombre: 'Batería USB-C', desc: 'Celda interna con carga USB-C.', precio: 45, tiempo: 1 },
    { id: 'gbc-6', nombre: 'ProSound Mod', desc: 'Modificación de audio + nuevo altavoz.', precio: 35, tiempo: 1 },
    { id: 'gbc-7', nombre: 'Paquete completo', desc: 'IPS + USB-C + Carcasa + Audio.', precio: 280, tiempo: 5 },
  ],
  'PSP': [
    { id: 'psp-1', nombre: 'Pantalla IPS', desc: 'Panel de mayor brillo y color.', precio: 60, tiempo: 1 },
    { id: 'psp-2', nombre: 'Batería extendida', desc: 'Batería de mayor capacidad tipo Extended.', precio: 45, tiempo: 1 },
    { id: 'psp-3', nombre: 'Carcasa personalizada', desc: 'Reemplazo completo de carcasa.', precio: 40, tiempo: 2 },
    { id: 'psp-4', nombre: 'USB-C', desc: 'Carga por USB-C moderno.', precio: 35, tiempo: 1 },
    { id: 'psp-5', nombre: 'Adaptador MicroSD', desc: 'Hasta 128GB de almacenamiento.', precio: 20, tiempo: 0 },
    { id: 'psp-6', nombre: 'Paquete completo', desc: 'Pantalla + Batería + Carcasa + USB-C.', precio: 220, tiempo: 4 },
  ],
  'PS Vita': [
    { id: 'vita-1', nombre: 'Reemplazo de pantalla', desc: 'OLED o LCD de repuesto.', precio: 80, tiempo: 2 },
    { id: 'vita-2', nombre: 'Carcasa personalizada', desc: 'Shell nueva o custom.', precio: 50, tiempo: 2 },
    { id: 'vita-3', nombre: 'Joysticks', desc: 'Reemplazo de joysticks con drift.', precio: 30, tiempo: 1 },
    { id: 'vita-4', nombre: 'SD2Vita', desc: 'Adaptador microSD hasta 256GB.', precio: 45, tiempo: 0 },
    { id: 'vita-5', nombre: 'USB-C (modelo 1000)', desc: 'Puerto de carga moderno para el modelo OLED.', precio: 45, tiempo: 1 },
    { id: 'vita-6', nombre: 'Paquete completo', desc: 'Pantalla + Carcasa + SD2Vita + Joysticks.', precio: 260, tiempo: 4 },
  ],
  'Steam Deck': [
    { id: 'sd-1', nombre: 'SSD 1TB/2TB NVMe', desc: 'Upgrade de almacenamiento de alta velocidad.', precio: 150, tiempo: 1 },
    { id: 'sd-2', nombre: 'Carcasa transparente', desc: 'Shell JSAUX u otras marcas premium.', precio: 65, tiempo: 3 },
    { id: 'sd-3', nombre: 'Joysticks Hall Effect', desc: 'Módulos electromagnéticos anti-drift.', precio: 75, tiempo: 1 },
    { id: 'sd-4', nombre: 'Thermal Mod PTM7950', desc: 'Pasta térmica avanzada + pads de cobre.', precio: 45, tiempo: 1 },
    { id: 'sd-5', nombre: 'Back Buttons custom', desc: 'Botones traseros reprogramables.', precio: 35, tiempo: 1 },
    { id: 'sd-6', nombre: 'Paquete completo', desc: 'SSD + Carcasa + Joysticks + Thermal Mod.', precio: 350, tiempo: 6 },
  ],
  'PlayStation 5 DualSense': [
    { id: 'ps5-1', nombre: 'Custom Shell', desc: 'Carcasa personalizada o con diseño.', precio: 45, tiempo: 2 },
    { id: 'ps5-2', nombre: 'Joysticks Hall Effect', desc: 'Módulos electromagnéticos anti-drift.', precio: 60, tiempo: 2 },
    { id: 'ps5-3', nombre: 'Back Paddles', desc: 'Botones traseros programables (2 o 4).', precio: 75, tiempo: 2 },
    { id: 'ps5-4', nombre: 'Hair Triggers', desc: 'Gatillos de recorrido reducido.', precio: 35, tiempo: 1 },
    { id: 'ps5-5', nombre: 'LED RGB personalizado', desc: 'Iluminación RGB bajo joysticks y botones.', precio: 45, tiempo: 1 },
    { id: 'ps5-6', nombre: 'Pintura aerografiada', desc: 'Diseño único pintado a mano.', precio: 90, tiempo: 4 },
    { id: 'ps5-7', nombre: 'Paquete Pro-Gaming', desc: 'Joysticks + Paddles + Triggers + Shell.', precio: 220, tiempo: 5 },
  ],
  'DualShock 4': [
    { id: 'ds4-1', nombre: 'Custom Shell', desc: 'Carcasa de colores o diseño personalizado.', precio: 40, tiempo: 2 },
    { id: 'ds4-2', nombre: 'Joysticks KontrolFreek', desc: 'Extensores de joystick para mayor precisión.', precio: 25, tiempo: 0 },
    { id: 'ds4-3', nombre: 'Joysticks Hall Effect', desc: 'Módulos anti-drift electromagnéticos.', precio: 50, tiempo: 2 },
    { id: 'ds4-4', nombre: 'Botones custom', desc: 'Botones de colores alternativos.', precio: 20, tiempo: 1 },
  ],
  'Xbox Series Controller': [
    { id: 'xbs-1', nombre: 'Grip custom texturizado', desc: 'Grip de agarre anti-deslizante premium.', precio: 35, tiempo: 1 },
    { id: 'xbs-2', nombre: 'Hair Triggers', desc: 'Reducción del recorrido de los gatillos.', precio: 40, tiempo: 1 },
    { id: 'xbs-3', nombre: 'Joysticks Hall Effect', desc: 'Anti-drift electromagnético.', precio: 55, tiempo: 2 },
    { id: 'xbs-4', nombre: 'Pintura cyberpunk', desc: 'Diseño aerografiado personalizado.', precio: 75, tiempo: 3 },
  ],
  'Nintendo Joy-Con': [
    { id: 'jc-1', nombre: 'Reparación drift', desc: 'Reemplazo del módulo analógico dañado.', precio: 30, tiempo: 1 },
    { id: 'jc-2', nombre: 'Carcasa transparente', desc: 'Shell claro con D-pad opcional.', precio: 25, tiempo: 1 },
    { id: 'jc-3', nombre: 'Joysticks Hall Effect', desc: 'Módulos electromagnéticos definitivos.', precio: 40, tiempo: 1 },
  ],
  'Teclado Mecánico 60%': [
    { id: 'kb60-1', nombre: 'Lubricación de switches', desc: 'Lube manual switch por switch.', precio: 65, tiempo: 2 },
    { id: 'kb60-2', nombre: 'Keycaps PBT', desc: 'Set de keycaps doble-shot duradera.', precio: 60, tiempo: 0 },
    { id: 'kb60-3', nombre: 'Foam Mod acústico', desc: 'PE o EVA foam para sonido sólido.', precio: 25, tiempo: 1 },
    { id: 'kb60-4', nombre: 'Estabilizadores Mod', desc: 'Holy Mod + Band-aid en stabs.', precio: 30, tiempo: 1 },
    { id: 'kb60-5', nombre: 'Build completa', desc: 'Armado, lube, foam, stabs y keycaps.', precio: 125, tiempo: 3 },
  ],
  'Teclado Mecánico 75%': [
    { id: 'kb75-1', nombre: 'Lubricación de switches', desc: 'Lube + film manual switch por switch.', precio: 80, tiempo: 3 },
    { id: 'kb75-2', nombre: 'Placa de latón', desc: 'Mayor masa y resonancia controlada.', precio: 90, tiempo: 2 },
    { id: 'kb75-3', nombre: 'Foam + Tape Mod', desc: 'Modificación acústica completa.', precio: 45, tiempo: 2 },
    { id: 'kb75-4', nombre: 'Estabilizadores premium', desc: 'Holy Mod + Band-aid + lube thick.', precio: 35, tiempo: 1 },
    { id: 'kb75-5', nombre: 'Build completa', desc: 'Placa + switches + foam + keycaps PBT.', precio: 190, tiempo: 5 },
  ],
  'Arcade Stick': [
    { id: 'arc-1', nombre: 'Joystick Sanwa JLF', desc: 'Palanca de alta precisión Sanwa Denshi.', precio: 50, tiempo: 1 },
    { id: 'arc-2', nombre: 'Botones Sanwa OBSF-30', desc: '8 botones premium Sanwa Denshi.', precio: 60, tiempo: 1 },
    { id: 'arc-3', nombre: 'Artwork + Plexi', desc: 'Arte personalizado con cubierta plexi.', precio: 55, tiempo: 3 },
    { id: 'arc-4', nombre: 'LED RGB', desc: 'Iluminación RGB en botones.', precio: 65, tiempo: 2 },
    { id: 'arc-5', nombre: 'Full Custom + PCB Brooks', desc: 'Renovación total con placa multi-plataforma.', precio: 400, tiempo: 7 },
  ],
};

const DEFAULT_OPTIONS = [
  { id: 'def-1', nombre: 'Diagnóstico y reparación general', desc: 'Evaluación completa y arreglo de fallas básicas.', precio: 40, tiempo: 2 },
  { id: 'def-2', nombre: 'Limpieza profunda', desc: 'Desmontaje, limpieza interior y exterior.', precio: 25, tiempo: 1 },
  { id: 'def-3', nombre: 'Personalización estética', desc: 'Modificaciones visuales según el equipo.', precio: 35, tiempo: 2 },
];

const Cotizador = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [equipo, setEquipo] = useState('');
  const [presupuesto, setPresupuesto] = useState('');
  const [detalles, setDetalles] = useState('');
  const [preferenciaContacto, setPreferenciaContacto] = useState('Email');
  const [selectedMods, setSelectedMods] = useState([]);
  const [enviado, setEnviado] = useState(false);
  const [reqId, setReqId] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const currentOptions = MODS_CATALOG[equipo] || (equipo ? DEFAULT_OPTIONS : []);

  const handleEquipoChange = (e) => {
    setEquipo(e.target.value);
    setSelectedMods([]);
  };

  const handleModToggle = (modId) => {
    setSelectedMods(prev =>
      prev.includes(modId) ? prev.filter(id => id !== modId) : [...prev, modId]
    );
  };

  const { precioEstimado, tiempoEstimado } = useMemo(() => {
    let price = 0;
    let time = 0;
    selectedMods.forEach(id => {
      const mod = currentOptions.find(o => o.id === id);
      if (mod) { price += mod.precio; time += mod.tiempo; }
    });
    return { precioEstimado: price, tiempoEstimado: time || 1 };
  }, [selectedMods, currentOptions]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!equipo) { setErrorMsg('Selecciona un equipo o periférico.'); return; }
    if (selectedMods.length === 0 && !detalles) {
      setErrorMsg('Selecciona al menos una modificación o describe tu proyecto en el campo de detalles.');
      return;
    }
    setLoading(true);
    setErrorMsg('');

    const numeroSolicitud = getNextSolicitudId();
    const modsObj = selectedMods.map(id => currentOptions.find(o => o.id === id));
    const categoriaMod = modsObj[0] ? 'Personalización' : 'Consulta';

    const nuevaCotizacion = {
      id: numeroSolicitud,
      numeroSolicitud,
      nombre,
      email,
      equipo,
      categoria: modsObj.length > 0 ? 'Personalización' : categoriaMod,
      modificacion: modsObj.map(m => m.nombre).join(', ') || 'Consulta general',
      personalizaciones: modsObj,
      presupuesto: presupuesto ? parseFloat(presupuesto) : null,
      precioEstimado,
      tiempoEstimado,
      detalles,
      preferenciaContacto,
      fecha: new Date().toISOString(),
      estado: 'Pendiente',
    };

    // Guardar siempre en localStorage (fallback garantizado)
    try {
      const local = JSON.parse(localStorage.getItem('volt_cotizaciones') || '[]');
      local.unshift(nuevaCotizacion);
      localStorage.setItem('volt_cotizaciones', JSON.stringify(local));
    } catch (err) {
      console.error('Error guardando en localStorage:', err);
    }

    // Intentar también guardar en json-server (silencioso si falla)
    try {
      await fetch('http://localhost:3001/cotizaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaCotizacion),
      });
    } catch {
      // Silencioso — ya está guardado en localStorage
    }

    setReqId(numeroSolicitud);
    setEnviado(true);
    setLoading(false);

    // Resetear formulario
    setNombre('');
    setEmail('');
    setEquipo('');
    setPresupuesto('');
    setDetalles('');
    setSelectedMods([]);
  };

  if (enviado) {
    return (
      <div className="page-container" style={{ maxWidth: '600px', textAlign: 'center' }}>
        <div style={{ padding: '3rem 2rem', background: 'var(--bg-card)', border: '1px solid var(--emerald-glow)', borderRadius: '16px', boxShadow: '0 0 30px rgba(16,185,129,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', border: '2px solid var(--emerald-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(16,185,129,0.4)' }}>
              <IconCheck size={36} color="var(--emerald-glow)" />
            </div>
          </div>
          <h2 style={{ color: 'var(--emerald-glow)', marginBottom: '0.5rem' }}>Solicitud enviada correctamente</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Tu proyecto fue recibido por VOLTGARAGE.
          </p>
          <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid var(--amber-fire)', borderRadius: '8px', padding: '1rem', marginBottom: '2rem' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Número de solicitud</p>
            <p style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--amber-light)', letterSpacing: '2px' }}>{reqId}</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Estado inicial: <strong style={{ color: 'var(--amber-light)' }}>Pendiente</strong>
            </p>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Un técnico revisará tu proyecto y se pondrá en contacto contigo via <strong>{preferenciaContacto}</strong>.
          </p>
          <button className="btn-primary" onClick={() => setEnviado(false)} style={{ width: '100%' }}>
            Enviar otra solicitud
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: '820px' }}>
      <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
        Cotizador de <span style={{ color: 'var(--amber-fire)' }}>Custom Mods</span>
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Selecciona tu equipo y las modificaciones. Calculamos una estimación en tiempo real.
      </p>

      {errorMsg && <div className="alert-error" style={{ marginBottom: '1.5rem' }}>{errorMsg}</div>}

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          {/* Datos del cliente */}
          <h3 style={{ color: 'var(--amber-light)', marginBottom: '1rem' }}>Datos del cliente</h3>
          <div className="grid-form" style={{ marginTop: 0 }}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre completo *</label>
              <input id="nombre" type="text" placeholder="Tu nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email de contacto *</label>
              <input id="email" type="email" placeholder="tu@correo.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
          </div>

          {/* Selección de equipo */}
          <h3 style={{ color: 'var(--amber-light)', margin: '1.5rem 0 1rem' }}>Equipo o periférico</h3>
          <div className="grid-form" style={{ marginTop: 0 }}>
            <div className="form-group">
              <label htmlFor="equipo">Selecciona el hardware *</label>
              <select id="equipo" value={equipo} onChange={handleEquipoChange} required>
                <option value="">-- Selecciona un equipo --</option>
                <optgroup label="Consolas Portátiles">
                  <option value="Game Boy Advance">Game Boy Advance</option>
                  <option value="Game Boy Color">Game Boy Color</option>
                  <option value="Nintendo DS Lite">Nintendo DS Lite</option>
                  <option value="Nintendo 3DS">Nintendo 3DS</option>
                  <option value="PSP">PSP</option>
                  <option value="PS Vita">PS Vita</option>
                  <option value="Nintendo Switch Lite">Nintendo Switch Lite</option>
                  <option value="Steam Deck">Steam Deck</option>
                  <option value="Analogue Pocket">Analogue Pocket</option>
                </optgroup>
                <optgroup label="Mandos / Controles">
                  <option value="PlayStation 5 DualSense">PlayStation 5 DualSense</option>
                  <option value="DualShock 4">DualShock 4</option>
                  <option value="Xbox Series Controller">Xbox Series Controller</option>
                  <option value="Xbox One Controller">Xbox One Controller</option>
                  <option value="Nintendo Switch Pro Controller">Nintendo Switch Pro Controller</option>
                  <option value="Nintendo Joy-Con">Nintendo Joy-Con</option>
                </optgroup>
                <optgroup label="Teclados Mecánicos">
                  <option value="Teclado Mecánico 60%">Teclado Mecánico 60%</option>
                  <option value="Teclado Mecánico 65%">Teclado Mecánico 65%</option>
                  <option value="Teclado Mecánico 75%">Teclado Mecánico 75%</option>
                  <option value="Teclado Mecánico TKL">Teclado Mecánico TKL</option>
                  <option value="Custom Keyboard Build">Custom Keyboard Build</option>
                </optgroup>
                <optgroup label="Arcade">
                  <option value="Arcade Stick">Arcade Stick</option>
                </optgroup>
                <optgroup label="Otros">
                  <option value="Gaming Mouse">Gaming Mouse</option>
                  <option value="Custom Controller">Custom Controller</option>
                  <option value="Otro periférico">Otro periférico</option>
                </optgroup>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="pref">Preferencia de contacto</label>
              <select id="pref" value={preferenciaContacto} onChange={e => setPreferenciaContacto(e.target.value)}>
                <option value="Email">Email</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Telegram">Telegram</option>
              </select>
            </div>
          </div>

          {/* Personalizaciones dinámicas */}
          {equipo && (
            <div style={{ marginTop: '2rem', marginBottom: '1rem' }}>
              <h3 style={{ color: 'var(--emerald-glow)', marginBottom: '0.5rem' }}>
                Personalizaciones disponibles para {equipo}
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Selecciona las modificaciones que deseas. Puedes elegir varias.
              </p>
              <div className="mods-grid">
                {currentOptions.map(mod => (
                  <label key={mod.id} className={`mod-checkbox-label ${selectedMods.includes(mod.id) ? 'selected' : ''}`}>
                    <input
                      type="checkbox"
                      checked={selectedMods.includes(mod.id)}
                      onChange={() => handleModToggle(mod.id)}
                    />
                    <div className="mod-details">
                      <span className="mod-name">{mod.nombre}</span>
                      <span className="mod-desc">{mod.desc}</span>
                      <span className="mod-meta">${mod.precio} USD · +{mod.tiempo > 0 ? `${mod.tiempo} día${mod.tiempo !== 1 ? 's' : ''}` : 'sin tiempo extra'}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Detalles y presupuesto */}
          <div className="form-group" style={{ marginTop: '1.5rem' }}>
            <label htmlFor="detalles">Descripción adicional del proyecto</label>
            <textarea
              id="detalles"
              rows="4"
              placeholder="Describe qué quieres lograr, colores preferidos, materiales, condición actual del equipo, etc."
              value={detalles}
              onChange={e => setDetalles(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', background: '#0b0f19', border: '1px solid #1f2937', color: 'white', borderRadius: '8px', resize: 'vertical', fontFamily: 'inherit', fontSize: '0.95rem' }}
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="presupuesto">Presupuesto objetivo en USD (opcional)</label>
            <input id="presupuesto" type="number" placeholder="Ej: 200" value={presupuesto} onChange={e => setPresupuesto(e.target.value)} min="0" />
          </div>

          {/* Resumen */}
          {equipo && (selectedMods.length > 0 || detalles) && (
            <div className="quote-summary">
              <h3>Resumen del proyecto</h3>
              <p><strong>Cliente:</strong> {nombre || '—'}</p>
              <p><strong>Equipo:</strong> {equipo}</p>
              {selectedMods.length > 0 && (
                <>
                  <p><strong>Modificaciones seleccionadas:</strong></p>
                  <ul>
                    {selectedMods.map(id => {
                      const m = currentOptions.find(o => o.id === id);
                      return <li key={id}>{m?.nombre}</li>;
                    })}
                  </ul>
                </>
              )}
              {presupuesto && <p><strong>Presupuesto objetivo:</strong> ${presupuesto} USD</p>}
              <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(245,158,11,0.3)' }}>
                <p style={{ fontSize: '1.2rem' }}>
                  <strong>Estimación base: <span style={{ color: 'var(--emerald-glow)' }}>${precioEstimado} USD</span></strong>
                </p>
                <p>Tiempo estimado: <strong>{tiempoEstimado} día{tiempoEstimado !== 1 ? 's' : ''}</strong></p>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  * El precio y tiempo finales son confirmados por el técnico.
                </p>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '1.5rem', padding: '1rem', fontSize: '1rem', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}
          >
            <IconSend size={18} color="white" />
            {loading ? 'Enviando solicitud...' : 'Enviar solicitud de cotización'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Cotizador;
