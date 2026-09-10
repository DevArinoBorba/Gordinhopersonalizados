# 🎁 Gordinho Personalizados — Portal Oficial

Portal web oficial da **Gordinho Personalizados** (Grupo Gordinho - Itajaí/SC), com experiência imersiva de divisão de perfis em **Split Screen** (*Cliente Final* vs *Sou Terceirizado / Revenda*) e fluxo integrado de pré-cadastro B2B com validação em tempo real na Receita Federal.

---

## 📌 Principais Recursos

- 🌓 **Portal Split Screen Interativo**: Experiência visual dividida ao meio, inspirada em marcas de tecnologia de ponta, permitindo que o visitante selecione facilmente seu perfil.
- 🎨 **100% Identidade Visual Gordinho**: Paleta oficial com Verde Floresta Profundo (`#0F3822`, `#0A2717`, `#06180E`), Amarelo Ouro Âmbar (`#FAB818`) e Verde Esmeralda (`#22C55E`).
- ⚡ **Validação Automática de CNPJ**: A página `cadastro-terceirizado.html` valida os dígitos verificadores e consulta automaticamente a API da Receita Federal (BrasilAPI), preenchendo Razão Social e Endereço sem digitação manual.
- 📲 **Integração WhatsApp Direta**: Botões inteligentes com mensagens pré-formatadas para conversão comercial rápida.
- 📱 **Totalmente Responsivo**: Funciona perfeitamente em celulares, tablets, notebooks e monitores ultra-wide sem qualquer borda branca ou overflow lateral.
- 🚀 **100% Independente**: Todos os assets, fontes, estilos e scripts estão contidos dentro desta pasta. Não depende do projeto de Celulares para rodar.

---

## 📂 Estrutura de Arquivos

```
gordinho-personalizados/
├── index.html                   # Página inicial Split Screen
├── cadastro-terceirizado.html   # Página de cadastro e validação CNPJ B2B
├── GUIA_DA_MARCA.md             # Manual completo com cores, fontes e serviços
├── README.md                    # Documentação do projeto
├── package.json                 # Manifesto do projeto e scripts locais
├── css/
│   ├── variables.css            # Variáveis CSS e paleta de cores
│   ├── portal.css               # Estilos da tela inicial
│   └── cadastro.css             # Estilos do formulário B2B
├── js/
│   ├── portal.js                # Lógica e interatividade do split screen
│   └── cadastro.js              # Máscaras e validação BrasilAPI
└── assets/
    └── images/                  # Imagens e marcas locais
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
