import React, { useState, useEffect } from 'react';

const FALLBACK = [
  { id: '1', hardware: 'Game Boy Color', categoria: 'Consola Portátil', tipoMod: 'Carcasa Transparente Amber + IPS V3', precioEstimado: 135, tiempoDias: 3 },
  { id: '2', hardware: 'Control PS5 DualSense', categoria: 'Mandos', tipoMod: 'Back Paddles + Joysticks Hall Effect', precioEstimado: 85, tiempoDias: 2 },
];

const Admin = () => {
  const [mods, setMods] = useState([]);
  const [form, setForm] = useState({ hardware: '', categoria: 'Consola Portátil', tipoMod: '', precioEstimado: '', tiempoDias: '' });
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState(null);

  useEffect(() => { cargar(); }, []);

  const cargar = () => {
    fetch('http://localhost:3001/modificaciones')
      .then((r) => r.json())
      .then(setMods)
      .catch(() => setMods(FALLBACK));
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

  return (
    <div className="page-container">
      <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
        Panel Técnico <span style={{ color: 'var(--amber-fire)' }}>CRUD</span>
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Gestiona el inventario y los servicios del taller.
      </p>

      {msg && <div className="alert-success">{msg}</div>}

      {/* Formulario */}
      <div className="form-admin" style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ marginBottom: '0.5rem', color: 'var(--amber-light)' }}>
          {editId ? '✏️ Editar Modificación' : '➕ Nueva Modificación'}
        </h3>
        <form onSubmit={handleSave}>
          <div className="grid-form">
            <input type="text" placeholder="Hardware / Consola *" value={form.hardware}
              onChange={(e) => setForm({ ...form, hardware: e.target.value })} required />
            <select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}>
              <option value="Consola Portátil">Consola Portátil</option>
              <option value="Mandos">Mandos / Controles</option>
              <option value="Teclados Mecánicos">Teclados Mecánicos</option>
              <option value="Retro Gaming">Retro Gaming</option>
              <option value="PC Custom">PC Custom</option>
            </select>
            <input type="text" placeholder="Descripción del Mod *" value={form.tipoMod}
              onChange={(e) => setForm({ ...form, tipoMod: e.target.value })} required />
            <input type="number" placeholder="Precio ($USD)" value={form.precioEstimado}
              onChange={(e) => setForm({ ...form, precioEstimado: e.target.value })} min="0" />
            <input type="number" placeholder="Tiempo (Días)" value={form.tiempoDias}
              onChange={(e) => setForm({ ...form, tiempoDias: e.target.value })} min="1" />
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
    </div>
  );
};

export default Admin;
