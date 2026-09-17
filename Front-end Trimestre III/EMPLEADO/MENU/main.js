document.addEventListener("DOMContentLoaded", () => {
    // --- 1. CONTADORES DE CANTIDAD ---
    const productContainers = document.querySelectorAll(".contenedorpo, .contenedorone");
    productContainers.forEach(container => {
        const minusBtn = container.querySelector(".qty-btn.minus");
        const plusBtn = container.querySelector(".qty-btn.plus");
        const qtyNumber = container.querySelector(".qty-number");

        minusBtn.addEventListener("click", () => {
            let currentQty = parseInt(qtyNumber.textContent);
            if (currentQty > 1) qtyNumber.textContent = currentQty - 1;
        });

        plusBtn.addEventListener("click", () => {
            let currentQty = parseInt(qtyNumber.textContent);
            qtyNumber.textContent = currentQty + 1;
        });
    });

    // --- 2. MODAL DE COMBOS ---
    const modal = document.getElementById("comboModal");
    const comboButtons = document.querySelectorAll(".btn-combo");
    const btnCancelar = document.getElementById("btnCancelarCombo");
    const btnAceptar = document.getElementById("btnAceptarCombo");

    comboButtons.forEach(button => {
        button.addEventListener("click", () => modal.classList.add("show"));
    });

    const closeModal = () => modal.classList.remove("show");
    btnCancelar.addEventListener("click", closeModal);
    btnAceptar.addEventListener("click", () => {
        alert("¡Combo agregado con éxito al producto!");
        closeModal();
    });
    modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });


    // --- 3. FILTRADO Y ORDENAMIENTO DINÁMICO ---
    const gridProductos = document.getElementById("gridProductos");
    const selectCategoria = document.getElementById("selectCategoria");
    const selectOrden = document.getElementById("selectOrden");
    
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
            // De menor a mayor precio
            tarjetasVisibles.sort((a, b) => parseInt(a.getAttribute("data-precio")) - parseInt(b.getAttribute("data-precio")));
        } else if (criterioOrden === "relevancia") {
            // Preferidos primero (Orden ascendente según peso numérico de relevancia asignado)
            tarjetasVisibles.sort((a, b) => parseInt(a.getAttribute("data-relevancia")) - parseInt(b.getAttribute("data-relevancia")));
        } else if (criterioOrden === "calificacion") {
            // Mejores votados primero (De 5 estrellas a menos estrellas)
            tarjetasVisibles.sort((a, b) => parseInt(b.getAttribute("data-calificacion")) - parseInt(a.getAttribute("data-calificacion")));
        }

        // Paso C: Volver a meter los elementos ordenados al contenedor HTML
        tarjetasVisibles.forEach(tarjeta => gridProductos.appendChild(tarjeta));
    }

    // Escuchar cambios en los selectores
    selectCategoria.addEventListener("change", filtrarYOrdenar);
    selectOrden.addEventListener("change", filtrarYOrdenar);
});