// ==========================================================================
// 1. CATÁLOGO DE PRODUCTOS ACTUALIZADO (Categorías Reales del Restaurante)
// ==========================================================================
const catalog = {
  entradas: [
      { id: 'ent1', name: 'Salchipapa Sencilla', desc: 'Papa francesa con salchicha Zenú acompañada de salsas', price: 12500, emoji: '🍟' },
      { id: 'ent2', name: 'Salchipapa Especial', desc: 'Papa francesa con salchicha zenú, maíz, jamón y queso doble crema', price: 20000, emoji: '🍟' },
      { id: 'ent3', name: 'Mega Salchipapa', desc: 'Papa francesa con salchicha zenú, maíz, carne, pollo, queso doble crema', price: 36500, emoji: '🍟' },
      { id: 'ent4', name: 'Cheese Bacon', desc: 'Papas a la francesa con queso cheddar derretido y tocineta', price: 11500, emoji: '🍟' }
  ],
  hamburguesa: [
      { id: 'hb1', name: 'Hamburguesa Sencilla', desc: 'Carne artesanal, queso, verduras frescas y salsas de la casa', price: 14000, emoji: '🍔' },
      { id: 'hb2', name: 'Hamburguesa Especial', desc: 'Carne artesanal, queso, tocineta, huevo frito y ripio de papa', price: 18500, emoji: '🍔' },
      { id: 'hb3', name: 'Hamburguesa Corralejo Extra', desc: 'Doble carne artesanal, doble queso, tocineta premium y aros de cebolla', price: 25000, emoji: '🍔' }
  ],
  mazorcadas: [
      { id: 'mz1', name: 'Mazorcada Sencilla', desc: 'Maíz tierno desgranado, queso derretido, ripio y salsas', price: 15000, emoji: '🌽' },
      { id: 'mz2', name: 'Mazorcada Mixta', desc: 'Maíz, carne desmechada, pollo, abundante queso doble crema y salsas', price: 22000, emoji: '🌽' }
  ],
  burritos: [
      { id: 'br1', name: 'Burrito de Carne', desc: 'Tortilla gigante rellena de carne premium, frijol refrito, queso y guacamole', price: 17000, emoji: '🌯' },
      { id: 'br2', name: 'Burrito de Pollo', desc: 'Tortilla gigante con pollo desmechado, maíz tierno, queso y salsas', price: 16500, emoji: '🌯' }
  ],
  tortillas: [
      { id: 'tr1', name: 'Quesadilla Simple', desc: 'Tortilla dorada a la plancha rellena de una mezcla de quesos fundidos', price: 10000, emoji: '🫓' },
      { id: 'tr2', name: 'Quesadilla Especial', desc: 'Tortilla rellena de jamón, queso doble crema, champiñones y maíz', price: 14500, emoji: '🫓' }
  ],
  carnes: [
      { id: 'cr1', name: 'Parrillada Corralejo', desc: 'Corte de carne de res, pechuga de pollo, chorizo, arepa con queso y papas', price: 32000, emoji: '🥩' },
      { id: 'cr2', name: 'Pechuga a la Plancha', desc: 'Filete de pechuga jugosa acompañada de ensalada fresca y papas fritas', price: 19000, emoji: '🥩' }
  ],
  bebidas: [
      { id: 'beb1', name: 'Gaseosa 250 ml', desc: 'Coca-Cola, Postobón o Pepsi fría', price: 4000, emoji: '🥤' },
      { id: 'beb2', name: 'Jugo Natural', desc: 'En agua o leche, sabores de temporada', price: 5500, emoji: '🥤' },
      { id: 'beb3', name: 'Agua Mineral', desc: 'Botella de agua con o sin gas', price: 3000, emoji: '💧' }
  ],
  combos: [
      { id: 'cmb1', name: 'Combo Familiar Corralejo', desc: '2 Hamburguesas Especiales + Salchipapa Sencilla + Gaseosa grande', price: 45000, emoji: '⭐' },
      { id: 'cmb2', name: 'Combo Pareja', desc: '1 Mazorcada Mixta + 1 Burrito de Carne + 2 Gaseosas pequeñas', price: 34000, emoji: '⭐' }
  ]
};

