// 1. Base de datos simulada
let employees = [
    { id: 1, name: "Carlos Ramirez", role: "Cocinero", schedule: "08:00 AM - 04:00 PM", status: "Trabajando" },
    { id: 2, name: "Ana Torres", role: "Cajero", schedule: "02:00 PM - 10:00 PM", status: "Trabajando" },
    { id: 3, name: "Luis Mendoza", role: "Mesero", schedule: "Descanso", status: "Inactivo" },
    { id: 4, name: "Diana Rojas", role: "Jefe", schedule: "09:00 AM - 06:00 PM", status: "Trabajando" }
];

let nextId = 5;
let isEditing = false;

// 2. Referencias correctas a los elementos del DOM
const activeGrid = document.getElementById('activeEmployeeGrid');
const inactiveGrid = document.getElementById('inactiveEmployeeGrid');
const modal = document.getElementById('employeeModal');
const employeeForm = document.getElementById('employeeForm');
const btnOpenAddModal = document.getElementById('btnOpenAddModal');
const btnCancelModal = document.getElementById('btnCancelModal');

// Menú móvil protegido
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => mobileMenu.classList.toggle('open'));
}

// 3. Función para renderizar las dos secciones por separado
function renderGrid() {
    if (!activeGrid || !inactiveGrid) return;
    
    // Limpiar contenedores
    activeGrid.innerHTML = '';
    inactiveGrid.innerHTML = '';

    // Filtrar y pintar Empleados Activos (Verdes)
    const activeEmployees = employees.filter(emp => emp.status === 'Trabajando');
    if (activeEmployees.length === 0) {
        activeGrid.innerHTML = `<p class="no-data-msg">No hay empleados trabajando actualmente.</p>`;
    } else {
        activeEmployees.forEach(emp => {
            const card = createEmployeeCard(emp, 'border-green');
            activeGrid.appendChild(card);
        });
    }

    // Filtrar y pintar Empleados Inactivos (Rojos)
    const inactiveEmployees = employees.filter(emp => emp.status === 'Inactivo');
    if (inactiveEmployees.length === 0) {
        inactiveGrid.innerHTML = `<p class="no-data-msg">No hay empleados en descanso.</p>`;
    } else {
        inactiveEmployees.forEach(emp => {
            const card = createEmployeeCard(emp, 'border-red');
            inactiveGrid.appendChild(card);
        });
    }
}

// Función auxiliar para construir la tarjeta HTML
function createEmployeeCard(emp, borderClass) {
    const card = document.createElement('div');
    card.className = `employee-card ${borderClass}`;
    card.innerHTML = `
        <div class="card-avatar">
            <i class="fa-solid fa-circle-user"></i>
        </div>
        <h4 class="emp-name">${emp.name}</h4>
        <p class="emp-role">${emp.role}</p>
        <div class="emp-schedule">
            <i class="fa-regular fa-clock"></i> ${emp.schedule}
        </div>
        <div class="card-actions">
            <button class="btn-icon edit" onclick="openEditModal(${emp.id})" title="Editar">
                <i class="fa-solid fa-pen"></i>
            </button>
            <button class="btn-icon delete" onclick="deleteEmployee(${emp.id})" title="Eliminar">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `;
    return card;
}

// 4. Funciones de control de la Ventana Modal
const openModal = () => {
    if (modal) modal.classList.add('active');
};

const closeModal = () => {
    if (modal) {
        modal.classList.remove('active');
        if (employeeForm) employeeForm.reset();
        isEditing = false;
    }
};

// EVENTO CLAVE: Abrir modal para añadir un nuevo empleado
if (btnOpenAddModal) {
    btnOpenAddModal.addEventListener('click', () => {
        document.getElementById('modalTitle').textContent = 'Añadir Empleado';
        document.getElementById('empId').value = '';
        document.getElementById('empStatus').value = 'Trabajando';
        isEditing = false;
        openModal();
    });
}

// Evento para cerrar la modal con el botón "Cancelar"
if (btnCancelModal) {
    btnCancelModal.addEventListener('click', closeModal);
}

// Cerrar la modal si se hace clic fuera de la ventana blanca
if (modal) {
    modal.addEventListener('click', (e) => { 
        if (e.target === modal) closeModal(); 
    });
}

// 5. Enviar el formulario (Guardar o Editar)
if (employeeForm) {
    employeeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const empData = {
            name: document.getElementById('empName').value.trim(),
            schedule: document.getElementById('empSchedule').value.trim(),
            role: document.getElementById('empRole').value,
            status: document.getElementById('empStatus').value
        };

        if (isEditing) {
            const idToEdit = parseInt(document.getElementById('empId').value);
            const index = employees.findIndex(emp => emp.id === idToEdit);
            if (index !== -1) employees[index] = { id: idToEdit, ...empData };
        } else {
            employees.push({ id: nextId++, ...empData });
        }

        renderGrid();
        closeModal();
    });
}

// 6. Funciones globales de las tarjetas (Editar y Eliminar)
window.openEditModal = function(id) {
    const emp = employees.find(e => e.id === id);
    if (!emp) return;

    document.getElementById('modalTitle').textContent = 'Editar Empleado';
    document.getElementById('empId').value = emp.id;
    document.getElementById('empName').value = emp.name;
    document.getElementById('empSchedule').value = emp.schedule;
    document.getElementById('empRole').value = emp.role;
    document.getElementById('empStatus').value = emp.status;

    isEditing = true;
    openModal();
};

window.deleteEmployee = function(id) {
    if (confirm(`¿Eliminar empleado?`)) {
        employees = employees.filter(emp => emp.id !== id);
        renderGrid();
    }
};

// Carga inicial del sistema
renderGrid();