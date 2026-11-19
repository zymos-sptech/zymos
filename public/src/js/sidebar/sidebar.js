const ROUTES = {
  panorama: '/src/pages/dashboard/panorama.html',
  macro: '/src/pages/dashboard/dashboard-macro.html',
  micro: '/src/pages/dashboard/dashboard-micro.html',
  unidades: '/src/pages/dashboard/unidades.html',
  tanques: '/src/pages/dashboard/tanques.html',
  lotes: '/src/pages/dashboard/lotes.html',
  cervejas: '/src/pages/dashboard/cervejas.html',
  perfil: '/src/pages/dashboard/perfil.html',
  login: '/src/pages/login.html'
};

const NAV_SECTIONS = [
  {
    title: 'MONITORAÇÃO & OPERAÇÃO',
    items: [
      { key: 'panorama', label: 'Panorama', icon: 'fa-regular fa-house' },
      { key: 'macro', label: 'Monitor de Tanques', icon: 'fa-solid fa-chart-column' },
      { key: 'micro', label: 'Dashboard do Lote', icon: 'fa-solid fa-chart-line' },
    ],
  },
  {
    title: 'CADASTROS & CONFIGURAÇÕES',
    items: [
      { key: 'unidades', label: 'Unidades', icon: 'fa-regular fa-building' },
      { key: 'tanques', label: 'Tanques', icon: 'fa-solid fa-jar' },
      { key: 'cervejas', label: 'Cervejas', icon: 'fa-solid fa-beer-mug-empty' },
      { key: 'lotes', label: 'Lotes', icon: 'fa-solid fa-flask' },
      { key: 'perfil', label: 'Perfil', icon: 'fa-regular fa-user' },
    ],
  },
];

function definirIniciais(nomeCompleto) {
  if (!nomeCompleto) return '?';
  const parte = nomeCompleto.trim().split(' ');
  if (parte.length === 0) return '?';
  if (parte.length === 1) return parte[0][0].toUpperCase();
  const primeira = parte[0][0];
  const ultima = parte[parte.length - 1][0];
  return `${primeira}${ultima}`.toUpperCase();
}

function buscarUsuario() {
  const nome = sessionStorage.getItem('NOME_COMPLETO') || 'Usuário';
  const cargo = sessionStorage.getItem('CARGO') || '';
  return { nome, cargo, initials: definirIniciais(nome) };
}

function isActive(key) {
  const route = ROUTES[key];
  if (!route) return false;
  const path = window.location.pathname.toLowerCase();
  return path === route.toLowerCase() || path.endsWith(route.toLowerCase());
}

function montarSidebarAberta(user) {
  const sections = NAV_SECTIONS.map((section) => `
    <hr class="sidebar-divider" />
    <p class="sidebar-title">${section.title}</p>
    <ul class="sidebar-list">
      ${section.items.map((item) => `
        <li class="sidebar-link ${isActive(item.key) ? 'sidebar-link-active' : ''}">
          <a href="${ROUTES[item.key]}">
            <i class="${item.icon}"></i>
            ${item.label}
          </a>
        </li>
      `).join('')}
    </ul>
  `).join('');

  return `
    <aside id="sidebar-open" class="sidebar-container">
      <button type="button" class="sidebar-btn-toggle" data-action="close" aria-label="Recolher sidebar">
        <i class="fa-solid fa-chevron-left"></i>
      </button>

      <img class="sidebar-logo-open"
           src="/assets/branding/logo-branca.svg"
           alt="Zymos Qualidade na fermentação"
           draggable="false" />

      <nav>${sections}</nav>

      <div class="sidebar-footer">
        <hr class="sidebar-divider" />
        <div class="sidebar-user">
          <div class="sidebar-user-avatar">${user.initials}</div>
          <div class="sidebar-user-info">
            <span class="sidebar-user-name">${user.nome}</span>
            <span class="sidebar-user-role">${user.cargo}</span>
          </div>
          <button class="btn-logout" data-action="logout" aria-label="Sair">
            <i class="fa-solid fa-arrow-right-from-bracket"></i>
          </button>
        </div>
      </div>
    </aside>
  `;
}

function montarSidebarFechada(user) {
  const renderItems = (items) => items.map((item) => `
    <li class="sidebar-link ${isActive(item.key) ? 'sidebar-link-active' : ''}">
      <a href="${ROUTES[item.key]}" title="${item.label}">
        <i class="${item.icon}"></i>
      </a>
    </li>
  `).join('');

  return `
    <aside id="sidebar-close" class="sidebar-container-close" style="display:none">
      <button type="button" class="sidebar-btn-toggle btn-close" data-action="open" aria-label="Expandir sidebar">
        <i class="fa-solid fa-chevron-left"></i>
      </button>

      <img class="sidebar-logo-open"
           src="/assets/branding/mini-logo-branca.png"
           alt="Zymos"
           draggable="false" />

      <nav>
        <span class="sidebar-line"></span>
        <ul class="sidebar-list">
          ${renderItems(NAV_SECTIONS[0].items)}
          <span class="sidebar-line"></span>
          ${renderItems(NAV_SECTIONS[1].items)}
        </ul>
      </nav>

      <div class="sidebar-footer">
        <hr class="sidebar-divider" />
        <div class="sidebar-user">
          <div class="sidebar-user-avatar">${user.initials}</div>
        </div>
      </div>
    </aside>
  `;
}

function abrirSidebar() {
  const open = document.getElementById('sidebar-open');
  const close = document.getElementById('sidebar-close');
  if (open) open.style.display = 'flex';
  if (close) close.style.display = 'none';
}

function fecharSidebar() {
  const open = document.getElementById('sidebar-open');
  const close = document.getElementById('sidebar-close');
  if (open) open.style.display = 'none';
  if (close) close.style.display = 'flex';
}

function logout() {
  // sessionStorage.removeItem('NOME_COMPLETO');
  // sessionStorage.removeItem('CARGO');
  // sessionStorage.removeItem('EMAIL');
  // sessionStorage.removeItem('PASSWORD');
  sessionStorage.clear()
  window.location.href = ROUTES.login;
}

window.abrirSidebar = abrirSidebar;
window.fecharSidebar = fecharSidebar;
window.logout = logout;

function atribuirEventos(container) {
  container.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-action]');
    if (!trigger) return;

    switch (trigger.dataset.action) {
      case 'open': abrirSidebar(); break;
      case 'close': fecharSidebar(); break;
      case 'logout': logout(); break;
    }
  });
}

function init() {
  const mount = document.getElementById('sidebar');
  if (document.getElementById('sidebar-open')) return;
  
  const user = buscarUsuario();
  const html = montarSidebarAberta(user) + montarSidebarFechada(user);
  
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;

  if (mount) {
    mount.replaceWith(...wrapper.childNodes);
    atribuirEventos(document.body);
  } else {
    document.body.prepend(...wrapper.childNodes);
    atribuirEventos(document.body);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}