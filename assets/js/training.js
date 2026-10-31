(function () {
  'use strict';
  function buildParticipationEmail(language = 'pt-PT') {
    const english = language === 'en';
    const subject = english ? 'Request a quotation — Training and consulting' : 'Pedido de proposta — Formação e consultoria';
    const body = english ? 'Hello Hugo,\n\nI would like a quotation for training or consulting on AI and healthcare processes. Could we discuss the objectives, format and expected number of participants?\n\nThank you.' : 'Olá Hugo,\n\nGostaria de receber uma proposta para formação ou consultoria na área da IA e dos processos em saúde. Podemos conversar sobre os objetivos, o formato e o número de participantes?\n\nObrigado/a.';
    return 'mailto:hugo.filipe.b.monteiro@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = { buildParticipationEmail };
  if (typeof document === 'undefined') return;
  const dialog = document.getElementById('participation-dialog');
  let previousFocus;
  document.getElementById('participation-email').href = buildParticipationEmail(document.documentElement.lang);
  document.querySelectorAll('[data-participate]').forEach(function (button) {
    button.addEventListener('click', function () { previousFocus = button; dialog.showModal(); document.body.style.overflow = 'hidden'; document.getElementById('close-dialog').focus(); });
  });
  document.getElementById('close-dialog').addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('close', function () { document.body.style.overflow = ''; if (previousFocus) previousFocus.focus(); });
})();
