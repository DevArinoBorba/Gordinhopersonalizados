/**
 * GORDINHO PERSONALIZADOS — CATÁLOGO ONLINE B2B & ESTRUTURA INDUSTRIAL 2026
 * Arquitetura baseada no modelo InfinityTech:
 * - Produtos, máquinas e tecnologias com busca instantânea e filtros por categoria
 * - Carrinho Drawer persistido no localStorage
 * - Checkout formatado direto para o WhatsApp oficial com dados cadastrais do parceiro
 */

(function () {
  'use strict';

  const CART_STORAGE_KEY = 'gordinho-personalizados-cart';
  const CADASTRO_STORAGE_KEY = 'gordinho-terceirizado-cadastro';
  const WHATSAPP_NUMBER = '5547984965444';
  const PAGE_SIZE = 12;

  // Base de Itens e Estrutura Oficial 2026
  const CATALOG_ITEMS = [
    // --- TECNOLOGIAS DE PERSONALIZAÇÃO ---
    {
      id: 'tech-dtf-uv',
      nome: 'DTF UV (Impressão Digital Rígida)',
      categoria: 'Tecnologias',
      badge: 'Alta Resistência',
      especificacao: 'Cores vibrantes + Verniz + Relevo',
      descricao: 'Impressão digital direta para superfícies rígidas (copos, acrílicos, vidros e metais). Estampas com cores vivas, alta definição e excelente resistência ao uso contínuo.',
      foto: 'assets/images/catalogo/tech-dtf-uv.png',
      paginaRef: 'assets/images/catalogo/personalizacao-dtf-laser-textil.png'
    },
    {
      id: 'tech-fiber-laser',
      nome: 'Fiber Laser (Gravação Industrial)',
      categoria: 'Tecnologias',
      badge: 'Gravação Permanente',
      especificacao: 'Precisão milimétrica em metais',
      descricao: 'Tecnologia de gravação a laser ideal para metais, inox, facas e superfícies rígidas. Garante acabamento refinado, durabilidade eterna e não descasca nem desbota.',
      foto: 'assets/images/catalogo/tech-fiber-laser.png',
      paginaRef: 'assets/images/catalogo/personalizacao-dtf-laser-textil.png'
    },
    {
      id: 'tech-dtf-textil',
      nome: 'DTF Têxtil (Direct to Film)',
      categoria: 'Tecnologias',
      badge: 'Têxtil de Alta Definição',
      especificacao: 'Algodão, Dry Fit, Moletom e Poliéster',
      descricao: 'Transferência de estampas coloridas para tecidos com flexibilidade total, toque suave e altíssima resistência a dezenas de lavagens industriais e domésticas.',
      foto: 'assets/images/catalogo/tech-dtf-textil.png',
      paginaRef: 'assets/images/catalogo/personalizacao-dtf-laser-textil.png'
    },
    {
      id: 'tech-sublimacao',
      nome: 'Sublimação Térmica Premium',
      categoria: 'Tecnologias',
      badge: 'Cores Vivas',
      especificacao: 'Cerâmica resinada e tecidos poliéster',
      descricao: 'Processo de impressão térmica com penetração de pigmentos em produtos resinados e tecidos sintéticos, proporcionando estampas sem relevo e cores ultra saturadas.',
      foto: 'assets/images/catalogo/tech-sublimacao.png',
      paginaRef: 'assets/images/catalogo/personalizacao-sublimacao-transfer-3d.png'
    },
    {
      id: 'tech-transfer',
      nome: 'Transfer Laser 360',
      categoria: 'Tecnologias',
      badge: 'Brindes Promocionais',
      especificacao: 'Acrílicos, Long Drinks e Canetas',
      descricao: 'Aplicação de impressão colorida via rolo térmico pressurizado diretamente na superfície cônica ou cilíndrica de copos, canecas e canetas.',
      foto: 'assets/images/catalogo/tech-transfer.png',
      paginaRef: 'assets/images/catalogo/personalizacao-sublimacao-transfer-3d.png'
    },
    {
      id: 'tech-impressao-3d',
      nome: 'Impressão 3D e Modelagem Aditiva',
      categoria: 'Tecnologias',
      badge: 'Prototipagem & Peças',
      especificacao: 'Peças sob medida e chaveiros volumétricos',
      descricao: 'Transformação de modelos digitais tridimensionais em produtos físicos com rica volumetria, texturas e precisão geométrica em diversos filamentos.',
      foto: 'assets/images/catalogo/tech-impressao-3d.png',
      paginaRef: 'assets/images/catalogo/personalizacao-sublimacao-transfer-3d.png'
    },

    // --- ESTRUTURA DE MÁQUINAS ---
    {
      id: 'maq-cnc-laser-60x40',
      nome: 'CNC Laser 60x40 (Corte e Gravação)',
      categoria: 'Estrutura de Máquinas',
      badge: 'Corte & Gravação',
      especificacao: '60x40 cm (600x400 mm) de área útil',
      descricao: 'Corte milimétrico e gravação a laser CO2 de alta precisão em acrílico, MDF, madeira, couro, tecidos e EVA para peças sofisticadas, troféus e brindes.',
      foto: 'assets/images/catalogo/item-cnc-laser-60x40.jpg',
      paginaRef: 'assets/images/catalogo/maquinas-dtf-textil-uv-laser.png'
    },
    {
      id: 'maq-laser-uv-5w',
      nome: 'Laser UV 5W (Gravação Universal)',
      categoria: 'Estrutura de Máquinas',
      badge: 'Feixe Frio UV',
      especificacao: 'Potência 5W • Grava em todos os materiais',
      descricao: 'Tecnologia com feixe ultravioleta frio de ultra definição. Grava em absolutamente qualquer material: papéis, acrílicos, vidros, metais e até alimentos, sem queimar.',
      foto: 'assets/images/catalogo/item-laser-uv-5w.jpg',
      paginaRef: 'assets/images/catalogo/maquinas-dtf-textil-uv-laser.png'
    },
    {
      id: 'maq-plotter-eco',
      nome: 'Plotter Eco Solvente 1.800 mm',
      categoria: 'Estrutura de Máquinas',
      badge: 'Grande Formato',
      especificacao: '1.800 mm de área de impressão',
      descricao: 'Impressão digital em grande escala para banners, adesivos, rótulos e fachadas com excelente durabilidade contra intempéries e cores de alto impacto.',
      foto: 'assets/images/catalogo/item-plotter-eco-solvente.png',
      paginaRef: 'assets/images/catalogo/maquinas-plotter-eco-3d-recorte.png'
    },
    {
      id: 'maq-impressora-3d',
      nome: 'Impressora 3D de Grande Porte 500 mm³',
      categoria: 'Estrutura de Máquinas',
      badge: 'Volume Gigante',
      especificacao: '500 mm³ de área de impressão',
      descricao: 'Equipamento industrial para fabricação de brindes tridimensionais, protótipos corporativos e peças exclusivas em grande escala com precisão mecânica.',
      foto: 'assets/images/catalogo/item-impressora-3d.png',
      paginaRef: 'assets/images/catalogo/maquinas-plotter-eco-3d-recorte.png'
    },
    {
      id: 'maq-plotter-recorte',
      nome: 'Plotter de Recorte 1.200 mm',
      categoria: 'Estrutura de Máquinas',
      badge: 'Corte de Alta Precisão',
      especificacao: '1.200 mm de área de corte',
      descricao: 'Corte contornado ultra preciso de vinil adesivo, películas, etiquetas de produtos e máscaras de pintura com velocidade e repetibilidade industrial.',
      foto: 'assets/images/catalogo/item-plotter-recorte.png',
      paginaRef: 'assets/images/catalogo/maquinas-plotter-eco-3d-recorte.png'
    },
    {
      id: 'maq-dtf-textil',
      nome: 'Impressora DTF Têxtil 580 mm',
      categoria: 'Estrutura de Máquinas',
      badge: 'Produção Têxtil',
      especificacao: '580 mm de boca de impressão contínua',
      descricao: 'Equipamento com recirculação de tinta branca e aplicação automática de poliamida termofusível para estampas têxteis em série.',
      foto: 'assets/images/catalogo/item-maquina-dtf-textil.png',
      paginaRef: 'assets/images/catalogo/maquinas-dtf-textil-uv-laser.png'
    },
    {
      id: 'maq-dtf-uv',
      nome: 'Impressora DTF UV 280 mm',
      categoria: 'Estrutura de Máquinas',
      badge: 'Tecnologia UV',
      especificacao: '280 mm com cura UV e verniz',
      descricao: 'Impressão digital em filme especial com cura UV instantânea e camada de verniz com brilho e proteção contra arranhões para itens rígidos.',
      foto: 'assets/images/catalogo/item-maquina-dtf-uv.png',
      paginaRef: 'assets/images/catalogo/maquinas-dtf-textil-uv-laser.png'
    },
    {
      id: 'maq-fiber-laser',
      nome: 'Marcadora Fiber Laser Industrial',
      categoria: 'Estrutura de Máquinas',
      badge: 'Laser de Fibra Óptica',
      especificacao: '200 mm² de área de gravação',
      descricao: 'Canhão laser galvanométrico de fibra com alta velocidade de repetição, perfeito para números de série, QR Codes e logomarcas em copos e metais.',
      foto: 'assets/images/catalogo/item-maquina-fiber-laser.png',
      paginaRef: 'assets/images/catalogo/maquinas-dtf-textil-uv-laser.png'
    },
    {
      id: 'maq-prensa-giro',
      nome: 'Prensa Transfer Giro 360 & Transferneta',
      categoria: 'Estrutura de Máquinas',
      badge: 'Cilíndrico & Cônico',
      especificacao: 'Rolos térmicos especiais para copos e canetas',
      descricao: 'Equipamento com rotação motorizada para personalização periférica 360 graus de copos long drink, copos térmicos acrílicos e canetas promocionais.',
      foto: 'assets/images/catalogo/item-prensa-transfer-giro.png',
      paginaRef: 'assets/images/catalogo/maquinas-prensas-termicas.png'
    },
    {
      id: 'maq-prensa-cilindrica',
      nome: 'Prensa Térmica Cilíndrica Sublimática',
      categoria: 'Estrutura de Máquinas',
      badge: 'Sublimação Rápida',
      especificacao: 'Resistência de alta homogeneidade térmica',
      descricao: 'Prensagem pneumática e manual com controle digital de temperatura e tempo para queima e fixação perfeita em canecas e squeezes resinados.',
      foto: 'assets/images/catalogo/item-prensa-cilindrica.png',
      paginaRef: 'assets/images/catalogo/maquinas-prensas-termicas.png'
    },
    {
      id: 'maq-prensa-plana',
      nome: 'Prensa Térmica Plana Industrial',
      categoria: 'Estrutura de Máquinas',
      badge: 'Alta Pressão',
      especificacao: 'Prato plano térmico para têxteis e peças planas',
      descricao: 'Transferência térmica de alta pressão para aplicação de folhas DTF têxtil e sublimação em camisetas, moletons, uniformes e almofadas.',
      foto: 'assets/images/catalogo/item-prensa-plana.png',
      paginaRef: 'assets/images/catalogo/maquinas-prensas-termicas.png'
    },

    // --- LINHA TÊXTIL ---
    {
      id: 'prod-textil-camisetas',
      nome: 'Camisetas Personalizadas DTF Têxtil',
      categoria: 'Linha Têxtil',
      badge: 'Diversas Cores',
      especificacao: '100% Algodão, Dry Fit ou Poliéster',
      descricao: 'Camisetas promocionais e uniformes de equipe com estampa frontal no peito, costas ou mangas. Cores vivas, tecido macio e acabamento de alto padrão.',
      foto: 'assets/images/catalogo/item-textil-camisetas.png',
      paginaRef: 'assets/images/catalogo/produtos-textil-dtf.png'
    },
    {
      id: 'prod-textil-bone',
      nome: 'Bonés Personalizados com DTF',
      categoria: 'Linha Têxtil',
      badge: 'Modelo Estruturado',
      especificacao: 'Aba curva com regulagem e logo frontal',
      descricao: 'Bonés com excelente encaixe e acabamento profissional. Estampa aplicada com firmeza térmica que não deforma e valoriza a sua marca.',
      foto: 'assets/images/catalogo/item-textil-bone.png',
      paginaRef: 'assets/images/catalogo/produtos-textil-dtf.png'
    },
    {
      id: 'prod-textil-moletom',
      nome: 'Moletom Canguru Personalizado',
      categoria: 'Linha Têxtil',
      badge: 'Inverno & Corporativo',
      especificacao: 'Com capuz ajustável e bolso frontal',
      descricao: 'Moletom encorpado com forro macio, ideal para equipes e eventos corporativos de inverno. Aplicação de logotipo em alta definição.',
      foto: 'assets/images/catalogo/item-textil-moletom.png',
      paginaRef: 'assets/images/catalogo/produtos-textil-dtf.png'
    },

    // --- COMUNICAÇÃO VISUAL & GRÁFICA ---
    {
      id: 'prod-graf-cartao',
      nome: 'Cartões de Visita Profissionais',
      categoria: 'Comunicação Visual',
      badge: 'Papel Nobre',
      especificacao: 'Couchê 300g com laminação fosca ou verniz',
      descricao: 'A primeira impressão do seu negócio. Cortes precisos, fidelidade cromática e acabamento tátil sofisticado.',
      foto: 'assets/images/catalogo/item-cartao-visita.png',
      paginaRef: 'assets/images/catalogo/produtos-grafica-comunicacao-visual.png'
    },
    {
      id: 'prod-graf-folder',
      nome: 'Folders e Panfletos Institucionais',
      categoria: 'Comunicação Visual',
      badge: 'Solução Completa',
      especificacao: 'Modelos com 2 ou 3 dobras / tamanhos variados',
      descricao: 'Material promocional completo para apresentação da empresa, cardápios, feiras e prospecção de clientes.',
      foto: 'assets/images/catalogo/item-folder.png',
      paginaRef: 'assets/images/catalogo/produtos-grafica-comunicacao-visual.png'
    },
    {
      id: 'prod-graf-banners',
      nome: 'Banners e Roll-Ups Promocionais',
      categoria: 'Comunicação Visual',
      badge: 'Alta Resolução',
      especificacao: 'Lona com acabamento para tripé ou roll-up retrátil',
      descricao: 'Impressão digital eco-solvente em lona premium de alta gramatura com cores vivas e suporte estável para eventos e pontos de venda.',
      foto: 'assets/images/catalogo/item-banners.png',
      paginaRef: 'assets/images/catalogo/produtos-grafica-comunicacao-visual.png'
    },
    {
      id: 'prod-graf-vitrines',
      nome: 'Plotagem de Vitrines & Fachadas',
      categoria: 'Comunicação Visual',
      badge: 'Comunicação Comercial',
      especificacao: 'Vinil jateado, fosco, brilhoso ou microperfurado',
      descricao: 'Transformação visual do ponto comercial com aplicação de vinil resistente ao sol e chuva, garantindo privacidade e destaque à marca.',
      foto: 'assets/images/catalogo/item-plotagem-vitrine.png',
      paginaRef: 'assets/images/catalogo/produtos-grafica-comunicacao-visual.png'
    },
    {
      id: 'prod-graf-totens',
      nome: 'Totens de PVC Personalizados',
      categoria: 'Comunicação Visual',
      badge: 'Sinalização Premium',
      especificacao: 'Formatos verticais, ovais e redondos com base',
      descricao: 'Totens com corte router/recorte e adesivação de alta durabilidade para recepções, feiras de negócios e sinalização interna.',
      foto: 'assets/images/catalogo/item-totens-pvc.png',
      paginaRef: 'assets/images/catalogo/produtos-grafica-comunicacao-visual.png'
    },

    // --- PLOTAGEM VEICULAR ---
    {
      id: 'prod-veic-30',
      nome: 'Plotagem Veicular 30% (Parcial Discreta)',
      categoria: 'Plotagem Veicular',
      badge: 'Discrição & Elegância',
      especificacao: 'Lateral traseira e linha de portas',
      descricao: 'Ideal para empresas que desejam identificar a frota com elegância e ótimo custo de aplicação.',
      foto: 'assets/images/catalogo/item-plotagem-30.png',
      paginaRef: 'assets/images/catalogo/plotagem-veicular.png'
    },
    {
      id: 'prod-veic-50',
      nome: 'Plotagem Veicular 50% (Meio Veículo)',
      categoria: 'Plotagem Veicular',
      badge: 'Melhor Custo-Benefício',
      especificacao: 'Metade traseira e laterais com transição',
      descricao: 'Destaque visual expressivo nas ruas com investimento inteligente e adesivo automotivo de alta conformabilidade.',
      foto: 'assets/images/catalogo/item-plotagem-50.png',
      paginaRef: 'assets/images/catalogo/plotagem-veicular.png'
    },
    {
      id: 'prod-veic-100',
      nome: 'Plotagem Veicular 100% (Envelopamento Total)',
      categoria: 'Plotagem Veicular',
      badge: 'Máximo Impacto',
      especificacao: 'Cobertura total da carroceria em adesivo premium',
      descricao: 'Transforme o veículo corporativo em um outdoor ambulante de alta visibilidade 24 horas por dia por onde passar.',
      foto: 'assets/images/catalogo/item-plotagem-100.png',
      paginaRef: 'assets/images/catalogo/plotagem-veicular.png'
    },
    {
      id: 'prod-veic-perfurado',
      nome: 'Adesivo Perfurado no Vidro Traseiro',
      categoria: 'Plotagem Veicular',
      badge: 'Homologado Contran',
      especificacao: 'Visibilidade total de dentro para fora',
      descricao: 'Permite exibir sua marca e contatos no vidro traseiro com segurança total na condução e proteção contra raios solares.',
      foto: 'assets/images/catalogo/item-adesivo-perfurado.png',
      paginaRef: 'assets/images/catalogo/plotagem-veicular.png'
    },

    // --- BRINDES & CORPORATIVO ---
    {
      id: 'prod-brinde-kit',
      nome: 'Kit Corporativo de Boas-Vindas (Onboarding)',
      categoria: 'Brindes Corporativos',
      badge: 'Kit Completo',
      especificacao: 'Garrafa térmica, caneca, caderno moleskine e caneta',
      descricao: 'Conjunto executivo para encantar clientes VIP e novos colaboradores. Embalagem personalizada e acabamento alinhado à sua marca.',
      foto: 'assets/images/catalogo/item-kit-boas-vindas.png',
      paginaRef: 'assets/images/catalogo/catalogo-capa.png'
    }
  ];

  const CATALOG_STORAGE_KEY = 'gordinho-catalog-items';

  function loadCatalogItems() {
    if (window.GordinhoCatalogData && typeof window.GordinhoCatalogData.getItems === 'function') {
      return window.GordinhoCatalogData.getItems().filter(function (i) { return i.ativo !== false; });
    }
    try {
      const raw = localStorage.getItem(CATALOG_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter(function (i) { return i.ativo !== false; });
        }
      }
    } catch (e) {}
    const fallback = window.DEFAULT_CATALOG_ITEMS || CATALOG_ITEMS;
    return fallback.filter(function (i) { return i.ativo !== false; });
  }

  const initialItems = loadCatalogItems();

  // Estado do catálogo
  const state = {
    items: initialItems,
    itemsById: new Map(initialItems.map((item) => [item.id, item])),
    filteredItems: initialItems,
    activeCategory: 'todos',
    searchTerm: '',
    visibleCount: PAGE_SIZE,
    cart: loadCart()
  };

  function reloadCatalogItems() {
    const fresh = loadCatalogItems();
    state.items = fresh;
    state.itemsById = new Map(fresh.map((item) => [item.id, item]));
    if (els.categoryFilters) renderCategoryFilters();
    if (els.grid) applyFilters();
  }

  window.addEventListener('storage', (e) => {
    if (e.key === CATALOG_STORAGE_KEY) {
      reloadCatalogItems();
    }
  });

  window.addEventListener('gordinho:catalog-updated', () => {
    reloadCatalogItems();
  });

  // Elementos do DOM
  const els = {};

  function cacheDom() {
    els.grid = document.getElementById('catalog-grid');
    els.search = document.getElementById('catalog-search');
    els.categoryFilters = document.getElementById('category-filters');
    els.categoryScrollPrev = document.getElementById('category-scroll-prev');
    els.categoryScrollNext = document.getElementById('category-scroll-next');
    els.loadMoreWrap = document.getElementById('catalog-load-more-wrap');
    els.emptyState = document.getElementById('catalog-empty-state');
    els.cartButton = document.getElementById('cart-button');
    els.cartBadge = document.getElementById('cart-badge');
    els.cartDrawer = document.getElementById('cart-drawer');
    els.cartBackdrop = document.getElementById('cart-backdrop');
    els.cartItems = document.getElementById('cart-items');
    els.cartEmpty = document.getElementById('cart-empty');
    els.cartTotalBadge = document.getElementById('cart-total-badge');
    els.cartPartnerBanner = document.getElementById('cart-partner-banner');
    els.cartCheckout = document.getElementById('cart-checkout');
    els.cartClose = document.getElementById('cart-close');
    els.cartClear = document.getElementById('cart-clear');
    els.lightbox = document.getElementById('catalog-lightbox');
    els.lightboxImg = document.getElementById('lightbox-img');
    els.lightboxTitle = document.getElementById('lightbox-title');
    els.lightboxClose = document.getElementById('lightbox-close');
  }

  // Persistência do Carrinho
  function loadCart() {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart() {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart));
    } catch (e) {}
  }

  function getPartnerData() {
    try {
      const raw = localStorage.getItem(CADASTRO_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function addToCart(item, quantity) {
    const existing = state.cart.find((i) => i.id === item.id);
    if (existing) {
      existing.quantidade += quantity;
    } else {
      state.cart.push({
        id: item.id,
        nome: item.nome,
        categoria: item.categoria,
        especificacao: item.especificacao,
        foto: item.foto,
        quantidade: quantity
      });
    }
    saveCart();
    renderCart();
    flashCartButton();
  }

  function updateCartQuantity(id, delta) {
    const item = state.cart.find((i) => i.id === id);
    if (!item) return;
    item.quantidade += delta;
    if (item.quantidade <= 0) {
      state.cart = state.cart.filter((i) => i.id !== id);
    }
    saveCart();
    renderCart();
  }

  function removeFromCart(id) {
    state.cart = state.cart.filter((i) => i.id !== id);
    saveCart();
    renderCart();
  }

  function clearCart() {
    state.cart = [];
    saveCart();
    renderCart();
  }

  function cartCount() {
    return state.cart.reduce((sum, item) => sum + item.quantidade, 0);
  }

  function flashCartButton() {
    if (!els.cartButton) return;
    els.cartButton.classList.add('cart-pulse');
    setTimeout(() => els.cartButton.classList.remove('cart-pulse'), 500);
  }

  function openCart() {
    els.cartDrawer.classList.add('open');
    els.cartBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    els.cartDrawer.classList.remove('open');
    els.cartBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  function openLightbox(imgSrc, title) {
    if (!els.lightbox) return;
    els.lightboxImg.src = imgSrc;
    els.lightboxTitle.textContent = title || 'Página do Catálogo Oficial 2026';
    els.lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!els.lightbox) return;
    els.lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Filtragem e busca
  function applyFilters() {
    let result = state.items;

    if (state.activeCategory !== 'todos') {
      result = result.filter((item) => item.categoria === state.activeCategory);
    }

    if (state.searchTerm.trim() !== '') {
      const term = state.searchTerm.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      result = result.filter((item) => {
        const text = `${item.nome} ${item.categoria} ${item.badge} ${item.especificacao} ${item.descricao}`
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');
        return text.includes(term);
      });
    }

    state.filteredItems = result;
    renderGrid();
  }

  // Renderização dos Filtros por Categoria
  function renderCategoryFilters() {
    const categories = Array.from(new Set(state.items.map((i) => i.categoria)));
    els.categoryFilters.innerHTML = '';

    const allBtn = document.createElement('button');
    allBtn.type = 'button';
    allBtn.className = 'category-pill' + (state.activeCategory === 'todos' ? ' active' : '');
    allBtn.innerHTML = `<span>Todos</span> <span class="pill-count">${state.items.length}</span>`;
    allBtn.addEventListener('click', () => {
      state.activeCategory = 'todos';
      state.visibleCount = PAGE_SIZE;
      renderCategoryFilters();
      applyFilters();
    });
    els.categoryFilters.appendChild(allBtn);

    categories.forEach((cat) => {
      const count = state.items.filter((i) => i.categoria === cat).length;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'category-pill' + (state.activeCategory === cat ? ' active' : '');
      btn.innerHTML = `<span>${escapeHTML(cat)}</span> <span class="pill-count">${count}</span>`;
      btn.addEventListener('click', () => {
        state.activeCategory = cat;
        state.visibleCount = PAGE_SIZE;
        renderCategoryFilters();
        applyFilters();
      });
      els.categoryFilters.appendChild(btn);
    });
  }

  // Renderização do Card de Produto/Máquina
  function itemCardHTML(item) {
    return `
      <article class="catalog-card" data-id="${escapeAttr(item.id)}">
        <div class="card-media">
          <img src="${escapeAttr(item.foto)}" alt="${escapeAttr(item.nome)}" loading="lazy" class="card-img" />
          <span class="card-badge">${escapeHTML(item.badge)}</span>
          <button type="button" class="btn-zoom-preview" title="Ver página do catálogo" data-preview="${escapeAttr(item.paginaRef)}" data-title="${escapeAttr(item.nome)}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
        </div>
        <div class="card-body">
          <div class="card-category-tag">${escapeHTML(item.categoria)}</div>
          <h3 class="card-title">${escapeHTML(item.nome)}</h3>
          <p class="card-spec"><strong>Especificação:</strong> ${escapeHTML(item.especificacao)}</p>
          <p class="card-desc">${escapeHTML(item.descricao)}</p>
        </div>
        <div class="card-footer">
          <div class="qty-stepper" data-qty="1">
            <button type="button" class="qty-btn qty-minus" aria-label="Diminuir quantidade">−</button>
            <span class="qty-value">1</span>
            <button type="button" class="qty-btn qty-plus" aria-label="Aumentar quantidade">+</button>
          </div>
          <button type="button" class="btn-card-add" aria-label="Adicionar ${escapeAttr(item.nome)} ao orçamento">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14M5 12h14"/></svg>
            <span class="btn-add-label">Adicionar</span>
          </button>
        </div>
      </article>
    `;
  }

  function renderGrid() {
    const visible = state.filteredItems;

    if (visible.length === 0) {
      els.grid.innerHTML = '';
      els.loadMoreWrap.innerHTML = '';
      els.emptyState.hidden = false;
      return;
    }

    els.emptyState.hidden = true;
    const pageItems = visible.slice(0, state.visibleCount);
    els.grid.innerHTML = pageItems.map(itemCardHTML).join('');

    const remaining = visible.length - pageItems.length;
    els.loadMoreWrap.innerHTML = remaining > 0
      ? `<button type="button" class="btn-load-more" id="catalog-load-more">Carregar mais itens (${remaining} restantes)</button>`
      : '';

    if (remaining > 0) {
      document.getElementById('catalog-load-more').addEventListener('click', () => {
        state.visibleCount += PAGE_SIZE;
        renderGrid();
      });
    }

    // Eventos dos cards
    els.grid.querySelectorAll('.catalog-card').forEach((card) => {
      const id = card.dataset.id;
      const item = state.itemsById.get(id);
      const stepper = card.querySelector('.qty-stepper');
      const qtyValue = card.querySelector('.qty-value');

      card.querySelector('.qty-minus').addEventListener('click', () => {
        const current = parseInt(stepper.dataset.qty, 10);
        const next = Math.max(1, current - 1);
        stepper.dataset.qty = next;
        qtyValue.textContent = next;
      });

      card.querySelector('.qty-plus').addEventListener('click', () => {
        const current = parseInt(stepper.dataset.qty, 10);
        const next = current + 1;
        stepper.dataset.qty = next;
        qtyValue.textContent = next;
      });

      const zoomBtn = card.querySelector('.btn-zoom-preview');
      if (zoomBtn) {
        zoomBtn.addEventListener('click', () => {
          openLightbox(zoomBtn.dataset.preview, zoomBtn.dataset.title);
        });
      }

      const addBtn = card.querySelector('.btn-card-add');
      addBtn.addEventListener('click', () => {
        const qty = parseInt(stepper.dataset.qty, 10);
        addToCart(item, qty);
        stepper.dataset.qty = 1;
        qtyValue.textContent = 1;

        const label = addBtn.querySelector('.btn-add-label');
        const originalText = label.textContent;
        label.textContent = 'Adicionado ✓';
        addBtn.classList.add('is-added');
        setTimeout(() => {
          label.textContent = originalText;
          addBtn.classList.remove('is-added');
        }, 1200);
      });
    });
  }

  // Renderização do Carrinho Drawer
  function cartItemHTML(item) {
    return `
      <li class="cart-item" data-id="${escapeAttr(item.id)}">
        <div class="cart-item-photo">
          <img src="${escapeAttr(item.foto)}" alt="${escapeAttr(item.nome)}" loading="lazy" />
        </div>
        <div class="cart-item-info">
          <span class="cart-item-cat">${escapeHTML(item.categoria)}</span>
          <strong class="cart-item-title">${escapeHTML(item.nome)}</strong>
          <span class="cart-item-spec">${escapeHTML(item.especificacao)}</span>
          <div class="cart-item-controls">
            <button type="button" class="qty-btn cart-qty-minus" aria-label="Diminuir quantidade">−</button>
            <span class="qty-value">${item.quantidade}</span>
            <button type="button" class="qty-btn cart-qty-plus" aria-label="Aumentar quantidade">+</button>
            <button type="button" class="cart-item-remove" aria-label="Remover">Remover</button>
          </div>
        </div>
      </li>
    `;
  }

  function renderCart() {
    const count = cartCount();
    els.cartBadge.textContent = count;
    els.cartBadge.hidden = count === 0;
    els.cartTotalBadge.textContent = `${count} ${count === 1 ? 'item' : 'itens'}`;

    const partner = getPartnerData();
    if (partner && partner.nome) {
      els.cartPartnerBanner.hidden = false;
      els.cartPartnerBanner.innerHTML = `
        <div class="partner-badge-inline">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>Parceiro B2B: <strong>${escapeHTML(partner.nome)}</strong> (CNPJ: ${escapeHTML(partner.cnpj || '')})</span>
        </div>
      `;
    } else {
      els.cartPartnerBanner.hidden = false;
      els.cartPartnerBanner.innerHTML = `
        <div class="partner-lead-inline">
          <span>Tem CNPJ? <a href="cadastro-terceirizado.html">Faça seu pré-cadastro</a> para tabela de parceiro.</span>
        </div>
      `;
    }

    if (state.cart.length === 0) {
      els.cartItems.innerHTML = '';
      els.cartEmpty.hidden = false;
      els.cartCheckout.disabled = true;
    } else {
      els.cartEmpty.hidden = true;
      els.cartCheckout.disabled = false;
      els.cartItems.innerHTML = state.cart.map(cartItemHTML).join('');

      els.cartItems.querySelectorAll('.cart-item').forEach((el) => {
        const id = el.dataset.id;
        el.querySelector('.cart-qty-minus').addEventListener('click', () => updateCartQuantity(id, -1));
        el.querySelector('.cart-qty-plus').addEventListener('click', () => updateCartQuantity(id, 1));
        el.querySelector('.cart-item-remove').addEventListener('click', () => removeFromCart(id));
      });
    }
  }

  // Formatação da Mensagem do WhatsApp
  function buildWhatsAppMessage() {
    const lines = [];
    const partner = getPartnerData();

    lines.push('🎁 *SOLICITAÇÃO DE COTAÇÃO / ORÇAMENTO — GORDINHO PERSONALIZADOS 2026*');
    lines.push('');

    if (partner) {
      lines.push('*DADOS DO PARCEIRO / TERCEIRIZADO:*');
      if (partner.nome) lines.push(`• *Empresa / Razão:* ${partner.nome}`);
      if (partner.cnpj) lines.push(`• *CNPJ:* ${partner.cnpj}`);
      if (partner.endereco) lines.push(`• *Endereço:* ${partner.endereco}`);
      if (partner.contato || partner.telefone) lines.push(`• *Contato:* ${partner.contato || partner.telefone}`);
      if (partner.email) lines.push(`• *E-mail:* ${partner.email}`);
      lines.push('');
    }

    lines.push('Olá! Selecionei os seguintes itens no Catálogo Online Corporativo:');
    lines.push('');

    state.cart.forEach((item, index) => {
      lines.push(`${index + 1}) *${item.quantidade}x* ${item.nome}`);
      lines.push(`   _Categoria:_ ${item.categoria}`);
      if (item.especificacao) lines.push(`   _Especificação:_ ${item.especificacao}`);
    });

    lines.push('');
    lines.push(`*Total de itens selecionados:* ${cartCount()}`);
    lines.push('');
    lines.push('Gostaria de verificar disponibilidade, prazos de produção e os valores da tabela!');

    return lines.join('\n');
  }

  function checkout() {
    if (state.cart.length === 0) return;
    const msg = encodeURIComponent(buildWhatsAppMessage());
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank', 'noopener');
  }

  // Utilitários
  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  function escapeAttr(str) {
    return escapeHTML(str).replace(/"/g, '&quot;');
  }

  function debounce(fn, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  // Inicialização
  document.addEventListener('DOMContentLoaded', () => {
    cacheDom();

    renderCategoryFilters();
    renderGrid();
    renderCart();

    // Busca com debounce
    els.search.addEventListener('input', debounce((e) => {
      state.searchTerm = e.target.value;
      state.visibleCount = PAGE_SIZE;
      applyFilters();
    }, 250));

    // Scroll de Categorias
    els.categoryScrollPrev.addEventListener('click', () => {
      els.categoryFilters.scrollBy({ left: -200, behavior: 'smooth' });
    });
    els.categoryScrollNext.addEventListener('click', () => {
      els.categoryFilters.scrollBy({ left: 200, behavior: 'smooth' });
    });

    // Drawer de Carrinho
    els.cartButton.addEventListener('click', openCart);
    els.cartClose.addEventListener('click', closeCart);
    els.cartBackdrop.addEventListener('click', closeCart);
    els.cartClear.addEventListener('click', clearCart);
    els.cartCheckout.addEventListener('click', checkout);

    // Lightbox
    if (els.lightboxClose) {
      els.lightboxClose.addEventListener('click', closeLightbox);
    }
    if (els.lightbox) {
      els.lightbox.addEventListener('click', (e) => {
        if (e.target === els.lightbox) closeLightbox();
      });
    }

    // Tecla ESC fecha modais
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeCart();
        closeLightbox();
      }
    });
  });
})();
