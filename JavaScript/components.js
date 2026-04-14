async function loadComponent(selector, url) {
    const el = document.querySelector(selector);
    if (!el) return;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
        el.innerHTML = await res.text();
    } catch (err) {
        console.error(err);
    }
}

function getPathPrefixFromPages() {
    const marker = '/Pages/';
    const normalizedPath = window.location.pathname.replace(/\\/g, '/');
    const markerIndex = normalizedPath.lastIndexOf(marker);

    if (markerIndex === -1) {
        return '../';
    }

    const pathAfterPages = normalizedPath.slice(markerIndex + marker.length);
    const depth = Math.max(pathAfterPages.split('/').length - 1, 0);
    return depth === 0 ? '../' : `../${'../'.repeat(depth)}`;
}

function updateComponentNavigationLinks() {
    const marker = '/Pages/';
    const normalizedPath = window.location.pathname.replace(/\\/g, '/');
    const markerIndex = normalizedPath.lastIndexOf(marker);

    let pagePrefix = '';
    if (markerIndex !== -1) {
        const pathAfterPages = normalizedPath.slice(markerIndex + marker.length);
        const depth = Math.max(pathAfterPages.split('/').length - 1, 0);
        pagePrefix = '../'.repeat(depth);
    }

    document.querySelectorAll('[data-page-link]').forEach((anchor) => {
        const route = anchor.getAttribute('data-page-link');
        if (!route) return;
        anchor.setAttribute('href', `${pagePrefix}${route}`);
    });
}

async function initComponents(onReady) {
    const pathPrefix = getPathPrefixFromPages();

    await Promise.all([
        loadComponent('#header-placeholder', `${pathPrefix}Assets/Components/header.html`),
        loadComponent('#footer-placeholder', `${pathPrefix}Assets/Components/footer.html`),
    ]);

    updateComponentNavigationLinks();

    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    await applyLanguage(getStoredLanguage());

    if (typeof onReady === 'function') onReady();
}

async function loadCodeSnippets() {
    const codeElements = document.querySelectorAll('[data-code-file]');
    
    for (const el of codeElements) {
        const filePath = el.getAttribute('data-code-file');
        try {
            const response = await fetch(filePath);
            const code = await response.text();
            el.textContent = code;
            hljs.highlightElement(el);
        } catch (error) {
            console.error(`Failed to load code snippet from ${filePath}:`, error);
        }
    }
}

// Call this after the DOM is ready
document.addEventListener('DOMContentLoaded', loadCodeSnippets);