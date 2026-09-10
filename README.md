# 🎁 Gordinho Personalizados — Portal Oficial

Portal web oficial da **Gordinho Personalizados** (Grupo Gordinho - Itajaí/SC), com experiência imersiva de divisão de perfis em **Split Screen** (*Cliente Final* vs *Sou Terceirizado / Revenda*) e fluxo integrado de pré-cadastro B2B com validação em tempo real na Receita Federal.

---

## 📌 Principais Recursos

- 🌓 **Portal Split Screen Interativo**: Experiência visual dividida ao meio, inspirada em marcas de tecnologia de ponta, permitindo que o visitante selecione facilmente seu perfil.
- 📦 **Catálogo Corporativo & Parque de Máquinas 2026 (`catalogo.html`)**: Padrão InfinityTech com catálogo interativo de tecnologias (DTF UV, Fiber Laser, DTF Têxtil, Sublimação, Transfer 360, Impressão 3D), estrutura industrial (plotters, prensas térmicas), comunicação visual e plotagem veicular.
- 🛒 **Carrinho de Orçamento Inteligente (Drawer)**: Monte seu pedido ou solicitação com ajuste de quantidade e persistência no `localStorage`.
- ⚡ **Validação Automática de CNPJ & Sincronização B2B**: A página `cadastro-terceirizado.html` valida os dados na Receita Federal e sincroniza automaticamente os dados cadastrais da empresa no carrinho do catálogo.
- 📲 **Integração WhatsApp Direta**: Finalização de pedidos e cotações no WhatsApp comercial oficial `(47) 98496-5444` com mensagem formatada e dados da empresa.
- 🎨 **100% Identidade Visual Gordinho**: Paleta oficial com Verde Floresta Profundo (`#0F3822`, `#0A2717`, `#06180E`), Amarelo Ouro Âmbar (`#FAB818`) e Verde Esmeralda (`#22C55E`).
- 📱 **Totalmente Responsivo**: Funciona perfeitamente em celulares, tablets, notebooks e monitores ultra-wide sem qualquer borda branca ou overflow lateral.
- 🚀 **100% Independente**: Todos os assets, fontes, estilos e scripts estão contidos dentro desta pasta. Não depende do projeto de Celulares para rodar.

---

## 📂 Estrutura de Arquivos

```
gordinho-personalizados/
├── index.html                   # Página inicial Split Screen
├── cadastro-terceirizado.html   # Página de cadastro e validação CNPJ B2B
├── terceirizados.html           # Página Institucional B2B (Apresentação da Estrutura Industrial)
├── catalogo.html                # Catálogo Online B2B & Maquinário com busca e carrinho
├── GUIA_DA_MARCA.md             # Manual completo com cores, fontes e serviços
├── README.md                    # Documentação do projeto
├── package.json                 # Manifesto do projeto e scripts locais
├── css/
│   ├── variables.css            # Variáveis CSS e paleta de cores
│   ├── portal.css               # Estilos da tela inicial
│   ├── terceirizados.css        # Estilos da página institucional B2B
│   ├── catalogo.css             # Estilos do catálogo online e carrinho drawer
│   └── cadastro.css             # Estilos do formulário B2B
├── js/
│   ├── portal.js                # Lógica e interatividade do split screen
│   ├── terceirizados.js         # Boas-vindas pós-cadastro e acordeão de FAQ
│   ├── catalogo.js              # Busca, filtros por categoria e carrinho WhatsApp
│   └── cadastro.js              # Máscaras, validação BrasilAPI e sync de parceiro
└── assets/
    └── images/                  # Imagens e marcas locais (100% independentes)
        └── catalogo/            # Imagens e miniaturas do catálogo 2026
```

---

## 💻 Como Rodar Localmente

Você pode rodar com qualquer servidor estático local:

### Com Python:
```bash
python -m http.server 8080
```
Depois abra [http://localhost:8080](http://localhost:8080).

### Com Node / npx:
```bash
npx serve .
```

---

## 🚀 Como Fazer o Deploy (Hospedagem Separada)

Basta enviar o conteúdo desta pasta para qualquer provedor:
- **Vercel**: `npx vercel`
- **Netlify**: arraste a pasta no painel do Netlify
- **cPanel / FTP**: envie os arquivos para a pasta `public_html` do seu domínio ou subdomínio (ex: `personalizados.gordinhocelulares.com.br`)

Para detalhes completos sobre códigos hexadecimais, tipografia e diretrizes da marca, consulte o arquivo [GUIA_DA_MARCA.md](GUIA_DA_MARCA.md).
