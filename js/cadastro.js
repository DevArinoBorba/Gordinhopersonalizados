/**
 * GORDINHO PERSONALIZADOS — CADASTRO DE TERCEIRIZADO
 * Validação de CNPJ (Checksum + BrasilAPI), máscaras e redirecionamento WhatsApp
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('cadastro-terceirizado-form');
  if (!form) return;

  const cnpjInput = document.getElementById('cnpj');
  const nomeInput = document.getElementById('nome');
  const enderecoInput = document.getElementById('endereco');
  const contatoInput = document.getElementById('contato');
  const emailInput = document.getElementById('email');
  const cnpjHint = document.getElementById('cnpj-hint');
  const cnpjStatusIcon = document.getElementById('cnpj-status-icon');
  const submitBtn = document.getElementById('cadastro-submit');
  const formFeedback = document.getElementById('form-feedback');

  let cnpjState = null; // null | 'checking' | 'valid' | 'invalid'

  // ---------- Máscaras ----------
  function maskCNPJ(value) {
    const digits = value.replace(/\D/g, '').slice(0, 14);
    return digits
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }

  function maskPhone(value) {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 10) {
      return digits
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }
    return digits
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  }

  let validateTimeout = null;
  cnpjInput.addEventListener('input', () => {
    cnpjInput.value = maskCNPJ(cnpjInput.value);
    const digits = cnpjInput.value.replace(/\D/g, '');

    if (validateTimeout) clearTimeout(validateTimeout);

    if (digits.length === 14) {
      validateTimeout = setTimeout(() => {
        validateCNPJ();
      }, 300);
    } else {
      cnpjState = null;
      setCnpjStatus('idle');
      checkFormValidity();
    }
  });

  contatoInput.addEventListener('input', () => {
    contatoInput.value = maskPhone(contatoInput.value);
    checkFormValidity();
  });

  [nomeInput, enderecoInput, emailInput].forEach(input => {
    input.addEventListener('input', checkFormValidity);
  });

  // ---------- Validação Matemática do Dígito Verificador ----------
  function isValidCNPJChecksum(cnpjDigits) {
    if (cnpjDigits.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(cnpjDigits)) return false;

    const calcDigit = (base, weights) => {
      const sum = base
        .split('')
        .reduce((acc, digit, i) => acc + parseInt(digit, 10) * weights[i], 0);
      const mod = sum % 11;
      return mod < 2 ? 0 : 11 - mod;
    };

    const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    const base12 = cnpjDigits.slice(0, 12);
    const d1 = calcDigit(base12, w1);
    const d2 = calcDigit(base12 + d1, w2);

    return cnpjDigits === base12 + String(d1) + String(d2);
  }

  // ---------- Consulta BrasilAPI ----------
  async function lookupCNPJ(cnpjDigits) {
    const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjDigits}`);
    if (response.status === 404) {
      return { found: false };
    }
    if (!response.ok) {
      throw new Error('brasilapi_unavailable');
    }
    const data = await response.json();
    return { found: true, data };
  }

  function composeEndereco(data) {
    const parts = [];
    const logradouroLinha = [data.logradouro, data.numero].filter(Boolean).join(', ');
    if (logradouroLinha) parts.push(logradouroLinha);
    if (data.complemento) parts.push(data.complemento);
    if (data.bairro) parts.push(data.bairro);
    const cidadeUf = [data.municipio, data.uf].filter(Boolean).join(' - ');
    if (cidadeUf) parts.push(cidadeUf);
    if (data.cep) {
      const cep = String(data.cep).replace(/\D/g, '');
      if (cep.length === 8) parts.push(cep.replace(/^(\d{5})(\d{3})$/, '$1-$2'));
    }
    return parts.join(', ');
  }

  function setCnpjStatus(status, message) {
    cnpjInput.classList.remove('is-valid', 'is-invalid', 'is-checking');
    cnpjStatusIcon.innerHTML = '';
    cnpjHint.textContent = message || '';
    cnpjHint.className = 'form-hint';

    if (status === 'checking') {
      cnpjInput.classList.add('is-checking');
      cnpjStatusIcon.innerHTML = '<div class="spinner"></div>';
      cnpjHint.classList.add('loading');
    } else if (status === 'valid') {
      cnpjInput.classList.add('is-valid');
      cnpjStatusIcon.innerHTML = '<span style="color: #4ADE80; font-weight: bold;">✓</span>';
      cnpjHint.classList.add('success');
    } else if (status === 'invalid') {
      cnpjInput.classList.add('is-invalid');
      cnpjStatusIcon.innerHTML = '<span style="color: #F87171; font-weight: bold;">✕</span>';
      cnpjHint.classList.add('error');
    }
  }

  async function validateCNPJ() {
    const digits = cnpjInput.value.replace(/\D/g, '');
    if (digits.length !== 14) return;

    if (!isValidCNPJChecksum(digits)) {
      cnpjState = 'invalid';
      setCnpjStatus('invalid', 'CNPJ inválido. Verifique os números digitados.');
      checkFormValidity();
      return;
    }

    cnpjState = 'checking';
    setCnpjStatus('checking', 'Consultando dados na Receita Federal...');

    try {
      const result = await lookupCNPJ(digits);

      if (!result.found) {
        cnpjState = 'invalid';
        setCnpjStatus('invalid', 'CNPJ não localizado na Receita Federal.');
        checkFormValidity();
        return;
      }

      const data = result.data;
      const razaoSocial = data.razao_social || data.nome_fantasia || '';
      const enderecoCompleto = composeEndereco(data);

      if (razaoSocial) nomeInput.value = razaoSocial;
      if (enderecoCompleto) enderecoInput.value = enderecoCompleto;

      cnpjState = 'valid';
      setCnpjStatus('valid', `✓ CNPJ validado: ${razaoSocial}`);
    } catch (err) {
      // Caso a BrasilAPI esteja fora do ar, aceita o checksum matemático
      cnpjState = 'valid';
      setCnpjStatus('valid', '✓ CNPJ com dígito válido. Preencha os demais campos.');
    }

    checkFormValidity();
  }

  function checkFormValidity() {
    const isCnpjOk = cnpjState === 'valid';
    const isNomeOk = nomeInput.value.trim().length >= 3;
    const isEnderecoOk = enderecoInput.value.trim().length >= 5;
    const isContatoOk = contatoInput.value.replace(/\D/g, '').length >= 10;
    const isEmailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());

    if (isCnpjOk && isNomeOk && isEnderecoOk && isContatoOk && isEmailOk) {
      submitBtn.disabled = false;
    } else {
      submitBtn.disabled = true;
    }
  }

  // ---------- Envio do Formulário ----------
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<div class="spinner"></div> Processando cadastro...';

    const cnpj = cnpjInput.value.trim();
    const nome = nomeInput.value.trim();
    const endereco = enderecoInput.value.trim();
    const contato = contatoInput.value.trim();
    const email = emailInput.value.trim();

    formFeedback.className = 'form-feedback success';
    formFeedback.innerHTML = `
      <strong>Cadastro realizado com sucesso!</strong><br>
      Redirecionando para o WhatsApp do comercial para liberar sua tabela de terceirizado...
    `;

    // Mensagem formatada para o WhatsApp oficial
    const msg = [
      `*SOLICITAÇÃO DE CADASTRO — TERCEIRIZADO*`,
      `Olá! Preenchi meu pré-cadastro de terceirizado no site Gordinho Personalizados e gostaria de acessar a tabela e condições exclusivas:`,
      ``,
      `*Empresa / Razão Social:* ${nome}`,
      `*CNPJ:* ${cnpj}`,
      `*Endereço:* ${endereco}`,
      `*Telefone / WhatsApp:* ${contato}`,
      `*E-mail:* ${email}`
    ].join('\n');

    const whatsappUrl = `https://wa.me/5547996970405?text=${encodeURIComponent(msg)}`;

    setTimeout(() => {
      window.location.href = whatsappUrl;
    }, 1800);
  });
});
