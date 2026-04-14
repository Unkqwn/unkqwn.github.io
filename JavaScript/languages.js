const DEFAULT_LANGUAGE = 'en';
const SUPPORTED_LANGUAGES = ['en', 'nl'];
const LANGUAGE_FILE_NAMES = {
    en: 'En',
    nl: 'NL',
};

let currentLanguage = DEFAULT_LANGUAGE;
let currentTranslations = {};

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
        const pathPrefix = getPathPrefixFromPages();
        const response = await fetch(`${pathPrefix}Assets/Languages/${fileName}.json`);
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

    if (typeof rerenderProjectSectionsIfAvailable === 'function') {
        rerenderProjectSectionsIfAvailable();
    }
}

async function applyLanguage(language) {
    currentLanguage = SUPPORTED_LANGUAGES.includes(language) ? language : DEFAULT_LANGUAGE;
    currentTranslations = await loadTranslations(currentLanguage);
    setStoredLanguage(currentLanguage);
    applyTranslations();
}

async function toggleLanguage() {
    const nextLanguage = currentLanguage === 'en' ? 'nl' : 'en';
    await applyLanguage(nextLanguage);
}
