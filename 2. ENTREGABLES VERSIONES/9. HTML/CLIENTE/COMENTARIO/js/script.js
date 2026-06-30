/* ===================================================
   CFF - Comentarios y Opiniones
   =================================================== */

const COMENTARIOS_KEY  = 'cffComentarios';
const COMENTARIOS_SEQ  = 'cffComentariosContador';
const COMENTARIOS_VER  = 'cffComentariosVersion';
const VERSION_ACTUAL   = '3'; // súbela si vuelves a precargar ejemplos nuevos

const COMENTARIOS_EJEMPLO = [
    {
        id: 'C0001',
        nombre: 'Carlos Andrade',
        texto: 'Excelente atención y la comida llegó calientita. Las hamburguesas son enormes, definitivamente vuelvo a pedir.',
        fecha: '19 jun 2026',
        hora: '08:45 p. m.',
        likes: 4,
        likeDado: false
    },
    {
        id: 'C0002',
        nombre: 'María Fernanda López',
        texto: 'Buen sabor en general, aunque la entrega tardó un poco más de lo esperado. Las papas estaban perfectas.',
        fecha: '19 jun 2026',
        hora: '06:10 p. m.',
        likes: 2,
        likeDado: false
    },
    {
        id: 'C0003',
        nombre: 'Diego Sánchez',
        texto: 'El mejor fast food de la zona. Precios justos y porciones generosas. Recomendado totalmente.',
        fecha: '18 jun 2026',
        hora: '01:20 p. m.',
        likes: 7,
        likeDado: false
    },
    {
        id: 'C0004',
        nombre: 'Natalia Herrera',
        texto: 'Pedí una combo familiar y todo llegó completo y bien empacado. Muy buena relación calidad-precio.',
        fecha: '18 jun 2026',
        hora: '09:05 p. m.',
        likes: 3,
        likeDado: false
    },
    {
        id: 'C0005',
        nombre: 'Carlos Andrade',
        texto: 'Me encantó la salsa de la casa, le da un toque diferente a las alitas. Seguiré siendo cliente.',
        fecha: '17 jun 2026',
        hora: '07:30 p. m.',
        likes: 5,
        likeDado: false
    },

];

document.addEventListener('DOMContentLoaded', () => {

    inicializarComentarios();

    const btnPublicar          = document.getElementById('btnPublicar');
    const modal                = document.getElementById('modalComentario');
    const cerrarModalBtn       = document.getElementById('cerrarModalComentario');
    const cancelarBtn          = document.getElementById('btnCancelarComentario');
    const formComentario       = document.getElementById('formComentario');

    btnPublicar.addEventListener('click', () => abrirModalComentario());

    cerrarModalBtn.addEventListener('click', cerrarModalComentario);
    cancelarBtn.addEventListener('click', cerrarModalComentario);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) cerrarModalComentario();
    });

    formComentario.addEventListener('submit', (e) => {
        e.preventDefault();
        guardarComentario();
    });

    renderComentarios();
});


/* ---------- Almacenamiento ---------- */

function inicializarComentarios() {
    const versionGuardada = localStorage.getItem(COMENTARIOS_VER);
    const guardado         = localStorage.getItem(COMENTARIOS_KEY);

    let lista = [];
    let datosCorruptos = false;

    if (guardado) {
        try {
            lista = JSON.parse(guardado);
            if (!Array.isArray(lista)) datosCorruptos = true;
        } catch (e) {
            datosCorruptos = true;
        }
    }

    // Recarga los ejemplos limpios si: nunca se guardó nada, quedó vacío,
    // los datos están corruptos, o cambió la versión de los ejemplos
    const necesitaRecarga =
        !guardado ||
        lista.length === 0 ||
        datosCorruptos ||
        versionGuardada !== VERSION_ACTUAL;

    if (necesitaRecarga) {
        guardarComentarios(COMENTARIOS_EJEMPLO);
        localStorage.setItem(COMENTARIOS_SEQ, COMENTARIOS_EJEMPLO.length.toString());
        localStorage.setItem(COMENTARIOS_VER, VERSION_ACTUAL);
    }
}

function obtenerComentarios() {
    return JSON.parse(localStorage.getItem(COMENTARIOS_KEY) || '[]');
}

function guardarComentarios(comentarios) {
    localStorage.setItem(COMENTARIOS_KEY, JSON.stringify(comentarios));
}

function obtenerSiguienteIdComentario() {
    let contador = parseInt(localStorage.getItem(COMENTARIOS_SEQ) || '0');
    contador++;
    localStorage.setItem(COMENTARIOS_SEQ, contador.toString());
    return contador;
}


/* ---------- Modal ---------- */

function abrirModalComentario(comentario = null) {
    const modal        = document.getElementById('modalComentario');
    const titulo        = document.getElementById('modalComentarioTitulo');
    const idInput        = document.getElementById('comentarioId');
    const nombreInput    = document.getElementById('comentarioNombre');
    const textoInput     = document.getElementById('comentarioTexto');

    idInput.value     = comentario ? comentario.id : '';
    nombreInput.value = comentario ? comentario.nombre : '';
    textoInput.value  = comentario ? comentario.texto : '';

    titulo.textContent = comentario ? 'Editar comentario' : 'Nuevo comentario';

    modal.classList.add('activo');
    nombreInput.focus();
}

function cerrarModalComentario() {
    document.getElementById('modalComentario').classList.remove('activo');
    document.getElementById('formComentario').reset();
}


/* ---------- CRUD ---------- */

