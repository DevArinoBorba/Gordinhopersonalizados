/**
 * GORDINHO PERSONALIZADOS — PORTAL SPLIT SCREEN
 * Interatividade, Efeitos de Hover e Ações
 */

document.addEventListener('DOMContentLoaded', () => {
  const portalWrapper = document.querySelector('.portal-wrapper');
  const sideB2C = document.querySelector('.side-b2c');
  const sideB2B = document.querySelector('.side-b2b');

  if (!portalWrapper || !sideB2C || !sideB2B) return;

  // Interatividade de Hover no Desktop
  const isDesktop = () => window.innerWidth > 992;

  sideB2C.addEventListener('mouseenter', () => {
    if (isDesktop()) {
      portalWrapper.classList.add('hover-b2c');
      portalWrapper.classList.remove('hover-b2b');
    }
  });

  sideB2C.addEventListener('mouseleave', () => {
    if (isDesktop()) {
      portalWrapper.classList.remove('hover-b2c');
    }
  });

  sideB2B.addEventListener('mouseenter', () => {
    if (isDesktop()) {
      portalWrapper.classList.add('hover-b2b');
      portalWrapper.classList.remove('hover-b2c');
    }
  });

  sideB2B.addEventListener('mouseleave', () => {
    if (isDesktop()) {
      portalWrapper.classList.remove('hover-b2b');
    }
  });

  const b2cBtn = sideB2C.querySelector('.btn-portal-action');
  const b2bBtn = sideB2B.querySelector('.btn-portal-action');

  if (b2cBtn) {
    b2cBtn.addEventListener('click', () => {
      try { sessionStorage.setItem('gordinho-profile', 'cliente'); } catch (e) {}
    });
  }

  if (b2bBtn) {
    b2bBtn.addEventListener('click', () => {
      try { sessionStorage.setItem('gordinho-profile', 'terceirizado'); } catch (e) {}
    });
  }

  // Atalhos de Teclado Úteis (Seta Esquerda/1 para B2C, Seta Direita/2 para B2B)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === '1') {
      if (b2cBtn) b2cBtn.click();
    } else if (e.key === 'ArrowRight' || e.key === '2') {
      if (b2bBtn) b2bBtn.click();
    }
  });
});