// Estructura interna para almacenar temporalmente lo que el usuario cliquea en el modal
let selectedItems = {};

// ==========================================================================
// 2. LÓGICA DE CONTROL DE PESTAÑAS VERTICALES Y MOTOR DEL MODAL
// ==========================================================================

function openProductModal() {
  const overlay = document.getElementById('productOverlay');
  if (overlay) overlay.classList.add('show');
  selectedItems = {};
  updateFooterTotal();
  
  // Activar automáticamente por defecto la primera pestaña (Entradas) al abrir
  const firstTab = document.querySelector('.tab-btn-vertical');
  switchTab('entradas', firstTab);
}

function closeProductModal() {
  const overlay = document.getElementById('productOverlay');
  if (overlay) overlay.classList.remove('show');
}

// NUEVA FUNCIÓN OPTIMIZADA PARA PESTAÑAS VERTICALES
function switchTab(categoryKey, element) {
  // 1. Quitar la clase 'active' de todos los botones de pestañas verticales
  document.querySelectorAll('.tab-btn-vertical').forEach(btn => btn.classList.remove('active'));
  
  // 2. Asignar la clase 'active' al elemento que recibió el clic
  if (element) element.classList.add('active');

  // 3. Renderizar los artículos correspondientes desde el objeto catalog
  const products = catalog[categoryKey] || [];
  renderModalProducts(products);
}

function renderModalProducts(products) {
  const body = document.getElementById('modalBody');
  if (!body) return;
  body.innerHTML = '';

  if (products.length === 0) {
      body.innerHTML = '<p class="no-products">No hay productos cargados en esta sección.</p>';
      return;
  }

  products.forEach(p => {
      const currentQty = selectedItems[p.id] ? selectedItems[p.id].qty : 0;
      const card = document.createElement('div');
      card.className = 'modal-product-card';
      card.innerHTML = `
          <div class="prod-emoji">${p.emoji}</div>
          <div class="prod-details">
              <h4>${p.name}</h4>
              <p>${p.desc}</p>
              <span class="prod-price">$${p.price.toLocaleString('de-DE')}</span>
          </div>
          <div class="prod-counter">
              <button type="button" class="count-btn" onclick="changeQty('${p.id}', -1, '${p.name}', ${p.price}, '${p.emoji}')">-</button>
              <span class="count-num" id="qty-${p.id}">${currentQty}</span>
              <button type="button" class="count-btn" onclick="changeQty('${p.id}', 1, '${p.name}', ${p.price}, '${p.emoji}')">+</button>
          </div>
      `;
      body.appendChild(card);
  });
}

function changeQty(id, delta, name, price, emoji) {
  if (!selectedItems[id]) {
      selectedItems[id] = { id, name, price, emoji, qty: 0 };
  }

  selectedItems[id].qty += delta;

  if (selectedItems[id].qty <= 0) {
      delete selectedItems[id];
      const qtyLabel = document.getElementById(`qty-${id}`);
      if (qtyLabel) qtyLabel.textContent = '0';
  } else {
      const qtyLabel = document.getElementById(`qty-${id}`);
      if (qtyLabel) qtyLabel.textContent = selectedItems[id].qty;
  }

  updateSelectionSummary();
  updateFooterTotal();
}

function updateSelectionSummary() {
  const summaryBox = document.getElementById('selectionSummary');
  if (!summaryBox) return;
  summaryBox.innerHTML = '';

  const items = Object.values(selectedItems);
  if (items.length === 0) {
      summaryBox.style.display = 'none';
      return;
  }

  summaryBox.style.display = 'block';
  items.forEach(item => {
      const chip = document.createElement('span');
      chip.className = 'summary-chip';
      chip.innerHTML = `${item.emoji} ${item.name} x${item.qty} <strong onclick="removeChip('${item.id}')">✕</strong>`;
      summaryBox.appendChild(chip);
  });
}

