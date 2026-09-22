/**
 * GORDINHO PERSONALIZADOS — PAINEL DE CONTROLE OFICIAL 2026
 * Central Unificada: Catálogo, B2B vs Varejo, Categorias, Leads e Manutenção
 */

(function () {
  'use strict';

  // Chaves de armazenamento
  const AUTH_STORAGE_KEY = 'gordinho-admin-session-auth';
  const PIN_STORAGE_KEY = 'gordinho-admin-pin';
  const DEFAULT_PIN = '2026';
  const LEADS_KEY = 'gordinho-terceirizados-leads-list';
  const CADASTRO_KEY = 'gordinho-terceirizado-cadastro';
  const RECOVERY_KEY = 'gordinho-catalog-recovery';

  // Estado global do admin
  const state = {
    items: [],
    categories: [],
    filterCategory: 'todos',
    filterPublico: 'todos',
    filterStatus: 'todos',
    searchTerm: '',
    sortBy: 'nome-asc',
    activeTab: 'produtos',
    currentItemId: null,
    pendingDeleteId: null,
    pendingDeletePartnerIndex: null,
    pendingReset: false
  };

  // Cache dos elementos DOM
  const els = {};
  let savedItems = [];
  let formSnapshot = '';
  let modalTrigger = null;
  let partnerTrigger = null;
  let pendingImport = null;
  let confirmCallback = null;
  let confirmTrigger = null;
  let photoBusy = false;
  let externalChange = false;
  const selectedIds = new Set();

  function getPin() {
    try {
      return localStorage.getItem(PIN_STORAGE_KEY) || DEFAULT_PIN;
    } catch {
      return DEFAULT_PIN;
    }
  }

  function snapshot() {
    return JSON.stringify(
      Array.from(els.formItem.querySelectorAll('input,select,textarea'))
        .filter((e) => e.type !== 'file')
        .map((e) => (e.type === 'checkbox' ? e.checked : e.value))
    );
  }

  function dirty() {
    return els.modalItem && els.modalItem.classList.contains('open') && snapshot() !== formSnapshot;
  }

  function syncSaveLabel() {
    const labelEl = document.querySelector('.btn-admin-save span');
    if (!labelEl) return;
    labelEl.textContent = els.itemAtivo.checked
      ? state.currentItemId
        ? 'Salvar Alterações'
        : 'Salvar Produto'
      : 'Salvar como Rascunho';
  }

  function enterModal() {
    modalTrigger = document.activeElement;
    formSnapshot = snapshot();
    syncSaveLabel();
    const mainEl = document.querySelector('main');
    const headerEl = document.querySelector('header');
    if (mainEl) mainEl.inert = true;
    if (headerEl) headerEl.inert = true;
    if (els.itemNome) els.itemNome.focus();
  }

  function updateBulk() {
    const n = selectedIds.size;
    const btn = document.getElementById('bulk-apply');
    if (btn) {
      btn.disabled = !n;
      btn.textContent = 'Aplicar (' + n + ')';
    }
    const list = getFilteredAndSortedItems();
    const all = document.getElementById('select-all');
    if (all) {
      all.checked = list.length > 0 && list.every((i) => selectedIds.has(i.id));
      all.indeterminate = n > 0 && !all.checked;
    }
  }

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
    els.kpiB2bItems = document.getElementById('kpi-b2b-items');
    els.kpiRetailItems = document.getElementById('kpi-retail-items');
    els.kpiTotalCategories = document.getElementById('kpi-total-categories');
    els.kpiTotalPartners = document.getElementById('kpi-total-partners');
    els.kpiStorageStatus = document.getElementById('kpi-storage-status');

    // Tabs Nav & Badges
    els.tabNavProdutos = document.getElementById('tab-nav-produtos');
    els.tabNavCategorias = document.getElementById('tab-nav-categorias');
    els.tabNavParceiros = document.getElementById('tab-nav-parceiros');
    els.tabNavSistema = document.getElementById('tab-nav-sistema');
    els.badgeTabProdutos = document.getElementById('badge-tab-produtos');
    els.badgeTabCategorias = document.getElementById('badge-tab-categorias');
    els.badgeTabParceiros = document.getElementById('badge-tab-parceiros');

    // Panes
    els.paneProdutos = document.getElementById('pane-produtos');
    els.paneCategorias = document.getElementById('pane-categorias');
    els.paneParceiros = document.getElementById('pane-parceiros');
    els.paneSistema = document.getElementById('pane-sistema');

    // Toolbar de Produtos
    els.searchInput = document.getElementById('admin-search');
    els.publicoSelect = document.getElementById('admin-publico-filter');
    els.categorySelect = document.getElementById('admin-category-filter');
    els.statusSelect = document.getElementById('admin-status-filter');
    els.sortSelect = document.getElementById('admin-sort-filter');
    els.btnClearFilters = document.getElementById('btn-clear-filters');
    els.btnNewItem = document.getElementById('btn-new-item');
    els.resultsCount = document.getElementById('results-count');
    els.activeFilterIndicator = document.getElementById('active-filter-indicator');
    els.btnEmptyClear = document.getElementById('btn-empty-clear');

    // Tabela de Produtos
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
    els.itemPublico = document.getElementById('item-publico');
    els.itemCategoria = document.getElementById('item-categoria');
    els.itemCategoriaCustomWrap = document.getElementById('item-categoria-custom-wrap');
    els.itemCategoriaCustom = document.getElementById('item-categoria-custom');
    els.itemBadge = document.getElementById('item-badge');
    els.itemEspecificacao = document.getElementById('item-especificacao');
    els.itemDescricao = document.getElementById('item-descricao');
    els.itemFoto = document.getElementById('item-foto');
    els.itemFotoFile = document.getElementById('item-foto-file');
    els.btnTriggerUpload = document.getElementById('btn-trigger-upload');
    els.btnClearPhoto = document.getElementById('btn-clear-photo');
    els.itemPaginaRef = document.getElementById('item-pagina-ref');
    els.itemAtivo = document.getElementById('item-ativo');

    // Live Preview elements
    els.previewCardImg = document.getElementById('preview-card-img');
    els.previewPlaceholder = document.getElementById('preview-placeholder');
    els.previewCardBadge = document.getElementById('preview-card-badge');
    els.previewCardPublico = document.getElementById('preview-card-publico');
    els.previewCardCat = document.getElementById('preview-card-cat');
    els.previewCardTitle = document.getElementById('preview-card-title');
    els.previewCardSpec = document.getElementById('preview-card-spec');
    els.previewCardDesc = document.getElementById('preview-card-desc');

    // Categorias Pane
    els.categoryCardsGrid = document.getElementById('category-cards-grid');
    els.btnNewCategoryShortcut = document.getElementById('btn-new-category-shortcut');

    // Parceiros Pane
    els.partnersTableBody = document.getElementById('partners-table-body');
    els.partnersResultsCount = document.getElementById('partners-results-count');
    els.partnersEmptyState = document.getElementById('partners-empty-state');
    els.btnExportPartners = document.getElementById('btn-export-partners');
    els.btnNewPartner = document.getElementById('btn-new-partner');

    // Modal Parceiro
    els.modalPartner = document.getElementById('modal-partner');
    els.modalPartnerClose = document.getElementById('modal-partner-close');
    els.modalPartnerCancel = document.getElementById('modal-partner-cancel');
    els.formPartner = document.getElementById('form-partner');
    els.partnerNome = document.getElementById('partner-nome');
    els.partnerCnpj = document.getElementById('partner-cnpj');
    els.partnerContato = document.getElementById('partner-contato');
    els.partnerEmail = document.getElementById('partner-email');
    els.partnerEndereco = document.getElementById('partner-endereco');

    // Sistema & Manutenção
    els.formChangePin = document.getElementById('form-change-pin');
    els.pinAtual = document.getElementById('pin-atual');
    els.pinNovo = document.getElementById('pin-novo');
    els.pinConfirma = document.getElementById('pin-confirma');
    els.btnExportJson = document.getElementById('btn-export-json');
    els.btnImportJson = document.getElementById('btn-import-json');
    els.inputFileImport = document.getElementById('input-file-import');
    els.btnRecoveryJson = document.getElementById('btn-recovery-json');
    els.btnResetDefault = document.getElementById('btn-reset-default');
    els.storageUsedKb = document.getElementById('storage-used-kb');
    els.storageProgressFill = document.getElementById('storage-progress-fill');
    els.diagItemsCount = document.getElementById('diag-items-count');
    els.diagImagesCount = document.getElementById('diag-images-count');
    els.diagPartnersCount = document.getElementById('diag-partners-count');
    els.diagBackupStatus = document.getElementById('diag-backup-status');
    els.btnRefreshStorage = document.getElementById('btn-refresh-storage');

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
    const currentPin = getPin();

    if (pin === currentPin) {
      sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
      els.authOverlay.classList.add('hidden');
      els.authError.classList.remove('visible');
      els.authPin.value = '';
      showToast('Acesso autorizado! Bem-vindo à Central de Controle.', 'success');
      loadData();
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

  function handlePinChange(e) {
    e.preventDefault();
    const atual = (els.pinAtual.value || '').trim();
    const novo = (els.pinNovo.value || '').trim();
    const confirma = (els.pinConfirma.value || '').trim();

    const currentPin = getPin();

    if (atual !== currentPin) {
      showToast('O PIN Atual informado está incorreto.', 'error');
      els.pinAtual.focus();
      return;
    }

    if (novo.length < 4 || novo.length > 12) {
      showToast('O novo PIN deve ter entre 4 e 12 dígitos.', 'error');
      els.pinNovo.focus();
      return;
    }

    if (novo !== confirma) {
      showToast('A confirmação do novo PIN não confere.', 'error');
      els.pinConfirma.focus();
      return;
    }

    try {
      localStorage.setItem(PIN_STORAGE_KEY, novo);
      els.formChangePin.reset();
      showToast('PIN de acesso atualizado com sucesso!', 'success');
    } catch (err) {
      showToast('Não foi possível salvar o novo PIN.', 'error');
    }
  }

  // ==========================================================================
  // NAVEGAÇÃO POR ABAS (TABS)
  // ==========================================================================
  function switchTab(tabId) {
    state.activeTab = tabId;

    // Atualiza botões
    const navButtons = [els.tabNavProdutos, els.tabNavCategorias, els.tabNavParceiros, els.tabNavSistema];
    navButtons.forEach((btn) => {
      if (!btn) return;
      const match = btn.dataset.tab === tabId;
      btn.classList.toggle('active', match);
    });

    // Atualiza painéis
    const panes = [
      { id: 'produtos', el: els.paneProdutos },
      { id: 'categorias', el: els.paneCategorias },
      { id: 'parceiros', el: els.paneParceiros },
      { id: 'sistema', el: els.paneSistema }
    ];

    panes.forEach(({ id, el }) => {
      if (!el) return;
      if (id === tabId) {
        el.hidden = false;
        el.classList.add('active');
      } else {
        el.hidden = true;
        el.classList.remove('active');
      }
    });

    // Gatilhos de renderização sob demanda
    if (tabId === 'produtos') {
      renderTable();
    } else if (tabId === 'categorias') {
      renderCategoriesView();
    } else if (tabId === 'parceiros') {
      renderPartnersView();
    } else if (tabId === 'sistema') {
      renderSystemView();
    }
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
        state.items = raw ? JSON.parse(raw) : window.DEFAULT_CATALOG_ITEMS || [];
      } catch (e) {
        state.items = window.DEFAULT_CATALOG_ITEMS || [];
      }
    }

    externalChange = false;
    savedItems = JSON.parse(JSON.stringify(state.items));
    updateCategoriesList();
    renderKpis();
    renderCategoryOptions();
    renderTable();

    if (state.activeTab === 'categorias') renderCategoriesView();
    if (state.activeTab === 'parceiros') renderPartnersView();
    if (state.activeTab === 'sistema') renderSystemView();
  }

  function updateCategoriesList() {
    const fromItems = state.items.map((i) => i.categoria).filter(Boolean);
    const defaults = window.GordinhoCatalogData ? window.GordinhoCatalogData.DEFAULT_CATEGORIES : [];
    state.categories = Array.from(new Set([...defaults, ...fromItems]));
  }

  function renderKpis() {
    const total = state.items.length;
    const b2b = state.items.filter((i) => i.publico === 'terceirizado').length;
    const retail = state.items.filter((i) => i.publico === 'cliente' || !i.publico || i.publico === 'ambos').length;
    const categoriesCount = state.categories.length;
    const partners = getPartnersList().length;

    if (els.kpiTotalItems) els.kpiTotalItems.textContent = total;
    if (els.kpiB2bItems) els.kpiB2bItems.textContent = b2b;
    if (els.kpiRetailItems) els.kpiRetailItems.textContent = retail;
    if (els.kpiTotalCategories) els.kpiTotalCategories.textContent = categoriesCount;
    if (els.kpiTotalPartners) els.kpiTotalPartners.textContent = partners;

    if (els.badgeTabProdutos) els.badgeTabProdutos.textContent = total;
    if (els.badgeTabCategorias) els.badgeTabCategorias.textContent = categoriesCount;
    if (els.badgeTabParceiros) els.badgeTabParceiros.textContent = partners;

    const isCustom = localStorage.getItem('gordinho-catalog-items') !== null;
    if (els.kpiStorageStatus) {
      els.kpiStorageStatus.textContent = isCustom ? 'Navegador' : 'Base Inicial';
    }
  }

  function renderCategoryOptions() {
    if (!els.categorySelect || !els.itemCategoria) return;

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
  // RENDERIZAÇÃO DA TABELA DE PRODUTOS
  // ==========================================================================
  function getFilteredAndSortedItems() {
    let list = [...state.items];

    // Filtro por Público
    if (state.filterPublico !== 'todos') {
      if (state.filterPublico === 'terceirizado') {
        list = list.filter((i) => i.publico === 'terceirizado');
      } else if (state.filterPublico === 'cliente') {
        list = list.filter((i) => i.publico === 'cliente');
      } else if (state.filterPublico === 'ambos') {
        list = list.filter((i) => !i.publico || i.publico === 'ambos');
      }
    }

    // Filtro por Categoria
    if (state.filterCategory !== 'todos') {
      list = list.filter((i) => i.categoria === state.filterCategory);
    }

    // Filtro por Status
    if (state.filterStatus !== 'todos') {
      list = list.filter((i) => (i.ativo !== false) === (state.filterStatus === 'active'));
    }

    // Filtro por Busca
    if (state.searchTerm.trim() !== '') {
      const term = state.searchTerm.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      list = list.filter((i) => {
        const text = `${i.nome} ${i.categoria} ${i.badge || ''} ${i.especificacao || ''} ${i.descricao || ''} ${i.id} ${i.publico || ''}`
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
      case 'publico':
        list.sort((a, b) => {
          const score = (item) => (item.publico === 'terceirizado' ? 3 : item.publico === 'cliente' ? 2 : 1);
          return score(b) - score(a) || a.nome.localeCompare(b.nome);
        });
        break;
      case 'recentes':
        list.sort((a, b) => (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0));
        break;
    }

    return list;
  }

  function renderTable() {
    if (!els.tableBody) return;
    const items = getFilteredAndSortedItems();
    selectedIds.clear();
    updateBulk();

    if (els.resultsCount) {
      els.resultsCount.textContent = `${items.length} de ${state.items.length} produtos`;
    }

    // Atualiza tag de filtro ativo
    if (els.activeFilterIndicator) {
      const activeFilters = [];
      if (state.filterPublico !== 'todos') {
        const labels = { terceirizado: '🏭 B2B', cliente: '🎁 Varejo', ambos: '👥 Universal' };
        activeFilters.push(labels[state.filterPublico]);
      }
      if (state.filterCategory !== 'todos') {
        activeFilters.push(`🏷️ ${state.filterCategory}`);
      }
      if (state.filterStatus !== 'todos') {
        activeFilters.push(state.filterStatus === 'active' ? '🟢 Visíveis' : '⚪ Rascunhos');
      }
      if (state.searchTerm) {
        activeFilters.push(`🔍 "${truncateText(state.searchTerm, 15)}"`);
      }

      if (activeFilters.length > 0) {
        els.activeFilterIndicator.style.display = 'inline-flex';
        els.activeFilterIndicator.innerHTML = `Filtros: ${activeFilters.join(' • ')} <button type="button" id="btn-quick-clear-filters" style="background:none;border:none;color:#FAB818;cursor:pointer;margin-left:4px;" title="Limpar">✕</button>`;
        const qBtn = document.getElementById('btn-quick-clear-filters');
        if (qBtn) qBtn.addEventListener('click', clearAllFilters);
      } else {
        els.activeFilterIndicator.style.display = 'none';
      }
    }

    if (items.length === 0) {
      els.tableBody.innerHTML = '';
      if (els.tableEmptyState) els.tableEmptyState.hidden = false;
      return;
    }

    if (els.tableEmptyState) els.tableEmptyState.hidden = true;

    els.tableBody.innerHTML = items
      .map((item) => {
        const isAtivo = item.ativo !== false;
        const fotoSrc = item.foto || 'assets/images/favicon.png';

        // Badge de público-alvo
        let publicoBadgeHtml = '';
        if (item.publico === 'terceirizado') {
          publicoBadgeHtml = '<span class="badge-audience badge-audience-b2b" title="Exclusivo Terceirizados">🏭 B2B</span>';
        } else if (item.publico === 'cliente') {
          publicoBadgeHtml = '<span class="badge-audience badge-audience-cliente" title="Exclusivo Cliente Final">🎁 Varejo</span>';
        } else {
          publicoBadgeHtml = '<span class="badge-audience badge-audience-all" title="Visível para Ambos">🌐 Ambos</span>';
        }

        return `
        <tr data-id="${escapeAttr(item.id)}">
          <td>
            <input type="checkbox" class="row-select" data-id="${escapeAttr(item.id)}" aria-label="Selecionar ${escapeAttr(item.nome)}">
            <img loading="lazy" src="${escapeAttr(fotoSrc)}" alt="${escapeAttr(item.nome)}" class="table-item-img" onerror="this.src='assets/images/favicon.png'" />
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
            ${publicoBadgeHtml}
          </td>
          <td>
            ${item.badge ? `<span class="badge-tag">${escapeHTML(item.badge)}</span>` : '<span style="color:#8FB49C;">—</span>'}
          </td>
          <td>
            <span style="color: #D2E4D8; font-size: 0.85rem;" title="${escapeAttr(item.especificacao || '')}">
              ${escapeHTML(truncateText(item.especificacao || '—', 45))}
            </span>
          </td>
          <td style="text-align: center;">
            <button type="button" class="status-pill ${isAtivo ? 'active' : 'inactive'}" data-action="toggle-status" data-id="${escapeAttr(item.id)}" title="Clique para alternar status">
              ${isAtivo ? 'Visível' : 'Rascunho'}
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
      })
      .join('');

    els.tableBody.querySelectorAll('.row-select').forEach((box) => {
      box.addEventListener('change', () => {
        box.checked ? selectedIds.add(box.dataset.id) : selectedIds.delete(box.dataset.id);
        updateBulk();
      });
    });

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

  function clearAllFilters() {
    state.searchTerm = '';
    state.filterCategory = 'todos';
    state.filterPublico = 'todos';
    state.filterStatus = 'todos';
    state.sortBy = 'nome-asc';

    if (els.searchInput) els.searchInput.value = '';
    if (els.categorySelect) els.categorySelect.value = 'todos';
    if (els.publicoSelect) els.publicoSelect.value = 'todos';
    if (els.statusSelect) els.statusSelect.value = 'todos';
    if (els.sortSelect) els.sortSelect.value = 'nome-asc';

    renderTable();
  }

  // ==========================================================================
  // ABA 2: VISÃO GERAL DE CATEGORIAS
  // ==========================================================================
  function renderCategoriesView() {
    if (!els.categoryCardsGrid) return;

    const categoriesMap = new Map();
    state.categories.forEach((cat) => {
      categoriesMap.set(cat, {
        name: cat,
        total: 0,
        active: 0,
        drafts: 0,
        b2b: 0,
        retail: 0
      });
    });

    state.items.forEach((item) => {
      const cat = item.categoria;
      if (!categoriesMap.has(cat)) {
        categoriesMap.set(cat, {
          name: cat,
          total: 0,
          active: 0,
          drafts: 0,
          b2b: 0,
          retail: 0
        });
      }
      const entry = categoriesMap.get(cat);
      entry.total++;
      if (item.ativo !== false) entry.active++;
      else entry.drafts++;

      if (item.publico === 'terceirizado') entry.b2b++;
      else entry.retail++;
    });

    const entries = Array.from(categoriesMap.values()).sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));

    els.categoryCardsGrid.innerHTML = entries
      .map((cat) => {
        let typeBadge = '<span class="badge-audience badge-audience-all">🌐 Ambos</span>';
        if (cat.b2b > 0 && cat.retail === 0) {
          typeBadge = '<span class="badge-audience badge-audience-b2b">🏭 100% B2B</span>';
        } else if (cat.retail > 0 && cat.b2b === 0) {
          typeBadge = '<span class="badge-audience badge-audience-cliente">🎁 Varejo</span>';
        }

        return `
        <article class="cat-overview-card">
          <div>
            <div class="cat-card-header">
              <div>
                <h3 class="cat-card-title">${escapeHTML(cat.name)}</h3>
                <div style="margin-top: 6px;">${typeBadge}</div>
              </div>
              <span class="cat-badge-count">${cat.total} ${cat.total === 1 ? 'item' : 'itens'}</span>
            </div>

            <div class="cat-card-stats">
              <div class="cat-stat-row">
                <span>Visíveis no Catálogo:</span>
                <strong style="color: #4ADE80;">${cat.active}</strong>
              </div>
              <div class="cat-stat-row">
                <span>Rascunhos Ocultos:</span>
                <strong style="color: #94A3B8;">${cat.drafts}</strong>
              </div>
              <div class="cat-stat-row">
                <span>Terceirizados (B2B):</span>
                <strong style="color: #38BDF8;">${cat.b2b}</strong>
              </div>
            </div>
          </div>

          <button type="button" class="btn-cat-filter" data-category="${escapeAttr(cat.name)}">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <span>Ver Produtos (${cat.total})</span>
          </button>
        </article>
      `;
      })
      .join('');

    // Listener para o botão "Ver Produtos"
    els.categoryCardsGrid.querySelectorAll('[data-category]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const catName = btn.dataset.category;
        state.filterCategory = catName;
        state.filterPublico = 'todos';
        state.searchTerm = '';
        if (els.categorySelect) els.categorySelect.value = catName;
        if (els.publicoSelect) els.publicoSelect.value = 'todos';
        if (els.searchInput) els.searchInput.value = '';
        switchTab('produtos');
      });
    });
  }

  // ==========================================================================
  // ABA 3: GESTÃO DE PARCEIROS B2B (LEADS)
  // ==========================================================================
  function getPartnersList() {
    try {
      const rawList = localStorage.getItem(LEADS_KEY);
      if (rawList) {
        const parsed = JSON.parse(rawList);
        if (Array.isArray(parsed)) return parsed;
      }
      // Fallback para cadastro individual anterior
      const single = localStorage.getItem(CADASTRO_KEY);
      if (single) {
        const parsed = JSON.parse(single);
        if (parsed && typeof parsed === 'object') {
          return [parsed];
        }
      }
      return [];
    } catch {
      return [];
    }
  }

  function savePartnersList(list) {
    try {
      localStorage.setItem(LEADS_KEY, JSON.stringify(list));
      renderKpis();
      return true;
    } catch (e) {
      showToast('Erro ao salvar lista de parceiros.', 'error');
      return false;
    }
  }

  function renderPartnersView() {
    if (!els.partnersTableBody) return;
    const partners = getPartnersList();

    if (els.partnersResultsCount) {
      els.partnersResultsCount.textContent = `${partners.length} ${partners.length === 1 ? 'parceiro cadastrado' : 'parceiros cadastrados'}`;
    }

    if (partners.length === 0) {
      els.partnersTableBody.innerHTML = '';
      if (els.partnersEmptyState) els.partnersEmptyState.hidden = false;
      return;
    }

    if (els.partnersEmptyState) els.partnersEmptyState.hidden = true;

    els.partnersTableBody.innerHTML = partners
      .map((lead, idx) => {
        const cleanPhone = (lead.contato || '').replace(/\D+/g, '');
        const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(
          `Olá ${lead.nome}! Recebemos seu cadastro de terceirizado na Gordinho Personalizados e gostaríamos de apresentar nossa tabela especial B2B.`
        )}`;

        let dataFormatada = 'Recente';
        if (lead.dataCadastro) {
          try {
            const d = new Date(lead.dataCadastro);
            dataFormatada = d.toLocaleDateString('pt-BR') + ' às ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
          } catch {}
        }

        return `
        <tr data-lead-index="${idx}">
          <td>
            <div class="table-item-info">
              <span class="partner-company-name">${escapeHTML(lead.nome || 'Empresa')}</span>
              ${lead.endereco ? `<span class="partner-cnpj-sub">📍 ${escapeHTML(lead.endereco)}</span>` : ''}
            </div>
          </td>
          <td>
            <span class="partner-cnpj-sub">${escapeHTML(lead.cnpj || '—')}</span>
          </td>
          <td>
            <a href="${escapeAttr(whatsappUrl)}" target="_blank" rel="noopener" class="btn-whatsapp-lead" title="Conversar no WhatsApp">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.52 3.48A11.93 11.93 0 0 0 12.06 0C5.46 0 .09 5.37.09 11.97c0 2.11.55 4.17 1.6 5.99L0 24l6.21-1.63a11.96 11.96 0 0 0 5.85 1.51h.01c6.6 0 11.97-5.37 11.97-11.97 0-3.2-1.25-6.21-3.52-8.43zM12.06 21.88h-.01a9.92 9.92 0 0 1-5.06-1.39l-.36-.21-3.76.99 1-3.66-.24-.38a9.91 9.91 0 0 1-1.52-5.26c0-5.48 4.46-9.94 9.95-9.94 2.65 0 5.15 1.03 7.02 2.91a9.88 9.88 0 0 1 2.91 7.02c0 5.49-4.46 9.93-9.94 9.93zm5.45-7.44c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.95 1.17-.18.2-.35.23-.65.08-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.68-1.64-.93-2.25-.24-.59-.49-.51-.68-.52h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.51s1.08 2.91 1.23 3.11c.15.2 2.11 3.23 5.12 4.53.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.18-1.42-.08-.13-.28-.2-.58-.35z"/></svg>
              <span>${escapeHTML(lead.contato || 'Chamar')}</span>
            </a>
          </td>
          <td>
            <span style="color: #D2E4D8; font-size: 0.88rem;">${escapeHTML(lead.email || '—')}</span>
          </td>
          <td>
            <span style="color: #8FB49C; font-size: 0.82rem;">${escapeHTML(dataFormatada)}</span>
          </td>
          <td style="text-align: center;">
            <div class="table-actions-group">
              <button type="button" class="btn-table-action action-delete" data-partner-action="delete" data-index="${idx}" title="Excluir parceiro">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
      })
      .join('');

    // Listener para ações de parceiros
    els.partnersTableBody.querySelectorAll('[data-partner-action="delete"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.index, 10);
        confirmDeletePartner(index);
      });
    });
  }

  function openPartnerModal() {
    partnerTrigger = document.activeElement;
    if (els.formPartner) els.formPartner.reset();
    if (els.modalPartner) {
      els.modalPartner.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (els.partnerNome) els.partnerNome.focus();
    }
  }

  function closePartnerModal() {
    if (!els.modalPartner) return;
    els.modalPartner.classList.remove('open');
    document.body.style.overflow = '';
    (partnerTrigger?.isConnected ? partnerTrigger : els.btnNewPartner)?.focus();
  }

  function handleSavePartner(e) {
    e.preventDefault();
    const nome = (els.partnerNome.value || '').trim();
    const cnpj = (els.partnerCnpj.value || '').trim();
    const contato = (els.partnerContato.value || '').trim();
    const email = (els.partnerEmail.value || '').trim();
    const endereco = (els.partnerEndereco.value || '').trim();

    if (!nome || !cnpj || !contato || !email) {
      showToast('Por favor, preencha todos os campos obrigatórios.', 'error');
      return;
    }

    const partners = getPartnersList();
    partners.unshift({
      nome,
      cnpj,
      contato,
      email,
      endereco,
      dataCadastro: new Date().toISOString()
    });

    if (savePartnersList(partners)) {
      renderPartnersView();
      closePartnerModal();
      showToast(`Parceiro "${nome}" cadastrado com sucesso!`, 'success');
    }
  }

  function confirmDeletePartner(index) {
    const partners = getPartnersList();
    const target = partners[index];
    if (!target) return;

    askConfirmation(
      'Remover Parceiro B2B',
      `Deseja realmente remover o parceiro <strong>"${escapeHTML(target.nome)}"</strong> da lista de leads?`,
      'Sim, Excluir',
      () => {
        partners.splice(index, 1);
        savePartnersList(partners);
        renderPartnersView();
        showToast('Parceiro removido com sucesso.', 'warning');
      }
    );
  }

  function exportPartnersJson() {
    try {
      const partners = getPartnersList();
      if (partners.length === 0) {
        showToast('Não há parceiros cadastrados para exportar.', 'warning');
        return;
      }
      const dataStr = JSON.stringify(partners, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const dateStr = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `leads-terceirizados-gordinho-${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Lista de parceiros exportada com sucesso!', 'success');
    } catch {
      showToast('Erro ao exportar leads de parceiros.', 'error');
    }
  }

  // ==========================================================================
  // ABA 4: SISTEMA, SEGURANÇA & DIAGNÓSTICO
  // ==========================================================================
  function renderSystemView() {
    let totalChars = 0;
    let customImagesCount = 0;

    try {
      for (let key in localStorage) {
        if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
          const val = localStorage.getItem(key) || '';
          totalChars += key.length + val.length;
        }
      }
    } catch {}

    state.items.forEach((item) => {
      if (item.foto && item.foto.startsWith('data:image')) {
        customImagesCount++;
      }
    });

    const usedKb = Math.round((totalChars * 2) / 1024); // UTF-16
    const maxKb = 5120; // 5 MB aproximado
    const percent = Math.min(100, Math.max(3, Math.round((usedKb / maxKb) * 100)));

    if (els.storageUsedKb) els.storageUsedKb.textContent = `${usedKb} KB / 5 MB (${percent}%)`;
    if (els.storageProgressFill) {
      els.storageProgressFill.style.width = `${percent}%`;
      if (percent > 85) {
        els.storageProgressFill.style.background = '#EF4444';
      } else {
        els.storageProgressFill.style.background = 'linear-gradient(90deg, #22C55E 0%, #FAB818 100%)';
      }
    }

    if (els.diagItemsCount) els.diagItemsCount.textContent = state.items.length;
    if (els.diagImagesCount) els.diagImagesCount.textContent = customImagesCount;
    if (els.diagPartnersCount) els.diagPartnersCount.textContent = getPartnersList().length;

    const hasRecovery = localStorage.getItem(RECOVERY_KEY) !== null;
    if (els.diagBackupStatus) {
      els.diagBackupStatus.textContent = hasRecovery ? 'Snapshot Atualizado' : 'Nenhuma cópia recente';
      els.diagBackupStatus.style.color = hasRecovery ? '#4ADE80' : '#8FB49C';
    }
  }

  // ==========================================================================
  // CRUD DE PRODUTOS
  // ==========================================================================
  function toggleItemStatus(id) {
    const item = state.items.find((i) => i.id === id);
    if (!item) return;

    item.ativo = !(item.ativo !== false);
    item.updatedAt = new Date().toISOString();
    if (!saveState()) return;
    renderTable();
    renderKpis();
    if (state.activeTab === 'categorias') renderCategoriesView();
    showToast(`Status de "${item.nome}" alterado para ${item.ativo ? 'Visível' : 'Rascunho'}.`, 'success');
  }

  function openCreateModal() {
    state.currentItemId = null;
    els.modalItemTitle.innerHTML = 'Adicionar Novo <span>Produto</span>';
    els.formItem.reset();

    // Auto gerar ID sugestivo
    els.itemId.value = 'prod-' + Date.now().toString(36);
    if (els.itemPublico) els.itemPublico.value = 'ambos';

    if (els.itemCategoriaCustomWrap) {
      els.itemCategoriaCustomWrap.hidden = true;
      els.itemCategoriaCustomWrap.style.display = 'none';
    }
    if (els.itemCategoriaCustom) els.itemCategoriaCustom.required = false;
    els.itemAtivo.checked = true;
    els.itemFoto.value = '';

    updateLivePreview();
    document.body.style.overflow = 'hidden';
    els.modalItem.classList.add('open');
    enterModal();
  }

  function openEditModal(id) {
    const item = state.items.find((i) => i.id === id);
    if (!item) return;

    state.currentItemId = id;
    els.modalItemTitle.innerHTML = 'Editar <span>' + escapeHTML(item.nome) + '</span>';

    els.itemId.value = item.id;
    els.itemNome.value = item.nome || '';
    if (els.itemPublico) {
      els.itemPublico.value = item.publico || 'ambos';
    }

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
    enterModal();
  }

  function closeItemModal(force = false) {
    if (!els.modalItem.classList.contains('open')) return;
    if (photoBusy) {
      showToast('Aguarde o processamento da imagem antes de fechar.', 'warning');
      return;
    }
    if (force !== true && dirty()) {
      askConfirmation('Descartar alterações?', 'Há alterações não salvas. Você pode continuar editando ou descartá-las.', 'Descartar alterações', () =>
        closeItemModal(true)
      );
      els.confirmCancel.textContent = 'Continuar editando';
      return;
    }
    els.modalItem.classList.remove('open');
    state.currentItemId = null;
    document.body.style.overflow = '';
    const mainEl = document.querySelector('main');
    const headerEl = document.querySelector('header');
    if (mainEl) mainEl.inert = false;
    if (headerEl) headerEl.inert = false;
    (modalTrigger?.isConnected ? modalTrigger : els.btnNewItem).focus();
    if (externalChange) loadData();
  }

  function handleSaveItem(e) {
    e.preventDefault();

    if (photoBusy) {
      showToast('Aguarde o processamento da imagem.', 'warning');
      return;
    }

    const id = (els.itemId.value || '').trim();
    const nome = (els.itemNome.value || '').trim();
    let categoria = els.itemCategoria.value;

    if (categoria === '__nova__') {
      categoria = (els.itemCategoriaCustom.value || '').trim();
    }

    const publicoVal = els.itemPublico ? els.itemPublico.value : 'ambos';
    const publico = publicoVal === 'ambos' ? undefined : publicoVal;

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

    if (state.items.some((i) => i.id === id && i.id !== state.currentItemId)) {
      showToast('Este identificador já pertence a outro produto. Escolha outro ID.', 'error');
      return;
    }

    const previous = state.items.find((i) => i.id === state.currentItemId);
    const itemData = {
      createdAt: previous ? previous.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      id,
      nome,
      categoria,
      badge,
      especificacao,
      descricao,
      foto,
      paginaRef: paginaRef || foto,
      publico,
      ativo
    };

    if (state.currentItemId) {
      const index = state.items.findIndex((i) => i.id === state.currentItemId);
      if (index !== -1) {
        state.items[index] = itemData;
      }
    } else {
      state.items.unshift(itemData);
    }

    if (!saveState()) return;
    updateCategoriesList();
    renderCategoryOptions();
    renderKpis();
    renderTable();
    if (state.activeTab === 'categorias') renderCategoriesView();
    showToast('Produto salvo com sucesso neste navegador.', 'success');
    closeItemModal(true);
  }

  function duplicateItem(id) {
    const orig = state.items.find((i) => i.id === id);
    if (!orig) return;

    const copy = JSON.parse(JSON.stringify(orig));
    copy.id = orig.id + '-copia-' + crypto.randomUUID().slice(0, 8);
    copy.createdAt = new Date().toISOString();
    copy.updatedAt = copy.createdAt;
    copy.nome = orig.nome + ' (Cópia)';
    copy.ativo = false;

    state.items.unshift(copy);
    if (!saveState()) return;
    renderKpis();
    renderTable();
    showToast(`"${copy.nome}" duplicado com sucesso!`, 'success');
  }

  function openDeleteConfirm(id) {
    confirmTrigger = document.activeElement;
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
    document.querySelector('main').inert = true;
    document.querySelector('header').inert = true;
    if (els.modalItem) els.modalItem.inert = true;
    els.confirmCancel.focus();
  }

  function openResetConfirm() {
    confirmTrigger = document.activeElement;
    state.pendingDeleteId = null;
    state.pendingReset = true;

    els.confirmTitle.textContent = 'Restaurar Catálogo de Fábrica';
    els.confirmDesc.innerHTML = `Tem certeza que deseja restaurar os <strong>${window.GordinhoCatalogData ? window.GordinhoCatalogData.DEFAULT_ITEMS.length : 42} produtos padrão originais</strong>? Todas as alterações manuais e produtos novos criados serão resetados.`;
    els.confirmAction.textContent = 'Sim, Restaurar Padrões';
    els.confirmAction.className = 'btn-admin btn-admin-primary';

    document.body.style.overflow = 'hidden';
    els.modalConfirm.classList.add('open');
    document.querySelector('main').inert = true;
    document.querySelector('header').inert = true;
    els.confirmCancel.focus();
  }

  function handleConfirmAction() {
    if (confirmCallback) {
      const callback = confirmCallback;
      closeConfirmModal();
      callback();
      return;
    }

    if (pendingImport) {
      const incoming = pendingImport;
      const replace = document.getElementById('import-mode').value === 'replace';
      if (!saveRecovery()) return;
      state.items = replace ? incoming : Array.from(new Map([...state.items, ...incoming].map((i) => [i.id, i])).values());
      if (!saveState()) return;
      closeConfirmModal();
      loadData();
      showToast('Importação salva com sucesso neste navegador.', 'success');
      return;
    }

    if (state.pendingReset) {
      if (window.GordinhoCatalogData) {
        if (!saveRecovery()) return;
        if (!window.GordinhoCatalogData.resetToDefault()) {
          showToast('Não foi possível restaurar. Tente novamente.', 'error');
          return;
        }
      } else {
        localStorage.removeItem('gordinho-catalog-items');
      }
      loadData();
      showToast('Catálogo restaurado para os padrões de fábrica!', 'success');
    } else if (state.pendingDeleteId) {
      const id = state.pendingDeleteId;
      state.items = state.items.filter((i) => i.id !== id);
      if (!saveState()) return;
      updateCategoriesList();
      renderCategoryOptions();
      renderKpis();
      renderTable();
      if (state.activeTab === 'categorias') renderCategoriesView();
      showToast('Produto removido com sucesso.', 'warning');
    }

    closeConfirmModal();
  }

  function closeConfirmModal() {
    if (!els.modalConfirm || !els.modalConfirm.classList.contains('open')) return;
    els.modalConfirm.classList.remove('open');
    pendingImport = null;
    confirmCallback = null;
    const opt = document.getElementById('import-options');
    if (opt) opt.hidden = true;
    els.confirmCancel.textContent = 'Cancelar';
    if (els.modalItem) els.modalItem.inert = false;
    const editing = els.modalItem && els.modalItem.classList.contains('open');
    document.querySelector('main').inert = editing;
    document.querySelector('header').inert = editing;
    (editing ? els.itemNome : confirmTrigger?.isConnected ? confirmTrigger : els.btnNewItem).focus();
    state.pendingDeleteId = null;
    state.pendingReset = false;
    document.body.style.overflow = editing ? 'hidden' : '';
  }

  function generateSlug(text) {
    return (
      'prod-' +
      (text || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 30)
    );
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
    const publicoVal = els.itemPublico ? els.itemPublico.value : 'ambos';
    const badge = els.itemBadge.value.trim();
    const spec = els.itemEspecificacao.value.trim() || 'Especificação técnica do item';
    const desc = els.itemDescricao.value.trim() || 'Descrição completa sobre os acabamentos e técnicas.';
    const foto = els.itemFoto.value.trim();

    els.previewCardTitle.textContent = nome;
    els.previewCardCat.textContent = cat;

    // Selo de Público
    if (els.previewCardPublico) {
      if (publicoVal === 'terceirizado') {
        els.previewCardPublico.textContent = '🏭 Apenas B2B';
        els.previewCardPublico.className = 'preview-card-publico badge-audience-b2b';
      } else if (publicoVal === 'cliente') {
        els.previewCardPublico.textContent = '🎁 Apenas Varejo';
        els.previewCardPublico.className = 'preview-card-publico badge-audience-cliente';
      } else {
        els.previewCardPublico.textContent = '🌐 Ambos';
        els.previewCardPublico.className = 'preview-card-publico badge-audience-all';
      }
    }

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

    const placeholderTitle = els.previewPlaceholder.querySelector('.placeholder-title');
    const placeholderSub = els.previewPlaceholder.querySelector('.placeholder-sub');
    placeholderTitle.textContent = 'Nenhuma foto selecionada';
    placeholderSub.textContent = 'Faça upload ou digite um link';
    els.previewCardImg.onerror = () => {
      placeholderTitle.textContent = 'Não foi possível carregar a imagem';
      placeholderSub.textContent = 'Confira o link ou selecione outro arquivo';
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

  function saveRecovery() {
    try {
      localStorage.setItem(RECOVERY_KEY, JSON.stringify(state.items));
      return true;
    } catch {
      showToast('Não há espaço para a cópia de recuperação. Exporte um backup antes de liberar espaço.', 'error');
      return false;
    }
  }

  function askConfirmation(title, description, label, callback) {
    confirmTrigger = document.activeElement;
    els.confirmTitle.textContent = title;
    els.confirmDesc.innerHTML = description;
    els.confirmAction.textContent = label;
    confirmCallback = callback;
    els.modalConfirm.classList.add('open');
    if (els.modalItem) els.modalItem.inert = true;
    document.querySelector('main').inert = true;
    document.querySelector('header').inert = true;
    els.confirmCancel.focus();
  }

  async function handleImportFile(e) {
    confirmTrigger = els.btnImportJson;
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      showToast('O backup deve ter até 15 MB.', 'error');
      return;
    }
    try {
      const parsed = JSON.parse(await file.text());
      if (!Array.isArray(parsed)) throw new Error('O arquivo precisa conter uma lista de produtos.');
      const ids = new Set();
      let rejected = 0;
      const valid = parsed
        .filter((i) => {
          const ok =
            i &&
            ['id', 'nome', 'categoria', 'especificacao'].every((k) => typeof i[k] === 'string' && i[k].trim()) &&
            ['foto', 'paginaRef', 'badge', 'descricao', 'publico'].every((k) => i[k] == null || typeof i[k] === 'string') &&
            (i.ativo == null || typeof i.ativo === 'boolean') &&
            !ids.has(i.id.trim());
          if (!ok) {
            rejected++;
            return false;
          }
          ids.add(i.id.trim());
          return true;
        })
        .map((i) => ({
          id: i.id.trim(),
          nome: i.nome.trim(),
          categoria: i.categoria.trim(),
          especificacao: i.especificacao.trim(),
          badge: i.badge || '',
          descricao: i.descricao || '',
          foto: i.foto || '',
          paginaRef: i.paginaRef || '',
          publico: i.publico === 'terceirizado' || i.publico === 'cliente' ? i.publico : undefined,
          ativo: i.ativo !== false,
          createdAt: typeof i.createdAt === 'string' && Number.isFinite(Date.parse(i.createdAt)) ? i.createdAt : undefined,
          updatedAt: typeof i.updatedAt === 'string' && Number.isFinite(Date.parse(i.updatedAt)) ? i.updatedAt : undefined
        }));

      if (!valid.length && parsed.length) throw new Error('Nenhum produto válido. Confira os campos obrigatórios e IDs.');
      const replaced = valid.filter((i) => state.items.some((old) => old.id === i.id)).length;
      pendingImport = valid;
      state.pendingDeleteId = null;
      state.pendingReset = false;
      els.confirmTitle.textContent = 'Revisar Importação';
      els.confirmDesc.innerHTML = `${valid.length} produtos válidos: <strong>${valid.length - replaced} novos</strong>, <strong>${replaced} já existentes</strong>. ${rejected} rejeitados.`;
      els.confirmAction.textContent = 'Confirmar Importação';
      document.getElementById('import-options').hidden = false;
      document.getElementById('import-mode').value = 'merge';
      els.modalConfirm.classList.add('open');
      document.querySelector('main').inert = true;
      document.querySelector('header').inert = true;
      els.confirmCancel.focus();
    } catch (err) {
      showToast('Não foi possível importar: ' + err.message, 'error');
    }
  }

  async function handlePhotoUpload(e) {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 10 * 1024 * 1024) {
      showToast('Selecione JPG, PNG ou WebP de até 10 MB.', 'error');
      return;
    }
    photoBusy = true;
    els.btnTriggerUpload.disabled = true;
    document.querySelector('.btn-admin-save').disabled = true;
    let bitmap;
    try {
      bitmap = await createImageBitmap(file);
      const scale = Math.min(1, 1200 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const data = canvas.toDataURL('image/webp', 0.82);
      if (data.length > 2 * 1024 * 1024) throw new Error('A imagem otimizada ainda é grande. Escolha uma imagem menor.');
      els.itemFoto.value = data;
      updateLivePreview();
      showToast('Imagem otimizada com sucesso! Salve o produto para concluir.', 'success');
    } catch (err) {
      showToast('Não foi possível processar a imagem. ' + err.message, 'error');
    } finally {
      bitmap?.close();
      photoBusy = false;
      els.btnTriggerUpload.disabled = false;
      document.querySelector('.btn-admin-save').disabled = false;
    }
  }

  // ==========================================================================
  // SALVAR ESTADO
  // ==========================================================================
  function saveState() {
    if (externalChange) {
      state.items = JSON.parse(JSON.stringify(savedItems));
      showToast('O catálogo mudou em outra aba. Copie suas alterações e reabra o produto para evitar sobrescrever dados.', 'error');
      return false;
    }
    let success = false;
    try {
      success = window.GordinhoCatalogData.saveItems(state.items);
    } catch {}
    if (!success) {
      state.items = JSON.parse(JSON.stringify(savedItems));
      showToast('Não foi possível salvar. O armazenamento local pode estar cheio.', 'error');
      return false;
    }
    savedItems = JSON.parse(JSON.stringify(state.items));
    return true;
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
      iconSvg =
        '<svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    } else if (type === 'error') {
      iconSvg =
        '<svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
    } else {
      iconSvg =
        '<svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
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

    // Eventos de Autenticação & PIN
    if (els.authForm) els.authForm.addEventListener('submit', handleLogin);
    if (els.btnLogout) els.btnLogout.addEventListener('click', handleLogout);
    if (els.authTogglePin) {
      els.authTogglePin.addEventListener('click', () => {
        const isPass = els.authPin.type === 'password';
        els.authPin.type = isPass ? 'text' : 'password';
      });
    }
    if (els.formChangePin) els.formChangePin.addEventListener('submit', handlePinChange);

    // Navegação em Abas (Tabs)
    [els.tabNavProdutos, els.tabNavCategorias, els.tabNavParceiros, els.tabNavSistema].forEach((btn) => {
      if (btn) {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
      }
    });

    // Cliques nos KPI Cards redirecionam para a aba e filtro corretos
    document.querySelectorAll('.kpi-card[data-kpi-target]').forEach((card) => {
      card.addEventListener('click', () => {
        const target = card.dataset.kpiTarget;
        if (target === 'todos') {
          state.filterPublico = 'todos';
          state.filterCategory = 'todos';
          if (els.publicoSelect) els.publicoSelect.value = 'todos';
          if (els.categorySelect) els.categorySelect.value = 'todos';
          switchTab('produtos');
        } else if (target === 'terceirizado') {
          state.filterPublico = 'terceirizado';
          if (els.publicoSelect) els.publicoSelect.value = 'terceirizado';
          switchTab('produtos');
        } else if (target === 'cliente') {
          state.filterPublico = 'cliente';
          if (els.publicoSelect) els.publicoSelect.value = 'cliente';
          switchTab('produtos');
        } else if (target === 'categorias') {
          switchTab('categorias');
        } else if (target === 'parceiros') {
          switchTab('parceiros');
        } else if (target === 'sistema') {
          switchTab('sistema');
        }
      });
    });

    // Atalho Nova Categoria
    if (els.btnNewCategoryShortcut) {
      els.btnNewCategoryShortcut.addEventListener('click', () => {
        openCreateModal();
        if (els.itemCategoria) {
          els.itemCategoria.value = '__nova__';
          els.itemCategoriaCustomWrap.hidden = false;
          els.itemCategoriaCustomWrap.style.display = 'block';
          els.itemCategoriaCustom.required = true;
          els.itemCategoriaCustom.focus();
        }
      });
    }

    // Eventos da Toolbar de Produtos
    if (els.searchInput) {
      els.searchInput.addEventListener('input', (e) => {
        state.searchTerm = e.target.value;
        renderTable();
      });
    }

    if (els.publicoSelect) {
      els.publicoSelect.addEventListener('change', (e) => {
        state.filterPublico = e.target.value;
        renderTable();
      });
    }

    if (els.categorySelect) {
      els.categorySelect.addEventListener('change', (e) => {
        state.filterCategory = e.target.value;
        renderTable();
      });
    }

    if (els.statusSelect) {
      els.statusSelect.addEventListener('change', (e) => {
        state.filterStatus = e.target.value;
        renderTable();
      });
    }

    if (els.sortSelect) {
      els.sortSelect.addEventListener('change', (e) => {
        state.sortBy = e.target.value;
        renderTable();
      });
    }

    if (els.btnClearFilters) els.btnClearFilters.addEventListener('click', clearAllFilters);
    if (els.btnEmptyClear) els.btnEmptyClear.addEventListener('click', clearAllFilters);
    if (els.btnNewItem) els.btnNewItem.addEventListener('click', openCreateModal);

    // Ações em Massa (Bulk)
    const selectAllEl = document.getElementById('select-all');
    if (selectAllEl) {
      selectAllEl.addEventListener('change', (e) => {
        selectedIds.clear();
        if (e.target.checked) {
          getFilteredAndSortedItems().forEach((i) => selectedIds.add(i.id));
        }
        els.tableBody.querySelectorAll('.row-select').forEach((box) => (box.checked = e.target.checked));
        updateBulk();
      });
    }

    const bulkApplyEl = document.getElementById('bulk-apply');
    if (bulkApplyEl) {
      bulkApplyEl.addEventListener('click', () => {
        const active = document.getElementById('bulk-status').value === 'active';
        state.items.forEach((i) => {
          if (selectedIds.has(i.id)) {
            i.ativo = active;
            i.updatedAt = new Date().toISOString();
          }
        });
        if (!saveState()) return;
        renderTable();
        renderKpis();
        showToast('Status dos produtos atualizado neste navegador.');
      });
    }

    // Eventos do Modal Item
    if (els.modalItemClose) els.modalItemClose.addEventListener('click', () => closeItemModal());
    if (els.modalItemCancel) els.modalItemCancel.addEventListener('click', () => closeItemModal());
    if (els.formItem) els.formItem.addEventListener('submit', handleSaveItem);
    if (els.itemAtivo) els.itemAtivo.addEventListener('change', syncSaveLabel);

    if (els.itemCategoria) {
      els.itemCategoria.addEventListener('change', (e) => {
        const isCustom = e.target.value === '__nova__';
        els.itemCategoriaCustomWrap.hidden = !isCustom;
        els.itemCategoriaCustomWrap.style.display = isCustom ? 'block' : 'none';
        els.itemCategoriaCustom.required = isCustom;
        if (isCustom) els.itemCategoriaCustom.focus();
        updateLivePreview();
      });
    }

    if (els.itemPublico) {
      els.itemPublico.addEventListener('change', updateLivePreview);
    }

    if (els.itemNome) {
      els.itemNome.addEventListener('input', () => {
        if (!state.currentItemId && els.itemNome.value.trim()) {
          const slug = generateSlug(els.itemNome.value.trim());
          if (slug && slug !== 'prod-') {
            els.itemId.value = slug;
          }
        }
      });
    }

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
      els.itemPublico,
      els.itemCategoriaCustom,
      els.itemBadge,
      els.itemEspecificacao,
      els.itemDescricao,
      els.itemFoto
    ].forEach((input) => {
      if (input) input.addEventListener('input', updateLivePreview);
    });

    // Upload de foto & Limpeza
    if (els.btnTriggerUpload) els.btnTriggerUpload.addEventListener('click', () => els.itemFotoFile.click());
    if (els.itemFotoFile) els.itemFotoFile.addEventListener('change', handlePhotoUpload);
    if (els.btnClearPhoto) {
      els.btnClearPhoto.addEventListener('click', () => {
        els.itemFoto.value = '';
        if (els.itemFotoFile) els.itemFotoFile.value = '';
        updateLivePreview();
        showToast('Foto removida.', 'warning');
      });
    }

    // Eventos do Modal Parceiro
    if (els.btnNewPartner) els.btnNewPartner.addEventListener('click', openPartnerModal);
    if (els.btnExportPartners) els.btnExportPartners.addEventListener('click', exportPartnersJson);
    if (els.modalPartnerClose) els.modalPartnerClose.addEventListener('click', closePartnerModal);
    if (els.modalPartnerCancel) els.modalPartnerCancel.addEventListener('click', closePartnerModal);
    if (els.formPartner) els.formPartner.addEventListener('submit', handleSavePartner);

    // Eventos de Backup e Sistema
    if (els.btnExportJson) els.btnExportJson.addEventListener('click', exportJson);
    if (els.btnImportJson) els.btnImportJson.addEventListener('click', () => els.inputFileImport.click());
    if (els.inputFileImport) els.inputFileImport.addEventListener('change', handleImportFile);
    if (els.btnResetDefault) els.btnResetDefault.addEventListener('click', openResetConfirm);
    if (els.btnRecoveryJson) {
      els.btnRecoveryJson.addEventListener('click', () => {
        try {
          const raw = localStorage.getItem(RECOVERY_KEY);
          if (!raw) {
            showToast('Ainda não há cópia de recuperação gravada.', 'warning');
            return;
          }
          const blob = new Blob([raw], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'catalogo-recuperacao-gordinho.json';
          link.click();
          setTimeout(() => URL.revokeObjectURL(url), 1000);
          showToast('Cópia de recuperação baixada com sucesso!', 'success');
        } catch {
          showToast('Não foi possível baixar a cópia de recuperação.', 'error');
        }
      });
    }
    if (els.btnRefreshStorage) els.btnRefreshStorage.addEventListener('click', () => {
      renderSystemView();
      showToast('Diagnóstico recalculado.');
    });

    // Eventos do Modal de Confirmação
    if (els.confirmCancel) els.confirmCancel.addEventListener('click', closeConfirmModal);
    if (els.confirmAction) els.confirmAction.addEventListener('click', handleConfirmAction);

    // Tecla Escape & Trap de Foco
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (els.modalConfirm && els.modalConfirm.classList.contains('open')) closeConfirmModal();
        else if (els.modalPartner && els.modalPartner.classList.contains('open')) closePartnerModal();
        else if (els.modalItem && els.modalItem.classList.contains('open')) closeItemModal();
      }
    });

    window.addEventListener('beforeunload', (e) => {
      if (dirty()) {
        e.preventDefault();
        e.returnValue = '';
      }
    });

    // Sincronização automática entre abas
    window.addEventListener('storage', (e) => {
      if (e.key === 'gordinho-catalog-items' || e.key === null) {
        if (dirty()) {
          externalChange = true;
          showToast('O catálogo foi atualizado em outra aba.', 'warning');
        } else {
          loadData();
        }
      }
      if (e.key === LEADS_KEY || e.key === CADASTRO_KEY) {
        renderKpis();
        if (state.activeTab === 'parceiros') renderPartnersView();
      }
    });
  });
})();
