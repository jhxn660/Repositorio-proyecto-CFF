document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Previene que la página se recargue si el HTML pasó sus filtros

    // Captura de valores de los cuadros de información
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validación interna: Contraseñas idénticas
    if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden. Por favor, verifíquelas.");
        return;
    }

    // Limpia el formulario
    document.getElementById('registerForm').reset();

    window.location.href = "/LOGIN/INICIO/index.html"; 
});