// ---- Configuración general ----
const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DIAS_SEMANA_LU0 = ["LU","MA","MI","JU","VI","SA","DO"];

// Límite: desde Junio 2026 hasta Enero 2027 (inclusive)
const LIMITE_MIN = {year: 2026, month: 5};  // Junio 2026 (month es 0-index)
const LIMITE_MAX = {year: 2027, month: 0};  // Enero 2027

let vista = {year: 2026, month: 5}; // mes que se está mostrando actualmente

// Textos predefinidos según el tipo de día
const TEXTOS_PREDEFINIDOS = {
    cerrado: "Este día el restaurante estará cerrado.",
    selected: "Este día habrá un evento especial."
};

// ---- Almacenamiento de días especiales ----
// Estructura: { "2026-5": { 23: {type:"selected", motivo:"..."} }, "2026-6": {...} }
function cargarTodosLosDatos() {
    try {
        return JSON.parse(localStorage.getItem('corralejo_specialDays')) || migrarDatosAntiguos();
    } catch {
        return migrarDatosAntiguos();
    }
}

// Si existía el formato viejo (solo junio 2026), lo migramos para no perder datos
function migrarDatosAntiguos() {
    const viejo = JSON.parse(localStorage.getItem('specialDaysJunio2026'));
    if (viejo) {
        const nuevo = { "2026-5": viejo };
        localStorage.setItem('corralejo_specialDays', JSON.stringify(nuevo));
        return nuevo;
    }
    return {};
}

let todosLosDatos = cargarTodosLosDatos();

function claveMes(year, month) { return `${year}-${month}`; }

function getDatosMes(year, month) {
    return todosLosDatos[claveMes(year, month)] || {};
}

function guardarTodo() {
    localStorage.setItem('corralejo_specialDays', JSON.stringify(todosLosDatos));
}

// ---- Navegación de mes ----
function dentroDeLimite(year, month) {
    const idx = year * 12 + month;
    const min = LIMITE_MIN.year * 12 + LIMITE_MIN.month;
    const max = LIMITE_MAX.year * 12 + LIMITE_MAX.month;
    return idx >= min && idx <= max;
}

function cambiarMes(delta) {
    let { year, month } = vista;
    month += delta;
    if (month < 0) { month = 11; year--; }
    if (month > 11) { month = 0; year++; }
    if (!dentroDeLimite(year, month)) return;
    vista = { year, month };
    renderCalendar();
}

// ---- Render del calendario ----
function renderCalendar() {
    const { year, month } = vista;
    document.getElementById('calendar-header').textContent = `${MESES[month]} ${year}`;

    // Botones deshabilitados visualmente en los límites
    const btns = document.querySelectorAll('.calendar-header button');
    btns[0].style.opacity = dentroDeLimite(year, month - 1 < 0 ? -1 : year) && dentroDeLimite(month === 0 ? year - 1 : year, month === 0 ? 11 : month - 1) ? 1 : .35;
    btns[1].style.opacity = dentroDeLimite(month === 11 ? year + 1 : year, month === 11 ? 0 : month + 1) ? 1 : .35;

    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';

    const primerDiaSemana = new Date(year, month, 1).getDay(); // 0=Domingo
    const offset = (primerDiaSemana + 6) % 7; // convertir a Lunes=0
    const diasEnMes = new Date(year, month + 1, 0).getDate();
    const diasMesAnterior = new Date(year, month, 0).getDate();

    const datosMes = getDatosMes(year, month);
    const hoy = new Date();
    const esMesActual = hoy.getFullYear() === year && hoy.getMonth() === month;

    // Días del mes anterior (relleno, no clicables)
    for (let i = offset - 1; i >= 0; i--) {
        const d = document.createElement('div');
        d.textContent = diasMesAnterior - i;
        d.classList.add('otro-mes');
        calendar.appendChild(d);
    }

    // Días del mes actual
    for (let i = 1; i <= diasEnMes; i++) {
        const day = document.createElement('div');
        day.textContent = i;
        if (datosMes[i]) day.classList.add(datosMes[i].type);
        if (esMesActual && hoy.getDate() === i) day.classList.add('hoy');
        day.onclick = () => abrirModalDia(i);
        calendar.appendChild(day);
    }

    renderSpecialDaysList();
}

// ---- Modal de día ----
let tipoActual = "normal";

