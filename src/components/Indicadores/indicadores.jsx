import React, { useCallback, useEffect, useState } from 'react';
import './Indicadores.css';

/* =========================================================
   CONFIGURACIÓN DE LA API
   -----------------------------------------------------------
   json-server se corre así, sin ningún archivo de servidor:

     npx json-server db.json --port 3001

   Con eso, cada clave del db.json queda expuesta como una ruta
   REST propia (json-server la genera automáticamente):
     GET http://localhost:3001/kpis
     GET http://localhost:3001/goal
     GET http://localhost:3001/comparison
     GET http://localhost:3001/productRows
     GET http://localhost:3001/ranking
     GET http://localhost:3001/reviews

   json-server ya trae CORS habilitado por defecto, así que el
   navegador (Vite en :5173) puede llamar a :3001 sin problema,
   sin necesidad de configurar un proxy.
   ========================================================= */

const API_BASE = 'http://localhost:3001';

const SIDEBAR_ITEMS = [
  { icon: 'fa-solid fa-circle-info', label: 'Gestión de Información', href: '/ADMIN/INFORMACION/informacion.html' },
  { icon: 'fa-solid fa-paste', label: 'Gestión de Inventario', href: '/ADMIN/INVENTARIO/Insumos.html' },
  { icon: 'fa-solid fa-utensils', label: 'Gestión de Menú', href: '/ADMIN/MENU/index.html' },
  { icon: 'fa-solid fa-arrow-trend-up', label: 'Estadísticas de Negocio', href: '/ADMIN/ESTADISTICA/estadistica.html', active: true },
  { icon: 'fa-solid fa-people-line', label: 'Gestión de Empleados', href: '/ADMIN/EMPLEADO/gestion.html' },
];

const RANKING_COLORS = ['#ff9100', '#ffa632', '#ffbb62', '#ffdcd0', '#f5f5f5'];
const medalIcon = { 1: '🥇', 2: '🥈', 3: '🥉' };

/* =========================================================
   HELPERS
   ========================================================= */

function buildPieGradient(items, colors) {
  let acc = 0;
  const stops = items.map((item, i) => {
    const start = acc;
    acc += item.pct;
    return `${colors[i % colors.length]} ${start}% ${acc}%`;
  });
  return `conic-gradient(${stops.join(', ')})`;
}

function buildPieAriaLabel(items) {
  const parts = items.map((i) => `${i.name} ${i.pct}%`).join(', ');
  return `Gráfica de participación de ventas por producto: ${parts}`;
}

/**
 * Pide un recurso a json-server y valida que la respuesta sea OK.
 * Centralizar esto evita repetir el mismo bloque try/then seis veces.
 */
async function fetchResource(name) {
  const res = await fetch(`${API_BASE}/${name}`);
  if (!res.ok) {
    throw new Error(`No se pudo cargar "${name}" (HTTP ${res.status})`);
  }
  return res.json();
}

/* =========================================================
   COMPONENTE
   ========================================================= */

