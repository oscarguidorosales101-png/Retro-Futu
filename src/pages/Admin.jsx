import React, { useState, useEffect } from 'react';
import { IconTrash, IconCheck, IconX, IconClock, IconCog, IconDocument, IconUser } from '../components/Icons';

// =======================================================
// Modal de Eliminación Cyberpunk (reemplaza window.confirm)
// =======================================================
const ModalConfirmDelete = ({ onConfirm, onCancel, itemName }) => (
  <div className="modal-overlay" onClick={onCancel}>
    <div className="modal-content modal-confirm" onClick={(e) => e.stopPropagation()}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <IconTrash size={52} color="#ef4444" />
      </div>
      <h2 style={{ textAlign: 'center', color: 'var(--text-main)', marginBottom: '0.5rem', fontSize: '1.4rem' }}>
        ¿Confirmar eliminación?
      </h2>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
        Estás a punto de eliminar: <strong style={{ color: 'var(--amber-light)' }}>{itemName}</strong>
      </p>
      <p style={{ textAlign: 'center', color: '#ef4444', marginBottom: '2rem', fontSize: '0.85rem' }}>
        Esta acción no se puede deshacer.
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
          style={{ flex: 1, padding: '0.8rem', background: 'linear-gradient(135deg, #b91c1c, #dc2626)', boxShadow: '0 0 10px rgba(220, 38, 38, 0.4)' }}
        >
          Eliminar
        </button>
      </div>
    </div>
  </div>
);

