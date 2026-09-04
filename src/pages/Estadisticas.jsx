import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { IconClock } from '../components/Icons';

const FALLBACK_MODS = [
  { id: '1', hardware: 'Game Boy Advance', categoria: 'Consola Portátil', tipoMod: 'Pantalla IPS V2', precioEstimado: 85, tiempoDias: 1 },
  { id: '2', hardware: 'PlayStation 5 DualSense', categoria: 'Mandos', tipoMod: 'Back Paddles + Hall Effect', precioEstimado: 95, tiempoDias: 2 },
  { id: '3', hardware: 'Steam Deck', categoria: 'Consola Portátil', tipoMod: 'SSD 2TB + Thermal Mod', precioEstimado: 350, tiempoDias: 6 },
  { id: '4', hardware: 'Teclado Mecánico 75%', categoria: 'Teclados Mecánicos', tipoMod: 'Placa Latón + Switches Lubed', precioEstimado: 190, tiempoDias: 5 },
  { id: '5', hardware: 'Arcade Stick', categoria: 'Arcade', tipoMod: 'Sanwa Mod', precioEstimado: 110, tiempoDias: 2 },
];

const COLORS = ['#10b981', '#f59e0b', '#06b6d4', '#8b5cf6', '#ec4899'];

// Corrección del Tooltip: Todo texto blanco sobre fondo oscuro
const tooltipStyle = { 
  background: '#030712', 
  border: '1px solid var(--emerald-glow)', 
  borderRadius: '8px', 
  color: '#ffffff',
  boxShadow: '0 0 15px rgba(16,185,129,0.3)',
  padding: '10px'
};

const tooltipItemStyle = { color: '#ffffff' };
const tooltipLabelStyle = { color: '#ffffff', fontWeight: 'bold', marginBottom: '5px' };

