document.addEventListener("DOMContentLoaded", () => {
    
    // Listas de productos y combos en memoria temporal
    let listaProductosMemoria = [];      
    let listaProductosEdicionMemoria = []; 
    
    let categoriasComboSeleccionadas = []; // Almacena los nombres de las categorías vinculadas al combo
    let articulosComboSeleccionados = [];  // Almacena los productos individuales {nombre, precio} del combo
    
    let tarjetaSeleccionadaActiva = null;

    const contenedorCategorias = document.getElementById("contenedor-categorias");
    const inputBusqueda = document.getElementById("input-busqueda");

    // ==========================================
    // 1. MOTOR DE BÚSQUEDA INTERACTIVO Y ACCIONES
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
    const btnModoEliminar = document.getElementById("btn-modo-eliminar");

    if(btnActualizar) {
        btnActualizar.addEventListener("click", () => {
            if(inputBusqueda) inputBusqueda.value = "";
            if(btnModoEliminar) btnModoEliminar.classList.remove("activo");
            
            document.querySelectorAll(".card-categoria").forEach(t => {
                t.style.display = "flex";
                t.style.opacity = "1";
                t.classList.remove("modo-eliminar-activo");
                const btnX = t.querySelector(".btn-borrar-tarjeta-definitivo");
                if(btnX) btnX.remove();
            });
        });
    }

    if (btnModoEliminar) {
        btnModoEliminar.addEventListener("click", () => {
            btnModoEliminar.classList.toggle("activo");
            const todasLasTarjetas = document.querySelectorAll(".card-categoria");
            const esModoActivo = btnModoEliminar.classList.contains("activo");

            todasLasTarjetas.forEach(tarjeta => {
                if (esModoActivo) {
                    tarjeta.classList.add("modo-eliminar-activo");
                    if (!tarjeta.querySelector(".btn-borrar-tarjeta-definitivo")) {
                        const botonBorrar = document.createElement("button");
                        botonBorrar.classList.add("btn-borrar-tarjeta-definitivo");
                        botonBorrar.innerHTML = '<i class="fa-solid fa-xmark"></i>';
                        botonBorrar.setAttribute("title", "Eliminar esta tarjeta");
                        tarjeta.appendChild(botonBorrar);
                    }
                } else {
                    tarjeta.classList.remove("modo-eliminar-activo");
                    const botonExistente = tarjeta.querySelector(".btn-borrar-tarjeta-definitivo");
                    if (botonExistente) botonExistente.remove();
                }
            });
        });
    }

    // ==========================================
    // 2. CONTROL GLOBAL DE VENTANAS EMERGENTES (MODALES)
    // ==========================================
    const modalCrear = document.getElementById("modal-registro");
    const modalEditar = document.getElementById("modal-editar");
    const modalAgregarProd = document.getElementById("modal-agregar-producto");
    const modalCombo = document.getElementById("modal-combo");

    const abrirCualquierModal = (modalNode) => {
        if (!modalNode) return;
        modalNode.classList.add("show");
        document.body.style.overflow = "hidden";
    };

    const cerrarTodosLosModales = () => {
        document.querySelectorAll(".modal-overlay").forEach(m => m.classList.remove("show"));
        document.body.style.overflow = "auto";
        
        if(document.getElementById("form-categoria")) document.getElementById("form-categoria").reset();
        if(document.getElementById("form-editar-categoria")) document.getElementById("form-editar-categoria").reset();
        if(document.getElementById("form-agregar-producto")) document.getElementById("form-agregar-producto").reset();
        if(document.getElementById("form-combo")) document.getElementById("form-combo").reset();
        
        listaProductosMemoria = [];
        listaProductosEdicionMemoria = [];
        categoriasComboSeleccionadas = [];
        articulosComboSeleccionados = [];
        
        actualizarListaTemporalUI();
        actualizarListaEdicionUI();
        actualizarCategoriasComboUI();
        actualizarArticulosComboUI();
        
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
    // MODULE: LÓGICA DE CONTROL DESPLEGABLE Y AGREGACIÓN DE COMBOS
    // ==========================================
    const btnRegistrarCombo = document.getElementById("btn-registrar-combo");
    const menuDesplegableCategorias = document.getElementById("menu-desplegable-categorias");
    const btnDropdownCategorias = document.getElementById("btn-dropdown-categorias");

    if (btnRegistrarCombo) {
        btnRegistrarCombo.addEventListener("click", () => {
            // Leer dinámicamente las categorías reales que se encuentran desplegadas en la interfaz
            if(menuDesplegableCategorias) {
                menuDesplegableCategorias.innerHTML = "";
                const categoriasExistentes = [];
                
                document.querySelectorAll(".card-categoria").forEach(tarjeta => {
                    const tagCombo = tarjeta.querySelector(".info h3 span");
                    // Descartar tarjetas que sean combos de la recolección
                    if(!tagCombo) {
                        const tituloCat = tarjeta.querySelector(".info h3").textContent.trim();
                        if(tituloCat && !categoriasExistentes.includes(tituloCat)){
                            categoriasExistentes.push(tituloCat);
                        }
                    }
                });

                if(categoriasExistentes.length === 0) {
                    menuDesplegableCategorias.innerHTML = `<li style="color:#aaa; cursor:default; padding:8px 12px;">Cree una categoría primero</li>`;
                } else {
                    categoriasExistentes.forEach(cat => {
                        const li = document.createElement("li");
                        li.textContent = cat;
                        menuDesplegableCategorias.appendChild(li);
                    });
                }
            }
            abrirCualquierModal(modalCombo);
        });
    }

    // Desplegar menú de categorías
    if(btnDropdownCategorias) {
        btnDropdownCategorias.addEventListener("click", (e) => {
            e.stopPropagation();
            if(menuDesplegableCategorias) menuDesplegableCategorias.classList.toggle("mostrar");
        });
    }
    document.addEventListener("click", () => {
        if(menuDesplegableCategorias) menuDesplegableCategorias.classList.remove("mostrar");
    });

    // Añadir Categoría seleccionada a la lista de vinculación
    if(menuDesplegableCategorias) {
        menuDesplegableCategorias.addEventListener("click", (e) => {
            if(e.target.tagName === "LI" && e.target.textContent.trim() !== "Cree una categoría primero") {
                const nombreCat = e.target.textContent.trim();
                if(!categoriasComboSeleccionadas.includes(nombreCat)) {
                    categoriasComboSeleccionadas.push(nombreCat);
                    actualizarCategoriasComboUI();
                }
            }
        });
    }

    const contenedorCategoriasSelected = document.getElementById("contenedor-categorias-seleccionadas");
    function actualizarCategoriasComboUI() {
        if(!contenedorCategoriasSelected) return;
        contenedorCategoriasSelected.innerHTML = "";
        
        if(categoriasComboSeleccionadas.length === 0) {
            contenedorCategoriasSelected.innerHTML = `<p style="font-size:11px; color:#aaa; text-align:center; padding-top:10px;">Ninguna categoría asociada.</p>`;
            return;
        }

        categoriasComboSeleccionadas.forEach((cat, idx) => {
            const badge = document.createElement("div");
            badge.classList.add("badge-categoria-combo");
            badge.innerHTML = `
                <span>${cat}</span>
                <button type="button" class="btn-eliminar-temp btn-borrar-cat-link" data-index="${idx}"><i class="fa-solid fa-xmark"></i></button>
            `;
            contenedorCategoriasSelected.appendChild(badge);
        });
    }

    if(contenedorCategoriasSelected) {
        contenedorCategoriasSelected.addEventListener("click", (e) => {
            const btnTrash = e.target.closest(".btn-borrar-cat-link");
            if(btnTrash) {
                const idx = btnTrash.getAttribute("data-index");
                categoriasComboSeleccionadas.splice(idx, 1);
                actualizarCategoriasComboUI();
            }
        });
    }

    // Adición de Artículos Manuales (Bloque Derecho)
    const btnAnadirArtCombo = document.getElementById("btn-anadir-art-combo");
    const inputComboArtNombre = document.getElementById("input-combo-art-nombre");
    const inputComboArtPrecio = document.getElementById("input-combo-art-precio");
    const contenedorArticulosSelected = document.getElementById("contenedor-articulos-seleccionados");
    
    const resumenComboLista = document.getElementById("resumen-combo-lista");
    const resumenComboSubtotal = document.getElementById("resumen-combo-subtotal");

    if(btnAnadirArtCombo) {
        btnAnadirArtCombo.addEventListener("click", () => {
            const nombre = inputComboArtNombre.value.trim();
            let precio = inputComboArtPrecio.value.trim();

            if(nombre === "" || precio === "") return alert("Complete el nombre y precio del artículo.");

            precio = precio.replace(/[\$\.]/g, "");
            if(!isNaN(precio) && precio !== "") {
                precio = Number(precio).toLocaleString('de-DE');
            }

            articulosComboSeleccionados.push({ nombre, precio });
            inputComboArtNombre.value = "";
            inputComboArtPrecio.value = "";
            inputComboArtNombre.focus();
            actualizarArticulosComboUI();
        });
    }

    function actualizarArticulosComboUI() {
        if(!contenedorArticulosSelected || !resumenComboLista || !resumenComboSubtotal) return;
        
        contenedorArticulosSelected.innerHTML = "";
        resumenComboLista.innerHTML = "";
        let subtotal = 0;

        if(articulosComboSeleccionados.length === 0) {
            contenedorArticulosSelected.innerHTML = `<p style="font-size:11px; color:#aaa; text-align:center; padding-top:10px;">Ningún artículo agregado.</p>`;
            resumenComboSubtotal.textContent = "$0";
            return;
        }

        articulosComboSeleccionados.forEach((art, idx) => {
            const precioNum = parseInt(art.precio.replace(/\./g, ""), 10) || 0;
            subtotal += precioNum;

            // Fila en bloque de selección
            const rowSel = document.createElement("div");
            rowSel.classList.add("item-articulo-combo-temp");
            rowSel.innerHTML = `
                <span>${art.nombre} ($${art.precio})</span>
                <button type="button" class="btn-eliminar-temp btn-borrar-art-link" data-index="${idx}"><i class="fa-solid fa-trash"></i></button>
            `;
            contenedorArticulosSelected.appendChild(rowSel);

            // Fila en bloque de resumen (Vista Lateral)
            const rowRes = document.createElement("div");
            rowRes.classList.add("item-resumen-linea");
            rowRes.innerHTML = `
                <span>1x ${art.nombre}</span>
                <span>$${art.precio}</span>
            `;
            resumenComboLista.appendChild(rowRes);
        });

        resumenComboSubtotal.textContent = `$${subtotal.toLocaleString('de-DE')}`;
    }

    if(contenedorArticulosSelected) {
        contenedorArticulosSelected.addEventListener("click", (e) => {
            const btnTrash = e.target.closest(".btn-borrar-art-link");
            if(btnTrash) {
                const idx = btnTrash.getAttribute("data-index");
                articulosComboSeleccionados.splice(idx, 1);
                actualizarArticulosComboUI();
            }
        });
    }

    // Procesar guardado e inserción del Combo en los contenedores correspondientes
    const formCombo = document.getElementById("form-combo");
    if(formCombo) {
        formCombo.addEventListener("submit", (e) => {
            e.preventDefault();
            const nombre = document.getElementById("combo-nombre").value.trim();
            let precio = document.getElementById("combo-precio").value.trim();
            const desc = document.getElementById("combo-desc").value.trim();

            if(categoriasComboSeleccionadas.length === 0) {
                return alert("Debe asociar el combo a por lo menos una Categoría.");
            }
            if(articulosComboSeleccionados.length === 0) {
                return alert("Debe añadir al menos un artículo para calcular el contenido del combo.");
            }

            precio = precio.replace(/[\$\.]/g, "");
            if(!isNaN(precio) && precio !== "") precio = Number(precio).toLocaleString('de-DE');

            // Generar contenido del listado interno del combo
            let productosHTML = "";
            articulosComboSeleccionados.forEach(art => {
                productosHTML += `<div class="item"><p>${art.nombre}</p><p>Incluido</p></div>`;
            });

            const nuevaCard = document.createElement("div");
            nuevaCard.classList.add("card-categoria");
            // Guardamos las categorías asociadas en un atributo personalizado de datos para control futuro si es necesario
            nuevaCard.setAttribute("data-categorias-vinculadas", categoriasComboSeleccionadas.join(","));

            if (btnModoEliminar && btnModoEliminar.classList.contains("activo")) {
                nuevaCard.classList.add("modo-eliminar-activo");
            }

            nuevaCard.innerHTML = `
                <div class="icono" style="color: #ff9100;"><i class="fa-solid fa-cubes"></i></div>
                <div class="info">
                    <h3>${nombre} <span style="font-size:11px; background:#ff9100; color:white; padding:2px 6px; border-radius:4px; vertical-align:middle; margin-left:5px; font-weight:bold;">Combo</span></h3>
                    <p>${desc || 'Combinación especial de productos.'}</p>
                </div>
                <div class="contenido"><h3>Contenido del Combo</h3>${productosHTML}</div>
                <div class="acciones-card">
                    <p class="estado disponible">● Disponible</p>
                    <div class="botones">
                        <button class="btn-editar-cat" style="display:none;">Editar</button>
                        <span style="font-weight:bold; color:#ff9100; font-size:16px;">$${precio}</span>
                    </div>
                </div>
            `;

            if (btnModoEliminar && btnModoEliminar.classList.contains("activo")) {
                const botonBorrar = document.createElement("button");
                botonBorrar.classList.add("btn-borrar-tarjeta-definitivo");
                botonBorrar.innerHTML = '<i class="fa-solid fa-xmark"></i>';
                botonBorrar.setAttribute("title", "Eliminar este combo");
                nuevaCard.appendChild(botonBorrar);
            }

            if(contenedorCategorias) {
                contenedorCategorias.insertBefore(nuevaCard, contenedorCategorias.firstChild);
            }
            cerrarTodosLosModales();
        });
    }

    // ==========================================
    // 3. EVENTOS DINÁMICOS EN TARJETAS (Delegación)
    // ==========================================
    if (contenedorCategorias) {
        contenedorCategorias.addEventListener("click", (e) => {
            const objetivo = e.target;
            const tarjetaPadre = objetivo.closest(".card-categoria");

            if (!tarjetaPadre) return;

            if (objetivo.classList.contains("btn-borrar-tarjeta-definitivo") || objetivo.closest(".btn-borrar-tarjeta-definitivo")) {
                const tituloCat = tarjetaPadre.querySelector(".info h3").textContent;
                const confirmar = confirm(`¿Estás seguro de que deseas eliminar permanentemente "${tituloCat.trim()}"?`);
                if (confirmar) {
                    tarjetaPadre.style.opacity = "0";
                    setTimeout(() => { tarjetaPadre.remove(); }, 250); 
                }
                return;
            }

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

            else if (objetivo.classList.contains("btn-editar-cat")) {
                tarjetaSeleccionadaActiva = tarjetaPadre;
                
                const tituloActual = tarjetaPadre.querySelector(".info h3").textContent;
                const descActual = tarjetaPadre.querySelector(".info p").textContent;

                document.getElementById("edit-cat-titulo").value = tituloActual;
                document.getElementById("edit-cat-desc").value = descActual;

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
        if(!contenedorListaTemp) return;
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

    if(contenedorListaTemp) {
        contenedorListaTemp.addEventListener("click", (e) => {
            const btnTrash = e.target.closest(".btn-eliminar-temp");
            if(btnTrash) {
                listaProductosMemoria.splice(btnTrash.getAttribute("data-index"), 1);
                actualizarListaTemporalUI();
            }
        });
    }

    if(formCategoria) {
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
            
            if (btnModoEliminar && btnModoEliminar.classList.contains("activo")) {
                nuevaCard.classList.add("modo-eliminar-activo");
            }

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

            if (btnModoEliminar && btnModoEliminar.classList.contains("activo")) {
                const botonBorrar = document.createElement("button");
                botonBorrar.classList.add("btn-borrar-tarjeta-definitivo");
                botonBorrar.innerHTML = '<i class="fa-solid fa-xmark"></i>';
                botonBorrar.setAttribute("title", "Eliminar esta categoría");
                nuevaCard.appendChild(botonBorrar);
            }

            contenedorCategorias.insertBefore(nuevaCard, contenedorCategorias.firstChild);
            cerrarTodosLosModales();
        });
    }

    // ==========================================
    // 5. LÓGICA DE EDICIÓN AVANZADA (MODIFICAR CONTENIDO)
    // ==========================================
    const contenedorListaEdicionTemp = document.getElementById("edit-lista-productos-temporal");
    const inputEditProdNombre = document.getElementById("edit-prod-nombre-input");
    const inputEditProdPrecio = document.getElementById("edit-prod-precio-input");
    const btnEditAgregarLista = document.getElementById("btn-edit-agregar-lista");

    const actualizarListaEdicionUI = () => {
        if(!contenedorListaEdicionTemp) return;
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

    if(contenedorListaEdicionTemp) {
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

        contenedorListaEdicionTemp.addEventListener("click", (e) => {
            const btnTrash = e.target.closest(".btn-edit-trash");
            if (btnTrash) {
                const index = btnTrash.getAttribute("data-index");
                listaProductosEdicionMemoria.splice(index, 1);
                actualizarListaEdicionUI();
            }
        });
    }

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

    const formEditarCat = document.getElementById("form-editar-categoria");
    if(formEditarCat) {
        formEditarCat.addEventListener("submit", (e) => {
            e.preventDefault();
            if (!tarjetaSeleccionadaActiva) return;

            if (listaProductosEdicionMemoria.length === 0) {
                return alert("No puede dejar la categoría sin ningún producto. Agregue al menos uno.");
            }

            const nuevoTitulo = document.getElementById("edit-cat-titulo").value.trim();
            const nuevaDesc = document.getElementById("edit-cat-desc").value.trim();
            const inputEditImg = document.getElementById("edit-cat-img");

            tarjetaSeleccionadaActiva.querySelector(".info h3").textContent = nuevoTitulo;
            tarjetaSeleccionadaActiva.querySelector(".info p").textContent = nuevaDesc;

            if (inputEditImg.files && inputEditImg.files[0]) {
                tarjetaSeleccionadaActiva.querySelector(".icono").innerHTML = `<img src="${URL.createObjectURL(inputEditImg.files[0])}" alt="${nuevoTitulo}">`;
            }

            const contenedorContenidoCard = tarjetaSeleccionadaActiva.querySelector(".contenido");
            contenedorContenidoCard.innerHTML = "<h3>Contenido</h3>"; 

            listaProductosEdicionMemoria.forEach(prod => {
                const itemHTML = document.createElement("div");
                itemHTML.classList.add("item");
                itemHTML.innerHTML = `<p>${prod.nombre}</p><p>$${prod.precio}</p>`;
                contenedorContenidoCard.appendChild(itemHTML);
            });

            cerrarTodosLosModales();
        });
    }

    // ==========================================
    // 6. ADICIÓN DIRECTA DESDE EL BOTÓN "AGREGAR"
    // ==========================================
    const formAgregarProd = document.getElementById("form-agregar-producto");
    if(formAgregarProd) {
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
    }
});