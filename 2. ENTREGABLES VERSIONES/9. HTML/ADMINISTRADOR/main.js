document.addEventListener("DOMContentLoaded", () => {
    
    // Listas de productos en memoria
    let listaProductosMemoria = [];      // Para crear nueva categoría
    let listaProductosEdicionMemoria = []; // Para editar categoría existente
    
    let tarjetaSeleccionadaActiva = null;

    const contenedorCategorias = document.getElementById("contenedor-categorias");
    const inputBusqueda = document.getElementById("input-busqueda");

    // ==========================================
    // 1. MOTOR DE BÚSQUEDA INTERACTIVO
    // ==========================================
    if (inputBusqueda) {
        inputBusqueda.addEventListener("input", (e) => {
            const textoBuscar = e.target.value.toLowerCase().trim();
            const todasLasTarjetas = document.querySelectorAll(".card-categoria");

            todasLasTarjetas.forEach(tarjeta => {
                const titulo = tarjeta.querySelector(".info h3").textContent.toLowerCase();
                const descripcion = tarjeta.querySelector(".info p").textContent.toLowerCase();
                const productosTexto = Array.from(tarjeta.querySelectorAll(".item p"))
                                             .map(p => p.textContent.toLowerCase())
                                             .join(" ");

                if (titulo.includes(textoBuscar) || descripcion.includes(textoBuscar) || productosTexto.includes(textoBuscar)) {
                    tarjeta.style.display = "flex";
                    tarjeta.style.opacity = "1";
                } else {
                    tarjeta.style.display = "none";
                    tarjeta.style.opacity = "0";
                }
            });
        });
    }

    const btnActualizar = document.getElementById("btn-actualizar");
    if(btnActualizar) {
        btnActualizar.addEventListener("click", () => {
            if(inputBusqueda) inputBusqueda.value = "";
            document.querySelectorAll(".card-categoria").forEach(t => {
                t.style.display = "flex";
                t.style.opacity = "1";
            });
        });
    }

    // ==========================================
    // 2. CONTROL GLOBAL DE VENTANAS EMERGENTES (MODALES)
    // ==========================================
    const modalCrear = document.getElementById("modal-registro");
    const modalEditar = document.getElementById("modal-editar");
    const modalAgregarProd = document.getElementById("modal-agregar-producto");

    const abrirCualquierModal = (modalNode) => {
        modalNode.classList.add("show");
        document.body.style.overflow = "hidden";
    };

    const cerrarTodosLosModales = () => {
        document.querySelectorAll(".modal-overlay").forEach(m => m.classList.remove("show"));
        document.body.style.overflow = "auto";
        
        document.getElementById("form-categoria").reset();
        document.getElementById("form-editar-categoria").reset();
        document.getElementById("form-agregar-producto").reset();
        
        listaProductosMemoria = [];
        listaProductosEdicionMemoria = [];
        actualizarListaTemporalUI();
        actualizarListaEdicionUI();
        tarjetaSeleccionadaActiva = null;
    };

    document.querySelectorAll(".class-close-btn, .btn-cancelar-modal").forEach(btn => {
        btn.addEventListener("click", cerrarTodosLosModales);
    });

    window.addEventListener("click", (e) => {
        if (e.target.classList.contains("modal-overlay")) cerrarTodosLosModales();
    });

    const btnRegistrarCat = document.getElementById("btn-registrar");
    if (btnRegistrarCat) {
        btnRegistrarCat.addEventListener("click", () => abrirCualquierModal(modalCrear));
    }

    // ==========================================
    // 3. EVENTOS DINÁMICOS EN TARJETAS (Delegación)
    // ==========================================
    if (contenedorCategorias) {
        contenedorCategorias.addEventListener("click", (e) => {
            const objetivo = e.target;
            const tarjetaPadre = objetivo.closest(".card-categoria");

            if (!tarjetaPadre) return;

            // Disponible / Inhabilitado
            if (objetivo.classList.contains("estado")) {
                if (objetivo.classList.contains("disponible")) {
                    objetivo.classList.remove("disponible");
                    objetivo.classList.add("inhabilitado");
                    objetivo.innerHTML = "● Inhabilitado";
                } else {
                    objetivo.classList.remove("inhabilitado");
                    objetivo.classList.add("disponible");
                    objetivo.innerHTML = "● Disponible";
                }
            }

            // ACCIÓN: CLICK EN EDITAR CATEGORÍA (Lee el HTML y lo precarga en el formulario)
            else if (objetivo.classList.contains("btn-editar-cat")) {
                tarjetaSeleccionadaActiva = tarjetaPadre;
                
                const tituloActual = tarjetaPadre.querySelector(".info h3").textContent;
                const descActual = tarjetaPadre.querySelector(".info p").textContent;

                document.getElementById("edit-cat-titulo").value = tituloActual;
                document.getElementById("edit-cat-desc").value = descActual;

                // Extraer los productos actuales de la tarjeta para cargarlos en el array de edición
                listaProductosEdicionMemoria = [];
                const itemsProductosHTML = tarjetaPadre.querySelectorAll(".contenido .item");
                
                itemsProductosHTML.forEach(item => {
                    const nombreP = item.querySelector("p:first-child").textContent;
                    let precioP = item.querySelector("p:last-child").textContent.replace("$", "").trim();
                    listaProductosEdicionMemoria.push({ nombre: nombreP, precio: precioP });
                });

                actualizarListaEdicionUI();
                abrirCualquierModal(modalEditar);
            }

            // ACCIÓN: CLICK EN AGREGAR PRODUCTO DIRECTO
            else if (objetivo.classList.contains("btn-agregar-prod")) {
                tarjetaSeleccionadaActiva = tarjetaPadre;
                const tituloCat = tarjetaPadre.querySelector(".info h3").textContent;
                document.getElementById("nombre-cat-producto").textContent = tituloCat;
                abrirCualquierModal(modalAgregarProd);
            }
        });
    }

    // ==========================================
    // 4. LÓGICA DE REGISTRO (NUEVA CATEGORÍA)
    // ==========================================
    const formCategoria = document.getElementById("form-categoria");
    const inputProdNombre = document.getElementById("prod-nombre-input");
    const inputProdPrecio = document.getElementById("prod-precio-input");
    const btnAgregarLista = document.getElementById("btn-agregar-lista");
    const contenedorListaTemp = document.getElementById("lista-productos-temporal");

    const actualizarListaTemporalUI = () => {
        contenedorListaTemp.innerHTML = "";
        if (listaProductosMemoria.length === 0) {
            contenedorListaTemp.innerHTML = `<p style="font-size:12px; color:#aaa; text-align:center; padding:10px;">Ningún producto agregado aún.</p>`;
            return;
        }
        listaProductosMemoria.forEach((prod, idx) => {
            const item = document.createElement("div");
            item.classList.add("item-producto-temp");
            item.innerHTML = `
                <span>${prod.nombre}</span>
                <span>$${prod.precio}</span>
                <button type="button" class="btn-eliminar-temp" data-index="${idx}"><i class="fa-solid fa-trash-can"></i></button>
            `;
            contenedorListaTemp.appendChild(item);
        });
    };

    if(btnAgregarLista) {
        btnAgregarLista.addEventListener("click", () => {
            let nombre = inputProdNombre.value.trim();
            let precio = inputProdPrecio.value.trim();
            if (nombre === "" || precio === "") return alert("Ingrese nombre y precio.");
            
            precio = precio.replace(/[\$\.]/g, "");
            if(!isNaN(precio) && precio !== "") precio = Number(precio).toLocaleString('de-DE');

            listaProductosMemoria.push({ nombre, precio });
            inputProdNombre.value = ""; inputProdPrecio.value = "";
            inputProdNombre.focus();
            actualizarListaTemporalUI();
        });
    }

    contenedorListaTemp.addEventListener("click", (e) => {
        const btnTrash = e.target.closest(".btn-eliminar-temp");
        if(btnTrash) {
            listaProductosMemoria.splice(btnTrash.getAttribute("data-index"), 1);
            actualizarListaTemporalUI();
        }
    });

    formCategoria.addEventListener("submit", (e) => {
        e.preventDefault();
        const titulo = document.getElementById("cat-titulo").value.trim();
        const descripcion = document.getElementById("cat-desc").value.trim();
        const inputImg = document.getElementById("cat-img");

        if (listaProductosMemoria.length === 0) return alert("Agregue al menos un producto.");

        let iconoHTML = `<i class="fa-solid fa-utensils"></i>`;
        if (inputImg.files && inputImg.files[0]) {
            iconoHTML = `<img src="${URL.createObjectURL(inputImg.files[0])}" alt="${titulo}">`;
        }

        let productosHTML = "";
        listaProductosMemoria.forEach(p => {
            productosHTML += `<div class="item"><p>${p.nombre}</p><p>$${p.precio}</p></div>`;
        });

        const nuevaCard = document.createElement("div");
        nuevaCard.classList.add("card-categoria");
        nuevaCard.innerHTML = `
            <div class="icono">${iconoHTML}</div>
            <div class="info"><h3>${titulo}</h3><p>${descripcion}</p></div>
            <div class="contenido"><h3>Contenido</h3>${productosHTML}</div>
            <div class="acciones-card">
                <p class="estado disponible">● Disponible</p>
                <div class="botones">
                    <button class="btn-editar-cat">Editar</button>
                    <button class="btn-agregar-prod">Agregar</button>
                </div>
            </div>
        `;
        contenedorCategorias.insertBefore(nuevaCard, contenedorCategorias.firstChild);
        cerrarTodosLosModales();
    });


    // ==========================================
    // 5. LÓGICA DE EDICIÓN AVANZADA (MODIFICAR CONTENIDO)
    // ==========================================
    const contenedorListaEdicionTemp = document.getElementById("edit-lista-productos-temporal");
    const inputEditProdNombre = document.getElementById("edit-prod-nombre-input");
    const inputEditProdPrecio = document.getElementById("edit-prod-precio-input");
    const btnEditAgregarLista = document.getElementById("btn-edit-agregar-lista");

    // Renderiza la lista de productos dentro del modal de edición con Inputs modificables
    const actualizarListaEdicionUI = () => {
        contenedorListaEdicionTemp.innerHTML = "";
        if (listaProductosEdicionMemoria.length === 0) {
            contenedorListaEdicionTemp.innerHTML = `<p style="font-size:12px; color:#aaa; text-align:center; padding:10px;">La categoría no tiene productos. Agregue uno.</p>`;
            return;
        }

        listaProductosEdicionMemoria.forEach((prod, idx) => {
            const item = document.createElement("div");
            item.classList.add("item-producto-temp");
            item.innerHTML = `
                <input type="text" class="input-tabla-edit edit-nombre-live" data-index="${idx}" value="${prod.nombre}" placeholder="Nombre">
                <div style="display:flex; align-items:center; gap:3px; max-width:110px;">
                    <span style="font-size:13px; font-weight:bold; color:#555;">$</span>
                    <input type="text" class="input-tabla-edit edit-precio-live" data-index="${idx}" value="${prod.precio}" placeholder="Precio">
                </div>
                <button type="button" class="btn-eliminar-temp btn-edit-trash" data-index="${idx}">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            `;
            contenedorListaEdicionTemp.appendChild(item);
        });
    };

    // Escuchar cambios en vivo (Inputs) dentro del modal de edición para actualizar el array instantáneamente
    contenedorListaEdicionTemp.addEventListener("input", (e) => {
        const idx = e.target.getAttribute("data-index");
        if (!idx) return;

        if (e.target.classList.contains("edit-nombre-live")) {
            listaProductosEdicionMemoria[idx].nombre = e.target.value;
        } 
        else if (e.target.classList.contains("edit-precio-live")) {
            let valor = e.target.value.replace(/[\$\.]/g, "");
            if(!isNaN(valor) && valor !== "") {
                valor = Number(valor).toLocaleString('de-DE');
            }
            listaProductosEdicionMemoria[idx].precio = valor;
        }
    });

    // Agregar nuevo producto a la lista de edición
    if (btnEditAgregarLista) {
        btnEditAgregarLista.addEventListener("click", () => {
            let nombre = inputEditProdNombre.value.trim();
            let precio = inputEditProdPrecio.value.trim();

            if (nombre === "" || precio === "") return alert("Digite los datos del producto a añadir.");

            precio = precio.replace(/[\$\.]/g, "");
            if(!isNaN(precio) && precio !== "") precio = Number(precio).toLocaleString('de-DE');

            listaProductosEdicionMemoria.push({ nombre, precio });
            inputEditProdNombre.value = "";
            inputEditProdPrecio.value = "";
            inputEditProdNombre.focus();
            actualizarListaEdicionUI();
        });
    }

    // Eliminar producto de la lista de edición
    contenedorListaEdicionTemp.addEventListener("click", (e) => {
        const btnTrash = e.target.closest(".btn-edit-trash");
        if (btnTrash) {
            const index = btnTrash.getAttribute("data-index");
            listaProductosEdicionMemoria.splice(index, 1);
            actualizarListaEdicionUI();
        }
    });

    // GUARDAR CAMBIOS DEFINITIVOS EN LA TARJETA
    const formEditarCat = document.getElementById("form-editar-categoria");
    formEditarCat.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!tarjetaSeleccionadaActiva) return;

        if (listaProductosEdicionMemoria.length === 0) {
            return alert("No puede dejar la categoría sin ningún producto. Agregue al menos uno.");
        }

        const nuevoTitulo = document.getElementById("edit-cat-titulo").value.trim();
        const nuevaDesc = document.getElementById("edit-cat-desc").value.trim();
        const inputEditImg = document.getElementById("edit-cat-img");

        // 1. Guardar título y descripción
        tarjetaSeleccionadaActiva.querySelector(".info h3").textContent = nuevoTitulo;
        tarjetaSeleccionadaActiva.querySelector(".info p").textContent = nuevaDesc;

        // 2. Guardar nueva imagen si aplica
        if (inputEditImg.files && inputEditImg.files[0]) {
            tarjetaSeleccionadaActiva.querySelector(".icono").innerHTML = `<img src="${URL.createObjectURL(inputEditImg.files[0])}" alt="${nuevoTitulo}">`;
        }

        // 3. Reconstruir por completo el contenedor de productos de la tarjeta con los datos limpios
        const contenedorContenidoCard = tarjetaSeleccionadaActiva.querySelector(".contenido");
        contenedorContenidoCard.innerHTML = "<h3>Contenido</h3>"; // Limpiar y poner cabecera

        listaProductosEdicionMemoria.forEach(prod => {
            const itemHTML = document.createElement("div");
            itemHTML.classList.add("item");
            itemHTML.innerHTML = `<p>${prod.nombre}</p><p>$${prod.precio}</p>`;
            contenedorContenidoCard.appendChild(itemHTML);
        });

        cerrarTodosLosModales();
    });


    // ==========================================
    // 6. ADICIÓN DIRECTA DESDE EL BOTÓN "AGREGAR"
    // ==========================================
    const formAgregarProd = document.getElementById("form-agregar-producto");
    formAgregarProd.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!tarjetaSeleccionadaActiva) return;

        const prodNombre = document.getElementById("new-prod-nombre").value.trim();
        let prodPrecio = document.getElementById("new-prod-precio").value.trim();

        prodPrecio = prodPrecio.replace(/[\$\.]/g, "");
        if(!isNaN(prodPrecio) && prodPrecio !== "") prodPrecio = Number(prodPrecio).toLocaleString('de-DE');

        const nuevoItemProducto = document.createElement("div");
        nuevoItemProducto.classList.add("item");
        nuevoItemProducto.innerHTML = `<p>${prodNombre}</p><p>$${prodPrecio}</p>`;

        tarjetaSeleccionadaActiva.querySelector(".contenido").appendChild(nuevoItemProducto);
        cerrarTodosLosModales();
    });
});