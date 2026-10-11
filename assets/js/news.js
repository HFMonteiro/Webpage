// LinkedIn is contacted only after an explicit visitor action.
(function () {
    'use strict';
    const button = document.querySelector('[data-linkedin-load]');
    const container = document.querySelector('[data-linkedin-container]');
    if (!button || !container) return;
    button.addEventListener('click', function () {
        if (container.querySelector('iframe')) return;
        const frame = document.createElement('iframe');
        frame.src = 'https://www.linkedin.com/embed/feed/update/urn:li:activity:7510770567529144320';
        frame.title = container.dataset.linkedinTitle;
        frame.referrerPolicy = 'no-referrer';
        frame.setAttribute('allowfullscreen', '');
        container.appendChild(frame);
        button.hidden = true;
    });
})();
