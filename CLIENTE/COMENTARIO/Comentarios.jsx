import React, { useState, useEffect } from 'react';
import './Comentarios.css';

const API_URL = 'http://localhost:5000/comentarios';

export default function ComentariosPage() {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [comentarioId, setComentarioId] = useState(null);
  const [nombreInput, setNombreInput] = useState('');
  const [textoInput, setTextoInput] = useState('');
  const [comentarios, setComentarios] = useState([]);

  // Cargar comentarios desde db.json
  const obtenerComentarios = async () => {
    try {
      const res = await fetch(API_URL);
      if (res.ok) {
        const data = await res.json();
        setComentarios(data);
      }
    } catch (error) {
      console.error('Error al obtener comentarios:', error);
    }
  };

  useEffect(() => {
    obtenerComentarios();
  }, []);

  // Crear o editar comentario en db.json
  const handleSubmitComentario = async (e) => {
    e.preventDefault();
    if (!nombreInput.trim() || !textoInput.trim()) return;

    if (comentarioId !== null) {
      // Editar
      const comentarioExistente = comentarios.find((c) => c.id === comentarioId);
      const comentarioActualizado = {
        ...comentarioExistente,
        nombre: nombreInput,
        texto: textoInput,
      };

      try {
        const res = await fetch(`${API_URL}/${comentarioId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(comentarioActualizado),
        });
        if (res.ok) {
          setComentarios((prev) =>
            prev.map((c) => (c.id === comentarioId ? comentarioActualizado : c))
          );
        }
      } catch (error) {
        console.error('Error al actualizar comentario:', error);
      }
    } else {
      // Crear nuevo
      const nuevoComentario = {
        id: String(Date.now()),
        nombre: nombreInput,
        texto: textoInput,
        fecha: new Date().toLocaleDateString('es-CO'),
        likes: 0,
        liked: false,
      };

      try {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nuevoComentario),
        });
        if (res.ok) {
          const comentarioGuardado = await res.json();
          setComentarios((prev) => [comentarioGuardado, ...prev]);
        }
      } catch (error) {
        console.error('Error al guardar comentario:', error);
      }
    }

    handleCloseModal();
  };

  // Eliminar comentario de db.json
  const handleEliminar = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setComentarios((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (error) {
      console.error('Error al eliminar comentario:', error);
    }
  };

  // Alternar Me Gusta en db.json
  const handleLike = async (id) => {
    const comentario = comentarios.find((c) => c.id === id);
    if (!comentario) return;

    const comentarioActualizado = {
      ...comentario,
      liked: !comentario.liked,
      likes: comentario.liked ? comentario.likes - 1 : comentario.likes + 1,
    };

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(comentarioActualizado),
      });
      if (res.ok) {
        setComentarios((prev) =>
          prev.map((c) => (c.id === id ? comentarioActualizado : c))
        );
      }
    } catch (error) {
      console.error('Error al actualizar me gusta:', error);
    }
  };

  const handleOpenModal = (comentario = null) => {
    if (comentario) {
      setComentarioId(comentario.id);
      setNombreInput(comentario.nombre);
      setTextoInput(comentario.texto);
    } else {
      setComentarioId(null);
      setNombreInput('');
      setTextoInput('');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setComentarioId(null);
    setNombreInput('');
    setTextoInput('');
  };

  return (
    <div>
      <div className="contenedor">
        {/* BARRA LATERAL */}
        <aside className="sidebar">
          <div className="logo-container">
            <i className="fa-solid fa-fire logo-fire-icon"></i>
            <span className="logo-text">CFF</span>
          </div>

          <nav>
            <ul>
              <li>
                <a href="#informacion">
                  <i className="fa-solid fa-circle-info sidebar-icon"></i>
                  Información
                </a>
              </li>
              <li>
                <a href="#ubicacion">
                  <i className="fa-solid fa-location-dot sidebar-icon"></i>
                  Ubicación
                </a>
              </li>
              <li>
                <a href="#horarios">
                  <i className="fa-solid fa-calendar-days sidebar-icon"></i>
                  Horarios
                </a>
              </li>
              <li>
                <a href="#menu">
                  <i className="fa-solid fa-utensils sidebar-icon"></i>
                  Menú
                </a>
              </li>
              <li className="activo">
                <a href="#comentarios">
                  <i className="fa-solid fa-comment sidebar-icon"></i>
                  Comentarios
                </a>
              </li>
              <li>
                <a href="#pqrs">
                  <i className="fa-solid fa-users-rectangle sidebar-icon"></i>
                  PQRS
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* CONTENIDO PRINCIPAL */}
        <main className="contenido">
          {/* ENCABEZADO SUPERIOR */}
          <div className="secencabezado">
            <div className="encabezado">
              <h1>Comentarios y Opiniones</h1>
              <p>Conoce las experiencias de nuestros clientes y comparte tu opinión para ayudarnos a seguir mejorando.</p>
            </div>

            <div className="treencabezado">
              {/* Notificaciones */}
              <div className="notification-wrapper">
                <div className="logo1" onClick={() => setIsNotifOpen((prev) => !prev)}>
                  <i className="fa-solid fa-bell icon-header"></i>
                </div>
                <div className={`notification-dropdown-panel ${!isNotifOpen ? 'hidden' : ''}`}>
                  <div className="dropdown-header">
                    <i className="fa-solid fa-bell"></i>
                    <p className="dropdown-title-text">Notificaciones</p>
                  </div>
                  <hr className="dropdown-divider" />
                  <div className="notifications-section">
                    <a href="#local" className="btn-notification-item">
                      <i className="fa-solid fa-shop"></i>
                      <div className="notification-content">
                        <strong>¡Visita nuestro local!</strong>
                        <p>Disfruta del mejor ambiente de CFF.</p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              {/* Perfil de Usuario */}
              <div className="user-profile-wrapper">
                <div className="logo2" onClick={() => setIsUserMenuOpen((prev) => !prev)}>
                  <i className="fa-regular fa-circle-user icon-header"></i>
                </div>
                <div className={`user-dropdown-panel ${!isUserMenuOpen ? 'hidden' : ''}`}>
                  <div className="dropdown-header">
                    <div className="user-avatar">
                      <i className="fa-solid fa-circle-user"></i>
                    </div>
                    <p className="user-email">Karen Pinzón</p>
                  </div>
                  <hr className="dropdown-divider" />
                  <div className="actions-section">
                    <a href="#logout" className="btn-dropdown btn-logout">
                      <i className="fa-solid fa-arrow-right-from-bracket"></i> Cerrar Sesión
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CONTENEDOR BLANCO CON SOMBRA */}
          <div className="contenido-principal">
            <h2 className="comentarios-titulo">Lo que dicen nuestros clientes</h2>

            {comentarios.length > 0 ? (
              <div className="comentarios-grid">
                {comentarios.map((item) => (
                  <div key={item.id} className="comentario-card">
                    <div className="comentario-cabecera">
                      <div className="comentario-avatar">
                        <i className="fa-solid fa-user"></i>
                      </div>
                      <span className="comentario-nombre">{item.nombre}</span>
                    </div>

                    <p className="comentario-texto">{item.texto}</p>

                    <div className="comentario-pie">
                      <span className="comentario-fecha">{item.fecha}</span>
                      <div className="comentario-acciones-wrapper">
                        <button
                          className={`comentario-like ${item.liked ? 'activo' : ''}`}
                          onClick={() => handleLike(item.id)}
                        >
                          <i className={item.liked ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
                          <span>{item.likes}</span>
                        </button>
                        <div className="comentario-acciones-card">
                          <button title="Editar" onClick={() => handleOpenModal(item)}>
                            <i className="fa-solid fa-pen"></i>
                          </button>
                          <button
                            className="btn-eliminar-comentario"
                            title="Eliminar"
                            onClick={() => handleEliminar(item.id)}
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="sin-comentarios">
                Aún no hay comentarios. ¡Sé el primero en opinar!
              </p>
            )}

            {/* Aviso CTA */}
            <div className="aviso-comentario">
              <div className="aviso-icono-contenedor">
                <i className="fa-solid fa-comment-dots aviso-icono"></i>
              </div>
              <div className="aviso-texto">
                <strong>No has realizado tu comentario</strong>
                <span>Cuéntanos cómo fue tu experiencia, ¡tu opinión nos ayuda a mejorar!</span>
              </div>
              <button className="aviso-btn" onClick={() => handleOpenModal()}>
                <i className="fa-solid fa-pen"></i>
                Comentar
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* MODAL PARA AGREGAR / EDITAR */}
      <div className={`modal-overlay ${isModalOpen ? 'activo' : ''}`}>
        <div className="modal-box">
          <div className="modal-header">
            <i className="fa-regular fa-comment"></i>
            <h3>{comentarioId !== null ? 'Editar comentario' : 'Nuevo comentario'}</h3>
            <span className="modal-cerrar" onClick={handleCloseModal}>&times;</span>
          </div>

          <form onSubmit={handleSubmitComentario}>
            <label>Tu nombre</label>
            <input
              type="text"
              placeholder="Escribe tu nombre"
              value={nombreInput}
              onChange={(e) => setNombreInput(e.target.value)}
              required
            />

            <label>Comentario</label>
            <textarea
              rows={4}
              placeholder="Cuéntanos tu experiencia..."
              value={textoInput}
              onChange={(e) => setTextoInput(e.target.value)}
              required
            ></textarea>

            <div className="modal-acciones">
              <button type="button" className="btn-cancelar" onClick={handleCloseModal}>
                Cancelar
              </button>
              <button type="submit" className="btn-enviar">
                {comentarioId !== null ? 'Guardar' : 'Publicar'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* PIE DE PÁGINA / FOOTER */}
      <footer className="custom-footer">
        <div className="footer-info">
          <h2 className="footer-title">CONTACTO</h2>
          <ul className="contact-list">
            <li>
              <i className="fa-solid fa-location-arrow"></i>
              <span>Cl. 32 Sur #23 F 14, Bogotá, Colombia</span>
            </li>
            <li>
              <i className="fa-solid fa-phone"></i>
              <span>+57 311 8370904</span>
            </li>
            <li>
              <i className="fa-solid fa-clock"></i>
              <span>Martes a Domingo de 2 pm a 10 pm</span>
            </li>
          </ul>
          <a
            href="https://maps.google.com/?q=Cl.+32+Sur+%2323f-14,+Bogotá"
            target="_blank"
            rel="noreferrer"
            className="map-button"
          >
            Ver en el mapa <span className="arrow">›</span>
          </a>
        </div>

        <div className="footer-map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3977.0392348398457!2d-74.10398322523777!3d4.587391995387431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9919fcd7c191%3A0xc48fe33ee5ecf5c9!2sCl.%2032%20Sur%20%2323f-14%2C%20Bogot%C3%A1!5e0!3m2!1ses!2sco!4v1717616000000!5m2!1ses!2sco"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            title="Ubicación CFF"
          ></iframe>
        </div>
      </footer>
    </div>
  );
}