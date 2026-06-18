const toggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

toggle.addEventListener('click', function () {
    const isOpen = mobileMenu.classList.toggle('open');
    toggle.querySelector('i').className = isOpen
        ? 'fa-solid fa-xmark'
        : 'fa-solid fa-bars';
});

// Cerrar al hacer clic fuera
document.addEventListener('click', function (e) {
    if (!toggle.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('open');
        toggle.querySelector('i').className = 'fa-solid fa-bars';
    }
});