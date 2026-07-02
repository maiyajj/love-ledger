const App = {
  modules: [],
  activeId: null,

  register(module) {
    this.modules.push(module);
  },

  init() {
    if (this.modules.length === 0) {
      document.getElementById('pages').innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📦</div>
          <div class="empty-state-text">暂无模块</div>
        </div>`;
      return;
    }

    const pagesEl = document.getElementById('pages');
    const tabbarEl = document.getElementById('tabbar');

    this.modules.forEach(m => {
      const page = document.createElement('div');
      page.id = `page-${m.id}`;
      page.className = 'page';
      page.innerHTML = `<h1 class="page-header">${m.title}</h1>`;
      pagesEl.appendChild(page);

      const tab = document.createElement('div');
      tab.className = 'tab';
      tab.dataset.id = m.id;
      tab.innerHTML = `<span class="tab-icon">${m.icon}</span><span>${m.title}</span>`;
      tab.addEventListener('click', () => this.switchTo(m.id));
      tabbarEl.appendChild(tab);

      if (m.render) {
        m.render(document.getElementById(`page-${m.id}`));
      }
    });

    this.switchTo(this.modules[0].id);
  },

  switchTo(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));

    const page = document.getElementById(`page-${id}`);
    if (page) page.classList.add('active');

    const tab = document.querySelector(`.tab[data-id="${id}"]`);
    if (tab) tab.classList.add('active');

    this.activeId = id;
  }
};