function guardarComentario() {
    const id     = document.getElementById('comentarioId').value;
    const nombre = document.getElementById('comentarioNombre').value.trim();
    const texto  = document.getElementById('comentarioTexto').value.trim();

    if (!nombre || !texto) return;

    let comentarios = obtenerComentarios();

    if (id) {
        // Editar: conserva id, fecha original y likes
        comentarios = comentarios.map(c =>
            c.id === id ? { ...c, nombre, texto } : c
        );
    } else {
        const numero = obtenerSiguienteIdComentario();
        const ahora  = new Date();

        comentarios.unshift({
            id: 'C' + String(numero).padStart(4, '0'),
            nombre,
            texto,
            fecha: ahora.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }),
            hora: ahora.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
            likes: 0,
            likeDado: false
        });
    }

    guardarComentarios(comentarios);
    renderComentarios();
    cerrarModalComentario();
}

function editarComentario(id) {
    const comentario = obtenerComentarios().find(c => c.id === id);
    if (comentario) abrirModalComentario(comentario);
}

function eliminarComentario(id) {
    if (!confirm('¿Seguro que deseas eliminar este comentario?')) return;
    const comentarios = obtenerComentarios().filter(c => c.id !== id);
    guardarComentarios(comentarios);
    renderComentarios();
}

function alternarLike(id) {
    const comentarios = obtenerComentarios().map(c => {
        if (c.id === id) {
            const likeDado = !c.likeDado;
            const likes    = likeDado ? c.likes + 1 : c.likes - 1;
            return { ...c, likeDado, likes };
        }
        return c;
    });
    guardarComentarios(comentarios);
    renderComentarios();
}


/* ---------- Render ---------- */

function renderComentarios() {
    const contenedor     = document.getElementById('listaComentarios');
    const sinComentarios = document.getElementById('sinComentarios');
    const avisoComentario = document.getElementById('avisoComentario');
    const comentarios    = obtenerComentarios();

    contenedor.innerHTML = '';

    if (comentarios.length === 0) {
        sinComentarios.style.display = 'block';
        if (avisoComentario) avisoComentario.style.display = 'flex';
        return;
    }
    sinComentarios.style.display = 'none';
    if (avisoComentario) avisoComentario.style.display = 'flex';

    comentarios.forEach(comentario => {
        const card = document.createElement('div');
        card.className = 'comentario-card';
        card.innerHTML = `
            <div class="comentario-cabecera">
                <div class="comentario-avatar"><i class="fa-solid fa-user"></i></div>
                <span class="comentario-nombre">${escapeHTML(comentario.nombre)}</span>
            </div>

            <p class="comentario-texto">${escapeHTML(comentario.texto)}</p>

            <div class="comentario-pie">
                <div class="comentario-meta">
                    <span class="comentario-id">#${comentario.id}</span>
                    <span class="comentario-fecha">${comentario.fecha} · ${comentario.hora}</span>
                </div>

                <button class="comentario-like ${comentario.likeDado ? 'activo' : ''}" data-id="${comentario.id}">
                    <span>${comentario.likes}</span>
                    <i class="fa-solid fa-heart"></i>
                </button>

                <div class="comentario-acciones-card">
                    <button class="btn-editar-comentario" title="Editar" data-id="${comentario.id}">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn-eliminar-comentario" title="Eliminar" data-id="${comentario.id}">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        `;

        card.querySelector('.comentario-like').addEventListener('click', () => alternarLike(comentario.id));
        card.querySelector('.btn-editar-comentario').addEventListener('click', () => editarComentario(comentario.id));
        card.querySelector('.btn-eliminar-comentario').addEventListener('click', () => eliminarComentario(comentario.id));

        contenedor.appendChild(card);
    });
}


/* ---------- Utilidades ---------- */

function escapeHTML(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

    /* ===================================================
       CONTROL UNIFICADO DE PANELES (NOTIFICACIONES Y USUARIO)
       =================================================== */
    
    // Selectores de Usuario
    const userMenuBtn = document.getElementById("user-menu-btn");
    const userDropdown = document.getElementById("user-dropdown");
    const closeUserBtn = document.getElementById("close-user-btn"); // ID Corregido según tu HTML

    // Selectores de Notificaciones
    const notificationMenuBtn = document.getElementById("notification-menu-btn");
    const notificationDropdown = document.getElementById("notification-dropdown");
    const closeNotificationsBtn = document.getElementById("close-notifications-btn");

    // --- INTERACCIÓN PANEL NOTIFICACIONES ---
    if (notificationMenuBtn && notificationDropdown) {
        notificationMenuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (userDropdown) userDropdown.classList.add("hidden"); // Cierra usuario si está abierto
            notificationDropdown.classList.toggle("hidden");
        });

        if (closeNotificationsBtn) {
            closeNotificationsBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                notificationDropdown.classList.add("hidden");
            });
        }

        notificationDropdown.addEventListener("click", (e) => {
            e.stopPropagation(); // Evita que se cierre al hacer clic dentro del cuadro negro
        });
    }

    // --- INTERACCIÓN PANEL USUARIO ---
    if (userMenuBtn && userDropdown) {
        userMenuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (notificationDropdown) notificationDropdown.classList.add("hidden"); // Cierra notificaciones si está abierto
            userDropdown.classList.toggle("hidden");
        });

        if (closeUserBtn) {
            closeUserBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                userDropdown.classList.add("hidden");
            });
        }

        userDropdown.addEventListener("click", (e) => {
            e.stopPropagation(); // Evita que se cierre al hacer clic dentro del menú
        });
    }

    // --- EVENTO DE CIERRE GLOBAL ---
    // Un solo listener para toda la pantalla limpia sin repeticiones
    document.addEventListener("click", () => {
        if (userDropdown) userDropdown.classList.add("hidden");
        if (notificationDropdown) notificationDropdown.classList.add("hidden");
    });