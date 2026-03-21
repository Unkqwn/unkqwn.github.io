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

const DEFAULT_LANGUAGE = 'en';
const SUPPORTED_LANGUAGES = ['en', 'nl'];
const LANGUAGE_FILE_NAMES = {
    en: 'En',
    nl: 'NL',
};

let currentLanguage = DEFAULT_LANGUAGE;
let currentTranslations = {};

function getStoredLanguage() {
    const stored = localStorage.getItem('language');
    return SUPPORTED_LANGUAGES.includes(stored) ? stored : DEFAULT_LANGUAGE;
}

function setStoredLanguage(language) {
    localStorage.setItem('language', language);
}

function getNestedTranslation(translations, key) {
    return key.split('.').reduce((value, part) => {
        if (value && Object.prototype.hasOwnProperty.call(value, part)) {
            return value[part];
        }
        return undefined;
    }, translations);
}

async function loadTranslations(language) {
    const fileName = LANGUAGE_FILE_NAMES[language];
    if (!fileName) return {};

    try {
        const response = await fetch(`Assets/Languages/${fileName}.json`);
        if (!response.ok) throw new Error(`Failed to load translations for ${language}`);
        return await response.json();
    } catch (error) {
        console.error(error);
        return {};
    }
}

function t(key, fallback = key) {
    const translated = getNestedTranslation(currentTranslations, key);
    if (typeof translated === 'string') return translated;
    if (Array.isArray(translated)) return translated.join(' ');
    return fallback;
}

function updateLanguageButton() {
    const button = document.getElementById('language-btn');
    if (!button) return;
    button.textContent = currentLanguage.toUpperCase();
}

function applyTranslations() {
    document.documentElement.lang = currentLanguage;
    document.querySelectorAll('[language-text]').forEach((element) => {
        const key = element.getAttribute('language-text');
        if (!key) return;
        element.textContent = t(key, element.textContent);
    });
    updateLanguageButton();
    rerenderProjectsIfAvailable();
}

async function applyLanguage(language) {
    currentLanguage = SUPPORTED_LANGUAGES.includes(language) ? language : DEFAULT_LANGUAGE;
    currentTranslations = await loadTranslations(currentLanguage);
    setStoredLanguage(currentLanguage);
    applyTranslations();
}

function rerenderProjectsIfAvailable() {
    if (!Array.isArray(window.projects)) return;
    renderProjects(window.projects);
}

function createProjectContainer(project) {
    const container = document.createElement('div');
    container.className = 'project-container';
    if (project.containerClass) {
        container.classList.add(project.containerClass);
    }

    const languageTags = Array.isArray(project.languages) && project.languages.length
        ? `<div class="project-languages">${project.languages.map(language => `<span class="project-language">${language}</span>`).join('')}</div>`
        : '';

    const optionalThirdButton = project.extraLink
        ? `<button class="btn project-btn" onclick="window.open('${project.extraLink}', '_blank')">${project.extraLinkLabel || 'Extra Link'}</button>`
        : '';

    container.innerHTML = `
        <img class="project-image" src="${project.image}.png" alt="${project.name}">
        <h1 class="project-name">${project.name}</h1>
        ${languageTags}
        <div class="btn-container">
            <button class="btn project-btn" onclick="window.open('${project.github}')">${t('project.github', 'GitHub')}</button>
            <button class="btn project-btn" onclick="window.location.href='${project.projectPage}'">${t('project.view', 'View Project')}</button>
            ${optionalThirdButton}
        </div>
    `;
    return container;
}

function renderProjects(projects) {
    const projectsDiv = document.getElementById('projects');
    if (!projectsDiv) return;
    projectsDiv.innerHTML = '';
    projects.forEach(project => {
        projectsDiv.appendChild(createProjectContainer(project));
    });
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

async function toggleLanguage() {
    const nextLanguage = currentLanguage === 'en' ? 'nl' : 'en';
    await applyLanguage(nextLanguage);
}