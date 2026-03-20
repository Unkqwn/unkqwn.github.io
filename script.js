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

function createProjectContainer(project) {
    const container = document.createElement('div');
    container.className = 'project-container';
    if (project.containerClass) {
        container.classList.add(project.containerClass);
    }
    container.innerHTML = `
        <img class="project-image" src="${project.image}" alt="${project.name}">
        <h1 class="project-name">${project.name}</h1>
        <div class="btn-container">
            <button class="btn project-btn" onclick="window.open('${project.github}')">GitHub</button>
            <button class="btn project-btn" onclick="window.location.href='${project.projectPage}'">View Project</button>
        </div>
    `;
    return container;
}

function renderProjects(projects) {
    const projectsDiv = document.getElementById('projects');
    if (!projectsDiv) return;
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

    if (typeof onReady === 'function') onReady();
}

function toggleLanguage() {
    console.log('Language toggle clicked');
}