document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('mobileMenu').classList.toggle('open');
  });

  (function () {
    const PAGE_SIZE = 3;
    let currentPage = 1;
    let editingId = null;
    let nextId = 4;

    let insumos = [
      { id: 1, icon: 'fa-solid fa-wheat-awn', nombre: 'Harina de trigo', descripcion: 'Lorem ipsum dolor sit amet, consectetur amet amet amet consectetur', unidad: 'Kilogramos (kg)', stockActual: 49.23, stockMinimo: 20, costo: 2500, categoria: 'Harinas', vencimiento: '2026-07-10', pesoUnidad: '---', calorias: '364 kcal', estado: 'Disponible' },
      { id: 2, icon: 'fa-solid fa-cheese', nombre: 'Queso mozzarella', descripcion: 'Lorem ipsum dolor sit amet, consectetur amet amet amet consectetur', unidad: 'Kilogramos (kg)', stockActual: 62, stockMinimo: 30, costo: 8200, categoria: 'Lácteos', vencimiento: '2026-02-01', pesoUnidad: '500 g', calorias: '852 kcal', estado: 'Fuera de stock' },
      { id: 3, icon: 'fa-solid fa-bottle-droplet', nombre: 'Aceite vegetal', descripcion: 'Lorem ipsum dolor sit amet, consectetur amet amet amet consectetur', unidad: 'Litros (L)', stockActual: 31, stockMinimo: 10, costo: 6000, categoria: 'Aceites', vencimiento: '2026-07-10', pesoUnidad: '---', calorias: '884 kcal', estado: 'Disponible' }
    ];

    const ICONOS_POR_CATEGORIA = {
      Harinas:  'fa-solid fa-wheat-awn',
      'Lácteos': 'fa-solid fa-cheese',
      Aceites:  'fa-solid fa-bottle-droplet',
      Carnes:   'fa-solid fa-drumstick-bite',
      Pescados: 'fa-solid fa-fish',
      Huevos:   'fa-solid fa-egg',
      Verduras: 'fa-solid fa-leaf',
      Salsas:   'fa-solid fa-jar'
    };

    const insumosList        = document.getElementById('insumosList');
    const searchInput        = document.getElementById('searchInput');
    const filterSelect       = document.getElementById('filterCategoria');
    const footerInfo         = document.getElementById('footerInfo');
    const paginationContainer= document.getElementById('paginationContainer');
    const btnAdd             = document.getElementById('btnAddInsumo');
    const modalOverlay       = document.getElementById('modalOverlay');
    const modalTitle         = document.getElementById('modalTitle');
    const insumoForm         = document.getElementById('insumoForm');
    const modalClose         = document.getElementById('modalClose');
    const modalCancel        = document.getElementById('modalCancel');
    const fieldId            = document.getElementById('insumoId');
    const fieldNombre        = document.getElementById('fieldNombre');
    const fieldDescripcion   = document.getElementById('fieldDescripcion');
    const fieldUnidad        = document.getElementById('fieldUnidad');
    const fieldCategoria     = document.getElementById('fieldCategoria');
    const fieldEstado        = document.getElementById('fieldEstado');
    const fieldStockActual   = document.getElementById('fieldStockActual');
    const fieldStockMinimo   = document.getElementById('fieldStockMinimo');
    const fieldCosto         = document.getElementById('fieldCosto');
    const fieldVencimiento   = document.getElementById('fieldVencimiento');
    const fieldPesoUnidad    = document.getElementById('fieldPesoUnidad');
    const fieldCalorias      = document.getElementById('fieldCalorias');

    function escapeHtml(str) {
      if (str === undefined || str === null) return '';
      return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
    }
    function unidadAbrev(u) { const m = u.match(/\(([^)]+)\)/); return m ? m[1] : u; }
    function formatNumero(n) { return Number(n).toString().replace('.', ','); }
    function formatCosto(n, u) { return '$' + Math.round(Number(n)).toLocaleString('es-CO') + ' por ' + unidadAbrev(u); }
    function formatFecha(iso) { if (!iso) return '---'; const [y,m,d] = iso.split('-'); return d+'/'+m+'/'+y; }

    function getFiltered() {
      const term = searchInput.value.trim().toLowerCase();
      const cat  = filterSelect.value;
      return insumos.filter(it => {
        return (term === '' || it.nombre.toLowerCase().includes(term)) &&
               (cat === 'Todos' || it.categoria === cat);
      });
    }

    function renderCard(it) {
      const bc = it.estado === 'Disponible' ? 'badge-green' : 'badge-red';
      return `<div class="insumo-card" data-id="${it.id}">
        <div class="card-top">
          <div class="insumo-icon"><i class="${it.icon}"></i></div>
          <div class="col-info">
            <span class="insumo-name">${escapeHtml(it.nombre)}</span>
            <div class="insumo-desc">${escapeHtml(it.descripcion)}</div>
          </div>
          <div class="data-grid">
            <div class="data-cell"><div class="data-label">Unidad:</div><div class="data-value">${escapeHtml(it.unidad)}</div></div>
            <div class="data-cell"><div class="data-label">Stock actual:</div><div class="data-value">${formatNumero(it.stockActual)} ${unidadAbrev(it.unidad)}</div></div>
            <div class="data-cell"><div class="data-label">Stock mínimo:</div><div class="data-value">${formatNumero(it.stockMinimo)} ${unidadAbrev(it.unidad)}</div></div>
            <div class="data-cell"><div class="data-label">Costo unitario:</div><div class="data-value">${formatCosto(it.costo, it.unidad)}</div></div>
            <div class="data-cell"><div class="data-label">Categoría:</div><div class="data-value">${escapeHtml(it.categoria)}</div></div>
            <div class="data-cell"><div class="data-label">Fecha de vencimiento:</div><div class="data-value">${formatFecha(it.vencimiento)}</div></div>
          </div>
          <div class="nutribox">
            <div class="nutri-item"><div class="nutri-label">Peso por unidad:</div><div class="nutri-value">${escapeHtml(it.pesoUnidad||'---')}</div></div>
            <div class="nutri-item"><div class="nutri-label">Calorías por 100g:</div><div class="nutri-value">${escapeHtml(it.calorias||'---')}</div></div>
          </div>
        </div>
        <div class="card-bottom">
          <span class="badge ${bc}">● ${escapeHtml(it.estado)}</span>
          <button type="button" class="btn-action btn-edit" data-id="${it.id}">Editar</button>
          <button type="button" class="btn-action btn-delete" data-id="${it.id}">Eliminar</button>
        </div>
      </div>`;
    }

    function renderPagination(totalPages) {
      paginationContainer.innerHTML = '';
      const prev = document.createElement('button');
      prev.type='button'; prev.className='page-btn'; prev.textContent='Anterior'; prev.disabled = currentPage<=1;
      prev.addEventListener('click', ()=>{ if(currentPage>1){currentPage--;renderAll();} });
      paginationContainer.appendChild(prev);
      for(let p=1;p<=totalPages;p++){
        const b=document.createElement('button');
        b.type='button'; b.className='page-btn'+(p===currentPage?' active':''); b.textContent=String(p);
        b.addEventListener('click',()=>{currentPage=p;renderAll();});
        paginationContainer.appendChild(b);
      }
      const next=document.createElement('button');
      next.type='button'; next.className='page-btn'; next.textContent='Siguiente'; next.disabled=currentPage>=totalPages;
      next.addEventListener('click',()=>{if(currentPage<totalPages){currentPage++;renderAll();}});
      paginationContainer.appendChild(next);
    }

    function renderAll() {
      const filtered = getFiltered();
      const totalPages = Math.max(1, Math.ceil(filtered.length/PAGE_SIZE));
      if(currentPage>totalPages) currentPage=totalPages;
      if(currentPage<1) currentPage=1;
      const start = (currentPage-1)*PAGE_SIZE;
      const pageItems = filtered.slice(start, start+PAGE_SIZE);
      insumosList.innerHTML = pageItems.length ? pageItems.map(renderCard).join('') : '<p class="no-results">No se encontraron insumos.</p>';
      const desde = filtered.length===0 ? 0 : start+1;
      footerInfo.textContent = `Mostrando ${desde} a ${start+pageItems.length} de ${filtered.length} insumos`;
      renderPagination(totalPages);
    }

    function openModal(mode, id) {
      insumoForm.reset();
      if(mode==='edit'){
        const it=insumos.find(x=>x.id===id); if(!it) return;
        editingId=id; modalTitle.textContent='Editar insumo';
        fieldId.value=it.id; fieldNombre.value=it.nombre; fieldDescripcion.value=it.descripcion;
        fieldUnidad.value=it.unidad; fieldCategoria.value=it.categoria; fieldEstado.value=it.estado;
        fieldStockActual.value=it.stockActual; fieldStockMinimo.value=it.stockMinimo; fieldCosto.value=it.costo;
        fieldVencimiento.value=it.vencimiento||''; fieldPesoUnidad.value=it.pesoUnidad||''; fieldCalorias.value=it.calorias||'';
      } else {
        editingId=null; modalTitle.textContent='Añadir insumo'; fieldId.value='';
      }
      modalOverlay.classList.add('active'); document.body.classList.add('modal-open');
    }

    function closeModal() {
      modalOverlay.classList.remove('active'); document.body.classList.remove('modal-open');
      insumoForm.reset(); editingId=null;
    }

    function handleSubmit(e) {
      e.preventDefault();
      const datos = {
        nombre: fieldNombre.value.trim(), descripcion: fieldDescripcion.value.trim(),
        unidad: fieldUnidad.value, categoria: fieldCategoria.value, estado: fieldEstado.value,
        stockActual: parseFloat(fieldStockActual.value)||0, stockMinimo: parseFloat(fieldStockMinimo.value)||0,
        costo: parseFloat(fieldCosto.value)||0, vencimiento: fieldVencimiento.value,
        pesoUnidad: fieldPesoUnidad.value.trim()||'---', calorias: fieldCalorias.value.trim()||'---'
      };
      if(!datos.nombre){ alert('El nombre del insumo es obligatorio.'); return; }
      if(editingId!==null){
        const it=insumos.find(x=>x.id===editingId); if(it) Object.assign(it,datos);
      } else {
        insumos.push({id:nextId++, icon:ICONOS_POR_CATEGORIA[datos.categoria]||'fa-solid fa-box', ...datos});
        searchInput.value=''; filterSelect.value='Todos';
        currentPage=Math.max(1,Math.ceil(insumos.length/PAGE_SIZE));
      }
      closeModal(); renderAll();
    }

    function handleDelete(id) {
      const it=insumos.find(x=>x.id===id); if(!it) return;
      if(!confirm('¿Eliminar "'+it.nombre+'" del inventario?')) return;
      insumos=insumos.filter(x=>x.id!==id); renderAll();
    }

    btnAdd.addEventListener('click', ()=>openModal('add'));
    modalClose.addEventListener('click', closeModal);
    modalCancel.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', e=>{ if(e.target===modalOverlay) closeModal(); });
    document.addEventListener('keydown', e=>{ if(e.key==='Escape' && modalOverlay.classList.contains('active')) closeModal(); });
    insumoForm.addEventListener('submit', handleSubmit);
    insumosList.addEventListener('click', e=>{
      const eb=e.target.closest('.btn-edit');
      const db=e.target.closest('.btn-delete');
      if(eb) openModal('edit', Number(eb.dataset.id));
      else if(db) handleDelete(Number(db.dataset.id));
    });
    searchInput.addEventListener('input', ()=>{ currentPage=1; renderAll(); });
    filterSelect.addEventListener('change', ()=>{ currentPage=1; renderAll(); });

    renderAll();
  })();