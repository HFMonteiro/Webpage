// LinkedIn highlights renderer for curated public posts
(function() {
    'use strict';

    function getLanguage() {
        const lang = (document.documentElement.getAttribute('lang') || 'en').toLowerCase();
        return lang.startsWith('pt') ? 'pt' : 'en';
    }

    function localize(value, lang, fallback) {
        if (!value) return fallback || '';
        if (typeof value === 'string') return value;
        if (typeof value === 'object') {
            return value[lang] || value.en || value.pt || fallback || '';
        }
        return fallback || '';
    }

    function isAllowedLinkedInEmbed(url) {
        try {
            const parsed = new URL(url);
            return parsed.protocol === 'https:' &&
                   parsed.hostname === 'www.linkedin.com' &&
                   parsed.pathname.startsWith('/embed/');
        } catch (error) {
            return false;
        }
    }

    function isAllowedLinkedInLink(url) {
        try {
            const parsed = new URL(url);
            return parsed.protocol === 'https:' &&
                   (parsed.hostname === 'www.linkedin.com' || parsed.hostname === 'linkedin.com');
        } catch (error) {
            return false;
        }
    }

    function createElement(tag, className, text) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (text) element.textContent = text;
        return element;
    }

    function renderEmptyState(container) {
        const empty = createElement('div', 'linkedin-empty');
        const title = createElement('h3', null, container.dataset.emptyTitle || 'No LinkedIn highlights selected yet');
        const message = createElement('p', null, container.dataset.emptyMessage || 'Add public LinkedIn post embed URLs to assets/data/linkedin-posts.json.');
        empty.append(title, message);
        container.replaceChildren(empty);
    }

    function renderErrorState(container) {
        const error = createElement('div', 'linkedin-error');
        error.setAttribute('role', 'status');
        error.textContent = container.dataset.errorMessage || 'LinkedIn highlights could not be loaded.';
        container.replaceChildren(error);
    }

    function renderPost(post, index, lang, openLabel) {
        const card = createElement('article', 'linkedin-post-card');

        const title = createElement('h3', null, localize(post.title, lang, `LinkedIn post ${index + 1}`));
        card.appendChild(title);

        if (post.date || post.source) {
            const metaParts = [];
            if (post.date) metaParts.push(post.date);
            if (post.source) metaParts.push(localize(post.source, lang, 'LinkedIn'));
            card.appendChild(createElement('p', 'linkedin-post-meta', metaParts.join(' · ')));
        }

        const context = localize(post.context, lang, '');
        if (context) {
            card.appendChild(createElement('p', 'linkedin-post-context', context));
        }

        if (post.embedUrl && isAllowedLinkedInEmbed(post.embedUrl)) {
            const frameWrap = createElement('div', 'linkedin-frame-wrapper');
            const iframe = document.createElement('iframe');
            iframe.className = 'linkedin-frame';
            iframe.src = post.embedUrl;
            iframe.title = localize(post.title, lang, `Embedded LinkedIn post ${index + 1}`);
            iframe.loading = 'lazy';
            iframe.allowFullscreen = true;
            iframe.referrerPolicy = 'strict-origin-when-cross-origin';
            frameWrap.appendChild(iframe);
            card.appendChild(frameWrap);
        }

        if (post.url && isAllowedLinkedInLink(post.url)) {
            const link = document.createElement('a');
            link.className = 'card-link linkedin-post-link';
            link.href = post.url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = openLabel;
            card.appendChild(link);
        }

        return card;
    }

    async function loadLinkedInHighlights(container) {
        const lang = getLanguage();
        const source = container.dataset.source || '/assets/data/linkedin-posts.json';
        const openLabel = container.dataset.openLabel || (lang === 'pt' ? 'Abrir no LinkedIn' : 'Open on LinkedIn');

        try {
            const response = await fetch(source, { cache: 'no-cache' });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            const posts = Array.isArray(data.posts) ? data.posts : [];

            if (posts.length === 0) {
                renderEmptyState(container);
                return;
            }

            const feed = createElement('div', 'linkedin-feed-grid');
            posts.forEach((post, index) => {
                feed.appendChild(renderPost(post, index, lang, openLabel));
            });
            container.replaceChildren(feed);
        } catch (error) {
            console.error('Error loading LinkedIn highlights:', error);
            renderErrorState(container);
        }
    }

    function init() {
        document.querySelectorAll('[data-linkedin-feed]').forEach(loadLinkedInHighlights);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
