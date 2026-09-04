import React, { useState, useEffect } from 'react';

const FALLBACK = [
  { id: '1', hardware: 'Game Boy Color', categoria: 'Consola Portátil', tipoMod: 'Carcasa Transparente Amber + IPS V3', precioEstimado: 135, tiempoDias: 3 },
  { id: '2', hardware: 'Control PS5 DualSense', categoria: 'Mandos', tipoMod: 'Back Paddles + Joysticks Hall Effect', precioEstimado: 85, tiempoDias: 2 },
];

const Admin = () => {
  const [mods, setMods] = useState([]);
  const [cotizaciones, setCotizaciones] = useState([]);
  const [form, setForm] = useState({ hardware: '', categoria: 'Consola Portátil', tipoMod: '', precioEstimado: '', tiempoDias: '' });
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState(null);
  const [activeTab, setActiveTab] = useState('inventario');

  useEffect(() => { cargar(); cargarCotizaciones(); }, []);

  const cargar = () => {
    fetch('http://localhost:3001/modificaciones')
      .then((r) => r.json())
      .then(setMods)
      .catch(() => setMods(FALLBACK));
  };

  const cargarCotizaciones = () => {
    fetch('http://localhost:3001/cotizaciones')
      .then((r) => r.json())
      .then(setCotizaciones)
      .catch(() => setCotizaciones([]));
  };

  const resetForm = () => {
    setEditId(null);
    setForm({ hardware: '', categoria: 'Consola Portátil', tipoMod: '', precioEstimado: '', tiempoDias: '' });
  };

  const showMsg = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(null), 3000);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const data = { ...form, precioEstimado: Number(form.precioEstimado), tiempoDias: Number(form.tiempoDias) };

    try {
      if (editId) {
        await fetch(`http://localhost:3001/modificaciones/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, id: editId }),
        });
        showMsg('✅ Modificación actualizada correctamente.');
      } else {
        await fetch('http://localhost:3001/modificaciones', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, id: Date.now().toString() }),
        });
        showMsg('✅ Nueva modificación agregada al catálogo.');
      }
      cargar();
      resetForm();
    } catch {
      // Modo local sin servidor
      if (editId) {
        setMods((prev) => prev.map((m) => m.id === editId ? { ...data, id: editId } : m));
      } else {
        setMods((prev) => [...prev, { ...data, id: Date.now().toString() }]);
      }
      showMsg('✅ Operación realizada (modo local).');
      resetForm();
    }
  };

  const handleEdit = (mod) => {
    setEditId(mod.id);
    setForm({ hardware: mod.hardware, categoria: mod.categoria, tipoMod: mod.tipoMod, precioEstimado: mod.precioEstimado, tiempoDias: mod.tiempoDias });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta modificación del catálogo?')) return;
    try {
      await fetch(`http://localhost:3001/modificaciones/${id}`, { method: 'DELETE' });
      cargar();
    } catch {
      setMods((prev) => prev.filter((m) => m.id !== id));
    }
    showMsg('🗑️ Modificación eliminada.');
  };

  const handleUpdateCotizacionStatus = async (id, nuevoEstado) => {
    const cotizacion = cotizaciones.find(c => c.id === id);
    if (!cotizacion) return;
    try {
      await fetch(`http://localhost:3001/cotizaciones/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...cotizacion, estado: nuevoEstado }),
      });
      cargarCotizaciones();
      showMsg('✅ Estado de cotización actualizado.');
    } catch {
      setCotizaciones((prev) => prev.map(c => c.id === id ? { ...c, estado: nuevoEstado } : c));
      showMsg('✅ Estado actualizado (modo local).');
    }
  };

  const handleDeleteCotizacion = async (id) => {
    if (!window.confirm('¿Eliminar esta cotización?')) return;
    try {
      await fetch(`http://localhost:3001/cotizaciones/${id}`, { method: 'DELETE' });
      cargarCotizaciones();
      showMsg('🗑️ Cotización eliminada.');
    } catch {
      setCotizaciones((prev) => prev.filter(c => c.id !== id));
      showMsg('🗑️ Cotización eliminada (modo local).');
    }
  };

  return (
    <div className="page-container">
      <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
        Panel Técnico <span style={{ color: 'var(--amber-fire)' }}>CRUD</span>
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Gestiona el inventario y los servicios del taller.
      </p>

      {msg && <div className="alert-success">{msg}</div>}

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('inventario')}
          className={activeTab === 'inventario' ? 'btn-primary' : 'btn-secondary'}
          style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', border: 'none', background: activeTab === 'inventario' ? 'var(--emerald-glow)' : '#374151', color: '#fff' }}
        >
          📦 Inventario
        </button>
        <button 
          onClick={() => setActiveTab('cotizaciones')}
          className={activeTab === 'cotizaciones' ? 'btn-primary' : 'btn-secondary'}
          style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', border: 'none', background: activeTab === 'cotizaciones' ? 'var(--emerald-glow)' : '#374151', color: '#fff' }}
        >
          ✉️ Cotizaciones ({cotizaciones.length})
        </button>
      </div>

      {activeTab === 'inventario' ? (
        <>
          {/* Formulario */}
      <div className="form-admin" style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ marginBottom: '0.5rem', color: 'var(--amber-light)' }}>
          {editId ? '✏️ Editar Modificación' : '➕ Nueva Modificación'}
        </h3>
        <form onSubmit={handleSave}>
          <div className="grid-form">
            <div>
              <label htmlFor="hardware" style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem' }}>Hardware / Consola *</label>
              <input id="hardware" type="text" placeholder="Ej: GameBoy" value={form.hardware}
                onChange={(e) => setForm({ ...form, hardware: e.target.value })} required />
            </div>
            <div>
              <label htmlFor="categoria" style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem' }}>Categoría</label>
              <select id="categoria" value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}>
                <option value="Consola Portátil">Consola Portátil</option>
                <option value="Mandos">Mandos / Controles</option>
                <option value="Teclados Mecánicos">Teclados Mecánicos</option>
                <option value="Retro Gaming">Retro Gaming</option>
                <option value="PC Custom">PC Custom</option>
              </select>
            </div>
            <div>
              <label htmlFor="tipoMod" style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem' }}>Descripción del Mod *</label>
              <input id="tipoMod" type="text" placeholder="Ej: IPS V3" value={form.tipoMod}
                onChange={(e) => setForm({ ...form, tipoMod: e.target.value })} required />
            </div>
            <div>
              <label htmlFor="precio" style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem' }}>Precio ($USD)</label>
              <input id="precio" type="number" placeholder="Ej: 100" value={form.precioEstimado}
                onChange={(e) => setForm({ ...form, precioEstimado: e.target.value })} min="0" />
            </div>
            <div>
              <label htmlFor="tiempo" style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem' }}>Tiempo (Días)</label>
              <input id="tiempo" type="number" placeholder="Ej: 3" value={form.tiempoDias}
                onChange={(e) => setForm({ ...form, tiempoDias: e.target.value })} min="1" />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button type="submit" className="btn-primary">
              {editId ? '💾 Guardar Cambios' : '➕ Agregar al Catálogo'}
            </button>
            {editId && (
              <button type="button" onClick={resetForm}
                style={{ padding: '0.8rem 1.5rem', background: '#374151', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Tabla */}
      <h2 style={{ marginBottom: '0.5rem', fontSize: '1.2rem', color: 'var(--amber-light)' }}>
        Inventario Actual ({mods.length} mods)
      </h2>
      <table className="tabla-admin">
        <thead>
          <tr>
            <th>Hardware</th>
            <th>Categoría</th>
            <th>Modificación</th>
            <th>Precio</th>
            <th>Días</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {mods.map((m) => (
            <tr key={m.id}>
              <td>{m.hardware}</td>
              <td><span className="badge-cat" style={{ fontSize: '0.7rem' }}>{m.categoria}</span></td>
              <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.tipoMod}</td>
              <td style={{ color: 'var(--amber-light)', fontWeight: 700 }}>${m.precioEstimado}</td>
              <td style={{ color: 'var(--emerald-glow)' }}>{m.tiempoDias}d</td>
              <td>
                <button onClick={() => handleEdit(m)} className="btn-edit">Editar</button>
                <button onClick={() => handleDelete(m.id)} className="btn-delete">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </>
        
      ) : (
        <>
          <h2 style={{ marginBottom: '0.5rem', fontSize: '1.2rem', color: 'var(--amber-light)' }}>
            Cotizaciones Recibidas ({cotizaciones.length})
          </h2>
          <div className="table-responsive">
          <table className="tabla-admin">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Cliente/Email</th>
                <th>Equipo & Mod</th>
                <th>Presupuesto</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cotizaciones.length === 0 && <tr><td colSpan="6" style={{textAlign:'center'}}>No hay cotizaciones registradas.</td></tr>}
              {cotizaciones.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontSize: '0.85rem' }}>{c.fecha || 'N/A'}</td>
                  <td>{c.email || 'Sin email'}</td>
                  <td>
                    <strong>{c.hardware}</strong><br/>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{c.tipoMod}</span>
                  </td>
                  <td style={{ color: 'var(--amber-light)' }}>${c.presupuesto || '0'}</td>
                  <td>
                    <select 
                      value={c.estado || 'Pendiente'}
                      onChange={(e) => handleUpdateCotizacionStatus(c.id, e.target.value)}
                      style={{ padding: '0.2rem', borderRadius: '4px', background: '#1f2937', color: 'white', border: '1px solid #374151' }}
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="En revisión">En revisión</option>
                      <option value="Aprobada">Aprobada</option>
                      <option value="Rechazada">Rechazada</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={() => handleDeleteCotizacion(c.id)} className="btn-delete">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Admin;
