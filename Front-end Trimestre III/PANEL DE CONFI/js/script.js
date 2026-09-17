/* ===================================================
   CFF - Archivo Script de Control Completo Unificado
   =================================================== */

   document.addEventListener('DOMContentLoaded', () => {

    /* --- Navegación Sidebar (Gestión del menú activo) --- */
    document.querySelectorAll('.sidebar li').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.sidebar li').forEach(i => {
                i.classList.remove('activo');
                i.classList.add('movimiento');
            });
            item.classList.add('activo');
            item.classList.remove('movimiento');
        });
    });

    /* --- Placeholder de autenticación --- */
    const btnLogin    = document.querySelector('.btn-login');
    const btnRegister = document.querySelector('.btn-register');

    if (btnLogin) {
        btnLogin.addEventListener('click', () => alert('Redirigiendo a Iniciar Sesión...'));
    }
    if (btnRegister) {
        btnRegister.addEventListener('click', () => alert('Redirigiendo a Registrarse...'));
    }

    /* ===================================================
       CONTROL INTERACTIVO DE MODALES (USUARIO Y ELIMINAR)
       =================================================== */

    /* -- Toggles de notificación -- */
    const toggleCorreo = document.getElementById('toggle-correo');
    const togglePush   = document.getElementById('toggle-push');

    if (toggleCorreo) {
        toggleCorreo.addEventListener('change', () => {
            const estado = toggleCorreo.checked ? 'activadas' : 'desactivadas';
            alert(`Notificaciones por correo ${estado}.`);
        });
    }

    if (togglePush) {
        togglePush.addEventListener('change', () => {
            const estado = togglePush.checked ? 'activadas' : 'desactivadas';
            alert(`Notificaciones push ${estado}.`);
        });
    }

    /* -- Funciones Centrales del Ciclo de Modales -- */
    function abrirModal(id) {
        const modal = document.getElementById(id);
        if (modal) modal.classList.add('activo');
    }

    function cerrarModal(id) {
        const modal = document.getElementById(id);
        if (modal) modal.classList.remove('activo');
    }

    // Evento para abrir Modal Modificar
    const cardModificar = document.getElementById('btn-modificar');
    if (cardModificar) {
        cardModificar.addEventListener('click', () => abrirModal('modal-modificar'));
    }

    // Evento para abrir Modal Eliminar
    const cardEliminar = document.getElementById('btn-eliminar');
    if (cardEliminar) {
        cardEliminar.addEventListener('click', () => abrirModal('modal-eliminar'));
    }

    // Botones de salida del modal unificados (Cerrar por 'X' o botón 'Cancelar')
    document.querySelectorAll('.modal-cerrar, .btn-cancelar').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-modal');
            if (id) cerrarModal(id);
        });
    });

    // Control de cierre rápido haciendo click fuera de la caja blanca (en el fondo)
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.classList.remove('activo');
        });
    });

/* -- Procesar y Confirmar Cambios del Formulario -- */
const btnGuardar = document.getElementById('btn-guardar-datos');
if (btnGuardar) {
    btnGuardar.addEventListener('click', () => {
        const nuevoNombre   = document.getElementById('mod-nombre').value.trim();
        const nuevoTelefono = document.getElementById('mod-telefono').value.trim();
        const nuevoCorreo   = document.getElementById('mod-correo').value.trim();
        const cambiaContra  = document.getElementById('chk-cambiar-contra').checked;
        
        let cambioDetectado = false;

        // Verificar si hay cambios en los campos de texto estándar
        if (nuevoNombre || nuevoTelefono || nuevoCorreo) {
            cambioDetectado = true;
        }

        // Validación estricta si decide cambiar contraseña
        if (cambiaContra) {
            const passNueva = document.getElementById('mod-password-nueva').value;
            const passConfirmar = document.getElementById('mod-password-confirmar').value;

            if (!passNueva || !passConfirmar) {
                alert('Por favor, ingresa y confirma tu nueva contraseña.');
                return;
            }

            if (passNueva !== passConfirmar) {
                alert('Las contraseñas no coinciden. Por favor verifícalas.');
                return;
            }
            cambioDetectado = true;
        }

        // Validación global: ¿Se hizo algo?
        if (!cambioDetectado) {
            alert('Por favor realiza o selecciona al menos un cambio antes de confirmar.');
            return;
        }

        alert('¡Cambios confirmados y guardados correctamente en el sistema!');
        cerrarModal('modal-modificar');
        
        // Limpieza preventiva total tras guardar correctamente
        document.getElementById('mod-nombre').value = '';
        document.getElementById('mod-telefono').value = '';
        document.getElementById('mod-correo').value = '';
        document.getElementById('chk-cambiar-contra').checked = false;
        if (camposContrasena) camposContrasena.classList.remove('mostrar-campos');
    });
}

    /* -- Confirmar Eliminación Absoluta de Cuenta -- */
    const btnConfirmarEliminar = document.getElementById('btn-confirmar-eliminar');
    if (btnConfirmarEliminar) {
        btnConfirmarEliminar.addEventListener('click', () => {
            cerrarModal('modal-eliminar');
            alert('Tu cuenta ha sido eliminada. Lamentamos verte partir.');
        });
    }

    /* ===================================================
       CONTROL UNIFICADO DE DESPLEGABLES DE LA BARRA SUPERIOR
       =================================================== */
    
    const userMenuBtn = document.getElementById("user-menu-btn");
    const userDropdown = document.getElementById("user-dropdown");
    const closeUserBtn = document.getElementById("close-user-btn");

    const notificationMenuBtn = document.getElementById("notification-menu-btn");
    const notificationDropdown = document.getElementById("notification-dropdown");
    const closeNotificationsBtn = document.getElementById("close-notifications-btn");

    // Interacción del panel de notificaciones (Campana)
    if (notificationMenuBtn && notificationDropdown) {
        notificationMenuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (userDropdown) userDropdown.classList.add("hidden"); 
            notificationDropdown.classList.toggle("hidden");
        });

        if (closeNotificationsBtn) {
            closeNotificationsBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                notificationDropdown.classList.add("hidden");
            });
        }
        notificationDropdown.addEventListener("click", (e) => e.stopPropagation());
    }

    // Interacción del panel de usuario (Avatar de la barra superior)
    if (userMenuBtn && userDropdown) {
        userMenuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (notificationDropdown) notificationDropdown.classList.add("hidden"); 
            userDropdown.classList.toggle("hidden");
        });

        if (closeUserBtn) {
            closeUserBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                userDropdown.classList.add("hidden");
            });
        }
        userDropdown.addEventListener("click", (e) => e.stopPropagation());
    }

    // Cierre general de paneles interactivos haciendo click en cualquier otra sección de la pantalla
    document.addEventListener("click", () => {
        if (userDropdown) userDropdown.classList.add("hidden");
        if (notificationDropdown) notificationDropdown.classList.add("hidden");
    });

});

// Control dinámico del despliegue de campos de contraseña
const chkCambiarContra = document.getElementById('chk-cambiar-contra');
const camposContrasena = document.getElementById('campos-contrasena');

if (chkCambiarContra && camposContrasena) {
    chkCambiarContra.addEventListener('change', () => {
        if (chkCambiarContra.checked) {
            camposContrasena.classList.add('mostrar-campos');
        } else {
            camposContrasena.classList.remove('mostrar-campos');
            // Limpiar los campos si se desmarca la casilla
            document.getElementById('mod-password-nueva').value = '';
            document.getElementById('mod-password-confirmar').value = '';
        }
    });
}