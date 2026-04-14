function rerenderProjectSectionsIfAvailable() {
    if (Array.isArray(window.projects)) {
        renderProjects(window.projects);
    }
    if (Array.isArray(window.wipProjects)) {
        renderWipProjects(window.wipProjects);
    }
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

    const buttons = [];

    if (project.github) {
        buttons.push(`<button class="btn project-btn" onclick="window.open('${project.github}', '_blank')">${t('project.github', 'GitHub')}</button>`);
    }

    if (project.projectPage) {
        const viewAction = /^https?:\/\//i.test(project.projectPage)
            ? `window.open('${project.projectPage}', '_blank')`
            : `window.location.href='${project.projectPage}'`;
        buttons.push(`<button class="btn project-btn" onclick="${viewAction}">${t('project.view', 'View Project')}</button>`);
    }

    if (project.extraLink) {
        buttons.push(`<button class="btn project-btn" onclick="window.open('${project.extraLink}', '_blank')">${project.extraLinkLabel || 'Extra Link'}</button>`);
    }

    container.innerHTML = `
        <img class="project-image" src="${project.image}.png" alt="${project.name}">
        <h1 class="project-name">${project.name}</h1>
        ${languageTags}
        <div class="btn-container">
            ${buttons.join('')}
        </div>
    `;
    return container;
}

function renderProjectList(containerId, projects) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    projects.forEach(project => {
        container.appendChild(createProjectContainer(project));
    });
}

function renderProjects(projects) {
    renderProjectList('projects', projects);
}

function renderWipProjects(projects) {
    renderProjectList('wip', projects);
}
