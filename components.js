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

async function initComponents(onReady) {
    await Promise.all([
        loadComponent('#header-placeholder', 'Assets/Components/header.html'),
        loadComponent('#footer-placeholder', 'Assets/Components/footer.html'),
    ]);

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