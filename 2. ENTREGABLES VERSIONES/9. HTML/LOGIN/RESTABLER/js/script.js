document.addEventListener("DOMContentLoaded", () => {
    // Referencias de las vistas (pasos)
    const stepEmail = document.getElementById("step-email");
    const stepCode = document.getElementById("step-code");
    const stepPassword = document.getElementById("step-password");

    // 1. Estructura de perfiles con sus datos independientes
    const cuentas = {
        usuario: {
            correo: "diegor@correo.com",
            urlDestino: "/LOGIN/INICIO/index.html" // Redirección para el cliente/usuario
        },
        administrador: {
            correo: "karen@admin.com", // Cambia por el correo real del admin
            urlDestino: "dashboard_admin.html" // Cambia por el index de tu admin
        }
    };

    // Código de verificación general (puedes dejar el mismo para ambos en esta simulación)
    const CODIGO_VALIDO = "101447";
    
    // Variable global temporal para recordar qué rol se está modificando durante el flujo
    let rolDetectado = null; 

    // --- LÓGICA PASO 1: ENVIAR CORREO Y DETECTAR ROL ---
    const btnSendCode = document.getElementById("btn-send-code");
    const recoveryEmail = document.getElementById("recovery-email");
    const emailError = document.getElementById("email-error");

    btnSendCode.addEventListener("click", () => {
        const correoIngresado = recoveryEmail.value.trim().toLowerCase();

        // Validamos a cuál de los dos perfiles pertenece el correo
        if (correoIngresado === cuentas.usuario.correo) {
            rolDetectado = "usuario";
        } else if (correoIngresado === cuentas.administrador.correo) {
            rolDetectado = "administrador";
        } else {
            rolDetectado = null;
        }

        // Si pertenece a alguno, avanzamos al paso 2
        if (rolDetectado !== null) {
            emailError.style.display = "none";
            stepEmail.classList.remove("active");
            stepCode.classList.add("active");
        } else {
            emailError.style.display = "block";
            recoveryEmail.focus();
        }
    });

    // --- LÓGICA PASO 2: VERIFICAR CÓDIGO ---
    const btnVerifyCode = document.getElementById("btn-verify-code");
    const verificationCode = document.getElementById("verification-code");
    const codeError = document.getElementById("code-error");
    const linkResend = document.getElementById("link-resend");
    const resendSuccess = document.getElementById("resend-success");

    btnVerifyCode.addEventListener("click", () => {
        if (verificationCode.value.trim() === CODIGO_VALIDO) {
            codeError.style.display = "none";
            
            // Transición al paso 3
            stepCode.classList.remove("active");
            stepPassword.classList.add("active");
        } else {
            codeError.style.display = "block";
            verificationCode.focus();
        }
    });

    // Reenvío de código
    linkResend.addEventListener("click", (e) => {
        e.preventDefault(); 
        resendSuccess.style.display = "block";
        
        setTimeout(() => {
            resendSuccess.style.display = "none";
        }, 4000);
    });

    // --- LÓGICA PASO 3: NUEVA CONTRASEÑA Y REDIRECCIÓN POR ROL ---
    const btnConfirmChange = document.getElementById("btn-confirm-change");
    const newPassword = document.getElementById("new-password");
    const confirmPassword = document.getElementById("confirm-password");
    const passwordError = document.getElementById("password-error");

    btnConfirmChange.addEventListener("click", () => {
        // 1. Validar que los campos no estén vacíos y coincidan entre sí
        if (newPassword.value !== "" && newPassword.value === confirmPassword.value) {
            passwordError.style.display = "none";
            
            // Nota: En un sistema real con Base de Datos, aquí enviarías la contraseña 
            // correspondiente al correo del rolDetectado. Para tu simulación frontend local:
            
            alert(`¡Contraseña de ${rolDetectado} restablecida con éxito!`);
            
            // Redirecciona dinámicamente según el rol que inició el proceso
            window.location.href = cuentas[rolDetectado].urlDestino; 
            
        } else {
            passwordError.style.display = "block";
        }
    });
});