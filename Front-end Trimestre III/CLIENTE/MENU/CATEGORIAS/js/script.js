document.addEventListener("DOMContentLoaded", () => {
    
    /* ===================================================
           1. CONTADORES DE CANTIDAD DE PRODUCTOS
       =================================================== */
    const productContainers = document.querySelectorAll(".contenedorpo, .contenedorone");
    productContainers.forEach(container => {
        const minusBtn = container.querySelector(".qty-btn.minus");
        const plusBtn = container.querySelector(".qty-btn.plus");
        const qtyNumber = container.querySelector(".qty-number");

        if (minusBtn && plusBtn && qtyNumber) {
            minusBtn.addEventListener("click", () => {
                let currentQty = parseInt(qtyNumber.textContent);
                if (currentQty > 1) qtyNumber.textContent = currentQty - 1;
            });

            plusBtn.addEventListener("click", () => {
                let currentQty = parseInt(qtyNumber.textContent);
                qtyNumber.textContent = currentQty + 1;
            });
        }
    });

    /* ===================================================
           2. VENTANA MODAL (VER COMBO DISPONIBLE)
       =================================================== */
    const modal = document.getElementById("comboModal");
    // Selecciona los botones usando la clase genérica de tus tarjetas
    const comboButtons = document.querySelectorAll(".btn-secon"); 
    const btnCancelar = document.getElementById("btnCancelarCombo");
    const btnAceptar = document.getElementById("btnAceptarCombo");

    if (modal) {
        comboButtons.forEach(button => {
            button.addEventListener("click", (e) => {
                e.preventDefault();
                modal.classList.add("show");
            });
        });

        const closeModal = () => modal.classList.remove("show");

        if (btnCancelar) btnCancelar.addEventListener("click", closeModal);
        if (btnAceptar) {
            btnAceptar.addEventListener("click", () => {
                alert("¡Combo agregado con éxito al producto!");
                closeModal();
            });
        }

        modal.addEventListener("click", (e) => { 
            if (e.target === modal) closeModal(); 
        });
    }

    /* ===================================================
           3. FILTRADO Y ORDENAMIENTO DINÁMICO
       =================================================== */
    const gridProductos = document.getElementById("gridProductos");
    const selectCategoria = document.getElementById("selectCategoria");
    const selectOrden = document.getElementById("selectOrden");
    
    if (gridProductos && selectCategoria && selectOrden) {
        // Convertimos la lista de nodos original a un Array para poder ordenarlos en memoria
        const lasTarjetasOriginales = Array.from(gridProductos.children);

        function filtrarYOrdenar() {
            const categoriaSeleccionada = selectCategoria.value;
            const criterioOrden = selectOrden.value;

            // Paso A: Filtrar por categoría
            let tarjetasVisibles = lasTarjetasOriginales.filter(tarjeta => {
                const catProducto = tarjeta.getAttribute("data-categoria");
                if (categoriaSeleccionada === "todos" || catProducto === categoriaSeleccionada) {
                    tarjeta.style.display = "flex"; // Se muestra
                    return true;
                } else {
                    tarjeta.style.display = "none";  // Se oculta
                    return false;
                }
            });

            // Paso B: Ordenar las tarjetas que quedaron visibles
            if (criterioOrden === "precio") {
                tarjetasVisibles.sort((a, b) => parseInt(a.getAttribute("data-precio")) - parseInt(b.getAttribute("data-precio")));
            } else if (criterioOrden === "relevancia") {
                tarjetasVisibles.sort((a, b) => parseInt(a.getAttribute("data-relevancia")) - parseInt(b.getAttribute("data-relevancia")));
            } else if (criterioOrden === "calificacion") {
                tarjetasVisibles.sort((a, b) => parseInt(b.getAttribute("data-calificacion")) - parseInt(a.getAttribute("data-calificacion")));
            }

            // Paso C: Volver a meter los elementos ordenados al contenedor HTML
            tarjetasVisibles.forEach(tarjeta => gridProductos.appendChild(tarjeta));
        }

        // Escuchar cambios en los selectores
        selectCategoria.addEventListener("change", filtrarYOrdenar);
        selectOrden.addEventListener("change", filtrarYOrdenar);
    }

    /* ===================================================
           4. CONTROL DE PANELES (NOTIFICACIONES Y USUARIO)
       =================================================== */
    const userMenuBtn = document.getElementById("user-menu-btn");
    const userDropdown = document.getElementById("user-dropdown");
    const notificationMenuBtn = document.getElementById("notification-menu-btn");
    const notificationDropdown = document.getElementById("notification-dropdown");

    // Interacción Panel Notificaciones
    if (notificationMenuBtn && notificationDropdown) {
        notificationMenuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (userDropdown) userDropdown.classList.add("hidden"); 
            notificationDropdown.classList.toggle("hidden");
        });

        notificationDropdown.addEventListener("click", (e) => {
            e.stopPropagation(); 
        });
    }

    // Interacción Panel Usuario
    if (userMenuBtn && userDropdown) {
        userMenuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (notificationDropdown) notificationDropdown.classList.add("hidden"); 
            userDropdown.classList.toggle("hidden");
        });

        userDropdown.addEventListener("click", (e) => {
            e.stopPropagation(); 
        });
    }

    // Evento de Cierre Global al hacer clic en cualquier otra parte de la pantalla
    document.addEventListener("click", () => {
        if (userDropdown) userDropdown.classList.add("hidden");
        if (notificationDropdown) notificationDropdown.classList.add("hidden");
    });

}); // Cierre correcto y único del DOMContentLoaded