const Estadisticas = () => {
  const [mods, setMods] = useState([]);
  const [cotizaciones, setCotizaciones] = useState([]);

  useEffect(() => {
    // 1. Cargar catálogo
    fetch('http://localhost:3001/modificaciones')
      .then((res) => res.json())
      .then(setMods)
      .catch(() => setMods(FALLBACK_MODS));

    // 2. Cargar cotizaciones reales (Dual)
    const loadCotizaciones = async () => {
      let merged = [];
      try {
        const res = await fetch('http://localhost:3001/cotizaciones');
        if (res.ok) {
          merged = await res.json();
        }
      } catch (err) {
        // Silencioso
      }

      try {
        const localData = JSON.parse(localStorage.getItem('volt_cotizaciones') || '[]');
        localData.forEach(localItem => {
          if (!merged.find(m => m.id === localItem.id)) merged.push(localItem);
        });
      } catch (err) { }
      
      setCotizaciones(merged);
    };

    loadCotizaciones();
  }, []);

  // Cálculos para gráficos de Catálogo
  const dataPrecios = mods.map(m => ({ name: m.hardware.substring(0, 15) + (m.hardware.length > 15 ? '...' : ''), precio: Number(m.precioEstimado) }));
  
  const catCount = mods.reduce((acc, m) => {
    acc[m.categoria] = (acc[m.categoria] || 0) + 1;
    return acc;
  }, {});
  
  const totalMods = mods.length || 1; // Evitar división por 0
  const dataCategorias = Object.keys(catCount).map(key => ({
    name: key,
    value: Math.round((catCount[key] / totalMods) * 100) || 0
  }));

  // Cálculos estadísticos generales
  const precioPromedio = mods.length > 0 ? Math.round(mods.reduce((acc, m) => acc + Number(m.precioEstimado), 0) / mods.length) : 0;
  const tiempoPromedio = mods.length > 0 ? Math.round(mods.reduce((acc, m) => acc + Number(m.tiempoDias), 0) / mods.length) : 0;
  const modMasCara = mods.length > 0 ? [...mods].sort((a, b) => b.precioEstimado - a.precioEstimado)[0] : null;

  // Estadísticas de Cotizaciones
  const aprobadas = cotizaciones.filter(c => c.estado === 'Aprobada').length;
  const pendientes = cotizaciones.filter(c => c.estado === 'Pendiente').length;
  const tasaAprobacion = cotizaciones.length > 0 ? Math.round((aprobadas / cotizaciones.length) * 100) : 0;

  return (
    <div className="page-container">
      <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
        Métricas de <span style={{ color: 'var(--emerald-glow)' }}>Rendimiento</span>
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Análisis de precios, demanda y distribución por categorías del taller.
      </p>

      {/* Tarjetas de Métricas Rápidas */}
      <div className="stats-row" style={{ marginBottom: '2.5rem' }}>
        <div className="stat-card">
          <div className="stat-number">${precioPromedio}</div>
          <div className="stat-label">Precio Promedio</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{tiempoPromedio} d</div>
          <div className="stat-label">Tiempo Promedio</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: 'var(--cyan-pulse)' }}>{cotizaciones.length}</div>
          <div className="stat-label">Cotizaciones Totales</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: tasaAprobacion > 50 ? 'var(--emerald-glow)' : 'var(--amber-light)' }}>
            {tasaAprobacion}%
          </div>
          <div className="stat-label">Tasa Aprobación</div>
        </div>
      </div>

      <div className="grid-charts">
        <div className="chart-box">
          <h3 style={{ marginBottom: '1rem', color: 'var(--amber-light)' }}>
            Precios Estimados por Proyecto ($USD)
          </h3>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataPrecios}>
                <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                <Tooltip 
                  contentStyle={tooltipStyle} 
                  itemStyle={tooltipItemStyle}
                  labelStyle={tooltipLabelStyle}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Bar dataKey="precio" fill="var(--emerald-glow)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-box">
          <h3 style={{ marginBottom: '1rem', color: 'var(--cyan-pulse)' }}>
            Distribución de Catálogo por Categorías
          </h3>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataCategorias}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  outerRadius={90}
                  label={({ name, value }) => `${value}%`}
                  labelLine={false}
                >
                  {dataCategorias.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={tooltipStyle} 
                  itemStyle={tooltipItemStyle}
                  labelStyle={tooltipLabelStyle}
                />
                <Legend 
                  iconType="circle" 
                  formatter={(value) => <span style={{ color: '#f9fafb', fontSize: '0.85rem' }}>{value}</span>} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tabla resumen ampliada */}
      <div style={{ marginTop: '2.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        <div>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.3rem', color: 'var(--emerald-glow)' }}>
            Módulos Top (Más populares)
          </h2>
          <table className="tabla-admin">
            <thead>
              <tr>
                <th>Top</th>
                <th>Hardware / Mod</th>
                <th>Precio</th>
              </tr>
            </thead>
            <tbody>
              {mods.slice(0, 5).map((item, i) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 700, color: 'var(--amber-light)' }}>#{i + 1}</td>
                  <td>{item.hardware} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({item.tipoMod})</span></td>
                  <td style={{ color: 'var(--emerald-glow)', fontWeight: 600 }}>${item.precioEstimado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.3rem', color: 'var(--amber-light)' }}>
            Insights del Negocio
          </h2>
          <div className="form-card" style={{ padding: '1.5rem', background: 'rgba(17,24,39,0.7)', height: '100%' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1f2937', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Mod más costoso:</span>
                <span style={{ color: 'white', fontWeight: 600, textAlign: 'right' }}>
                  {modMasCara ? `${modMasCara.hardware}` : '—'} <br/>
                  <span style={{ color: 'var(--amber-light)', fontSize: '0.9rem' }}>${modMasCara?.precioEstimado || 0} USD</span>
                </span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1f2937', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Cotizaciones pendientes:</span>
                <span style={{ color: 'var(--amber-fire)', fontWeight: 600 }}>{pendientes} reqs</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Módulos en catálogo:</span>
                <span style={{ color: 'var(--emerald-glow)', fontWeight: 600 }}>{mods.length} mods</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Estadisticas;
