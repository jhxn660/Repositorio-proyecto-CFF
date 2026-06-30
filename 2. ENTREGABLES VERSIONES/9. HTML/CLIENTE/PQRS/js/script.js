const TIPOS = {
    peticion:   { nombre: 'Petición',   icono: 'fa-file-lines' },
    queja:      { nombre: 'Queja',      icono: 'fa-bullhorn' },
    reclamo:    { nombre: 'Reclamo',    icono: 'fa-triangle-exclamation' },
    sugerencia: { nombre: 'Sugerencia', icono: 'fa-lightbulb' }
};

const STORAGE_KEY = 'cffPqrsRegistros';
const CONTADOR_KEY = 'cffPqrsContadorGlobal';

document.addEventListener('DOMContentLoaded', () => {

    const tarjetas        = document.querySelectorAll('.pqrs-card');
    const modal            = document.getElementById('modalPQRS');
    const cerrarModalBtn   = document.getElementById('cerrarModal');
    const cancelarBtn      = document.getElementById('btnCancelar');
    const formPQRS          = document.getElementById('formPQRS');

    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener('click', () => {
            tarjetas.forEach(t => t.classList.remove('seleccionada'));
            tarjeta.classList.add('seleccionada');
            abrirModal('crear', tarjeta.dataset.tipo);
        });
    });

    cerrarModalBtn.addEventListener('click', cerrarModal);
    cancelarBtn.addEventListener('click', cerrarModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) cerrarModal();
    });

    formPQRS.addEventListener('submit', (e) => {
        e.preventDefault();
        guardarRegistro();
    });

    renderLista();
});

function obtenerRegistros() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function guardarRegistros(registros) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registros));
}

function obtenerSiguienteNumero() {
    let contadorActual = parseInt(localStorage.getItem(CONTADOR_KEY) || '0');
    contadorActual++;
    localStorage.setItem(CONTADOR_KEY, contadorActual.toString());
    return contadorActual;
}


function abrirModal(modo, tipo, registro = null) {
    const modal        = document.getElementById('modalPQRS');
    const modalIcono    = document.getElementById('modalIcono');
    const modalTitulo   = document.getElementById('modalTitulo');
    const idInput        = document.getElementById('pqrsId');
    const tipoInput      = document.getElementById('pqrsTipo');
    const asuntoInput    = document.getElementById('pqrsAsunto');
    const descInput      = document.getElementById('pqrsDescripcion');
    const btnEnviar       = document.getElementById('btnEnviar');

    const info = TIPOS[tipo];
    modalIcono.className = `fa-solid ${info.icono}`;

    idInput.value   = registro ? registro.id : '';
    tipoInput.value = tipo;
    asuntoInput.value = registro ? registro.asunto : '';
    descInput.value   = registro ? registro.descripcion : '';

    const soloLectura = modo === 'ver';
    asuntoInput.readOnly = soloLectura;
    descInput.readOnly   = soloLectura;
    btnEnviar.style.display = soloLectura ? 'none' : 'inline-block';

    if (modo === 'crear')      modalTitulo.textContent = `Nueva ${info.nombre}`;
    else if (modo === 'editar') modalTitulo.textContent = `Editar ${info.nombre}`;
    else                         modalTitulo.textContent = info.nombre;

    modal.classList.add('activo');
}

function cerrarModal() {
    document.getElementById('modalPQRS').classList.remove('activo');
    document.getElementById('formPQRS').reset();
}


function guardarRegistro() {
    const id     = document.getElementById('pqrsId').value;
    const tipo   = document.getElementById('pqrsTipo').value;
    const asunto = document.getElementById('pqrsAsunto').value.trim();
    const desc   = document.getElementById('pqrsDescripcion').value.trim();

    let registros = obtenerRegistros();

    if (id) {
        registros = registros.map(r =>
            r.id === id ? { ...r, asunto, descripcion: desc } : r
        );
    } else {
        const numeroConsecutivo = obtenerSiguienteNumero();

        registros.unshift({
            id: Date.now().toString(),
            tipo,
            asunto,
            descripcion: desc,
            numeroGlobal: numeroConsecutivo,
            fecha: new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }),
            estado: 'pendiente'
        });
    }

    guardarRegistros(registros);
    renderLista();
    cerrarModal();
}

function eliminarRegistro(id) {
    if (!confirm('¿Seguro que deseas eliminar esta solicitud?')) return;
    const registros = obtenerRegistros().filter(r => r.id !== id);
    guardarRegistros(registros);
    renderLista();
}


function renderLista() {
    const contenedor   = document.getElementById('listaPQRS');
    const sinRegistros = document.getElementById('sinRegistros');
    const registros    = obtenerRegistros();

    contenedor.querySelectorAll('.registro-pqrs').forEach(el => el.remove());

    if (registros.length === 0) {
        sinRegistros.style.display = 'block';
        return;
    }
    sinRegistros.style.display = 'none';

    registros.forEach(registro => {
        const info = TIPOS[registro.tipo];

        const item = document.createElement('div');
        item.className = 'registro-pqrs';
        item.innerHTML = `
            <i class="fa-solid ${info.icono} icono-tipo"></i>
            <div class="registro-info">
                <div class="registro-asunto">${info.nombre} #${registro.numeroGlobal}: ${registro.asunto}</div>
                <div class="registro-meta">${registro.fecha}</div>
            </div>
            <span class="estado-badge estado-${registro.estado}">${registro.estado}</span>
            <div class="registro-acciones">
                <button class="btn-ver" title="Ver"><i class="fa-solid fa-eye"></i></button>
                <button class="btn-editar" title="Editar"><i class="fa-solid fa-pen"></i></button>
                <button class="btn-eliminar" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;

        item.querySelector('.btn-ver').addEventListener('click', () => abrirModal('ver', registro.tipo, registro));
        item.querySelector('.btn-editar').addEventListener('click', () => abrirModal('editar', registro.tipo, registro));
        item.querySelector('.btn-eliminar').addEventListener('click', () => eliminarRegistro(registro.id));

        contenedor.appendChild(item);
    });
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