function seleccionarTipo(tipo) {
    tipoActual = tipo;
    document.getElementById('opcionNormal').classList.toggle('activo', tipo === 'normal');
    document.getElementById('opcionCerrado').classList.toggle('activo', tipo === 'cerrado');
    document.getElementById('opcionSelected').classList.toggle('activo', tipo === 'selected');

    const grupoMotivo = document.getElementById('grupoMotivo');
    const motivoEl = document.getElementById('motivo');

    if (tipo === 'normal') {
        grupoMotivo.style.display = 'none';
    } else {
        grupoMotivo.style.display = 'block';
        // Si el campo está vacío o tenía el texto predefinido del otro tipo, lo autocompletamos
        const esTextoPredefinido = Object.values(TEXTOS_PREDEFINIDOS).includes(motivoEl.value.trim());
        if (!motivoEl.value.trim() || esTextoPredefinido) {
            motivoEl.value = TEXTOS_PREDEFINIDOS[tipo];
        }
    }
}

function abrirModalDia(dia) {
    const { year, month } = vista;
    const datosMes = getDatosMes(year, month);
    const data = datosMes[dia] || { type: "normal", motivo: "" };

    document.getElementById('diaSeleccionado').textContent = dia;
    document.getElementById('fechaCompletaModal').textContent = `${dia} de ${MESES[month]} de ${year}`;
    document.getElementById('motivo').value = data.motivo;
    document.getElementById('modalHorario').dataset.dia = dia;

    seleccionarTipo(data.type);
    document.getElementById('modalHorario').style.display = 'flex';
}

function guardarDiaEspecial() {
    const { year, month } = vista;
    const dia = parseInt(document.getElementById('modalHorario').dataset.dia);
    const motivo = document.getElementById('motivo').value.trim();
    const key = claveMes(year, month);

    if (!todosLosDatos[key]) todosLosDatos[key] = {};

    if (tipoActual === "normal") {
        delete todosLosDatos[key][dia];
        if (Object.keys(todosLosDatos[key]).length === 0) delete todosLosDatos[key];
    } else {
        todosLosDatos[key][dia] = { type: tipoActual, motivo: motivo || TEXTOS_PREDEFINIDOS[tipoActual] };
    }

    guardarTodo();
    renderCalendar();
    cerrarModalHorario();
}

function eliminarDiaEspecial(year, month, dia) {
    const key = claveMes(year, month);
    if (todosLosDatos[key]) {
        delete todosLosDatos[key][dia];
        if (Object.keys(todosLosDatos[key]).length === 0) delete todosLosDatos[key];
        guardarTodo();
        renderCalendar();
    }
}

function cerrarModalHorario() {
    document.getElementById('modalHorario').style.display = 'none';
}

// ---- Lista de días especiales del mes visible ----
function renderSpecialDaysList() {
    const { year, month } = vista;
    const datosMes = getDatosMes(year, month);
    const container = document.getElementById('specialDaysList');
    let html = `<h4>Días especiales este mes:</h4>`;

    const sortedDays = Object.keys(datosMes).sort((a, b) => a - b);

    if (sortedDays.length === 0) {
        html += `<p style="color:#888; font-style:italic;">No hay días especiales configurados este mes.</p>`;
    } else {
        sortedDays.forEach(dia => {
            const d = datosMes[dia];
            const esCerrado = d.type === "cerrado";
            const label = esCerrado ? "Cerrado" : "Evento";
            html += `
                <div class="special-item ${esCerrado ? 'tipo-cerrado' : ''}">
                    <span class="special-item-badge">${label}</span>
                    <div class="special-item-body">
                        <p>${escaparHtml(d.motivo)}</p>
                    </div>
                    <span class="special-item-date">${dia} ${MESES[month].slice(0,3)}</span>
                    <button class="special-item-remove" title="Eliminar" onclick="eliminarDiaEspecial(${year}, ${month}, ${dia})">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>`;
        });
    }
    container.innerHTML = html;
}

function escaparHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

// ---- Modal Información ----
function abrirModalInfo(){
    document.getElementById('modalInfo').style.display='flex';
    document.getElementById('editNombre').value = document.getElementById('nombre').textContent;
    document.getElementById('editDescripcion').value = document.getElementById('descripcion').textContent;
    document.getElementById('editCiudad').value = document.getElementById('ciudad').textContent;
    document.getElementById('editTelefono').value = document.getElementById('telefono').textContent;
    document.getElementById('editWhatsapp').value = document.getElementById('whatsapp').textContent;
}
function cerrarModalInfo(){document.getElementById('modalInfo').style.display='none';}
function guardarInfo(){
    document.getElementById('nombre').textContent = document.getElementById('editNombre').value || "Corralejo Fast Food";
    document.getElementById('descripcion').textContent = document.getElementById('editDescripcion').value;
    document.getElementById('ciudad').textContent = document.getElementById('editCiudad').value;
    document.getElementById('telefono').textContent = document.getElementById('editTelefono').value;
    document.getElementById('whatsapp').textContent = document.getElementById('editWhatsapp').value;
    cerrarModalInfo();
}

// Cerrar modales al hacer click fuera del contenido
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });
});

// Inicializar
renderCalendar();

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