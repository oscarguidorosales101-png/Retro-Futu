import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const dataPrecios = [
  { name: 'GBC IPS Mod', precio: 135 },
  { name: 'DualSense Paddles', precio: 85 },
  { name: 'Switch OLED Shell', precio: 160 },
  { name: 'Keyboard 75%', precio: 190 },
  { name: 'GBA SP USB-C', precio: 110 },
  { name: 'Xbox Elite', precio: 95 },
];

const dataCategorias = [
  { name: 'Consolas Portátiles', value: 50 },
  { name: 'Mandos / Controls', value: 30 },
  { name: 'Teclados Mecánicos', value: 20 },
];

const COLORS = ['#10b981', '#f59e0b', '#06b6d4'];

const tooltipStyle = { background: '#111827', border: '1px solid #1f2937', borderRadius: '8px', color: '#f9fafb' };

const Estadisticas = () => {
  return (
    <div className="page-container">
      <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
        Métricas de <span style={{ color: 'var(--emerald-glow)' }}>Rendimiento</span>
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Análisis de precios, demanda y distribución por categorías del taller.
      </p>

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
            {dataPrecios.map((item, i) => (
              <tr key={i}>
                <td>{item.name}</td>
                <td style={{ color: 'var(--amber-light)' }}>${item.precio} USD</td>
                <td style={{ color: 'var(--emerald-glow)' }}>2–5 días</td>
                <td>
                  <span style={{
                    background: i < 2 ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)',
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
