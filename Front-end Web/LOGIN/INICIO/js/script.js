// ============================================================
// LOGIN - LÓGICA DE VALIDACIÓN (CFF)
// Nota: la validación de credenciales es JS puro (Bootstrap no
// interviene aquí), pero el mensaje de error que se inyecta en
// el DOM SÍ usa clases de utilidad de Bootstrap (alert, mt-*, etc.)
// para que combine visualmente con el resto del formulario.
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            // 1. Previene que la página se recargue sola
            e.preventDefault();

            // 2. Obtiene los datos limpios de los campos
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();

            // Limpiar mensajes de error anteriores para que no se acumulen
            const existingError = document.getElementById("error-message");
            if (existingError) {
                existingError.remove();
            }

            // ==========================================
            // 3. DEFINICIÓN DE CREDENCIALES Y RUTAS
            // ==========================================

            // Datos del Cliente (Index 1)
            const clientEmail = "diegor@correo.com";
            const clientPass = "2103";
            const clientUrl = "/CLIENTE/MENU/index.html"; // <-- Cambia esto por la ruta de tu INDEX 1 (Panel Cliente)

            // Datos del Administrador (Index 2)
            const adminEmail = "karen@admin.com";
            const adminPass = "210310";
            const adminUrl = "/CLIENTE/MENU/index.html"; // <-- Cambia esto por la ruta de tu INDEX 2 (Panel Admin)

            // ==========================================
            // 4. LÓGICA DE REDIRECCIÓN Y VALIDACIÓN
            // ==========================================

            if (email === clientEmail) {
                // Si el correo coincide con el del Cliente
                if (password === clientPass) {
                    window.location.href = clientUrl; // Redirige al Index 1
                } else {
                    showError("Contraseña incorrecta");
                }
            }
            else if (email === adminEmail) {
                // Si el correo coincide con el del Administrador
                if (password === adminPass) {
                    window.location.href = adminUrl; // Redirige al Index 2
                } else {
                    showError("Contraseña incorrecta");
                }
            }
            else {
                // Si digitan cualquier otro correo electrónico
                showError("Correo inexistente");
            }
        });
    }
});

/**
 * Pinta el mensaje de error dentro de la tarjeta de login.
 * Usamos clases de Bootstrap (text-center, fw-bold, mb-3) para
 * el espaciado/tipografía y nuestra clase custom "error-message"
 * (definida en style.css) para el color de marca.
 */
function showError(message) {
    const form = document.getElementById("loginForm");
    const button = form.querySelector(".btn-submit");

    // Creamos el contenedor del error
    const errorDiv = document.createElement("div");
    errorDiv.id = "error-message";

    // Clases de Bootstrap para alineación y tipografía +
    // clase custom "error-message" para el color naranja de marca
    errorDiv.className = "error-message text-center fw-bold mb-3";
    errorDiv.innerText = message;

    // Insertamos el mensaje justo antes del botón de "Iniciar Sesión"
    form.insertBefore(errorDiv, button);
}