// Referencias al Modal de PQRS
const modal = document.getElementById('pqrsModal');
const openButtons = document.querySelectorAll('.btn-open-modal');
const cancelButton = document.getElementById('btnCancelModal');
const btnEnviarRespuesta = document.getElementById('btnEnviarRespuesta');
const modalEstadoSelect = document.getElementById('modalEstadoSelect');

// Referencias para los Filtros de la Tabla
const filtroTipo = document.getElementById('filtroTipo');
const filtroEstado = document.getElementById('filtroEstado');
const filtroFecha = document.getElementById('filtroFecha');
const btnActualizarFiltros = document.getElementById('btnActualizarFiltros');
const filasTabla = document.querySelectorAll('.pqrs-table tbody tr');

let filaActual = null;

// Abrir Modal e Interconectar datos del estado
openButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        filaActual = e.target.closest('tr'); 
        
        const badgeActual = filaActual.querySelector('.status-badge');
        if (badgeActual.classList.contains('resolved')) {
            modalEstadoSelect.value = "RESUELTO";
        } else {
            modalEstadoSelect.value = "PENDIENTE";
        }

        modal.classList.add('active');
    });
});

const cerrarModal = () => {
    modal.classList.remove('active');
    filaActual = null;
};

cancelButton.addEventListener('click', cerrarModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) cerrarModal();
});

// Enviar Respuesta y Modificar el Estado en Caliente dentro de la Fila
btnEnviarRespuesta.addEventListener('click', () => {
    if (filaActual) {
        const nuevoEstado = modalEstadoSelect.value;
        const badgeElement = filaActual.querySelector('.status-badge');
        
        badgeElement.textContent = nuevoEstado.charAt(0) + nuevoEstado.slice(1).toLowerCase();
        
        if (nuevoEstado === 'RESUELTO') {
            badgeElement.classList.remove('pending');
            badgeElement.classList.add('resolved');
        } else {
            badgeElement.classList.remove('resolved');
            badgeElement.classList.add('pending');
        }

        document.querySelector('.modal-textarea').value = '';
        cerrarModal();
    }
});

// ==========================================
// NUEVA LÓGICA DE FILTRADO MÚLTIPLE
// ==========================================
btnActualizarFiltros.addEventListener('click', () => {
    const tipoSeleccionado = filtroTipo.value;
    const estadoSeleccionado = filtroEstado.value;
    const fechaSeleccionada = filtroFecha.value;

    // Obtener la fecha de hoy para hacer las matemáticas del filtro
    const hoy = new Date();

    filasTabla.forEach(fila => {
        // 1. Validar Tipo
        const tipoEnFila = fila.querySelector('td:nth-child(2)').textContent.trim();
        const cumpleTipo = (tipoSeleccionado === 'Todos' || tipoEnFila === tipoSeleccionado);

        // 2. Validar Estado
        const estadoEnFila = fila.querySelector('td:nth-child(6)').textContent.trim();
        const cumpleEstado = (estadoSeleccionado === 'Todos' || estadoEnFila === estadoSeleccionado);

        // 3. Validar Fecha
        // Extraemos exactamente los primeros 10 caracteres (la fecha de creación: DD/MM/YYYY)
        const textoFechaCelda = fila.querySelector('td:nth-child(3)').textContent.trim().substring(0, 10);
        const partesFecha = textoFechaCelda.split('/'); // [DD, MM, YYYY]
        
        // Formato en JS (Año, Mes [0-11], Día)
        const fechaFila = new Date(partesFecha[2], partesFecha[1] - 1, partesFecha[0]);
        
        let cumpleFecha = true;

        if (fechaSeleccionada === 'Ultima semana') {
            const haceUnaSemana = new Date();
            haceUnaSemana.setDate(hoy.getDate() - 7);
            cumpleFecha = (fechaFila >= haceUnaSemana && fechaFila <= hoy);
        } 
        else if (fechaSeleccionada === 'Ultimo mes') {
            const haceUnMes = new Date();
            haceUnMes.setMonth(hoy.getMonth() - 1);
            cumpleFecha = (fechaFila >= haceUnMes && fechaFila <= hoy);
        } 
        else if (fechaSeleccionada === 'Año actual') {
            cumpleFecha = (fechaFila.getFullYear() === hoy.getFullYear());
        }

        // 4. Aplicar visibilidad solo si cumple TODAS las reglas
        if (cumpleTipo && cumpleEstado && cumpleFecha) {
            fila.style.display = '';
        } else {
            fila.style.display = 'none';
        }
    });
});

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