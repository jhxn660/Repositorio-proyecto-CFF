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

// Función para pintar los errores elegantemente en la tarjeta
function showError(message) {
    const form = document.getElementById("loginForm");
    const button = form.querySelector(".btn-submit");
    
    const errorDiv = document.createElement("div");
    errorDiv.id = "error-message";
    errorDiv.innerText = message;
    
    // Estilos para el texto de advertencia
    errorDiv.style.color = "#ff9100"; // Color naranja de tu marca Corralejo Fast Food
    errorDiv.style.fontSize = "0.9rem";
    errorDiv.style.fontWeight = "700";
    errorDiv.style.textAlign = "center";
    errorDiv.style.marginBottom = "15px";
    errorDiv.style.marginTop = "-5px";
    
    form.insertBefore(errorDiv, button);
}