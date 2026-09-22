/**
 * GORDINHO PERSONALIZADOS — BASE OFICIAL DO CATÁLOGO 2026
 * Este arquivo define a base oficial inicial compartilhada entre o catálogo público e o painel administrativo.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'gordinho-catalog-items';

  const DEFAULT_CATEGORIES = [
    'Gráfica Rápida',
    'Identidade Visual',
    'Comunicação Visual, Plotagem de Vitrines e Fachadas',
    'Plotagem Veicular',
    'Brindes Corporativos',
    'Kits Corporativos',
    'Canecas Personalizadas',
    'Uniformes',
    'Presentes Personalizados',
    'Decoração Personalizada',
    'Papelaria Personalizada',
    'Vinil por Metro Quadrado',
    'DTF Têxtil',
    'DTF UV',
    'Gravação a Laser',
    'Estrutura de Máquinas',
    'Tecnologias'
  ];

  const DEFAULT_CATALOG_ITEMS = [
    // --- TECNOLOGIAS DE PERSONALIZAÇÃO ---
    {
      id: 'tech-dtf-uv',
      nome: 'DTF UV (Impressão Digital Rígida)',
      categoria: 'Tecnologias',
      badge: 'Alta Resistência',
      especificacao: 'Cores vibrantes + Verniz + Relevo',
      descricao: 'Impressão digital direta para superfícies rígidas (copos, acrílicos, vidros e metais). Estampas com cores vivas, alta definição e excelente resistência ao uso contínuo.',
      foto: 'assets/images/catalogo/tech-dtf-uv.png',
      paginaRef: 'assets/images/catalogo/personalizacao-dtf-laser-textil.png',
      ativo: true
    },
    {
      id: 'tech-fiber-laser',
      nome: 'Fiber Laser (Gravação Industrial)',
      categoria: 'Tecnologias',
      badge: 'Gravação Permanente',
      especificacao: 'Precisão milimétrica em metais',
      descricao: 'Tecnologia de gravação a laser ideal para metais, inox, facas e superfícies rígidas. Garante acabamento refinado, durabilidade eterna e não descasca nem desbota.',
      foto: 'assets/images/catalogo/tech-fiber-laser.png',
      paginaRef: 'assets/images/catalogo/personalizacao-dtf-laser-textil.png',
      ativo: true
    },
    {
      id: 'tech-dtf-textil',
      nome: 'DTF Têxtil (Direct to Film)',
      categoria: 'Tecnologias',
      badge: 'Têxtil de Alta Definição',
      especificacao: 'Algodão, Dry Fit, Moletom e Poliéster',
      descricao: 'Transferência de estampas coloridas para tecidos com flexibilidade total, toque suave e altíssima resistência a dezenas de lavagens industriais e domésticas.',
      foto: 'assets/images/catalogo/tech-dtf-textil.png',
      paginaRef: 'assets/images/catalogo/personalizacao-dtf-laser-textil.png',
      ativo: true
    },
    {
      id: 'tech-sublimacao',
      nome: 'Sublimação Térmica Premium',
      categoria: 'Tecnologias',
      badge: 'Cores Vivas',
      especificacao: 'Cerâmica resinada e tecidos poliéster',
      descricao: 'Processo de impressão térmica com penetração de pigmentos em produtos resinados e tecidos sintéticos, proporcionando estampas sem relevo e cores ultra saturadas.',
      foto: 'assets/images/catalogo/tech-sublimacao.png',
      paginaRef: 'assets/images/catalogo/personalizacao-sublimacao-transfer-3d.png',
      ativo: true
    },
    {
      id: 'tech-transfer',
      nome: 'Transfer Laser 360',
      categoria: 'Tecnologias',
      badge: 'Brindes Promocionais',
      especificacao: 'Acrílicos, Long Drinks e Canetas',
      descricao: 'Aplicação de impressão colorida via rolo térmico pressurizado diretamente na superfície cônica ou cilíndrica de copos, canecas e canetas.',
      foto: 'assets/images/catalogo/tech-transfer.png',
      paginaRef: 'assets/images/catalogo/personalizacao-sublimacao-transfer-3d.png',
      ativo: true
    },
    {
      id: 'tech-impressao-3d',
      nome: 'Impressão 3D e Modelagem Aditiva',
      categoria: 'Tecnologias',
      badge: 'Prototipagem & Peças',
      especificacao: 'Peças sob medida e chaveiros volumétricos',
      descricao: 'Transformação de modelos digitais tridimensionais em produtos físicos com rica volumetria, texturas e precisão geométrica em diversos filamentos.',
      foto: 'assets/images/catalogo/tech-impressao-3d.png',
      paginaRef: 'assets/images/catalogo/personalizacao-sublimacao-transfer-3d.png',
      ativo: true
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
      paginaRef: 'assets/images/catalogo/maquinas-dtf-textil-uv-laser.png',
      publico: 'terceirizado',
      ativo: true
    },
    {
      id: 'maq-laser-uv-5w',
      nome: 'Laser UV 5W (Gravação Universal)',
      categoria: 'Estrutura de Máquinas',
      badge: 'Feixe Frio UV',
      especificacao: 'Potência 5W • Grava em todos os materiais',
      descricao: 'Tecnologia com feixe ultravioleta frio de ultra definição. Grava em absolutamente qualquer material: papéis, acrílicos, vidros, metais e até alimentos, sem queimar.',
      foto: 'assets/images/catalogo/item-laser-uv-5w.jpg',
      paginaRef: 'assets/images/catalogo/maquinas-dtf-textil-uv-laser.png',
      publico: 'terceirizado',
      ativo: true
    },
    {
      id: 'maq-plotter-eco',
      nome: 'Plotter Eco Solvente 1.800 mm',
      categoria: 'Estrutura de Máquinas',
      badge: 'Grande Formato',
      especificacao: '1.800 mm de área de impressão',
      descricao: 'Impressão digital em grande escala para banners, adesivos, rótulos e fachadas com excelente durabilidade contra intempéries e cores de alto impacto.',
      foto: 'assets/images/catalogo/item-plotter-eco-solvente.png',
      paginaRef: 'assets/images/catalogo/maquinas-plotter-eco-3d-recorte.png',
      publico: 'terceirizado',
      ativo: true
    },
    {
      id: 'maq-impressora-3d',
      nome: 'Impressora 3D de Grande Porte 500 mm³',
      categoria: 'Estrutura de Máquinas',
      badge: 'Volume Gigante',
      especificacao: '500 mm³ de área de impressão',
      descricao: 'Equipamento industrial para fabricação de brindes tridimensionais, protótipos corporativos e peças exclusivas em grande escala com precisão mecânica.',
      foto: 'assets/images/catalogo/item-impressora-3d.png',
      paginaRef: 'assets/images/catalogo/maquinas-plotter-eco-3d-recorte.png',
      publico: 'terceirizado',
      ativo: true
    },
    {
      id: 'maq-plotter-recorte',
      nome: 'Plotter de Recorte 1.200 mm',
      categoria: 'Estrutura de Máquinas',
      badge: 'Corte de Alta Precisão',
      especificacao: '1.200 mm de área de corte',
      descricao: 'Corte contornado ultra preciso de vinil adesivo, películas, etiquetas de produtos e máscaras de pintura com velocidade e repetibilidade industrial.',
      foto: 'assets/images/catalogo/item-plotter-recorte.png',
      paginaRef: 'assets/images/catalogo/maquinas-plotter-eco-3d-recorte.png',
      publico: 'terceirizado',
      ativo: true
    },
    {
      id: 'maq-dtf-textil',
      nome: 'Impressora DTF Têxtil 580 mm',
      categoria: 'Estrutura de Máquinas',
      badge: 'Produção Têxtil',
      especificacao: '580 mm de boca de impressão contínua',
      descricao: 'Equipamento com recirculação de tinta branca e aplicação automática de poliamida termofusível para estampas têxteis em série.',
      foto: 'assets/images/catalogo/item-maquina-dtf-textil.png',
      paginaRef: 'assets/images/catalogo/maquinas-dtf-textil-uv-laser.png',
      publico: 'terceirizado',
      ativo: true
    },
    {
      id: 'maq-dtf-uv',
      nome: 'Impressora DTF UV 280 mm',
      categoria: 'Estrutura de Máquinas',
      badge: 'Tecnologia UV',
      especificacao: '280 mm com cura UV e verniz',
      descricao: 'Impressão digital em filme especial com cura UV instantânea e camada de verniz com brilho e proteção contra arranhões para itens rígidos.',
      foto: 'assets/images/catalogo/item-maquina-dtf-uv.png',
      paginaRef: 'assets/images/catalogo/maquinas-dtf-textil-uv-laser.png',
      publico: 'terceirizado',
      ativo: true
    },
    {
      id: 'maq-fiber-laser',
      nome: 'Marcadora Fiber Laser Industrial',
      categoria: 'Estrutura de Máquinas',
      badge: 'Laser de Fibra Óptica',
      especificacao: '200 mm² de área de gravação',
      descricao: 'Canhão laser galvanométrico de fibra com alta velocidade de repetição, perfeito para números de série, QR Codes e logomarcas em copos e metais.',
      foto: 'assets/images/catalogo/item-maquina-fiber-laser.png',
      paginaRef: 'assets/images/catalogo/maquinas-dtf-textil-uv-laser.png',
      publico: 'terceirizado',
      ativo: true
    },
    {
      id: 'maq-prensa-giro',
      nome: 'Prensa Transfer Giro 360 & Transferneta',
      categoria: 'Estrutura de Máquinas',
      badge: 'Cilíndrico & Cônico',
      especificacao: 'Rolos térmicos especiais para copos e canetas',
      descricao: 'Equipamento com rotação motorizada para personalização periférica 360 graus de copos long drink, copos térmicos acrílicos e canetas promocionais.',
      foto: 'assets/images/catalogo/item-prensa-transfer-giro.png',
      paginaRef: 'assets/images/catalogo/maquinas-prensas-termicas.png',
      publico: 'terceirizado',
      ativo: true
    },
    {
      id: 'maq-prensa-cilindrica',
      nome: 'Prensa Térmica Cilíndrica Sublimática',
      categoria: 'Estrutura de Máquinas',
      badge: 'Sublimação Rápida',
      especificacao: 'Resistência de alta homogeneidade térmica',
      descricao: 'Prensagem pneumática e manual com controle digital de temperatura e tempo para queima e fixação perfeita em canecas e squeezes resinados.',
      foto: 'assets/images/catalogo/item-prensa-cilindrica.png',
      paginaRef: 'assets/images/catalogo/maquinas-prensas-termicas.png',
      publico: 'terceirizado',
      ativo: true
    },
    {
      id: 'maq-prensa-plana',
      nome: 'Prensa Térmica Plana Industrial',
      categoria: 'Estrutura de Máquinas',
      badge: 'Alta Pressão',
      especificacao: 'Prato plano térmico para têxteis e peças planas',
      descricao: 'Transferência térmica de alta pressão para aplicação de folhas DTF têxtil e sublimação em camisetas, moletons, uniformes e almofadas.',
      foto: 'assets/images/catalogo/item-prensa-plana.png',
      paginaRef: 'assets/images/catalogo/maquinas-prensas-termicas.png',
      publico: 'terceirizado',
      ativo: true
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
      paginaRef: 'assets/images/catalogo/produtos-textil-dtf.png',
      ativo: true
    },
    {
      id: 'prod-textil-bone',
      nome: 'Bonés Personalizados com DTF',
      categoria: 'Linha Têxtil',
      badge: 'Modelo Estruturado',
      especificacao: 'Aba curva com regulagem e logo frontal',
      descricao: 'Bonés com excelente encaixe e acabamento profissional. Estampa aplicada com firmeza térmica que não deforma e valoriza a sua marca.',
      foto: 'assets/images/catalogo/item-textil-bone.png',
      paginaRef: 'assets/images/catalogo/produtos-textil-dtf.png',
      ativo: true
    },
    {
      id: 'prod-textil-moletom',
      nome: 'Moletom Canguru Personalizado',
      categoria: 'Linha Têxtil',
      badge: 'Inverno & Corporativo',
      especificacao: 'Com capuz ajustável e bolso frontal',
      descricao: 'Moletom encorpado com forro macio, ideal para equipes e eventos corporativos de inverno. Aplicação de logotipo em alta definição.',
      foto: 'assets/images/catalogo/item-textil-moletom.png',
      paginaRef: 'assets/images/catalogo/produtos-textil-dtf.png',
      ativo: true
    },

    // --- GRÁFICA RÁPIDA & COMUNICAÇÃO VISUAL ---
    {
      id: 'prod-graf-cartao',
      nome: 'Cartões de Visita Profissionais',
      categoria: 'Gráfica Rápida',
      badge: 'Couchê 300g',
      especificacao: 'Laminação Fosca Bopp + Verniz Localizado UV ou Corte Reto / Cantos Arredondados',
      descricao: 'A primeira impressão do seu negócio com acabamento gráfico de alto padrão. Cortes precisos, fidelidade cromática, toque aveludado e verniz localizado com brilho sofisticado.',
      foto: 'assets/images/catalogo/item-cartao-visita.png',
      paginaRef: 'assets/images/catalogo/produtos-grafica-comunicacao-visual.png',
      publico: 'terceirizado',
      ativo: true
    },
    {
      id: 'prod-graf-cardapios',
      nome: 'Cardápios Personalizados',
      categoria: 'Gráfica Rápida',
      badge: 'Lavável & Resistente',
      especificacao: 'PVC Cristal Lavável, Couchê 350g com Laminação Térmica Bopp ou Rígido com Vinco',
      descricao: 'Cardápios duráveis e impermeáveis para bares, restaurantes, cafeterias e lanchonetes. Resistentes a respingos e manuseio constante, disponíveis em lâminas individuais, pranchetas ou modelos bifold/trifold com vinco térmico.',
      foto: 'assets/images/catalogo/item-cardapios-personalizados.jpg',
      paginaRef: 'assets/images/catalogo/item-cardapios-personalizados.jpg',
      publico: 'terceirizado',
      ativo: true
    },
    {
      id: 'prod-graf-folder',
      nome: 'Folders e Panfletos Institucionais',
      categoria: 'Gráfica Rápida',
      badge: 'Solução Completa',
      especificacao: 'Modelos com 1, 2 ou 3 dobras / formatos A4, A5 e A6 em Couchê 115g/150g',
      descricao: 'Material promocional impresso em alta velocidade para apresentação da empresa, cardápios delivery, feiras, eventos e campanhas de vendas.',
      foto: 'assets/images/catalogo/item-folder.png',
      paginaRef: 'assets/images/catalogo/produtos-grafica-comunicacao-visual.png',
      publico: 'terceirizado',
      ativo: true
    },
    {
      id: 'terc-graf-comandas-blocos',
      nome: 'Comandas, Receituários & Blocos Autocopiativos',
      categoria: 'Gráfica Rápida',
      badge: 'Blocagem & Picote',
      especificacao: 'Papel Sulfite ou Autocopiativo (1 ou 2 vias) • Numeração sequencial e picote',
      descricao: 'Blocos personalizados para pedidos de mesas, comandas de garçom, receituários médicos e ordens de serviço. Blocagem reforçada com picote de destaque fácil e numeração sequencial opcional.',
      foto: 'assets/images/catalogo/item-comandas-blocos.jpg',
      paginaRef: 'assets/images/catalogo/item-comandas-blocos.jpg',
      publico: 'terceirizado',
      ativo: true
    },
    {
      id: 'prod-graf-vitrines',
      nome: 'Plotagem de Vitrines & Fachadas',
      categoria: 'Identidade Visual',
      badge: 'Comunicação Comercial',
      especificacao: 'Vinil jateado, fosco, brilhoso, black-out ou microperfurado',
      descricao: 'Transformação visual do ponto comercial com aplicação de vinil resistente ao sol e chuva, garantindo privacidade, destaque à marca e promoções atraentes.',
      foto: 'assets/images/catalogo/item-plotagem-vitrine.png',
      paginaRef: 'assets/images/catalogo/produtos-grafica-comunicacao-visual.png',
      publico: 'terceirizado',
      ativo: true
    },
    {
      id: 'prod-graf-banners',
      nome: 'Banners e Roll-Ups Promocionais',
      categoria: 'Identidade Visual',
      badge: 'Alta Resolução',
      especificacao: 'Lona Frontlight 440g com acabamento para tripé ou roll-up retrátil em alumínio',
      descricao: 'Impressão digital eco-solvente em lona premium de alta gramatura com cores vivas e suporte estável para eventos e pontos de venda.',
      foto: 'assets/images/catalogo/item-banners.png',
      paginaRef: 'assets/images/catalogo/produtos-grafica-comunicacao-visual.png',
      publico: 'terceirizado',
      ativo: true
    },
    {
      id: 'prod-graf-totens',
      nome: 'Totens de PVC Personalizados',
      categoria: 'Identidade Visual',
      badge: 'Sinalização Premium',
      especificacao: 'Formatos verticais, ovais e redondos com base',
      descricao: 'Totens com corte router/recorte e adesivação de alta durabilidade para recepções, feiras de negócios e sinalização interna.',
      foto: 'assets/images/catalogo/item-totens-pvc.png',
      paginaRef: 'assets/images/catalogo/produtos-grafica-comunicacao-visual.png',
      publico: 'terceirizado',
      ativo: true
    },
    {
      id: 'prod-graf-plaquinhas-acrilico-pvc-ps',
      nome: 'Plaquinhas em Acrílico, PVC e PS',
      categoria: 'Identidade Visual',
      badge: 'Sinalização & Identificação',
      especificacao: 'Acrílico Cristal, PVC Expandido e PS • Corte e Impressão UV',
      descricao: 'Plaquinhas personalizadas de identificação e sinalização para recepções, escritórios, consultórios e lojas. Modelos de parede em acrílico cristal com espaçadores/prolongadores em inox, placas de mesa interativas com QR Code/PIX e placas rígidas em PVC e PS de alta densidade.',
      foto: 'assets/images/catalogo/item-plaquinhas-acrilico-pvc-ps.jpg',
      paginaRef: 'assets/images/catalogo/item-plaquinhas-acrilico-pvc-ps.jpg',
      publico: 'terceirizado',
      ativo: true
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
      paginaRef: 'assets/images/catalogo/plotagem-veicular.png',
      ativo: true
    },
    {
      id: 'prod-veic-50',
      nome: 'Plotagem Veicular 50% (Meio Veículo)',
      categoria: 'Plotagem Veicular',
      badge: 'Melhor Custo-Benefício',
      especificacao: 'Metade traseira e laterais com transição',
      descricao: 'Destaque visual expressivo nas ruas com investimento inteligente e adesivo automotivo de alta conformabilidade.',
      foto: 'assets/images/catalogo/item-plotagem-50.png',
      paginaRef: 'assets/images/catalogo/plotagem-veicular.png',
      ativo: true
    },
    {
      id: 'prod-veic-100',
      nome: 'Plotagem Veicular 100% (Envelopamento Total)',
      categoria: 'Plotagem Veicular',
      badge: 'Máximo Impacto',
      especificacao: 'Cobertura total da carroceria em adesivo premium',
      descricao: 'Transforme o veículo corporativo em um outdoor ambulante de alta visibilidade 24 horas por dia por onde passar.',
      foto: 'assets/images/catalogo/item-plotagem-100.png',
      paginaRef: 'assets/images/catalogo/plotagem-veicular.png',
      ativo: true
    },
    {
      id: 'prod-veic-perfurado',
      nome: 'Adesivo Perfurado no Vidro Traseiro',
      categoria: 'Plotagem Veicular',
      badge: 'Homologado Contran',
      especificacao: 'Visibilidade total de dentro para fora',
      descricao: 'Permite exibir sua marca e contatos no vidro traseiro com segurança total na condução e proteção contra raios solares.',
      foto: 'assets/images/catalogo/item-adesivo-perfurado.png',
      paginaRef: 'assets/images/catalogo/plotagem-veicular.png',
      ativo: true
    },

    // --- BRINDES & CORPORATIVO ---
    {
      id: 'prod-brinde-canetas-chaveiros',
      nome: 'Canetas e Chaveiros',
      categoria: 'Brindes Corporativos',
      badge: 'Gravação a Laser & UV',
      especificacao: 'Canetas metálicas executivas e chaveiros em couro/metal gravados a laser',
      descricao: 'Conjunto executivo de canetas metálicas de alta precisão e chaveiros sofisticados personalizados com a logo da Gordinho ou da sua empresa. Ideal para brindes corporativos, kits de integração, feiras e fidelização de clientes.',
      foto: 'assets/images/catalogo/item-canetas-chaveiros.jpg',
      paginaRef: 'assets/images/catalogo/item-canetas-chaveiros.jpg',
      ativo: true
    },
    {
      id: 'prod-brinde-copos-garrafas-termicas',
      nome: 'Copos e Garrafas Térmicas',
      categoria: 'Brindes Corporativos',
      badge: 'Inox Térmico • Gravação a Laser',
      especificacao: 'Aço Inox com parede dupla a vácuo • Conserva quente até 6h e frio até 12h',
      descricao: 'Copos térmicos tipo tumbler e garrafas térmicas em aço inoxidável com isolamento a vácuo e parede dupla. Personalização em gravação a laser permanente de altíssima precisão ou impressão DTF UV colorida com verniz. O brinde corporativo e presente executivo mais desejado do mercado.',
      foto: 'assets/images/catalogo/item-copos-garrafas-termicas.jpg',
      paginaRef: 'assets/images/catalogo/item-copos-garrafas-termicas.jpg',
      ativo: true
    },
    {
      id: 'prod-brinde-kit',
      nome: 'Kit Corporativo de Boas-Vindas (Onboarding)',
      categoria: 'Brindes Corporativos',
      badge: 'Kit Completo',
      especificacao: 'Garrafa térmica, caneca, caderno moleskine e caneta',
      descricao: 'Conjunto executivo para encantar clientes VIP e novos colaboradores. Embalagem personalizada e acabamento alinhado à sua marca.',
      foto: 'assets/images/catalogo/item-kit-boas-vindas.jpg',
      paginaRef: 'assets/images/catalogo/item-kit-boas-vindas.jpg',
      ativo: true
    },
    {
      id: 'prod-kits-corporativos',
      nome: 'Kits Corporativos Executivos em Caixa Luxo',
      categoria: 'Kits Corporativos',
      badge: 'Alto Padrão',
      especificacao: 'Caixa cartonada personalizada com copo térmico, caderno e caneta',
      descricao: 'Encante clientes especiais e parceiros com kits de boas-vindas sofisticados que transmitem valor e prestígio.',
      foto: 'assets/images/catalogo/item-kit-boas-vindas.jpg',
      paginaRef: 'assets/images/catalogo/item-kit-boas-vindas.jpg',
      ativo: true
    },
    {
      id: 'prod-caneca-ceramica',
      nome: 'Canecas de Cerâmica Personalizadas',
      categoria: 'Canecas Personalizadas',
      badge: 'Sem Pedido Mínimo',
      especificacao: 'Cerâmica Resinada AAA 325ml • Sublimação Total',
      descricao: 'Canecas personalizadas com alto brilho e fidelidade de cor. Não desbota no micro-ondas e lava-louças.',
      foto: 'assets/images/catalogo/cat-canecas.jpg',
      paginaRef: 'assets/images/catalogo/personalizacao-sublimacao-transfer-3d.png',
      ativo: true
    },
    {
      id: 'prod-fachadas-comerciais',
      nome: 'Fachadas Comerciais & Letra Caixa',
      categoria: 'Identidade Visual',
      badge: 'Estrutura Completa',
      especificacao: 'ACM com recorte computadorizado e iluminação em LED',
      descricao: 'Projetos sob medida para destacar sua empresa com imponência e acabamento de alto padrão comercial.',
      foto: 'assets/images/catalogo/cat-fachadas.jpg',
      paginaRef: 'assets/images/catalogo/produtos-grafica-comunicacao-visual.png',
      publico: 'terceirizado',
      ativo: true
    },
    {
      id: 'prod-uniformes-profissionais',
      nome: 'Uniformes Corporativos & Camisas Polo',
      categoria: 'Uniformes',
      badge: 'Linha Corporativa',
      especificacao: 'Malha Piquet ou Dry Fit com DTF têxtil ou bordado',
      descricao: 'Identidade e padrão para a sua equipe. Peças confortáveis, resistentes ao desgaste e com caimento moderno.',
      foto: 'assets/images/catalogo/item-textil-camisetas.png',
      paginaRef: 'assets/images/catalogo/produtos-textil-dtf.png',
      ativo: true
    },
    {
      id: 'prod-presentes-afetivos',
      nome: 'Presentes Personalizados Afetivos',
      categoria: 'Presentes Personalizados',
      badge: 'Presente Exclusivo',
      especificacao: 'Porta-retrato em madeira, caneca e almofada coração',
      descricao: 'Presente inesquecível para datas especiais, namorados, aniversários e lembranças familiares com acabamento impecável.',
      foto: 'assets/images/catalogo/cat-presentes.jpg',
      paginaRef: 'assets/images/catalogo/personalizacao-sublimacao-transfer-3d.png',
      ativo: true
    },
    {
      id: 'prod-decor-almofada',
      nome: 'Decoração Personalizada & Almofadas',
      categoria: 'Decoração Personalizada',
      badge: 'Design de Interiores',
      especificacao: 'Linho rústico premium 40x40 cm com estampa digital e cachepot',
      descricao: 'Personalização elegante para ambientes corporativos, recepções e residências. Toque macio e enchimento anti-alérgico.',
      foto: 'assets/images/catalogo/cat-decoracao.jpg',
      paginaRef: 'assets/images/catalogo/personalizacao-sublimacao-transfer-3d.png',
      ativo: true
    },
    {
      id: 'prod-papelaria-caderno',
      nome: 'Papelaria Personalizada & Cadernos Corporativos',
      categoria: 'Papelaria Personalizada',
      badge: 'Papelaria Nobre',
      especificacao: 'Cadernos capa dura, canetas metálicas e blocos de anotações',
      descricao: 'Apresentação refinada para conferências, reuniões e uso corporativo do dia a dia com a sua marca gravada a laser ou DTF UV.',
      foto: 'assets/images/catalogo/item-cartao-visita.png',
      paginaRef: 'assets/images/catalogo/produtos-grafica-comunicacao-visual.png',
      ativo: true
    },
    {
      id: 'terc-vinil-metro',
      nome: 'Adesivo Vinil Brilho ou Fosco, Sem Corte',
      categoria: 'Vinil por Metro Quadrado',
      badge: 'Metro Quadrado m²',
      especificacao: 'Bobinas até 1.500 mm • Impressão Eco Solvente Brilho ou Fosco',
      descricao: 'Vinil adesivo impresso em alta definição sem corte de contorno, fornecido em rolo contínuo ou refilado no esquadro. Perfeito para vitrines, placas, painéis e envelopamentos comerciais.',
      foto: 'assets/images/catalogo/item-vinil-sem-corte.jpg',
      paginaRef: 'assets/images/catalogo/item-vinil-sem-corte.jpg',
      publico: 'terceirizado',
      ativo: true
    },
    {
      id: 'terc-vinil-corte-eletronico',
      nome: 'Adesivo Vinil Brilho ou Fosco + Corte Eletrônico',
      categoria: 'Vinil por Metro Quadrado',
      badge: 'Meio-Corte Digital',
      especificacao: 'Impressão digital Eco Solvente + Corte eletrônico computadorizado (kiss-cut)',
      descricao: 'Adesivos e rótulos personalizados recortados eletronicamente no contorno exato do seu projeto. Destaque rápido e prático para etiquetas, brindes e sinalizações.',
      foto: 'assets/images/catalogo/item-vinil-corte-eletronico.jpg',
      paginaRef: 'assets/images/catalogo/item-vinil-corte-eletronico.jpg',
      publico: 'terceirizado',
      ativo: true
    },
    {
      id: 'terc-lona-sem-acabamento',
      nome: 'Lona Sem Acabamento',
      categoria: 'Vinil por Metro Quadrado',
      badge: 'Grande Formato',
      especificacao: 'Lona Frontlight 440g/280g • Refilada no esquadro (sem madeira ou ilhós)',
      descricao: 'Impressão digital em grande formato para painéis, fachadas, outdoors e estruturas metálicas. Alta durabilidade e fidelidade de cores para revendedores.',
      foto: 'assets/images/catalogo/item-lona-sem-acabamento.jpg',
      paginaRef: 'assets/images/catalogo/item-lona-sem-acabamento.jpg',
      publico: 'terceirizado',
      ativo: true
    },
    {
      id: 'terc-lona-com-acabamento',
      nome: 'Lona com Acabamento (Madeira ou Ilhós)',
      categoria: 'Vinil por Metro Quadrado',
      badge: 'Pronta para Uso',
      especificacao: 'Madeira roliça com ponteiras e corda para pendurar OU ilhós metálicos nas bordas',
      descricao: 'Banners e faixas promocionais completas e prontas para instalar. Acabamento reforçado com costura/solda térmica, madeira ou ilhós antiferrugem.',
      foto: 'assets/images/catalogo/item-lona-com-acabamento.jpg',
      paginaRef: 'assets/images/catalogo/item-lona-com-acabamento.jpg',
      publico: 'terceirizado',
      ativo: true
    },
    {
      id: 'terc-vinil-perfurado-transparente-sem-corte',
      nome: 'Perfurado ou Transparente Sem Corte',
      categoria: 'Vinil por Metro Quadrado',
      badge: 'Vidros & Vitrines',
      especificacao: 'Vinil microperfurado One-Way Vision ou transparente cristal sem corte',
      descricao: 'Películas especiais para vidros, vitrines e traseiras de veículos. O perfurado garante privacidade interna e visual externo impecável; o transparente entrega efeito translúcido nobre.',
      foto: 'assets/images/catalogo/item-perfurado-transparente-sem-corte.jpg',
      paginaRef: 'assets/images/catalogo/item-perfurado-transparente-sem-corte.jpg',
      publico: 'terceirizado',
      ativo: true
    },
    {
      id: 'terc-vinil-transparente-corte-eletronico',
      nome: 'Transparente + Corte Eletrônico',
      categoria: 'Vinil por Metro Quadrado',
      badge: 'Cristal Recortado',
      especificacao: 'Vinil transparente de alto brilho + Recorte de contorno digital computadorizado',
      descricao: 'Adesivos transparentes com corte de precisão no contorno exato da sua arte. Efeito no-label sofisticado para embalagens, cosméticos, vidros e produtos premium.',
      foto: 'assets/images/catalogo/item-transparente-corte-eletronico.jpg',
      paginaRef: 'assets/images/catalogo/item-transparente-corte-eletronico.jpg',
      publico: 'terceirizado',
      ativo: true
    },
    {
      id: 'terc-vinil-avery-automotivo',
      nome: 'Adesivo Vinil Avery Automotivo',
      categoria: 'Vinil por Metro Quadrado',
      badge: 'Linha Cast Automotiva',
      especificacao: 'Película automotiva Avery Dennison com canais anti-bolhas Easy Apply',
      descricao: 'Vinil automotivo importado de altíssima performance para envelopamento de veículos, frotas e embarcações. Excelente moldabilidade em curvas profundas e longa vida útil.',
      foto: 'assets/images/catalogo/item-vinil-avery-automotivo.jpg',
      paginaRef: 'assets/images/catalogo/item-vinil-avery-automotivo.jpg',
      publico: 'terceirizado',
      ativo: true
    },
    {
      id: 'terc-vinil-avery-corte-eletronico',
      nome: 'Adesivo Vinil Avery Corte Eletrônico',
      categoria: 'Vinil por Metro Quadrado',
      badge: 'Automotivo Recortado',
      especificacao: 'Avery Dennison cortado em plotter de alta precisão + Máscara de transferência',
      descricao: 'Gráficos esportivos, faixas automotivas e logotipos de frotas cortados em vinil Avery Dennison, já depilados e preparados com máscara de transferência para aplicação direta.',
      foto: 'assets/images/catalogo/item-vinil-avery-corte-eletronico.jpg',
      paginaRef: 'assets/images/catalogo/item-vinil-avery-corte-eletronico.jpg',
      publico: 'terceirizado',
      ativo: true
    },
    {
      id: 'terc-dtf-textil-metro',
      nome: 'DTF Têxtil por Metro Linear (580 mm)',
      categoria: 'DTF Têxtil',
      badge: 'Produção B2B',
      especificacao: '580 mm de largura útil • Pronto para prensar com pó termofusível',
      descricao: 'Impressão digital em filme DTF têxtil contínuo em altíssima resolução com tinta branca de alta densidade. Aplique com facilidade em algodão, poliéster, jeans ou tecidos mistos.',
      foto: 'assets/images/catalogo/item-maquina-dtf-textil.png',
      paginaRef: 'assets/images/catalogo/personalizacao-dtf-laser-textil.png',
      publico: 'terceirizado',
      ativo: true
    },
    {
      id: 'terc-dtf-filme-60cm',
      nome: 'Bobina de Filme DTF Têxtil (Largura 60cm)',
      categoria: 'DTF Têxtil',
      badge: 'Insumo B2B',
      especificacao: 'Bobina 60cm x 100m • Filme PET Premium • Descasque a Quente/Frio',
      descricao: 'Bobina de filme DTF têxtil de 60cm de largura com tratamento antiestático e camada de absorção de tinta uniforme. Garante cores vibrantes, alta definição e toque macio nas estampas.',
      foto: 'assets/images/catalogo/item-filme-dtf-textil-60cm.jpg',
      paginaRef: 'assets/images/catalogo/item-filme-dtf-textil-60cm.jpg',
      publico: 'terceirizado',
      ativo: true
    },
    {
      id: 'terc-dtf-po-tpu',
      nome: 'Pó TPU para DTF Têxtil (Poliamida Termofusível)',
      categoria: 'DTF Têxtil',
      badge: 'Alta Aderência',
      especificacao: 'Embalagem 1kg • Granulometria Média/Fina • Toque Macio e Elástico',
      descricao: 'Pó termofusível de poliuretano (TPU/poliamida) de alta pureza para cura e fixação térmica de estampas DTF têxteis. Oferece alta elasticidade, resistência a lavagens e toque suave no tecido.',
      foto: 'assets/images/catalogo/item-po-tpu-dtf-textil.jpg',
      paginaRef: 'assets/images/catalogo/item-po-tpu-dtf-textil.jpg',
      publico: 'terceirizado',
      ativo: true
    },
    {
      id: 'terc-dtf-uv-metro',
      nome: 'DTF UV Adesivo por Metro (com Verniz & Relevo)',
      categoria: 'DTF UV',
      badge: 'Alta Aderência',
      especificacao: 'Impressão UV + Verniz localizado com relevo tátil',
      descricao: 'Adesivos rígidos permanentes em filme DTF UV para aplicação direta em copos térmicos, plásticos, vidros, acrílicos e metais. Sem necessidade de queima térmica ou prensagem.',
      foto: 'assets/images/catalogo/tech-dtf-uv.png',
      paginaRef: 'assets/images/catalogo/personalizacao-dtf-laser-textil.png',
      publico: 'terceirizado',
      ativo: true
    },
    {
      id: 'terc-dtf-uv-filme-30cm',
      nome: 'Bobina de Filme DTF UV (Largura 30cm)',
      categoria: 'DTF UV',
      badge: 'Filme A+B Cristal',
      especificacao: 'Bobina 30cm x 100m • Filme de Impressão (A) + Máscara de Aplicação (B)',
      descricao: 'Conjunto de filme DTF UV cristal de 30cm para transferência direta a frio em substratos rígidos (copos térmicos, vidros, acrílicos, metais e plásticos). Excelente transparência e fixação permanente.',
      foto: 'assets/images/catalogo/item-filme-dtf-uv-30cm.jpg',
      paginaRef: 'assets/images/catalogo/item-filme-dtf-uv-30cm.jpg',
      publico: 'terceirizado',
      ativo: true
    },
    {
      id: 'terc-gravacao-laser-servico',
      nome: 'Gravação a Laser Industrial por Demanda',
      categoria: 'Gravação a Laser',
      badge: 'Serviço Terceirizado',
      especificacao: 'Preço especial por peça ou lote em metais e copos do cliente',
      descricao: 'Traga os copos térmicos, garrafas, facas ou peças metálicas do seu cliente e terceirize apenas a gravação a laser permanente de fibra óptica com precisão milimétrica e entrega ágil.',
      foto: 'assets/images/catalogo/tech-fiber-laser.png',
      paginaRef: 'assets/images/catalogo/personalizacao-dtf-laser-textil.png',
      publico: 'terceirizado',
      ativo: true
    },
    {
      id: 'terc-corte-cnc-servico',
      nome: 'Corte CNC Laser em Acrílico e MDF',
      categoria: 'Gravação a Laser',
      badge: 'Usinagem & Corte',
      especificacao: 'Área útil 60x40 cm • Acrílico até 10mm, MDF até 6mm',
      descricao: 'Corte contornado ultra preciso com bordas polidas para letras caixa, troféus, displays de balcão e peças industriais personalizadas sob medida.',
      foto: 'assets/images/catalogo/item-cnc-laser-60x40.jpg',
      paginaRef: 'assets/images/catalogo/maquinas-dtf-textil-uv-laser.png',
      publico: 'terceirizado',
      ativo: true
    },
    {
      id: 'terc-banner-revenda',
      nome: 'Banners e Lonas Impressas para Revenda',
      categoria: 'Identidade Visual',
      badge: 'Tabela Gráfica',
      especificacao: 'Lona 440g com acabamento em madeira/tubo e corda ou ilhós',
      descricao: 'Produção em grande formato para gráficas rápidas, agências e revendedores entregarem aos seus clientes finais com excelente margem comercial.',
      foto: 'assets/images/catalogo/item-banners.png',
      paginaRef: 'assets/images/catalogo/produtos-grafica-comunicacao-visual.png',
      publico: 'terceirizado',
      ativo: true
    }
  ];

  const CLIENT_CATEGORIES = [
    'Gráfica Rápida',
    'Identidade Visual',
    'Brindes Corporativos',
    'Canecas Personalizadas',
    'Kits Corporativos',
    'Uniformes',
    'Presentes Personalizados',
    'Decoração Personalizada',
    'Papelaria Personalizada',
    'Comunicação Visual, Plotagem de Vitrines e Fachadas',
    'Plotagem Veicular',
    'Tecnologias'
  ];

  const TERCEIRIZADO_CATEGORIES = [
    'Gráfica Rápida',
    'Identidade Visual',
    'DTF Têxtil',
    'DTF UV',
    'Vinil por Metro Quadrado',
    'Gravação a Laser',
    'Comunicação Visual, Plotagem de Vitrines e Fachadas',
    'Estrutura de Máquinas',
    'Tecnologias'
  ];

  // Helper de checagem de perfil
  function isItemAllowedForProfile(item, profile) {
    if (!profile || profile === 'todos') return true;

    // Perfil Terceirizado: SOMENTE itens de revenda/insumos/serviços e maquinário/tecnologias
    if (profile === 'terceirizado') {
      if (item.publico === 'terceirizado') return true;
      if (item.publico === 'cliente') return false;
      const b2bCategories = [
        'Gráfica Rápida',
        'Identidade Visual',
        'DTF Têxtil',
        'DTF UV',
        'Vinil por Metro Quadrado',
        'Gravação a Laser',
        'Comunicação Visual, Plotagem de Vitrines e Fachadas',
        'Estrutura de Máquinas',
        'Tecnologias'
      ];
      if (b2bCategories.includes(item.categoria)) return true;
      if (item.id && (item.id.startsWith('terc-') || item.id.startsWith('maq-') || item.id.startsWith('prod-graf-'))) {
        return true;
      }
      return false;
    }

    // Perfil Cliente Final / Empresa: Produtos personalizados, brindes, uniformes, fachadas, etc. (sem maquinário industrial)
    if (profile === 'cliente') {
      if (item.publico === 'terceirizado') return false;
      if (item.id && (item.id.startsWith('terc-') || item.id.startsWith('maq-'))) return false;
      if (item.categoria === 'Vinil por Metro Quadrado' || item.categoria === 'Estrutura de Máquinas' || item.categoria === 'DTF Têxtil' || item.categoria === 'DTF UV') return false;
      return true;
    }

    return true;
  }

  // Helper global para carregar itens garantindo persistência ou fallback
  window.GordinhoCatalogData = {
    STORAGE_KEY: STORAGE_KEY,
    DEFAULT_CATEGORIES: DEFAULT_CATEGORIES,
    CLIENT_CATEGORIES: CLIENT_CATEGORIES,
    TERCEIRIZADO_CATEGORIES: TERCEIRIZADO_CATEGORIES,
    DEFAULT_ITEMS: DEFAULT_CATALOG_ITEMS,
    isItemAllowedForProfile: isItemAllowedForProfile,

    getItems: function (profile) {
      let items = [];
      try {
        const storage = typeof window !== 'undefined' && window.localStorage ? window.localStorage : (typeof localStorage !== 'undefined' ? localStorage : null);
        const raw = storage ? storage.getItem(STORAGE_KEY) : null;
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const existingIds = new Set(parsed.map((i) => i.id));
            const missing = DEFAULT_CATALOG_ITEMS.filter((d) => !existingIds.has(d.id));
            let photoUpdated = false;
            const updatedItems = parsed.map((item) => {
              const def = DEFAULT_CATALOG_ITEMS.find((d) => d.id === item.id);
              if (def && (item.foto !== def.foto || item.publico !== def.publico || item.categoria !== def.categoria || item.nome !== def.nome || item.especificacao !== def.especificacao)) {
                photoUpdated = true;
                return { ...item, foto: def.foto, paginaRef: def.paginaRef, publico: def.publico, categoria: def.categoria, nome: def.nome, especificacao: def.especificacao, descricao: def.descricao, badge: def.badge };
              }
              return item;
            });
            if (missing.length > 0 || photoUpdated) {
              items = [...updatedItems, ...missing];
              if (storage) storage.setItem(STORAGE_KEY, JSON.stringify(items));
            } else {
              items = parsed;
            }
          }
        }
      } catch (e) {
        console.warn('Erro ao ler itens do catálogo no localStorage:', e);
      }
      if (!items || items.length === 0) {
        items = JSON.parse(JSON.stringify(DEFAULT_CATALOG_ITEMS));
      }
      let result = items;
      if (profile) {
        result = items.filter((item) => isItemAllowedForProfile(item, profile));
      }
      // Sempre iniciar com os itens da Comunicação / Identidade Visual / Gráfica Rápida e colocar Tecnologias ao final
      const comVisual = [];
      const middleItems = [];
      const tecnologias = [];
      result.forEach(function (item) {
        if (item.categoria === 'Gráfica Rápida' || item.categoria === 'Identidade Visual' || item.categoria === 'Comunicação Visual, Plotagem de Vitrines e Fachadas' || (item.categoria && item.categoria.startsWith('Comunicação Visual'))) {
          comVisual.push(item);
        } else if (item.categoria === 'Tecnologias') {
          tecnologias.push(item);
        } else {
          middleItems.push(item);
        }
      });
      return [...comVisual, ...middleItems, ...tecnologias];
    },

    saveItems: function (items) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        // Disparar evento para mesma aba
        window.dispatchEvent(new CustomEvent('gordinho:catalog-updated', { detail: { items } }));
        return true;
      } catch (e) {
        console.error('Erro ao salvar itens no localStorage:', e);
        return false;
      }
    },

    resetToDefault: function () {
      try {
        localStorage.removeItem(STORAGE_KEY);
        window.dispatchEvent(new CustomEvent('gordinho:catalog-updated', { detail: { items: DEFAULT_CATALOG_ITEMS } }));
        return true;
      } catch (e) {
        console.error('Erro ao restaurar catálogo:', e);
        return false;
      }
    }
  };

  window.DEFAULT_CATALOG_ITEMS = DEFAULT_CATALOG_ITEMS;
  window.CATALOG_CATEGORIES = DEFAULT_CATEGORIES;
  window.CLIENT_CATEGORIES = CLIENT_CATEGORIES;
  window.TERCEIRIZADO_CATEGORIES = TERCEIRIZADO_CATEGORIES;
})();
