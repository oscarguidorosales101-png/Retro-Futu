import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const FALLBACK_MODS = [
  { id: '1', hardware: 'GBC IPS Mod', categoria: 'Consola Portátil', tipoMod: 'Carcasa + IPS', precioEstimado: 135, tiempoDias: 3 },
  { id: '2', hardware: 'DualSense Paddles', categoria: 'Mandos', tipoMod: 'Paddles + Hall', precioEstimado: 85, tiempoDias: 2 },
  { id: '3', hardware: 'Switch OLED Shell', categoria: 'Consola Portátil', tipoMod: 'Shell clear', precioEstimado: 160, tiempoDias: 4 },
  { id: '4', hardware: 'Keyboard 75%', categoria: 'Teclados Mecánicos', tipoMod: 'Switches + Lube', precioEstimado: 190, tiempoDias: 5 },
];

const COLORS = ['#10b981', '#f59e0b', '#06b6d4'];

const tooltipStyle = { background: '#111827', border: '1px solid #ffffffff', borderRadius: '8px', color: '#f9fafb' };

const Estadisticas = () => {
  const [mods, setMods] = useState([]);
  const [isLocal, setIsLocal] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/modificaciones')
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setMods)
      .catch(() => {
        setMods(FALLBACK_MODS);
        setIsLocal(true);
      });
  }, []);

  const dataPrecios = mods.map(m => ({ name: m.hardware, precio: Number(m.precioEstimado) }));
  
  const catCount = mods.reduce((acc, m) => {
    acc[m.categoria] = (acc[m.categoria] || 0) + 1;
    return acc;
  }, {});
  
  const dataCategorias = Object.keys(catCount).map(key => ({
    name: key,
    value: Math.round((catCount[key] / mods.length) * 100) || 0
  }));

  return (
    <div className="page-container">
      <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
        Métricas de <span style={{ color: 'var(--emerald-glow)' }}>Rendimiento</span>
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Análisis de precios, demanda y distribución por categorías del taller.
      </p>

      {isLocal && <div className="alert-error" style={{ marginBottom: '1.5rem' }}>⚠️ Servidor no disponible. Mostrando datos de demostración locales.</div>}

      <div className="grid-charts">
        <div className="chart-box">
          <h3>💰 Precios Estimados por Proyecto ($USD)</h3>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataPrecios}>
                <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 11 }} />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="precio" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-box">
          <h3>📊 Distribución por Categorías</h3>
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
                >
                  {dataCategorias.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend iconType="circle" formatter={(value) => <span style={{ color: '#f9fafb', fontSize: '0.85rem' }}>{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tabla resumen */}
      <div style={{ marginTop: '2.5rem' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.3rem', color: 'var(--amber-light)' }}>Resumen de Proyectos</h2>
        <table className="tabla-admin">
          <thead>
            <tr>
              <th>Proyecto</th>
              <th>Precio Base</th>
              <th>Tiempo Estimado</th>
              <th>Demanda</th>
            </tr>
          </thead>
          <tbody>
            {mods.map((item, i) => (
              <tr key={item.id}>
                <td>{item.hardware}</td>
                <td style={{ color: 'var(--amber-light)' }}>${item.precioEstimado} USD</td>
                <td style={{ color: 'var(--emerald-glow)' }}>{item.tiempoDias} días</td>
                <td>
                  <span style={{
                    background: i < 2 ? 'rgba(189, 202, 198, 0.2)' : 'rgba(245,158,11,0.2)',
                    color: i < 2 ? 'var(--emerald-glow)' : 'var(--amber-light)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: 700
                  }}>
                    {i < 2 ? 'Alta' : i < 4 ? 'Media' : 'Normal'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Estadisticas;