export default function Indicadores() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [error, setError] = useState(null);

  const loadData = useCallback(() => {
    setStatus('loading');
    setError(null);

    // Promise.all dispara las 6 peticiones en paralelo y espera a
    // que todas respondan antes de seguir. Si una falla, cae al catch.
    Promise.all([
      fetchResource('kpis'),
      fetchResource('goal'),
      fetchResource('comparison'),
      fetchResource('productRows'),
      fetchResource('ranking'),
      fetchResource('reviews'),
    ])
      .then(([kpis, goal, comparison, productRows, ranking, reviews]) => {
        setData({ kpis, goal, comparison, productRows, ranking, reviews });
        setStatus('success');
      })
      .catch((err) => {
        setError(err.message || 'Error desconocido');
        setStatus('error');
      });
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <>
      <header className="header">
        <div className="logo">
          <i class="fa-solid fa-fire flame-icon"></i>
          <h2>Corralejo <span className="letracolor">Fast Food</span></h2>
        </div>

        <nav>
          <ul className="nav-logos">
            <li className="logo1"><i className="fa-solid fa-bell" /></li>
            <li className="logo2"><i className="fa-regular fa-circle-user" /></li>
          </ul>
        </nav>
      </header>

      <main className="container">
        <aside className="sidebar">
          <h3>Administrador</h3>
          <ul>
            {SIDEBAR_ITEMS.map((item) => (
              <li key={item.label} className={item.active ? 'active' : ''}>
                <a href={item.href} className="sidebar-link">
                  <i className={item.icon} /> {item.label}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <section className="content">
          <h2>Estadísticas de Negocio</h2>

          {status === 'loading' && (
            <p className="state-msg">Cargando indicadores…</p>
          )}

          {status === 'error' && (
            <div className="state-msg state-msg--error">
              <p>No se pudieron cargar los datos{error ? `: ${error}` : '.'}</p>
              <button type="button" className="retry-btn" onClick={loadData}>
                Reintentar
              </button>
            </div>
          )}

          {status === 'success' && data && (
            <>
              {/* Tarjetas KPI */}
              <div className="kpi-grid" aria-label="Indicadores clave">
                {data.kpis.map((kpi) => (
                  <article className="kpi-card" key={kpi.id}>
                    <div className={`kpi-card__icon kpi-card__icon--${kpi.variant}`}>{kpi.icon}</div>
                    <div className="kpi-card__body">
                      <p className="kpi-card__label">{kpi.label}</p>
                      <p className="kpi-card__value">{kpi.value}</p>
                      <p className="kpi-card__trend kpi-card__trend--up">{kpi.trend}</p>
                    </div>
                  </article>
                ))}
              </div>

              {/* Metas + Comparación */}
              <div className="panels-container">
                <article className="panel panel--goals">
                  <header className="panel__header">
                    <h3 className="panel__title">Metas de Negocio</h3>
                    <p className="badge badge--progress">En progreso</p>
                  </header>

                  <div className="panel__body">
                    <p className="panel__hint">Presupuesto que el Administrador/Negocio aspira a alcanzar.</p>

                    <div className="goal-box">
                      <p className="goal-box__label">{data.goal.label}</p>
                      <p className="goal-box__value">{data.goal.value}</p>
                    </div>

                    <p className="panel__ref">
                      Se calcula con las ventas acumuladas del año actual, ver panel <strong>Comparación de Ventas</strong>.
                    </p>

                    <div className="goal-progress">
                      <div className="goal-progress__top">
                        <p className="goal-progress__label">Cumplimiento de meta anual</p>
                        <p className="goal-progress__percent">{data.goal.progressPercent}%</p>
                      </div>
                      <div
                        className="goal-progress__bar"
                        role="progressbar"
                        aria-valuenow={data.goal.progressPercent}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div className="goal-progress__fill" style={{ width: `${data.goal.progressPercent}%` }} />
                      </div>
                      <p className="goal-progress__note">
                        Faltan <strong>{data.goal.remaining}</strong> para alcanzar la meta anual.
                      </p>
                    </div>
                  </div>
                </article>

                <article className="panel panel--comparison">
                  <header className="panel__header">
                    <h3 className="panel__title">Comparación de Ventas</h3>
                    <p className="badge badge--year">Vista Anual</p>
                  </header>

                  <div className="panel__body">
                    <div className="comparison-grid">
                      <div className="comparison-card comparison-card--previous">
                        <p className="comparison-card__tag">Año Anterior · {data.comparison.previous.year}</p>
                        <ul className="comparison-card__list">
                          <li>
                            <p className="comparison-card__metric">Ventas acumuladas</p>
                            <p className="comparison-card__amount">{data.comparison.previous.sales}</p>
                          </li>
                          <li>
                            <p className="comparison-card__metric">Productos vendidos</p>
                            <p className="comparison-card__amount">{data.comparison.previous.products}</p>
                          </li>
                        </ul>
                      </div>

                      <div className="comparison-card comparison-card--current">
                        <p className="comparison-card__tag">Año Actual · {data.comparison.current.year}</p>
                        <ul className="comparison-card__list">
                          <li>
                            <p className="comparison-card__metric">Ventas acumuladas</p>
                            <p className="comparison-card__amount">{data.comparison.current.sales}</p>
                          </li>
                          <li>
                            <p className="comparison-card__metric">Productos vendidos</p>
                            <p className="comparison-card__amount">{data.comparison.current.products}</p>
                          </li>
                        </ul>
                        <span className="comparison-card__source">Base para el cumplimiento de meta anual</span>
                      </div>
                    </div>

                    <div className="comparison-summary">
                      <div className="comparison-summary__main">
                        <p className="comparison-summary__label">Variación interanual</p>
                        <p className="comparison-summary__diff">{data.comparison.yearlyDiff}</p>
                      </div>
                      <p className="comparison-summary__note">{data.comparison.yearlyNote}</p>
                    </div>

                    <div className="comparison-monthly">
                      <p className="comparison-monthly__label">Vista mensual (referencia)</p>
                      <div className="comparison-monthly__row">
                        <p>{data.comparison.monthly.label}: <strong>{data.comparison.monthly.value}</strong></p>
                        <p className="comparison-monthly__diff--up">{data.comparison.monthly.diff}</p>
                      </div>
                    </div>
                  </div>
                </article>
              </div>

              {/* Tabla de indicadores por producto */}
              <section className="panel panel--table">
                <header className="panel__header">
                  <h3 className="panel__title">Indicadores por Producto</h3>
                  <p className="badge badge--year">Comparativo Mensual / Anual</p>
                </header>

                <div className="panel__body">
                  <div className="table-wrapper">
                    <table className="data-table--grouped">
                      <thead>
                        <tr>
                          <th scope="col" rowSpan={2} className="col-product">Producto</th>
                          <th scope="col" colSpan={3} className="group-header group-header--month">Mensual</th>
                          <th scope="col" colSpan={3} className="group-header group-header--year">Anual</th>
                        </tr>
                        <tr className="subheader-row">
                          <th scope="col">Cant. Vendida</th>
                          <th scope="col">Ingreso</th>
                          <th scope="col">Particip. %</th>
                          <th scope="col">Cant. Vendida</th>
                          <th scope="col">Ingreso</th>
                          <th scope="col">Particip. %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.productRows.map((row) => (
                          <tr key={row.id}>
                            <td className="col-product">{row.name}</td>
                            <td>{row.monthly.qty}</td>
                            <td>{row.monthly.revenue}</td>
                            <td>
                              <div className="participation">
                                <span className="participation__bar">
                                  <span className="participation__fill" style={{ width: `${row.monthly.pct}%` }} />
                                </span>
                                <span className="participation__value">{row.monthly.pct}%</span>
                              </div>
                            </td>
                            <td className="col-year">{row.annual.qty}</td>
                            <td className="col-year">{row.annual.revenue}</td>
                            <td className="col-year">
                              <div className="participation">
                                <span className="participation__bar">
                                  <span className="participation__fill" style={{ width: `${row.annual.pct}%` }} />
                                </span>
                                <span className="participation__value">{row.annual.pct}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* Ranking + Productos mejor valorados */}
              <section className="row-double--bottom">
                <article className="panel panel--ranking">
                  <header className="panel__header">
                    <h3 className="panel__title">Ranking de Productos Más Vendidos</h3>
                  </header>

                  <div className="panel__body">
                    <div className="ranking-chart">
                      <div
                        className="pie-chart"
                        role="img"
                        aria-label={buildPieAriaLabel(data.ranking)}
                        style={{ background: buildPieGradient(data.ranking, RANKING_COLORS) }}
                      >
                        <div className="pie-chart__center">
                          <p className="pie-chart__center-value">100%</p>
                          <p className="pie-chart__center-label">Top 5</p>
                        </div>
                      </div>

                      <ul className="pie-legend">
                        {data.ranking.map((item, i) => (
                          <li className="pie-legend__item" key={item.id}>
                            <span className="pie-legend__dot" style={{ backgroundColor: RANKING_COLORS[i % RANKING_COLORS.length] }} />
                            <p className="pie-legend__name">
                              {medalIcon[item.pos] ? `${medalIcon[item.pos]} ` : ''}{item.name}
                            </p>
                            <p className="pie-legend__value">{item.pct}%</p>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="table-wrapper table-wrapper--vertical">
                      <table className="data-table--ranking">
                        <thead>
                          <tr>
                            <th scope="col">Pos.</th>
                            <th scope="col">Producto</th>
                            <th scope="col">Ventas</th>
                            <th scope="col">Ingreso</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.ranking.map((item) => (
                            <tr key={item.id} className={`ranking-row${item.tone !== 'plain' ? ` ranking-row--${item.tone}` : ''}`}>
                              <td><span className={`medal medal--${item.tone}`}>{item.pos}</span></td>
                              <td>{item.name}</td>
                              <td>{item.qty}</td>
                              <td>{item.tone === 'gold' ? <strong>{item.revenue}</strong> : item.revenue}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </article>

                <article className="panel panel--reviews">
                  <header className="panel__header">
                    <h3 className="panel__title">Productos Mejor Valorados</h3>
                  </header>

                  <div className="panel__body">
                    <ul className="review-list">
                      {data.reviews.map((review) => (
                        <li className="review-item" key={review.id}>
                          <div className="review-item__info">
                            <p className="review-item__name">{review.name}</p>
                            <p className="review-item__count">{review.count} reseñas</p>
                          </div>
                          <div className="review-item__score">
                            <p
                              className="stars"
                              style={{ '--percent': `${(review.score / 5) * 100}%` }}
                              aria-label={`${review.score.toFixed(1)} de 5 estrellas`}
                            />
                            <p className="review-item__number">{review.score.toFixed(1)}/5</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </section>
            </>
          )}
        </section>
      </main>
    </>
  );
}