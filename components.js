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
        loadComponent('#header-placeholder', 'components/header.html'),
        loadComponent('#footer-placeholder', 'components/footer.html'),
    ]);

    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    await applyLanguage(getStoredLanguage());

    if (typeof onReady === 'function') onReady();
}