function removeChip(id) {
  delete selectedItems[id];
  // Re-renderizar la pestaña actual para limpiar el contador visual de la tarjeta
  const activeTabBtn = document.querySelector('.tab-btn-vertical.active');
  if (body && activeTabBtn) {
      // Truco para identificar qué llave de catálogo está renderizada usando una porción de texto o atributo
      renderModalProducts(Object.values(selectedItems)); 
  }
  // Forzar limpieza completa en cascada
  updateSelectionSummary();
  updateFooterTotal();
  
  // Buscar si el contador existe en la vista actual del DOM y resetearlo a 0
  const qtyLabel = document.getElementById(`qty-${id}`);
  if (qtyLabel) qtyLabel.textContent = '0';
}

function updateFooterTotal() {
  const totalLabel = document.getElementById('footerTotal');
  const btnConfirm = document.getElementById('btnConfirm');
  
  let total = 0;
  Object.values(selectedItems).forEach(item => {
      total += item.price * item.qty;
  });

  if (totalLabel) totalLabel.textContent = `$${total.toLocaleString('de-DE')}`;
  
  if (btnConfirm) {
      if (total > 0) {
          btnConfirm.disabled = false;
      } else {
          btnConfirm.disabled = true;
      }
  }
}

function confirmSelection() {
  // Aquí viaja la lógica para insertar los elementos seleccionados a la tabla del pedido principal
  console.log('Productos agregados exitosamente al pedido:', Object.values(selectedItems));
  closeProductModal();
}

// ==========================================================================
// 3. TU CÓDIGO ORIGINAL: CONTROL DE NOTIFICACIONES Y PERFIL DE USUARIO
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  const notificationMenuBtn = document.getElementById("notification-menu-btn");
  const notificationDropdown = document.getElementById("notification-dropdown");
  const closeNotificationsBtn = document.getElementById("close-notifications-btn");

  const userMenuBtn = document.getElementById("user-menu-btn");
  const userDropdown = document.getElementById("user-dropdown");
  const closeUserBtn = document.getElementById("close-user-btn");

  // --- INTERACCIÓN PANEL NOTIFICACIONES ---
  if (notificationMenuBtn && notificationDropdown) {
      notificationMenuBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (userDropdown) userDropdown.classList.add("hidden"); // Cierra perfil de usuario si está abierto
          notificationDropdown.classList.toggle("hidden");
      });

      if (closeNotificationsBtn) {
          closeNotificationsBtn.addEventListener("click", (e) => {
              e.stopPropagation();
              notificationDropdown.classList.add("hidden");
          });
      }

      notificationDropdown.addEventListener("click", (e) => {
          e.stopPropagation(); // Evita que se cierre al hacer clic dentro del cuadro negro
      });
  }

  // --- INTERACCIÓN PANEL USUARIO ---
  if (userMenuBtn && userDropdown) {
      userMenuBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (notificationDropdown) notificationDropdown.classList.add("hidden"); // Cierra notificaciones si está abierto
          userDropdown.classList.toggle("hidden");
      });

      if (closeUserBtn) {
          closeUserBtn.addEventListener("click", (e) => {
              e.stopPropagation();
              userDropdown.classList.add("hidden");
          });
      }

      userDropdown.addEventListener("click", (e) => {
          e.stopPropagation(); // Evita que se cierre al hacer clic dentro del menú
      });
  }

  // --- EVENTO DE CIERRE GLOBAL ---
  document.addEventListener("click", () => {
      if (userDropdown) userDropdown.classList.add("hidden");
      if (notificationDropdown) notificationDropdown.classList.add("hidden");
  });
});