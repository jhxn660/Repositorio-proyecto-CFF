/* ===================================================
   CFF - Ubicación
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* --- Navegación sidebar --- */
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

    /* --- Botón campana (notificaciones placeholder) --- */
    const campana = document.querySelector('.logo1');
    if (campana) {
        campana.addEventListener('click', () => {
            alert('No tienes notificaciones nuevas.');
        });
    }

    /* --- Botones de auth (placeholder) --- */
    const btnLogin    = document.querySelector('.btn-login');
    const btnRegister = document.querySelector('.btn-register');

    if (btnLogin) {
        btnLogin.addEventListener('click', () => {
            alert('Redirigiendo a Iniciar Sesión...');
        });
    }

    if (btnRegister) {
        btnRegister.addEventListener('click', () => {
            alert('Redirigiendo a Registrarse...');
        });
    }

});
