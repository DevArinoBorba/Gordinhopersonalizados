# 📖 Guia Oficial da Marca & Manual do Projeto
# Gordinho Personalizados — Grupo Gordinho

> Este documento contém toda a identidade visual, padrões da marca, serviços, dados de contato e instruções de hospedagem independente do projeto **Gordinho Personalizados**.

---

## 🏢 1. Sobre a Marca

A **Gordinho Personalizados** faz parte do ecossistema do **Grupo Gordinho** (+10 anos de mercado e mais de 250 mil atendimentos em Itajaí/SC).

A unidade de Personalizados atua em duas frentes complementares:
1. **Cliente Final (B2C / Varejo)**: Presentes afetivos, lembranças exclusivas, copos e garrafas térmicas gravadas a laser, canecas de cerâmica resinada, camisetas e capinhas personalizadas — **sem quantidade mínima**.
2. **Terceirização & Atacado (B2B / Corporativo)**: Parceria industrial para lojistas, marcas, agências e empresas que terceirizam sua produção de brindes, uniformes e produtos corporativos com estrutura de fábrica, maquinário industrial próprio e preços diferenciados de tabela parceira.

---

## 🎨 2. Identidade Visual & Paleta de Cores

A paleta combina a solidez do **Verde Floresta** da marca Gordinho com o impacto convidativo do **Amarelo Ouro / Âmbar** e o frescor do **Verde Esmeralda**.

### Cores Principais

| Cor | Hex | RGB | Uso Principal |
| :--- | :--- | :--- | :--- |
| **Amarelo Ouro (Principal)** | `#FAB818` | `rgb(250, 184, 24)` | Botões de conversão CTA, badges B2B, destaques e logo |
| **Amarelo Ouro Hover** | `#E5A50E` | `rgb(229, 165, 14)` | Hover e estados ativos de botões |
| **Verde Esmeralda (Secundário)**| `#22C55E` | `rgb(34, 197, 94)` | Botão B2C (Cliente Final), status de sucesso, tags |
| **Verde Floresta Profundo** | `#0F3822` | `rgb(15, 56, 34)` | Superfícies principais, cabeçalhos, cartões |
| **Verde Floresta Escuro** | `#0A2717` | `rgb(10, 39, 23)` | Fundo de contraste, header glass, texto sobre amarelo |
| **Base Ultra Profunda** | `#06180E` | `rgb(6, 24, 14)` | Fundo geral do body, viewport, rodapé |

### Neutros & Tipografia

| Cor | Hex | Uso |
| :--- | :--- | :--- |
| **Branco Puro** | `#FFFFFF` | Títulos principais `h1`, `h2`, botões |
| **Off-White Suave** | `#D2E4D8` | Textos corridos e parágrafos de alta legibilidade |
| **Verde Acinzentado (Muted)** | `#8FB49C` | Legendas, metadados e rodapé secundário |
| **Cinza Neutro** | `#64748B` | Textos desativados e créditos |

---

## 🔤 3. Tipografia Oficial

O projeto utiliza duas fontes do **Google Fonts** otimizadas:

1. **Heading (Títulos e Destaques)**: `Outfit`
   - Pesos recomendados: `700 (Bold)`, `800 (ExtraBold)`, `900 (Black)`.
   - Aplicação: Títulos de seções, chamadas de impacto e botões de ação.
2. **Body (Textos Corridos e Formulários)**: `Plus Jakarta Sans`
   - Pesos recomendados: `400 (Regular)`, `500 (Medium)`, `600 (SemiBold)`.
   - Aplicação: Parágrafos descritivos, inputs, rótulos e chips de diferenciais.

---

## 🏭 4. Serviços & Capacidade Técnica

- **Gravação & Corte a Laser**: Copos térmicos, garrafas inox, facas, tábuas de churrasco, brindes metálicos e emborrachados.
- **Sublimação Premium**: Canecas de cerâmica classe AAA, azulejos decorativos, almofadas e brindes promocionais.
- **DTF Têxtil (Direct to Film)**: Estamparia em tecidos claros e escuros, camisetas 100% algodão, uniformes corporativos e moletons com cores vivas e alta durabilidade à lavagem.
- **Brindes Corporativos em Escala**: Agendas, canetas, mochilas, chaveiros, kits de boas-vindas (*onboarding*) para novos colaboradores e eventos empresariais.

---

## 📍 5. Informações Oficiais de Atendimento

- **Marca**: Gordinho Personalizados (Grupo Gordinho)
- **Endereço**: Rua Cônego Thomaz Fontes, 417 - Centro, Itajaí - SC, CEP 88301-100
- **WhatsApp Comercial**: `(47) 99697-0405`
- **Horário de Atendimento**: Segunda a Sexta: 08:00 às 18:00 | Sábado: 08:00 às 17:00
- **Redes Sociais Oficiais**:
  - Instagram: `@gordinhocelularoficial`
  - TikTok: `@ogordinhocelular`
  - Facebook: `/gordinhocelularoficial`
  - YouTube: `@grupogordinho`
- **Site Institucional de Celulares**: `https://gordinhocelulares.com.br`

---

## 📁 6. Estrutura Autônoma dos Arquivos

Este projeto foi totalmente descolado e pode ser aberto e hospedado de forma 100% independente:

```
gordinho-personalizados/
├── index.html                   # Tela inicial Split Screen (Cliente Final vs Terceirizado)
├── cadastro-terceirizado.html   # Página de Pré-Cadastro B2B com validação BrasilAPI
├── GUIA_DA_MARCA.md             # Este manual completo da marca e projeto
├── README.md                    # Documentação técnica e instruções de deploy
├── package.json                 # Configuração do projeto e scripts npm
├── css/
│   ├── variables.css            # Tokens de cores da marca, fontes e dimensões
│   ├── portal.css               # Estilo visual do split screen e responsividade
│   └── cadastro.css             # Estilo do formulário de terceirização B2B
├── js/
│   ├── portal.js                # Interatividade do portal e atalhos de teclado
│   └── cadastro.js              # Validação de CNPJ (Receita Federal) e WhatsApp
└── assets/
    └── images/                  # Imagens e marcas locais (100% independentes)
        ├── bg-cliente-final.jpg # Foto de estúdio de presentes e copos
        ├── bg-lojista-atacado.jpg # Foto industrial de brindes e produção
        ├── logo.png             # Logo oficial
        ├── mascot.png           # Mascote oficial
        └── favicon.png          # Ícone do navegador
```

---

## 🌐 7. Como Hospedar este Projeto de Forma Independente

Por ser um projeto web moderno em **HTML5, CSS3 e JavaScript puro**, ele **não precisa de backend complexo** e pode ser hospedado gratuitamente ou em qualquer servidor:

### Opção A: Vercel (Recomendada)
1. Instale ou acesse [vercel.com](https://vercel.com).
2. Se estiver usando o terminal: navegue até a pasta `gordinho-personalizados` e execute:
   ```bash
   npx vercel
   ```
3. O deploy será gerado instantaneamente com HTTPS e CDN mundial.

### Opção B: Netlify
1. Acesse [netlify.com](https://www.netlify.com).
2. Arraste a pasta `gordinho-personalizados` diretamente na área *"Deploy manually"*.

### Opção C: Hospedagem Tradicional (Hostgator, Locaweb, cPanel, Apache, Nginx)
1. Conecte ao seu servidor via FTP ou cPanel File Manager.
2. Envie todos os arquivos da pasta `gordinho-personalizados` para o diretório `public_html/` (ou crie um subdomínio como `personalizados.gordinhocelulares.com.br`).
3. Pronto! O site estará no ar imediatamente.
