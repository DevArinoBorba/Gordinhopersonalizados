/**
 * GORDINHO PERSONALIZADOS — JAVASCRIPT INSTITUCIONAL TERCEIRIZADOS B2B
 * Gerencia o banner de boas-vindas pós-cadastro e acordeão de dúvidas frequentes
 */

document.addEventListener('DOMContentLoaded', () => {
  // Acordeão de FAQ
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Fecha os outros
        faqItems.forEach((i) => i.classList.remove('open'));
        // Alterna o atual
        if (!isOpen) {
          item.classList.add('open');
        }
      });
    }
  });
});
