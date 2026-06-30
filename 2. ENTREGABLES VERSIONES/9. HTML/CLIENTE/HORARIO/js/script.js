document.addEventListener("DOMContentLoaded", () => {
    const selectorButton = document.getElementById("month-year-selector");
    const arrowIcon = document.getElementById("arrow-icon");
    const monthsPanel = document.getElementById("months-panel");
    const yearsPanel = document.getElementById("years-panel");
    const dotsToggle = document.getElementById("dots-toggle");
    
    const currentMonthYearText = document.getElementById("current-month-year-text");
    const infoDateText = document.getElementById("info-date");
    const infoContentText = document.getElementById("info-text");
    const dayCells = document.querySelectorAll(".interactive-day");

    // Base de datos simulada para los comentarios de cada día
    const infoPorDia = {
        "4": "La hamburguesa clásica fue el mejor plato valorado, ya que cuenta con ingredientes frescos y de mucho sabor para el paladar.",
        "5": "Día especial: ¡Promoción de Mazorcadas CFF! Los clientes disfrutaron de adiciones de queso gratis en todos sus pedidos.",
        "6": "Noche de Burritos: Alta demanda en pedidos a domicilio por la consistencia de nuestras tortillas suaves y salsas artesanales."
    };

    let mesSeleccionado = "Marzo";
    let anioSeleccionado = "2026";

    // 1. Alternar Panel de Meses (Clic en "Marzo, 2026")
    selectorButton.addEventListener("click", (e) => {
        e.stopPropagation();
        monthsPanel.classList.toggle("hidden");
        yearsPanel.classList.add("hidden"); // Asegura cerrar el de años
        arrowIcon.classList.toggle("rotated");
    });

    // 2. Alternar Panel de Años (Clic en los tres puntos "•••")
    dotsToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        yearsPanel.classList.toggle("hidden");
        monthsPanel.classList.add("hidden"); // Asegura cerrar el de meses
    });

    // 3. Selección de un Mes
    const monthButtons = document.querySelectorAll(".month-btn");
    monthButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            monthButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            mesSeleccionado = btn.getAttribute("data-month");
            actualizarCabecera();
            monthsPanel.classList.add("hidden");
            arrowIcon.classList.remove("rotated");
        });
    });

    // 4. Selección de un Año
    const yearItems = document.querySelectorAll(".year-item");
    yearItems.forEach(item => {
        item.addEventListener("click", () => {
            yearItems.forEach(y => y.classList.remove("active"));
            item.classList.add("active");
            
            anioSeleccionado = item.getAttribute("data-year");
            actualizarCabecera();
            yearsPanel.classList.add("hidden");
        });
    });

    // Función auxiliar para cambiar el texto de cabecera
    function actualizarCabecera() {
        currentMonthYearText.textContent = `${mesSeleccionado}, ${anioSeleccionado}`;
    }

    // 5. Cambio dinámico al seleccionar un día del calendario (4, 5 o 6)
    dayCells.forEach(cell => {
        cell.addEventListener("click", () => {
            // Quitar clase seleccionada del día anterior
            dayCells.forEach(c => c.classList.remove("selected"));
            // Añadir al día actual
            cell.classList.add("selected");

            const numeroDia = cell.getAttribute("data-day");
            const diaFormateado = numeroDia.padStart(2, '0');
            
            // Actualizar título de la Info Card
            infoDateText.textContent = `${mesSeleccionado}, ${diaFormateado} / 03 / 26`;
            
            // Actualizar texto descriptivo dinámicamente
            if (infoPorDia[numeroDia]) {
                infoContentText.textContent = infoPorDia[numeroDia];
            } else {
                infoContentText.textContent = "No hay eventos registrados o comentarios destacados para este día.";
            }
        });
    });

    // Cerrar paneles si se hace clic en cualquier otra parte de la pantalla
    document.addEventListener("click", () => {
        monthsPanel.classList.add("hidden");
        yearsPanel.classList.add("hidden");
        arrowIcon.classList.remove("rotated");
    });

    // --- LOGICA DE CONCURRENCIA SIMPLIFICADA (1 PM - 10 PM) ---
const datasetConcurrencia = {
    "LUN": { cerrado: true },
    "MAR": { barras: [15, 25, 35, 45, 55, 65, 80, 95, 70, 40], indexDestacado: 7 }, 
    "MIÉ": { barras: [20, 30, 40, 50, 55, 65, 75, 85, 95, 50], indexDestacado: 8 }, 
    "JUE": { barras: [15, 20, 35, 55, 70, 85, 95, 60, 45, 30], indexDestacado: 6 }, 
    "VIE": { barras: [25, 45, 60, 80, 95, 110, 95, 85, 75, 60], indexDestacado: 5 }, 
    "SÁB": { barras: [30, 50, 70, 85, 95, 110, 95, 90, 80, 65], indexDestacado: 5 }, 
    "DOM": { barras: [40, 65, 85, 100, 105, 95, 75, 55, 35, 20], indexDestacado: 4 }  
};

function cargarGraficoConcurrencia(dia) {
    const data = datasetConcurrencia[dia];
    const barsContainer = document.getElementById("bars-container");
    const closedContainer = document.getElementById("closed-message-container");
    const chartWrapper = document.querySelector(".chart-wrapper");
    const timeAxis = document.querySelector(".time-axis");

    // Limpiar elementos
    barsContainer.innerHTML = "";
    closedContainer.innerHTML = "";

    if (data.cerrado) {
        // Ocultar gráfica e indicar cierre
        chartWrapper.style.display = "none";
        timeAxis.style.display = "none";
        closedContainer.innerHTML = `<div class="closed-text-alert">Cerrado los lunes</div>`;
    } else {
        // Mostrar gráfica si estaba oculta
        chartWrapper.style.display = "block";
        timeAxis.style.display = "flex";

        // Inyectar barras estructuradas (Borde negro / Fondo blanco)
        data.barras.forEach((altura, index) => {
            const bar = document.createElement("div");
            bar.classList.add("bar");
            bar.style.height = `${altura}px`;

            if (index === data.indexDestacado) {
                bar.classList.add("highlighted");
            }

            barsContainer.appendChild(bar);
        });
    }
}

// Configurar los manejadores de eventos en los botones de los días
document.querySelectorAll(".day-tab").forEach(tab => {
    tab.addEventListener("click", (e) => {
        document.querySelectorAll(".day-tab").forEach(t => t.classList.remove("active"));
        e.target.classList.add("active");
        
        const diaSeleccionado = e.target.getAttribute("data-day");
        cargarGraficoConcurrencia(diaSeleccionado);
    });
});

// Inicializar mostrando el Martes
cargarGraficoConcurrencia("MAR");
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