(function () {
  'use strict';
  const english = document.documentElement.lang === 'en';
  const nav = document.querySelector('body > nav');

  if (nav && !document.getElementById('navigation-toggle')) {
    const links = document.createElement('div');
    links.id = 'navigation-links';
    links.className = 'navigation-links';
    Array.from(nav.children).filter(element => element.tagName === 'A').forEach(link => links.appendChild(link));
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.id = 'navigation-toggle';
    toggle.className = 'navigation-toggle';
    toggle.setAttribute('aria-controls', links.id);
    nav.prepend(toggle, links);
    nav.classList.add('site-nav');
    const mobile = window.matchMedia('(max-width: 1024px)');

    function setOpen(open, restoreFocus = false) {
      links.hidden = mobile.matches && !open;
      toggle.hidden = !mobile.matches;
      toggle.setAttribute('aria-expanded', String(mobile.matches && open));
      toggle.textContent = open && mobile.matches ? (english ? 'Close' : 'Fechar') : 'Menu';
      toggle.setAttribute('aria-label', english ? (open ? 'Close menu' : 'Open menu') : (open ? 'Fechar menu' : 'Abrir menu'));
      if (restoreFocus && mobile.matches) toggle.focus();
    }

    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('keydown', event => {
      if (event.key === 'Escape' && mobile.matches && toggle.getAttribute('aria-expanded') === 'true') {
        event.preventDefault();
        setOpen(false, true);
      }
    });
    links.addEventListener('click', event => {
      const link = event.target.closest('a');
      if (link && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) setOpen(false);
    });
    document.addEventListener('click', event => {
      if (!nav.contains(event.target) && toggle.getAttribute('aria-expanded') === 'true') setOpen(false);
    });
    nav.addEventListener('focusout', event => {
      if (event.relatedTarget && !nav.contains(event.relatedTarget)) setOpen(false);
    });
    mobile.addEventListener('change', () => {
      const focusWasInLinks = links.contains(document.activeElement);
      setOpen(false, focusWasInLinks);
    });
    setOpen(false);
  }

  document.querySelectorAll('[data-copy-email]').forEach(button => {
    const status = document.getElementById(button.getAttribute('aria-describedby'));
    let copying = false;
    button.hidden = false;
    button.addEventListener('click', async () => {
      if (copying) return;
      copying = true;
      button.setAttribute('aria-busy', 'true');
      status.textContent = '';
      try {
        await navigator.clipboard.writeText(button.dataset.copyEmail);
        status.textContent = english ? 'Email copied.' : 'Email copiado.';
      } catch (_) {
        status.textContent = english ? 'Could not copy. Please select and copy the email address above.' : 'Não foi possível copiar. Selecione e copie o endereço de email acima.';
      } finally {
        copying = false;
        button.removeAttribute('aria-busy');
      }
    });
  });
})();
