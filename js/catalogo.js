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
      publico: 'terceirizado'
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
      publico: 'terceirizado'
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
      publico: 'terceirizado'
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
      publico: 'terceirizado'
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
      publico: 'terceirizado'
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
      publico: 'terceirizado'
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
      publico: 'terceirizado'
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
      publico: 'terceirizado'
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
      id: 'prod-brinde-canetas-chaveiros',
      nome: 'Canetas e Chaveiros',
      categoria: 'Brindes Corporativos',
      badge: 'Gravação a Laser & UV',
      especificacao: 'Canetas metálicas executivas e chaveiros em couro/metal gravados a laser',
      descricao: 'Conjunto executivo de canetas metálicas de alta precisão e chaveiros sofisticados personalizados com a logo da Gordinho ou da sua empresa. Ideal para brindes corporativos, kits de integração, feiras e fidelização de clientes.',
      foto: 'assets/images/catalogo/item-canetas-chaveiros.jpg',
      paginaRef: 'assets/images/catalogo/item-canetas-chaveiros.jpg'
    },
    {
      id: 'prod-brinde-copos-garrafas-termicas',
      nome: 'Copos e Garrafas Térmicas',
      categoria: 'Brindes Corporativos',
      badge: 'Inox Térmico • Gravação a Laser',
      especificacao: 'Aço Inox com parede dupla a vácuo • Conserva quente até 6h e frio até 12h',
      descricao: 'Copos térmicos tipo tumbler e garrafas térmicas em aço inoxidável com isolamento a vácuo e parede dupla. Personalização em gravação a laser permanente de altíssima precisão ou impressão DTF UV colorida com verniz. O brinde corporativo e presente executivo mais desejado do mercado.',
      foto: 'assets/images/catalogo/item-copos-garrafas-termicas.jpg',
      paginaRef: 'assets/images/catalogo/item-copos-garrafas-termicas.jpg'
    },
    {
      id: 'prod-brinde-kit',
      nome: 'Kit Corporativo de Boas-Vindas (Onboarding)',
      categoria: 'Brindes Corporativos',
      badge: 'Kit Completo',
      especificacao: 'Garrafa térmica, caneca, caderno moleskine e caneta',
      descricao: 'Conjunto executivo para encantar clientes VIP e novos colaboradores. Embalagem personalizada e acabamento alinhado à sua marca.',
      foto: 'assets/images/catalogo/item-kit-boas-vindas.jpg',
      paginaRef: 'assets/images/catalogo/item-kit-boas-vindas.jpg'
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

  const CATALOG_STORAGE_KEY = 'gordinho-catalog-items';

  function getInitialProfile() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      let p = (urlParams.get('perfil') || urlParams.get('tipo') || '').toLowerCase();
      if (!p && window.location.hash) {
        const hash = window.location.hash.toLowerCase().replace('#', '');
        if (hash.includes('terceirizado') || hash.includes('revenda') || hash.includes('b2b')) p = 'terceirizado';
        if (hash.includes('cliente') || hash.includes('varejo') || hash.includes('b2c')) p = 'cliente';
      }
      if (p === 'terceirizado' || p === 'b2b' || p === 'revenda') return 'terceirizado';
      if (p === 'cliente' || p === 'b2c' || p === 'varejo') return 'cliente';
      const saved = sessionStorage.getItem('gordinho-profile');
      if (saved === 'terceirizado' || saved === 'cliente') return saved;
    } catch (e) {}
    return 'cliente';
  }

  function sortCatalogItems(items) {
    if (!Array.isArray(items)) return [];
    const comVisual = [];
    const middleItems = [];
    const tecnologias = [];
    items.forEach(function (item) {
      if (!item) return;
      if (item.categoria === 'Gráfica Rápida' || item.categoria === 'Identidade Visual' || item.categoria === 'Comunicação Visual, Plotagem de Vitrines e Fachadas' || (item.categoria && item.categoria.startsWith('Comunicação Visual'))) {
        comVisual.push(item);
      } else if (item.categoria === 'Tecnologias') {
        tecnologias.push(item);
      } else {
        middleItems.push(item);
      }
    });
    return [...comVisual, ...middleItems, ...tecnologias];
  }
  const sortItemsForCatalog = sortCatalogItems;

  function loadCatalogItems(profile) {
    const prof = profile || (state && state.profile ? state.profile : getInitialProfile());
    let items = [];
    if (window.GordinhoCatalogData && typeof window.GordinhoCatalogData.getItems === 'function') {
      items = window.GordinhoCatalogData.getItems(prof).filter(function (i) { return i.ativo !== false; });
      return sortCatalogItems(items);
    }
    try {
      const raw = localStorage.getItem(CATALOG_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          items = parsed.filter(function (i) { 
            if (i.ativo === false) return false;
            if (window.GordinhoCatalogData && typeof window.GordinhoCatalogData.isItemAllowedForProfile === 'function') {
              return window.GordinhoCatalogData.isItemAllowedForProfile(i, prof);
            }
            return true;
          });
          return sortCatalogItems(items);
        }
      }
    } catch (e) {}
    const fallback = window.DEFAULT_CATALOG_ITEMS || CATALOG_ITEMS;
    items = fallback.filter(function (i) { 
      if (i.ativo === false) return false;
      if (window.GordinhoCatalogData && typeof window.GordinhoCatalogData.isItemAllowedForProfile === 'function') {
        return window.GordinhoCatalogData.isItemAllowedForProfile(i, prof);
      }
      return true;
    });
    return sortCatalogItems(items);
  }

  const initialProfile = getInitialProfile();
  const initialItems = loadCatalogItems(initialProfile);

  // Estado do catálogo
  const state = {
    profile: initialProfile,
    items: initialItems,
    itemsById: new Map(initialItems.map((item) => [item.id, item])),
    filteredItems: initialItems,
    activeCategory: 'todos',
    searchTerm: '',
    visibleCount: PAGE_SIZE,
    cart: loadCart()
  };

  function reloadCatalogItems() {
    const fresh = loadCatalogItems(state.profile);
    state.items = fresh;
    state.itemsById = new Map(fresh.map((item) => [item.id, item]));
    if (els.categoryFilters) renderCategoryFilters();
    if (els.grid) applyFilters();
  }

  function setProfile(newProfile, skipUrl) {
    if (!newProfile || (newProfile !== 'cliente' && newProfile !== 'terceirizado')) return;
    state.profile = newProfile;
    try {
      sessionStorage.setItem('gordinho-profile', newProfile);
      if (!skipUrl) {
        const url = new URL(window.location);
        url.searchParams.set('perfil', newProfile);
        window.history.replaceState(null, '', url);
      }
    } catch (e) {}

    // Atualiza tabs do switcher
    if (els.tabCliente && els.tabTerceirizado) {
      if (newProfile === 'cliente') {
        els.tabCliente.classList.add('active');
        els.tabCliente.setAttribute('aria-selected', 'true');
        els.tabTerceirizado.classList.remove('active');
        els.tabTerceirizado.setAttribute('aria-selected', 'false');
      } else {
        els.tabTerceirizado.classList.add('active');
        els.tabTerceirizado.setAttribute('aria-selected', 'true');
        els.tabCliente.classList.remove('active');
        els.tabCliente.setAttribute('aria-selected', 'false');
      }
    }

    // Atualiza Hero e seções visíveis
    if (newProfile === 'cliente') {
      if (els.heroBadge) els.heroBadge.textContent = 'Atendimento Varejo & Corporativo';
      if (els.heroTitle) {
        els.heroTitle.innerHTML = 'PERSONALIZE<br><span class="headline-gold">TUDO COM</span><br><span class="headline-gold">A GENTE!</span>';
      }
      if (els.heroDesc) {
        els.heroDesc.textContent = 'Qualidade, criatividade e soluções para você, sua empresa e seu negócio!';
      }
      if (els.heroCtaText) els.heroCtaText.textContent = 'CONHEÇA NOSSOS PRODUTOS';
      if (els.heroCtaBtn) els.heroCtaBtn.setAttribute('href', '#produtos-servicos');
      if (els.heroEnergyBadge) {
        els.heroEnergyBadge.innerHTML = '<span class="energy-sub">SUA IDEIA</span><span class="energy-title">AQUI GANHA</span><span class="energy-highlight">VIDA!</span>';
      }
      if (els.secProdutos) els.secProdutos.style.display = 'block';
      if (els.secTerceirizados) els.secTerceirizados.style.display = 'none';
      if (els.navProdutos) els.navProdutos.style.display = '';
      if (els.navTerceirizados) els.navTerceirizados.style.display = 'none';
      if (els.b2bInviteBanner) els.b2bInviteBanner.hidden = true;
    } else {
      if (els.heroBadge) els.heroBadge.textContent = 'Tabela Especial Direto de Fábrica B2B';
      if (els.heroTitle) {
        els.heroTitle.innerHTML = 'TERCEIRIZAÇÃO &amp;<br><span class="headline-gold">PRODUÇÃO INDUSTRIAL</span><br><span class="headline-gold">DIRETO DE FÁBRICA!</span>';
      }
      if (els.heroDesc) {
        els.heroDesc.textContent = 'Sua parceira industrial em Itajaí/SC: fornecemos DTF têxtil, DTF UV, adesivos por m², corte e gravação a laser com tabela especial para revendedores!';
      }
      if (els.heroCtaText) els.heroCtaText.textContent = 'VER PRODUTOS &amp; TABELA B2B';
      if (els.heroCtaBtn) els.heroCtaBtn.setAttribute('href', '#terceirizados');
      if (els.heroEnergyBadge) {
        els.heroEnergyBadge.innerHTML = '<span class="energy-sub">PARCERIA B2B</span><span class="energy-title">SUA MARCA</span><span class="energy-highlight">NOSSA FÁBRICA!</span>';
      }
      if (els.secProdutos) els.secProdutos.style.display = 'none';
      if (els.secTerceirizados) els.secTerceirizados.style.display = 'block';
      if (els.navProdutos) els.navProdutos.style.display = 'none';
      if (els.navTerceirizados) els.navTerceirizados.style.display = '';
      if (els.b2bInviteBanner) els.b2bInviteBanner.hidden = true;
    }

    // Recarrega itens filtrados para o perfil
    const fresh = loadCatalogItems(newProfile);
    state.items = fresh;
    state.itemsById = new Map(fresh.map((item) => [item.id, item]));
    state.activeCategory = 'todos';
    state.searchTerm = '';
    state.visibleCount = PAGE_SIZE;
    if (els.search) els.search.value = '';

    renderCategoryFilters();
    applyFilters();
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
    els.cartContinueBrowsing = document.getElementById('cart-continue-browsing');
    els.cartCatalogHint = document.getElementById('cart-catalog-hint');
    els.btnEmptyExplore = document.getElementById('btn-empty-explore');
    els.summaryCount = document.getElementById('summary-items-count');
    els.lightbox = document.getElementById('catalog-lightbox');
    els.lightboxImg = document.getElementById('lightbox-img');
    els.lightboxTitle = document.getElementById('lightbox-title');
    els.lightboxClose = document.getElementById('lightbox-close');
    els.searchForm = document.getElementById('header-search-form');
    els.activeCategoryTitle = document.getElementById('active-category-title');
    els.catalogCountBadge = document.getElementById('catalog-count-badge');
    els.btnClearSearch = document.getElementById('btn-clear-search');

    // Modal de Expansão de Detalhes do Produto
    els.productModal = document.getElementById('product-modal');
    els.productModalCard = document.getElementById('product-modal-card');
    els.productModalClose = document.getElementById('product-modal-close');
    els.modalItemImg = document.getElementById('modal-item-img');
    els.modalItemBadge = document.getElementById('modal-item-badge');
    els.modalItemCat = document.getElementById('modal-item-cat');
    els.modalItemTitle = document.getElementById('modal-item-title');
    els.modalItemSpecWrap = document.getElementById('modal-item-spec-wrap');
    els.modalItemSpec = document.getElementById('modal-item-spec');
    els.modalItemDesc = document.getElementById('modal-item-desc');
    els.modalItemStatusText = document.getElementById('modal-item-status-text');
    els.modalQtyStepper = document.getElementById('modal-qty-stepper');
    els.modalQtyVal = document.getElementById('modal-qty-val');
    els.modalQtyMinus = document.getElementById('modal-qty-minus');
    els.modalQtyPlus = document.getElementById('modal-qty-plus');
    els.modalBtnAdd = document.getElementById('modal-btn-add');
    els.modalBtnAddLabel = document.getElementById('modal-btn-add-label');
    els.modalBtnWhatsapp = document.getElementById('modal-btn-whatsapp');

    // Elementos de Perfil e Seções
    els.tabCliente = document.getElementById('tab-profile-cliente');
    els.tabTerceirizado = document.getElementById('tab-profile-terceirizado');
    els.btnSwitchToB2b = document.getElementById('btn-switch-to-b2b');
    els.heroBadge = document.getElementById('hero-profile-badge');
    els.heroTitle = document.getElementById('hero-main-title');
    els.heroDesc = document.getElementById('hero-description');
    els.heroCtaText = document.getElementById('hero-cta-text');
    els.heroCtaBtn = document.getElementById('hero-cta-btn');
    els.secProdutos = document.getElementById('produtos-servicos');
    els.secTerceirizados = document.getElementById('terceirizados');
    els.navProdutos = document.getElementById('nav-item-produtos');
    els.navTerceirizados = document.getElementById('nav-item-terceirizados');
    els.b2bInviteBanner = document.getElementById('b2b-invite-banner');
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

  function isDesktopView() {
    return window.innerWidth >= 992;
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

    // Divide a tela colocando o carrinho em evidência à direita sem bloquear o catálogo
    openCart({ triggerId: item.id });
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

  function openCart(options = {}) {
    const isDesktop = isDesktopView();

    document.body.classList.add('cart-split-open');
    if (els.cartDrawer) els.cartDrawer.classList.add('open');

    if (isDesktop) {
      // Modo Split Screen: o catálogo ao lado continua livre e interativo
      if (els.cartBackdrop) els.cartBackdrop.classList.remove('open');
      document.body.style.overflow = '';
    } else {
      // Mobile: gaveta sobreposta tradicional
      if (els.cartBackdrop) els.cartBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    // Destaque visual suave no item que acabou de entrar
    if (options.triggerId && els.cartItems) {
      requestAnimationFrame(() => {
        const selector = `[data-id="${escapeAttr(options.triggerId)}"]`;
        const target = els.cartItems.querySelector(selector);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          target.classList.remove('just-added');
          void target.offsetWidth;
          target.classList.add('just-added');
          setTimeout(() => target.classList.remove('just-added'), 1400);
        }
      });
    }
  }

  function closeCart() {
    document.body.classList.remove('cart-split-open');
    if (els.cartDrawer) els.cartDrawer.classList.remove('open');
    if (els.cartBackdrop) els.cartBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  function toggleCart() {
    if (els.cartDrawer && els.cartDrawer.classList.contains('open')) {
      closeCart();
    } else {
      openCart();
    }
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

  // Modal de Detalhes do Produto (Card Expandido)
  let currentModalItem = null;

  function openProductModal(item) {
    if (!item || !els.productModal) return;
    currentModalItem = item;

    if (els.modalItemImg) {
      els.modalItemImg.src = item.foto || 'assets/images/catalogo/cat-presentes.jpg';
      els.modalItemImg.alt = item.nome || '';
    }

    if (els.modalItemBadge) {
      if (item.badge) {
        els.modalItemBadge.textContent = item.badge;
        els.modalItemBadge.hidden = false;
      } else {
        els.modalItemBadge.hidden = true;
      }
    }

    if (els.modalItemCat) {
      els.modalItemCat.textContent = item.categoria || 'Catálogo Oficial';
    }

    if (els.modalItemTitle) {
      els.modalItemTitle.textContent = item.nome;
    }

    if (els.modalItemSpecWrap && els.modalItemSpec) {
      if (item.especificacao) {
        els.modalItemSpec.textContent = item.especificacao;
        els.modalItemSpecWrap.hidden = false;
      } else {
        els.modalItemSpecWrap.hidden = true;
      }
    }

    if (els.modalItemDesc) {
      els.modalItemDesc.textContent = item.descricao || 'Produto personalizado com máxima qualidade, acabamento refinado e entrega garantida para você ou sua empresa.';
    }

    if (els.modalItemStatusText) {
      if (item.publico === 'terceirizado') {
        els.modalItemStatusText.textContent = 'Tabela de Terceirização B2B • Direto de Fábrica';
      } else {
        els.modalItemStatusText.textContent = 'Sob Orçamento • Sem pedido mínimo';
      }
    }

    // Reset stepper da modal para 1
    if (els.modalQtyStepper && els.modalQtyVal) {
      els.modalQtyStepper.dataset.qty = '1';
      els.modalQtyVal.textContent = '1';
    }

    // Link personalizado para o WhatsApp da loja
    if (els.modalBtnWhatsapp) {
      const phone = '5547984965444';
      const perfilTxt = item.publico === 'terceirizado' ? 'Terceirizado/B2B' : 'Varejo/Personalizados';
      const msg = encodeURIComponent(`Olá! Vim pelo Catálogo Online (${perfilTxt}) e gostaria de tirar dúvidas sobre o produto: *${item.nome}* (${item.categoria}).`);
      els.modalBtnWhatsapp.href = `https://wa.me/${phone}?text=${msg}`;
    }

    // Exibe a modal com animação suave
    els.productModal.hidden = false;
    void els.productModal.offsetWidth;
    els.productModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeProductModal() {
    if (!els.productModal) return;
    els.productModal.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (!els.productModal.classList.contains('open')) {
        els.productModal.hidden = true;
      }
    }, 250);
  }

  // Filtragem e busca
  function applyFilters() {
    let result = state.items;

    if (state.activeCategory !== 'todos') {
      const targetCat = state.activeCategory.toLowerCase().trim();
      const isGraficaTarget = targetCat === 'gráfica rápida' || targetCat === 'grafica rapida';
      const isIdentidadeTarget = targetCat.includes('identidade visual');
      const isComVisualTarget = targetCat.includes('comunicação visual') || targetCat.includes('vitrine') || targetCat.includes('fachada');

      result = result.filter((item) => {
        if (!item || !item.categoria) return false;
        const itemCat = item.categoria.toLowerCase().trim();
        if (itemCat === targetCat) return true;
        if (isGraficaTarget) {
          return itemCat === 'gráfica rápida' || itemCat === 'grafica rapida';
        }
        if (isIdentidadeTarget && (itemCat.includes('identidade visual') || itemCat.includes('comunicação visual'))) {
          return true;
        }
        if (isComVisualTarget && (itemCat.includes('comunicação visual') || itemCat.includes('identidade visual') || itemCat.includes('vitrine') || itemCat.includes('fachada'))) {
          return true;
        }
        return false;
      });
    } else {
      result = sortCatalogItems(result);
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

    if (els.activeCategoryTitle) {
      if (state.activeCategory === 'todos') {
        els.activeCategoryTitle.textContent = 'Todos os Produtos & Tecnologias';
      } else {
        const targetCat = state.activeCategory.toLowerCase().trim();
        if (targetCat === 'gráfica rápida' || targetCat === 'grafica rapida') {
          els.activeCategoryTitle.textContent = 'Gráfica Rápida, Cartões, Folders & Cardápios';
        } else if (targetCat.includes('identidade visual')) {
          els.activeCategoryTitle.textContent = 'Identidade Visual, Fachadas, Vitrines & Banners';
        } else if (targetCat.includes('comunicação visual') || targetCat.includes('vitrine') || targetCat.includes('fachada')) {
          els.activeCategoryTitle.textContent = 'Comunicação Visual, Plotagem de Vitrines e Fachadas';
        } else {
          els.activeCategoryTitle.textContent = state.activeCategory;
        }
      }
    }
    if (els.catalogCountBadge) {
      const len = result.length;
      els.catalogCountBadge.textContent = `${len} ${len === 1 ? 'item disponível' : 'itens disponíveis'}`;
    }

    renderGrid();
  }

  // Renderização dos Filtros por Categoria
  function renderCategoryFilters() {
    // Categorias únicas ordenadas em ordem alfabética (pt-BR)
    const categories = Array.from(new Set(state.items.map((i) => i.categoria).filter(Boolean)))
      .sort((a, b) => (a || '').localeCompare(b || '', 'pt-BR'));
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

  // Renderização do Card de Produto/Máquina no padrão clean e moderno
  function itemCardHTML(item) {
    const badgeHTML = item.badge
      ? `<span class="card-badge">${escapeHTML(item.badge)}</span>`
      : '';
    const specHTML = item.especificacao
      ? `<div class="card-spec"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>${escapeHTML(item.especificacao)}</span></div>`
      : '';
    const descHTML = item.descricao
      ? `<p class="card-desc">${escapeHTML(item.descricao)}</p>`
      : '';

    return `
      <article class="catalog-card" data-id="${escapeAttr(item.id)}">
        <div class="card-media">
          <img src="${escapeAttr(item.foto)}" alt="${escapeAttr(item.nome)}" loading="lazy" class="card-img" onerror="this.src='assets/images/catalogo/cat-presentes.jpg'" />
          ${badgeHTML}
          <button type="button" class="btn-zoom-preview" title="Ver foto em alta resolução" data-preview="${escapeAttr(item.paginaRef)}" data-title="${escapeAttr(item.nome)}">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
        </div>
        <div class="card-body">
          <div class="card-category-tag">${escapeHTML(item.categoria)}</div>
          <h3 class="card-title">${escapeHTML(item.nome)}</h3>
          ${specHTML}
          ${descHTML}
          <div class="card-status-pill">
            <span class="status-pulse-dot"></span>
            <span>Sob Orçamento &bull; Sem pedido mínimo</span>
          </div>
        </div>
        <div class="card-footer">
          <div class="qty-stepper" data-qty="1">
            <button type="button" class="qty-btn qty-minus" aria-label="Diminuir quantidade">−</button>
            <span class="qty-value">1</span>
            <button type="button" class="qty-btn qty-plus" aria-label="Aumentar quantidade">+</button>
          </div>
          <button type="button" class="btn-card-add" aria-label="Adicionar ${escapeAttr(item.nome)} ao orçamento">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
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

      // Clique no card para expandir detalhes (exceto se clicar no stepper, no botão adicionar ou zoom)
      card.addEventListener('click', (e) => {
        if (e.target.closest('.qty-stepper') || e.target.closest('.btn-card-add') || e.target.closest('.btn-zoom-preview')) {
          return;
        }
        openProductModal(item);
      });

      card.querySelector('.qty-minus').addEventListener('click', (e) => {
        e.stopPropagation();
        const current = parseInt(stepper.dataset.qty, 10);
        const next = Math.max(1, current - 1);
        stepper.dataset.qty = next;
        qtyValue.textContent = next;
      });

      card.querySelector('.qty-plus').addEventListener('click', (e) => {
        e.stopPropagation();
        const current = parseInt(stepper.dataset.qty, 10);
        const next = current + 1;
        stepper.dataset.qty = next;
        qtyValue.textContent = next;
      });

      const zoomBtn = card.querySelector('.btn-zoom-preview');
      if (zoomBtn) {
        zoomBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          openLightbox(zoomBtn.dataset.preview, zoomBtn.dataset.title);
        });
      }

      const addBtn = card.querySelector('.btn-card-add');
      addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
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
          <div class="cart-item-top">
            <span class="cart-item-cat">${escapeHTML(item.categoria)}</span>
            <button type="button" class="cart-item-remove" aria-label="Remover ${escapeAttr(item.nome)}" title="Remover item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
          <strong class="cart-item-title">${escapeHTML(item.nome)}</strong>
          ${item.especificacao ? `<span class="cart-item-spec">${escapeHTML(item.especificacao)}</span>` : ''}
          <div class="cart-item-controls">
            <div class="cart-qty-pill">
              <button type="button" class="qty-btn cart-qty-minus" aria-label="Diminuir quantidade">−</button>
              <span class="qty-value">${item.quantidade}</span>
              <button type="button" class="qty-btn cart-qty-plus" aria-label="Aumentar quantidade">+</button>
            </div>
            <span class="cart-item-status">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Cotação ativa
            </span>
          </div>
        </div>
      </li>
    `;
  }

  function renderCart() {
    const count = cartCount();
    if (els.cartBadge) {
      els.cartBadge.textContent = count;
      els.cartBadge.hidden = count === 0;
    }
    if (els.cartTotalBadge) {
      els.cartTotalBadge.textContent = `${count} ${count === 1 ? 'item' : 'itens'}`;
    }
    if (els.summaryCount) {
      els.summaryCount.textContent = `${count} ${count === 1 ? 'item' : 'itens'}`;
    }

    const summaryCard = document.querySelector('.cart-summary-card');

    if (state.cart.length === 0) {
      if (els.cartItems) {
        els.cartItems.innerHTML = '';
        els.cartItems.style.display = 'none';
      }
      if (els.cartEmpty) {
        els.cartEmpty.hidden = false;
        els.cartEmpty.style.display = 'flex';
      }
      if (els.cartCheckout) els.cartCheckout.disabled = true;
      if (els.cartClear) els.cartClear.style.display = 'none';
      if (summaryCard) summaryCard.style.display = 'none';
    } else {
      if (els.cartEmpty) {
        els.cartEmpty.hidden = true;
        els.cartEmpty.style.display = 'none';
      }
      if (els.cartItems) {
        els.cartItems.style.display = 'flex';
        els.cartItems.innerHTML = state.cart.map(cartItemHTML).join('');
      }
      if (els.cartCheckout) els.cartCheckout.disabled = false;
      if (els.cartClear) els.cartClear.style.display = 'inline-flex';
      if (summaryCard) summaryCard.style.display = 'block';

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

    if (state.profile === 'terceirizado') {
      lines.push('🏭 *COTAÇÃO B2B TERCEIRIZAÇÃO & REVENDA — GORDINHO PERSONALIZADOS 2026*');
    } else {
      lines.push('🎁 *SOLICITAÇÃO DE ORÇAMENTO (CLIENTE FINAL / EMPRESA) — GORDINHO PERSONALIZADOS 2026*');
    }
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
    setProfile(state.profile, true);
    renderCategoryFilters();
    renderGrid();
    renderCart();

    // Alternador de Perfis (Tabs)
    if (els.tabCliente) {
      els.tabCliente.addEventListener('click', () => setProfile('cliente'));
    }
    if (els.tabTerceirizado) {
      els.tabTerceirizado.addEventListener('click', () => setProfile('terceirizado'));
    }
    if (els.btnSwitchToB2b) {
      els.btnSwitchToB2b.addEventListener('click', () => {
        setProfile('terceirizado');
        const targetEl = document.getElementById('catalogo-produtos');
        if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
      });
    }

    // Busca com debounce
    if (els.search) {
      els.search.addEventListener('input', debounce((e) => {
        state.searchTerm = e.target.value;
        state.visibleCount = PAGE_SIZE;
        applyFilters();
        if (e.target.value.trim().length >= 3) {
          const targetEl = document.getElementById('catalogo-produtos');
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 250));
    }

    // Submissão do formulário de busca
    if (els.searchForm) {
      els.searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const targetEl = document.getElementById('catalogo-produtos');
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    // Botão de Limpar Busca
    if (els.btnClearSearch) {
      els.btnClearSearch.addEventListener('click', () => {
        state.searchTerm = '';
        state.activeCategory = 'todos';
        if (els.search) els.search.value = '';
        state.visibleCount = PAGE_SIZE;
        renderCategoryFilters();
        applyFilters();
      });
    }

    // Cliques nos Cards de Categorias e Terceirizados (Grid Superior)
    document.querySelectorAll('.category-card, .terceirizado-card').forEach((card) => {
      card.addEventListener('click', () => {
        const cat = card.dataset.category || 'todos';
        state.activeCategory = cat;
        state.searchTerm = '';
        if (els.search) els.search.value = '';
        state.visibleCount = PAGE_SIZE;
        renderCategoryFilters();
        applyFilters();

        const targetEl = document.getElementById('catalogo-produtos');
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });

    // Scroll de Categorias
    if (els.categoryScrollPrev && els.categoryFilters) {
      els.categoryScrollPrev.addEventListener('click', () => {
        els.categoryFilters.scrollBy({ left: -200, behavior: 'smooth' });
      });
    }
    if (els.categoryScrollNext && els.categoryFilters) {
      els.categoryScrollNext.addEventListener('click', () => {
        els.categoryFilters.scrollBy({ left: 200, behavior: 'smooth' });
      });
    }

    // ScrollSpy suave para navegação das abas no Header
    const navLinks = document.querySelectorAll('.nav-tab-link');
    const sectionsToTrack = [
      { id: 'produtos-servicos', el: document.getElementById('produtos-servicos') },
      { id: 'terceirizados', el: document.getElementById('terceirizados') },
      { id: 'sobre-nos', el: document.getElementById('sobre-nos') }
    ];

    window.addEventListener('scroll', debounce(() => {
      const scrollPos = window.scrollY + 180;
      let currentSectionId = '';

      sectionsToTrack.forEach((sec) => {
        if (sec.el && sec.el.offsetTop <= scrollPos) {
          currentSectionId = sec.id;
        }
      });

      if (window.scrollY < 250) {
        navLinks.forEach((l) => l.classList.remove('active'));
        const homeLink = document.querySelector('.nav-tab-link[href="index.html"]');
        if (homeLink) homeLink.classList.add('active');
      } else if (currentSectionId) {
        navLinks.forEach((l) => {
          const href = l.getAttribute('href');
          if (href === `#${currentSectionId}`) {
            l.classList.add('active');
          } else {
            l.classList.remove('active');
          }
        });
      }
    }, 80));

    // Drawer de Carrinho & Modo Split Screen
    els.cartButton.addEventListener('click', toggleCart);
    els.cartClose.addEventListener('click', closeCart);
    els.cartBackdrop.addEventListener('click', closeCart);
    if (els.cartContinueBrowsing) {
      els.cartContinueBrowsing.addEventListener('click', closeCart);
    }
    if (els.btnEmptyExplore) {
      els.btnEmptyExplore.addEventListener('click', () => {
        closeCart();
        const targetEl = document.getElementById('catalogo-produtos');
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
    els.cartClear.addEventListener('click', clearCart);
    els.cartCheckout.addEventListener('click', checkout);

    // Ajusta o comportamento de rolagem e backdrop caso o usuário redimensione a janela
    window.addEventListener('resize', debounce(() => {
      if (els.cartDrawer && els.cartDrawer.classList.contains('open')) {
        if (isDesktopView()) {
          if (els.cartBackdrop) els.cartBackdrop.classList.remove('open');
          document.body.style.overflow = '';
        } else {
          if (els.cartBackdrop) els.cartBackdrop.classList.add('open');
          document.body.style.overflow = 'hidden';
        }
      }
    }, 150));

    // Lightbox
    if (els.lightboxClose) {
      els.lightboxClose.addEventListener('click', closeLightbox);
    }
    if (els.lightbox) {
      els.lightbox.addEventListener('click', (e) => {
        if (e.target === els.lightbox) closeLightbox();
      });
    }

    // Controles do Modal de Detalhes do Produto
    if (els.modalQtyMinus && els.modalQtyPlus && els.modalQtyStepper && els.modalQtyVal) {
      els.modalQtyMinus.addEventListener('click', () => {
        const cur = parseInt(els.modalQtyStepper.dataset.qty, 10) || 1;
        const next = Math.max(1, cur - 1);
        els.modalQtyStepper.dataset.qty = next;
        els.modalQtyVal.textContent = next;
      });

      els.modalQtyPlus.addEventListener('click', () => {
        const cur = parseInt(els.modalQtyStepper.dataset.qty, 10) || 1;
        const next = cur + 1;
        els.modalQtyStepper.dataset.qty = next;
        els.modalQtyVal.textContent = next;
      });
    }

    if (els.modalBtnAdd) {
      els.modalBtnAdd.addEventListener('click', () => {
        if (!currentModalItem) return;
        const qty = parseInt(els.modalQtyStepper.dataset.qty, 10) || 1;
        addToCart(currentModalItem, qty);

        const lbl = els.modalBtnAddLabel;
        const orig = lbl ? lbl.textContent : 'Adicionar ao Orçamento';
        if (lbl) lbl.textContent = 'Adicionado ao Orçamento ✓';
        els.modalBtnAdd.classList.add('is-added');

        setTimeout(() => {
          if (lbl) lbl.textContent = orig;
          els.modalBtnAdd.classList.remove('is-added');
          closeProductModal();
        }, 700);
      });
    }

    if (els.productModalClose) {
      els.productModalClose.addEventListener('click', closeProductModal);
    }

    if (els.productModal) {
      els.productModal.addEventListener('click', (e) => {
        if (e.target === els.productModal) closeProductModal();
      });
    }

    // Tecla ESC fecha modais
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeCart();
        closeLightbox();
        closeProductModal();
      }
    });
  });
})();