// =======================================================
// Main Admin Component
// =======================================================
const Admin = ({ authUser }) => {
  const [activeTab, setActiveTab] = useState('cotizaciones');

  // Inventario
  const [mods, setMods] = useState([]);
  const [form, setForm] = useState({ hardware: '', categoria: '', tipoMod: '', precioEstimado: '', tiempoDias: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Cotizaciones
  const [cotizaciones, setCotizaciones] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('Todas');
  const [selectedCotizacion, setSelectedCotizacion] = useState(null);

  // Modales de eliminación
  const [itemToDelete, setItemToDelete] = useState(null); // { type: 'mod' | 'cotizacion', id, name }

  useEffect(() => {
    // 1. Cargar Mods del inventario
    fetch('http://localhost:3001/modificaciones')
      .then((res) => res.json())
      .then((data) => setMods(data))
      .catch((err) => console.error('Error cargando mods:', err));

    // 2. Cargar Cotizaciones (Estrategia Dual: LocalStorage + API)
    const loadCotizaciones = async () => {
      let merged = [];
      try {
        const res = await fetch('http://localhost:3001/cotizaciones');
        if (res.ok) {
          const apiData = await res.json();
          merged = [...apiData];
        }
      } catch (err) {
        console.error('API no disponible para cotizaciones, usando solo local.');
      }

      // Mezclar con localStorage y deduplicar por ID
      try {
        const localData = JSON.parse(localStorage.getItem('volt_cotizaciones') || '[]');
        localData.forEach(localItem => {
          if (!merged.find(m => m.id === localItem.id)) {
            merged.push(localItem);
          }
        });
      } catch (err) {
        console.error('Error leyendo localStorage cotizaciones:', err);
      }

      // Ordenar por fecha descendente (más recientes primero)
      merged.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      setCotizaciones(merged);
      setLoading(false);
    };

    loadCotizaciones();
  }, []);

  // Sync cotizaciones to API and LocalStorage
  const updateCotizacionState = async (id, nuevoEstado) => {
    const updatedList = cotizaciones.map(c => c.id === id ? { ...c, estado: nuevoEstado } : c);
    setCotizaciones(updatedList);
    
    // Update local storage
    try {
      localStorage.setItem('volt_cotizaciones', JSON.stringify(updatedList));
    } catch (err) {
      console.error('Error actualizando localStorage:', err);
    }
    
    // Try to update API
    try {
      await fetch(`http://localhost:3001/cotizaciones/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
    } catch (err) {
      // Fallo silencioso, localStorage ya tiene el dato
    }
    
    if (selectedCotizacion?.id === id) {
      setSelectedCotizacion(prev => ({ ...prev, estado: nuevoEstado }));
    }
  };

  const handleActualizarEstado = (id, nuevoEstado) => {
    updateCotizacionState(id, nuevoEstado);
  };

  const confirmarEliminacion = () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === 'cotizacion') {
      const updatedList = cotizaciones.filter(c => c.id !== itemToDelete.id);
      setCotizaciones(updatedList);
      
      try {
        localStorage.setItem('volt_cotizaciones', JSON.stringify(updatedList));
      } catch (err) {
        console.error('Error localStorage:', err);
      }

      fetch(`http://localhost:3001/cotizaciones/${itemToDelete.id}`, { method: 'DELETE' }).catch(() => {});
      if (selectedCotizacion?.id === itemToDelete.id) setSelectedCotizacion(null);
    } 
    else if (itemToDelete.type === 'mod') {
      setMods(mods.filter((m) => m.id !== itemToDelete.id));
      fetch(`http://localhost:3001/modificaciones/${itemToDelete.id}`, { method: 'DELETE' }).catch(() => {});
    }

    setItemToDelete(null);
  };

  const handleCreateOrUpdateMod = (e) => {
    e.preventDefault();
    if (editingId) {
      const updated = { ...form, id: editingId, disponible: true };
      setMods(mods.map((m) => (m.id === editingId ? updated : m)));
      fetch(`http://localhost:3001/modificaciones/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      }).catch(() => {});
    } else {
      const newMod = { ...form, id: String(Date.now()), disponible: true };
      setMods([...mods, newMod]);
      fetch('http://localhost:3001/modificaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMod),
      }).catch(() => {});
    }
    setForm({ hardware: '', categoria: '', tipoMod: '', precioEstimado: '', tiempoDias: '' });
    setEditingId(null);
  };

  const handleEditMod = (mod) => {
    setForm(mod);
    setEditingId(mod.id);
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'Aprobada': return 'var(--emerald-glow)';
      case 'Rechazada': return '#ef4444';
      case 'En revisión': return 'var(--cyan-pulse)';
      default: return 'var(--amber-light)';
    }
  };

  const cotizacionesFiltradas = filtroEstado === 'Todas' ? cotizaciones : cotizaciones.filter(c => c.estado === filtroEstado);
  
  // Estadísticas rápidas cotizaciones
  const statsCotiz = {
    total: cotizaciones.length,
    pendientes: cotizaciones.filter(c => c.estado === 'Pendiente').length,
    revision: cotizaciones.filter(c => c.estado === 'En revisión').length,
    aprobadas: cotizaciones.filter(c => c.estado === 'Aprobada').length
  };

  if (loading) {
    return <div className="page-container"><p className="loading-text">Cargando panel...</p></div>;
  }

  return (
    <div className="page-container" style={{ maxWidth: '1200px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2rem' }}>Panel <span style={{ color: 'var(--amber-fire)' }}>Administrativo</span></h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'rgba(17,24,39,0.5)', padding: '0.5rem 1rem', borderRadius: '20px', border: '1px solid #1f2937' }}>
          <IconUser size={16} color="var(--emerald-glow)" />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Técnico: <strong style={{ color: 'white' }}>{authUser?.usuario}</strong></span>
        </div>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'cotizaciones' ? 'active' : ''}`}
          onClick={() => setActiveTab('cotizaciones')}
        >
          <IconDocument size={16} /> Solicitudes Recibidas ({cotizaciones.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'inventario' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventario')}
        >
          <IconCog size={16} /> Catálogo de Mods ({mods.length})
        </button>
      </div>

      {/* ============================================================== */}
      {/* PESTAÑA: COTIZACIONES RECIBIDAS */}
      {/* ============================================================== */}
      {activeTab === 'cotizaciones' && (
        <div className="admin-content-section fade-in">
          
          <div className="status-pills-container" style={{ marginBottom: '2rem' }}>
            <div className="status-pill total">
              <span className="count">{statsCotiz.total}</span>
              <span className="label">Total</span>
            </div>
            <div className="status-pill pendientes">
              <span className="count">{statsCotiz.pendientes}</span>
              <span className="label">Pendientes</span>
            </div>
            <div className="status-pill revision">
              <span className="count">{statsCotiz.revision}</span>
              <span className="label">En Revisión</span>
            </div>
            <div className="status-pill aprobadas">
              <span className="count">{statsCotiz.aprobadas}</span>
              <span className="label">Aprobadas</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.4rem' }}>Bandeja de Entrada</h2>
            <select 
              value={filtroEstado} 
              onChange={(e) => setFiltroEstado(e.target.value)}
              style={{ padding: '0.5rem', background: '#111827', color: 'white', border: '1px solid #374151', borderRadius: '8px' }}
            >
              <option value="Todas">Mostrar Todas</option>
              <option value="Pendiente">Solo Pendientes</option>
              <option value="En revisión">Solo En Revisión</option>
              <option value="Aprobada">Solo Aprobadas</option>
              <option value="Rechazada">Solo Rechazadas</option>
            </select>
          </div>

          {cotizacionesFiltradas.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#0b0f19', borderRadius: '12px', border: '1px dashed #374151' }}>
              <IconDocument size={48} color="#374151" />
              <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>No hay solicitudes en esta vista.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="tabla-admin">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Equipo</th>
                    <th>Estimación</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {cotizacionesFiltradas.map((cot) => {
                    const date = new Date(cot.fecha).toLocaleDateString();
                    const color = getStatusColor(cot.estado);
                    return (
                      <tr key={cot.id}>
                        <td style={{ fontWeight: 700, color: 'var(--amber-light)', fontSize: '0.85rem' }}>{cot.numeroSolicitud}</td>
                        <td style={{ fontSize: '0.85rem' }}>{date}</td>
                        <td>{cot.nombre || cot.email?.split('@')[0]}</td>
                        <td style={{ fontSize: '0.9rem' }}>{cot.equipo}</td>
                        <td style={{ color: 'var(--emerald-glow)' }}>${cot.precioEstimado}</td>
                        <td>
                          <span style={{ 
                            background: `${color}22`, 
                            color: color, 
                            padding: '0.3rem 0.6rem', 
                            borderRadius: '12px', 
                            fontSize: '0.75rem', 
                            fontWeight: 700,
                            border: `1px solid ${color}44`
                          }}>
                            {cot.estado}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="btn-action edit" 
                            title="Ver detalles"
                            onClick={() => setSelectedCotizacion(cot)}
                          >
                            <IconDocument size={15} />
                          </button>
                          <button 
                            className="btn-action delete" 
                            title="Eliminar"
                            onClick={() => setItemToDelete({ type: 'cotizacion', id: cot.id, name: cot.numeroSolicitud })}
                          >
                            <IconTrash size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* PESTAÑA: INVENTARIO / CATALOGO */}
      {/* ============================================================== */}
      {activeTab === 'inventario' && (
        <div className="admin-content-section fade-in">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'start' }}>
            
            {/* Formulario */}
            <div className="form-card" style={{ padding: '1.5rem', marginTop: 0 }}>
              <h3 style={{ marginBottom: '1.5rem', color: 'var(--emerald-glow)' }}>
                {editingId ? 'Editar Módulo' : 'Nuevo Módulo'}
              </h3>
              <form onSubmit={handleCreateOrUpdateMod} className="grid-form" style={{ gridTemplateColumns: '1fr', gap: '1rem' }}>
                <input
                  type="text"
                  placeholder="Equipo (ej: DualSense)"
                  value={form.hardware}
                  onChange={(e) => setForm({ ...form, hardware: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Categoría (ej: Mandos)"
                  value={form.categoria}
                  onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Descripción del mod"
                  value={form.tipoMod}
                  onChange={(e) => setForm({ ...form, tipoMod: e.target.value })}
                  required
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <input
                    type="number"
                    placeholder="Precio USD"
                    value={form.precioEstimado}
                    onChange={(e) => setForm({ ...form, precioEstimado: e.target.value })}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Días"
                    value={form.tiempoDias}
                    onChange={(e) => setForm({ ...form, tiempoDias: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
                  <IconCheck size={16} /> {editingId ? 'Guardar Cambios' : 'Registrar Módulo'}
                </button>
                {editingId && (
                  <button type="button" className="btn-secondary" onClick={() => { setEditingId(null); setForm({ hardware: '', categoria: '', tipoMod: '', precioEstimado: '', tiempoDias: '' }); }}>
                    Cancelar edición
                  </button>
                )}
              </form>
            </div>

            {/* Tabla */}
            <div className="table-responsive">
              <table className="tabla-admin">
                <thead>
                  <tr>
                    <th>Hardware</th>
                    <th>Categoría</th>
                    <th>Modificación</th>
                    <th>Precio</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {mods.map((mod) => (
                    <tr key={mod.id}>
                      <td style={{ fontWeight: 'bold' }}>{mod.hardware}</td>
                      <td>{mod.categoria}</td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{mod.tipoMod}</td>
                      <td style={{ color: 'var(--amber-light)' }}>${mod.precioEstimado}</td>
                      <td>
                        <button className="btn-action edit" onClick={() => handleEditMod(mod)} title="Editar"><IconCog size={15} /></button>
                        <button className="btn-action delete" onClick={() => setItemToDelete({ type: 'mod', id: mod.id, name: mod.hardware })} title="Eliminar"><IconTrash size={15} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: DETALLE DE COTIZACIÓN */}
      {/* ============================================================== */}
      {selectedCotizacion && (
        <div className="modal-overlay" onClick={() => setSelectedCotizacion(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #1f2937', paddingBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--amber-light)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <IconDocument size={24} /> {selectedCotizacion.numeroSolicitud}
              </h2>
              <button onClick={() => setSelectedCotizacion(null)} className="btn-action" style={{ background: 'transparent' }}><IconX size={20} color="white" /></button>
            </div>

            <div className="modal-grid-info">
              <div className="info-block">
                <label>Cliente</label>
                <p>{selectedCotizacion.nombre || 'N/A'}</p>
              </div>
              <div className="info-block">
                <label>Email de Contacto</label>
                <p>{selectedCotizacion.email}</p>
              </div>
              <div className="info-block">
                <label>Contacto Pref.</label>
                <p>{selectedCotizacion.preferenciaContacto || 'Email'}</p>
              </div>
              <div className="info-block">
                <label>Fecha Solicitud</label>
                <p>{new Date(selectedCotizacion.fecha).toLocaleString()}</p>
              </div>
              
              <div className="info-block full-width" style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <label style={{ color: 'var(--emerald-glow)' }}>Proyecto Requerido</label>
                <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.3rem' }}>{selectedCotizacion.equipo}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{selectedCotizacion.modificacion}</p>
              </div>

              {selectedCotizacion.detalles && (
                <div className="info-block full-width">
                  <label>Detalles del cliente</label>
                  <p style={{ fontStyle: 'italic', fontSize: '0.9rem', lineHeight: '1.4', background: '#030712', padding: '0.8rem', borderRadius: '8px' }}>
                    "{selectedCotizacion.detalles}"
                  </p>
                </div>
              )}

              <div className="info-block">
                <label>Presupuesto Objetivo</label>
                <p style={{ color: 'var(--text-main)', fontSize: '1.1rem' }}>
                  {selectedCotizacion.presupuesto ? `$${selectedCotizacion.presupuesto} USD` : 'No especificado'}
                </p>
              </div>
              <div className="info-block">
                <label>Estimación VOLTGARAGE</label>
                <p style={{ color: 'var(--emerald-glow)', fontSize: '1.3rem', fontWeight: 800 }}>
                  ${selectedCotizacion.precioEstimado} USD
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--amber-light)', display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.2rem' }}>
                  <IconClock size={12} /> {selectedCotizacion.tiempoEstimado} días
                </p>
              </div>
              
              <div className="info-block full-width" style={{ textAlign: 'center', background: '#0b0f19' }}>
                <label>Estado Actual</label>
                <span style={{ 
                  display: 'inline-block',
                  background: `${getStatusColor(selectedCotizacion.estado)}22`, 
                  color: getStatusColor(selectedCotizacion.estado), 
                  padding: '0.4rem 1rem', 
                  borderRadius: '20px', 
                  fontSize: '1rem', 
                  fontWeight: 700,
                  border: `1px solid ${getStatusColor(selectedCotizacion.estado)}`
                }}>
                  {selectedCotizacion.estado}
                </span>
              </div>
            </div>

            <div className="modal-actions" style={{ display: 'flex', gap: '0.8rem', marginTop: '2rem', borderTop: '1px solid #1f2937', paddingTop: '1.5rem' }}>
              <button 
                className="btn-status review" 
                onClick={() => handleActualizarEstado(selectedCotizacion.id, 'En revisión')}
                disabled={selectedCotizacion.estado === 'En revisión'}
              >
                <IconClock size={16} /> Poner en Revisión
              </button>
              <button 
                className="btn-status approve" 
                onClick={() => handleActualizarEstado(selectedCotizacion.id, 'Aprobada')}
                disabled={selectedCotizacion.estado === 'Aprobada'}
              >
                <IconCheck size={16} /> Aprobar Proyecto
              </button>
              <button 
                className="btn-status reject" 
                onClick={() => handleActualizarEstado(selectedCotizacion.id, 'Rechazada')}
                disabled={selectedCotizacion.estado === 'Rechazada'}
              >
                <IconX size={16} /> Rechazar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: CONFIRMACIÓN ELIMINAR */}
      {/* ============================================================== */}
      {itemToDelete && (
        <ModalConfirmDelete 
          itemName={itemToDelete.name}
          onConfirm={confirmarEliminacion}
          onCancel={() => setItemToDelete(null)}
        />
      )}
    </div>
  );
};

export default Admin;
