/**
 * GORDINHO PERSONALIZADOS — PAINEL ADMINISTRATIVO DO CATÁLOGO 2026
 * Gerenciamento completo (CRUD), Live Preview, Sincronização e Ferramentas de Backup
 */

(function () {
  'use strict';

  // Chave de autenticação na sessão
  const AUTH_STORAGE_KEY = 'gordinho-admin-session-auth';
  const DEFAULT_PIN = '2026';

  // Estado global do admin
  const state = {
    items: [],
    categories: [],
    filterCategory: 'todos',
    searchTerm: '',
    sortBy: 'nome-asc',
    currentItemId: null,
    pendingDeleteId: null,
    pendingReset: false
  };

  // Cache dos elementos DOM
  const els = {};

  function cacheDom() {
    // Auth
    els.authOverlay = document.getElementById('admin-auth-overlay');
    els.authForm = document.getElementById('admin-auth-form');
    els.authPin = document.getElementById('admin-auth-pin');
    els.authTogglePin = document.getElementById('auth-toggle-pin');
    els.authError = document.getElementById('admin-auth-error');
    els.btnLogout = document.getElementById('btn-admin-logout');

    // KPIs
    els.kpiTotalItems = document.getElementById('kpi-total-items');
    els.kpiTotalCategories = document.getElementById('kpi-total-categories');
    els.kpiActiveItems = document.getElementById('kpi-active-items');
    els.kpiStorageStatus = document.getElementById('kpi-storage-status');

    // Toolbar
    els.searchInput = document.getElementById('admin-search');
    els.categorySelect = document.getElementById('admin-category-filter');
    els.sortSelect = document.getElementById('admin-sort-filter');
    els.btnNewItem = document.getElementById('btn-new-item');
    els.btnExportJson = document.getElementById('btn-export-json');
    els.btnImportJson = document.getElementById('btn-import-json');
    els.inputFileImport = document.getElementById('input-file-import');
    els.btnResetDefault = document.getElementById('btn-reset-default');

    // Tabela
    els.tableBody = document.getElementById('admin-table-body');
    els.tableEmptyState = document.getElementById('admin-empty-state');

    // Modal Item
    els.modalItem = document.getElementById('modal-item');
    els.modalItemTitle = document.getElementById('modal-item-title');
    els.modalItemClose = document.getElementById('modal-item-close');
    els.modalItemCancel = document.getElementById('modal-item-cancel');
    els.formItem = document.getElementById('form-item');
    els.itemId = document.getElementById('item-id');
    els.itemNome = document.getElementById('item-nome');
    els.itemCategoria = document.getElementById('item-categoria');
    els.itemCategoriaCustomWrap = document.getElementById('item-categoria-custom-wrap');
    els.itemCategoriaCustom = document.getElementById('item-categoria-custom');
    els.itemBadge = document.getElementById('item-badge');
    els.itemEspecificacao = document.getElementById('item-especificacao');
    els.itemDescricao = document.getElementById('item-descricao');
    els.itemFoto = document.getElementById('item-foto');
    els.itemFotoFile = document.getElementById('item-foto-file');
    els.btnTriggerUpload = document.getElementById('btn-trigger-upload');
    els.itemPaginaRef = document.getElementById('item-pagina-ref');
    els.itemAtivo = document.getElementById('item-ativo');

    // Live Preview elements
    els.previewCardImg = document.getElementById('preview-card-img');
    els.previewPlaceholder = document.getElementById('preview-placeholder');
    els.previewCardBadge = document.getElementById('preview-card-badge');
    els.previewCardCat = document.getElementById('preview-card-cat');
    els.previewCardTitle = document.getElementById('preview-card-title');
    els.previewCardSpec = document.getElementById('preview-card-spec');
    els.previewCardDesc = document.getElementById('preview-card-desc');
    els.btnClearPhoto = document.getElementById('btn-clear-photo');

    // Confirm Modal
    els.modalConfirm = document.getElementById('modal-confirm');
    els.confirmTitle = document.getElementById('confirm-title');
    els.confirmDesc = document.getElementById('confirm-desc');
    els.confirmCancel = document.getElementById('confirm-cancel');
    els.confirmAction = document.getElementById('confirm-action');

    // Toast Container
    els.toastContainer = document.getElementById('toast-container');
  }

  // ==========================================================================
  // AUTENTICAÇÃO E SESSÃO
  // ==========================================================================
  function checkAuth() {
    const isAuthed = sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true';
    if (isAuthed) {
      els.authOverlay.classList.add('hidden');
    } else {
      els.authOverlay.classList.remove('hidden');
      if (els.authPin) els.authPin.focus();
    }
  }

  function handleLogin(e) {
    e.preventDefault();
    const pin = (els.authPin.value || '').trim();
    if (pin === DEFAULT_PIN) {
      sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
      els.authOverlay.classList.add('hidden');
      els.authError.classList.remove('visible');
      els.authPin.value = '';
      showToast('Acesso autorizado! Bem-vindo ao Painel.', 'success');
    } else {
      els.authError.textContent = 'PIN de segurança incorreto. Tente novamente.';
      els.authError.classList.add('visible');
      els.authPin.select();
    }
  }

  function handleLogout() {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    els.authOverlay.classList.remove('hidden');
    els.authPin.value = '';
    showToast('Sessão administrativa encerrada.', 'warning');
  }

  // ==========================================================================
  // CARREGAMENTO DE DADOS & KPIS
  // ==========================================================================
  function loadData() {
    if (window.GordinhoCatalogData) {
      state.items = window.GordinhoCatalogData.getItems();
    } else {
      try {
        const raw = localStorage.getItem('gordinho-catalog-items');
        state.items = raw ? JSON.parse(raw) : (window.DEFAULT_CATALOG_ITEMS || []);
      } catch (e) {
        state.items = window.DEFAULT_CATALOG_ITEMS || [];
      }
    }

    updateCategoriesList();
    renderKpis();
    renderCategoryOptions();
    renderTable();
  }

  function updateCategoriesList() {
    const fromItems = state.items.map((i) => i.categoria).filter(Boolean);
    const defaults = window.GordinhoCatalogData ? window.GordinhoCatalogData.DEFAULT_CATEGORIES : [];
    state.categories = Array.from(new Set([...defaults, ...fromItems]));
  }

  function renderKpis() {
    const total = state.items.length;
    const active = state.items.filter((i) => i.ativo !== false).length;
    const categoriesCount = state.categories.length;

    els.kpiTotalItems.textContent = total;
    els.kpiTotalCategories.textContent = categoriesCount;
    els.kpiActiveItems.textContent = active;

    const isCustom = localStorage.getItem('gordinho-catalog-items') !== null;
    els.kpiStorageStatus.textContent = isCustom ? 'Modificado' : 'Padrão';
  }

  function renderCategoryOptions() {
    // Atualizar dropdown de filtro
    const currentFilter = els.categorySelect.value;
    els.categorySelect.innerHTML = '<option value="todos">Todas as Categorias</option>';
    state.categories.forEach((cat) => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      els.categorySelect.appendChild(opt);
    });
    if (state.categories.includes(currentFilter)) {
      els.categorySelect.value = currentFilter;
    } else {
      els.categorySelect.value = 'todos';
      state.filterCategory = 'todos';
    }

    // Atualizar select do modal de cadastro
    els.itemCategoria.innerHTML = '';
    state.categories.forEach((cat) => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      els.itemCategoria.appendChild(opt);
    });
    const newCatOpt = document.createElement('option');
    newCatOpt.value = '__nova__';
    newCatOpt.textContent = '+ Cadastrar Nova Categoria...';
    els.itemCategoria.appendChild(newCatOpt);
  }

  // ==========================================================================
  // RENDERIZAÇÃO DA TABELA
  // ==========================================================================
  function getFilteredAndSortedItems() {
    let list = [...state.items];

    // Filtro por Categoria
    if (state.filterCategory !== 'todos') {
      list = list.filter((i) => i.categoria === state.filterCategory);
    }

    // Filtro por Busca
    if (state.searchTerm.trim() !== '') {
      const term = state.searchTerm.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      list = list.filter((i) => {
        const text = `${i.nome} ${i.categoria} ${i.badge || ''} ${i.especificacao || ''} ${i.descricao || ''} ${i.id}`
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');
        return text.includes(term);
      });
    }

    // Ordenação
    switch (state.sortBy) {
      case 'nome-asc':
        list.sort((a, b) => a.nome.localeCompare(b.nome));
        break;
      case 'nome-desc':
        list.sort((a, b) => b.nome.localeCompare(a.nome));
        break;
      case 'categoria':
        list.sort((a, b) => a.categoria.localeCompare(b.categoria) || a.nome.localeCompare(b.nome));
        break;
      case 'recentes':
        list.reverse();
        break;
    }

    return list;
  }

  function renderTable() {
    const items = getFilteredAndSortedItems();

    if (items.length === 0) {
      els.tableBody.innerHTML = '';
      els.tableEmptyState.hidden = false;
      return;
    }

    els.tableEmptyState.hidden = true;

    els.tableBody.innerHTML = items.map((item) => {
      const isAtivo = item.ativo !== false;
      const fotoSrc = item.foto || 'assets/images/favicon.png';

      return `
        <tr data-id="${escapeAttr(item.id)}">
          <td>
            <img src="${escapeAttr(fotoSrc)}" alt="${escapeAttr(item.nome)}" class="table-item-img" onerror="this.src='assets/images/favicon.png'" />
          </td>
          <td>
            <div class="table-item-info">
              <span class="table-item-name">${escapeHTML(item.nome)}</span>
              <span class="table-item-id">ID: ${escapeHTML(item.id)}</span>
            </div>
          </td>
          <td>
            <span class="badge-category">${escapeHTML(item.categoria)}</span>
          </td>
          <td>
            ${item.badge ? `<span class="badge-tag">${escapeHTML(item.badge)}</span>` : '<span style="color:#8FB49C;">—</span>'}
          </td>
          <td>
            <span style="color: #D2E4D8; font-size: 0.85rem;" title="${escapeAttr(item.especificacao || '')}">
              ${escapeHTML(truncateText(item.especificacao || '—', 45))}
            </span>
          </td>
          <td>
            <button type="button" class="status-pill ${isAtivo ? 'active' : 'inactive'}" data-action="toggle-status" data-id="${escapeAttr(item.id)}" title="Clique para alternar status">
              ${isAtivo ? 'Ativo' : 'Inativo'}
            </button>
          </td>
          <td>
            <div class="table-actions-group">
              <button type="button" class="btn-table-action action-edit" data-action="edit" data-id="${escapeAttr(item.id)}" title="Editar item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </button>
              <button type="button" class="btn-table-action action-clone" data-action="duplicate" data-id="${escapeAttr(item.id)}" title="Duplicar item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              </button>
              <button type="button" class="btn-table-action action-delete" data-action="delete" data-id="${escapeAttr(item.id)}" title="Excluir item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    attachTableEvents();
  }

  function attachTableEvents() {
    els.tableBody.querySelectorAll('[data-action]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        const id = btn.dataset.id;

        if (action === 'toggle-status') {
          toggleItemStatus(id);
        } else if (action === 'edit') {
          openEditModal(id);
        } else if (action === 'duplicate') {
          duplicateItem(id);
        } else if (action === 'delete') {
          openDeleteConfirm(id);
        }
      });
    });
  }

  // ==========================================================================
  // OPERAÇÕES DE CRUD
  // ==========================================================================
  function toggleItemStatus(id) {
    const item = state.items.find((i) => i.id === id);
    if (!item) return;

    item.ativo = !(item.ativo !== false);
    saveState();
    renderTable();
    renderKpis();
    showToast(`Status de "${item.nome}" alterado para ${item.ativo ? 'Ativo' : 'Inativo'}.`, 'success');
  }

  function openCreateModal() {
    state.currentItemId = null;
    els.modalItemTitle.innerHTML = 'Adicionar Novo <span>Produto</span>';
    els.formItem.reset();

    // Auto gerar ID sugestivo
    els.itemId.value = 'prod-' + Date.now().toString(36);
    if (els.itemCategoriaCustomWrap) {
      els.itemCategoriaCustomWrap.hidden = true;
      els.itemCategoriaCustomWrap.style.display = 'none';
    }
    if (els.itemCategoriaCustom) els.itemCategoriaCustom.required = false;
    els.itemAtivo.checked = true;
    els.itemFoto.value = '';

    // Reset preview
    updateLivePreview();

    document.body.style.overflow = 'hidden';
    els.modalItem.classList.add('open');
    els.itemNome.focus();
  }

  function openEditModal(id) {
    const item = state.items.find((i) => i.id === id);
    if (!item) return;

    state.currentItemId = id;
    els.modalItemTitle.innerHTML = 'Editar <span>' + escapeHTML(item.nome) + '</span>';

    els.itemId.value = item.id;
    els.itemNome.value = item.nome || '';

    // Categoria
    if (state.categories.includes(item.categoria)) {
      els.itemCategoria.value = item.categoria;
      if (els.itemCategoriaCustomWrap) {
        els.itemCategoriaCustomWrap.hidden = true;
        els.itemCategoriaCustomWrap.style.display = 'none';
      }
      if (els.itemCategoriaCustom) els.itemCategoriaCustom.required = false;
    } else {
      els.itemCategoria.value = '__nova__';
      if (els.itemCategoriaCustomWrap) {
        els.itemCategoriaCustomWrap.hidden = false;
        els.itemCategoriaCustomWrap.style.display = 'block';
      }
      if (els.itemCategoriaCustom) {
        els.itemCategoriaCustom.value = item.categoria;
        els.itemCategoriaCustom.required = true;
      }
    }

    els.itemBadge.value = item.badge || '';
    els.itemEspecificacao.value = item.especificacao || '';
    els.itemDescricao.value = item.descricao || '';
    els.itemFoto.value = item.foto || '';
    els.itemPaginaRef.value = item.paginaRef || '';
    els.itemAtivo.checked = item.ativo !== false;

    updateLivePreview();
    document.body.style.overflow = 'hidden';
    els.modalItem.classList.add('open');
  }

  function closeItemModal() {
    els.modalItem.classList.remove('open');
    state.currentItemId = null;
    document.body.style.overflow = '';
  }

  function handleSaveItem(e) {
    e.preventDefault();

    const id = (els.itemId.value || '').trim();
    const nome = (els.itemNome.value || '').trim();
    let categoria = els.itemCategoria.value;

    if (categoria === '__nova__') {
      categoria = (els.itemCategoriaCustom.value || '').trim();
    }

    const badge = (els.itemBadge.value || '').trim();
    const especificacao = (els.itemEspecificacao.value || '').trim();
    const descricao = (els.itemDescricao.value || '').trim();
    const foto = (els.itemFoto.value || '').trim() || 'assets/images/favicon.png';
    const paginaRef = (els.itemPaginaRef.value || '').trim();
    const ativo = els.itemAtivo.checked;

    if (!id || !nome || !categoria || !especificacao) {
      showToast('Por favor, preencha os campos obrigatórios.', 'error');
      return;
    }

    const itemData = {
      id,
      nome,
      categoria,
      badge,
      especificacao,
      descricao,
      foto,
      paginaRef: paginaRef || foto,
      ativo
    };

    if (state.currentItemId) {
      // Edição
      const index = state.items.findIndex((i) => i.id === state.currentItemId);
      if (index !== -1) {
        state.items[index] = itemData;
        showToast('Produto atualizado com sucesso!', 'success');
      }
    } else {
      // Novo
      // Verificar unicidade do ID
      const exists = state.items.some((i) => i.id === id);
      if (exists) {
        itemData.id = id + '-' + Math.floor(Math.random() * 1000);
      }
      state.items.unshift(itemData);
      showToast('Novo produto adicionado ao catálogo!', 'success');
    }

    saveState();
    updateCategoriesList();
    renderCategoryOptions();
    renderKpis();
    renderTable();
    closeItemModal();
  }

  function duplicateItem(id) {
    const orig = state.items.find((i) => i.id === id);
    if (!orig) return;

    const copy = JSON.parse(JSON.stringify(orig));
    copy.id = orig.id + '-copia-' + Math.floor(Math.random() * 1000);
    copy.nome = orig.nome + ' (Cópia)';
    copy.ativo = true;

    state.items.unshift(copy);
    saveState();
    renderKpis();
    renderTable();
    showToast(`"${copy.nome}" duplicado com sucesso!`, 'success');
  }

  function openDeleteConfirm(id) {
    const item = state.items.find((i) => i.id === id);
    if (!item) return;

    state.pendingDeleteId = id;
    state.pendingReset = false;

    els.confirmTitle.textContent = 'Excluir Produto';
    els.confirmDesc.innerHTML = `Tem certeza que deseja remover o item <strong>"${escapeHTML(item.nome)}"</strong> do catálogo? Esta ação não pode ser desfeita.`;
    els.confirmAction.textContent = 'Sim, Excluir';
    els.confirmAction.className = 'btn-admin btn-admin-danger-outline';

    document.body.style.overflow = 'hidden';
    els.modalConfirm.classList.add('open');
  }

  function openResetConfirm() {
    state.pendingDeleteId = null;
    state.pendingReset = true;

    els.confirmTitle.textContent = 'Restaurar Catálogo de Fábrica';
    els.confirmDesc.innerHTML = `Tem certeza que deseja restaurar os <strong>17 produtos padrão originais</strong>? Todas as alterações manuais e produtos novos criados serão resetados.`;
    els.confirmAction.textContent = 'Sim, Restaurar Padrões';
    els.confirmAction.className = 'btn-admin btn-admin-primary';

    document.body.style.overflow = 'hidden';
    els.modalConfirm.classList.add('open');
  }

  function handleConfirmAction() {
    if (state.pendingReset) {
      if (window.GordinhoCatalogData) {
        window.GordinhoCatalogData.resetToDefault();
      } else {
        localStorage.removeItem('gordinho-catalog-items');
      }
      loadData();
      showToast('Catálogo restaurado para os padrões de fábrica!', 'success');
    } else if (state.pendingDeleteId) {
      const id = state.pendingDeleteId;
      state.items = state.items.filter((i) => i.id !== id);
      saveState();
      renderKpis();
      renderTable();
      showToast('Produto removido com sucesso.', 'warning');
    }

    closeConfirmModal();
  }

  function closeConfirmModal() {
    els.modalConfirm.classList.remove('open');
    state.pendingDeleteId = null;
    state.pendingReset = false;
    document.body.style.overflow = '';
  }

  function generateSlug(text) {
    return 'prod-' + (text || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 30);
  }

  // ==========================================================================
  // LIVE PREVIEW DO CARD NO MODAL
  // ==========================================================================
  function updateLivePreview() {
    const nome = els.itemNome.value.trim() || 'Nome do Produto Personalizado';
    let cat = els.itemCategoria.value;
    if (cat === '__nova__') {
      cat = els.itemCategoriaCustom.value.trim() || 'Nova Categoria';
    }
    const badge = els.itemBadge.value.trim();
    const spec = els.itemEspecificacao.value.trim() || 'Especificação técnica do item';
    const desc = els.itemDescricao.value.trim() || 'Descrição completa sobre os acabamentos e técnicas.';
    const foto = els.itemFoto.value.trim();

    els.previewCardTitle.textContent = nome;
    els.previewCardCat.textContent = cat;

    // Selo / Badge
    if (badge) {
      els.previewCardBadge.textContent = badge;
      els.previewCardBadge.style.display = 'block';
    } else {
      els.previewCardBadge.style.display = 'none';
    }

    els.previewCardSpec.innerHTML = `<strong>Especificação:</strong> ${escapeHTML(spec)}`;
    els.previewCardDesc.textContent = desc;

    // Foto / Placeholder
    if (foto) {
      els.previewCardImg.src = foto;
      els.previewCardImg.style.display = 'block';
      if (els.previewPlaceholder) els.previewPlaceholder.style.display = 'none';
      if (els.btnClearPhoto) els.btnClearPhoto.style.display = 'inline-flex';
    } else {
      els.previewCardImg.style.display = 'none';
      if (els.previewPlaceholder) els.previewPlaceholder.style.display = 'flex';
      if (els.btnClearPhoto) els.btnClearPhoto.style.display = 'none';
    }

    els.previewCardImg.onerror = () => {
      els.previewCardImg.style.display = 'none';
      if (els.previewPlaceholder) els.previewPlaceholder.style.display = 'flex';
    };
  }

  // ==========================================================================
  // EXPORTAR & IMPORTAR BACKUP JSON
  // ==========================================================================
  function exportJson() {
    try {
      const dataStr = JSON.stringify(state.items, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const dateStr = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `catalogo-gordinho-backup-${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Catálogo exportado em JSON com sucesso!', 'success');
    } catch (e) {
      showToast('Erro ao exportar catálogo.', 'error');
    }
  }

  function handleImportFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result);
        if (!Array.isArray(parsed)) {
          showToast('Arquivo inválido: o JSON precisa ser uma lista de produtos.', 'error');
          return;
        }

        // Validação mínima
        const valid = parsed.filter((item) => item && item.id && item.nome && item.categoria);
        if (valid.length === 0) {
          showToast('Nenhum produto válido encontrado no arquivo.', 'error');
          return;
        }

        state.items = valid;
        saveState();
        loadData();
        showToast(`${valid.length} produtos importados com sucesso!`, 'success');
      } catch (err) {
        showToast('Erro ao processar arquivo JSON: ' + err.message, 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Por favor, selecione um arquivo de imagem.', 'error');
      return;
    }

    // Limite de 2MB para Base64 no localStorage
    if (file.size > 2 * 1024 * 1024) {
      showToast('A imagem excede 2MB. Recomendamos otimizar a imagem antes de fazer upload.', 'warning');
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      els.itemFoto.value = evt.target.result;
      updateLivePreview();
      showToast('Imagem carregada com sucesso!', 'success');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  // ==========================================================================
  // SALVAR ESTADO
  // ==========================================================================
  function saveState() {
    if (window.GordinhoCatalogData) {
      window.GordinhoCatalogData.saveItems(state.items);
    } else {
      try {
        localStorage.setItem('gordinho-catalog-items', JSON.stringify(state.items));
      } catch (e) {
        console.error('Falha ao salvar no storage:', e);
      }
    }
  }

  // ==========================================================================
  // TOAST NOTIFICATIONS
  // ==========================================================================
  function showToast(msg, type = 'success') {
    if (!els.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    } else if (type === 'error') {
      iconSvg = '<svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
    } else {
      iconSvg = '<svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
    }

    toast.innerHTML = `${iconSvg} <span class="toast-msg">${escapeHTML(msg)}</span>`;
    els.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-fadeout');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 3200);
  }

  // ==========================================================================
  // UTILITÁRIOS
  // ==========================================================================
  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  function escapeAttr(str) {
    return escapeHTML(str).replace(/"/g, '&quot;');
  }

  function truncateText(str, max) {
    if (!str) return '';
    return str.length > max ? str.substring(0, max) + '...' : str;
  }

  // ==========================================================================
  // INICIALIZAÇÃO
  // ==========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    cacheDom();
    checkAuth();
    loadData();

    // Eventos de Autenticação
    els.authForm.addEventListener('submit', handleLogin);
    els.btnLogout.addEventListener('click', handleLogout);
    els.authTogglePin.addEventListener('click', () => {
      const isPass = els.authPin.type === 'password';
      els.authPin.type = isPass ? 'text' : 'password';
    });

    // Eventos da Toolbar
    els.searchInput.addEventListener('input', (e) => {
      state.searchTerm = e.target.value;
      renderTable();
    });

    els.categorySelect.addEventListener('change', (e) => {
      state.filterCategory = e.target.value;
      renderTable();
    });

    els.sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      renderTable();
    });

    els.btnNewItem.addEventListener('click', openCreateModal);
    els.btnExportJson.addEventListener('click', exportJson);
    els.btnImportJson.addEventListener('click', () => els.inputFileImport.click());
    els.inputFileImport.addEventListener('change', handleImportFile);
    els.btnResetDefault.addEventListener('click', openResetConfirm);

    // Eventos do Modal Item
    els.modalItemClose.addEventListener('click', closeItemModal);
    els.modalItemCancel.addEventListener('click', closeItemModal);
    els.formItem.addEventListener('submit', handleSaveItem);

    // Toggle categoria custom
    els.itemCategoria.addEventListener('change', (e) => {
      const isCustom = e.target.value === '__nova__';
      els.itemCategoriaCustomWrap.hidden = !isCustom;
      els.itemCategoriaCustomWrap.style.display = isCustom ? 'block' : 'none';
      els.itemCategoriaCustom.required = isCustom;
      if (isCustom) els.itemCategoriaCustom.focus();
      updateLivePreview();
    });

    // Auto-gerar ID amigável ao digitar o nome (apenas em criação)
    els.itemNome.addEventListener('input', () => {
      if (!state.currentItemId && els.itemNome.value.trim()) {
        const slug = generateSlug(els.itemNome.value.trim());
        if (slug && slug !== 'prod-') {
          els.itemId.value = slug;
        }
      }
    });

    // Chips de sugestão rápida de Badge
    document.querySelectorAll('.badge-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        els.itemBadge.value = chip.dataset.badge || '';
        updateLivePreview();
      });
    });

    // Live preview listeners
    [
      els.itemNome,
      els.itemCategoriaCustom,
      els.itemBadge,
      els.itemEspecificacao,
      els.itemDescricao,
      els.itemFoto
    ].forEach((input) => {
      input.addEventListener('input', updateLivePreview);
    });

    // Upload de foto & Limpeza
    els.btnTriggerUpload.addEventListener('click', () => els.itemFotoFile.click());
    els.itemFotoFile.addEventListener('change', handlePhotoUpload);
    if (els.btnClearPhoto) {
      els.btnClearPhoto.addEventListener('click', () => {
        els.itemFoto.value = '';
        if (els.itemFotoFile) els.itemFotoFile.value = '';
        updateLivePreview();
        showToast('Foto removida.', 'warning');
      });
    }

    // Eventos do Modal de Confirmação
    els.confirmCancel.addEventListener('click', closeConfirmModal);
    els.confirmAction.addEventListener('click', handleConfirmAction);

    // Fechar modais com tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeItemModal();
        closeConfirmModal();
      }
    });

    // Sincronização automática entre abas
    window.addEventListener('storage', (e) => {
      if (e.key === 'gordinho-catalog-items') {
        loadData();
      }
    });
  });
})();
