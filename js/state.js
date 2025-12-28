/* DesiTrails — state page renderer */
(function(){
  const body = document.body;
  const stateSlug = new URL(location.href).searchParams.get('state') || body.dataset.state || 'kerala';
  const routesEl = document.getElementById('routes');
  const themesEl = document.getElementById('themes');

  fetch('/data/states.json').then(r=>r.json()).then(data => {
    const state = data.states.find(s => s.slug === stateSlug);
    if (!state){
      document.querySelector('main').innerHTML = '<div class="text-gray-600">State not found.</div>';
      return;
    }
    renderRoutes(state);
    renderThemes(state);
  });

  function renderRoutes(state){
    const routes = [
      { days: 4, title: '4 Days', desc: 'Backwaters & beaches', link: `/states/${state.slug}/itinerary-4-days.html` },
      { days: 6, title: '6 Days', desc: 'Hills + backwaters', link: '#' },
      { days: 8, title: '8 Days', desc: 'Extended slow travel', link: '#' }
    ];
    routes.forEach(r => {
      const card = document.createElement('a');
      card.href = r.link;
      card.className = 'block rounded-xl overflow-hidden border border-gray-100 hover:shadow transition-shadow';
      const local = `/assets/images/states/${state.slug}/routes/${r.days}.jpg`;
      const img = unsplashUrl(`${state.name} ${r.days} days`);
      card.innerHTML = `
        <div class="aspect-video bg-gray-100">
          <img alt="${state.name} ${r.title}" loading="lazy" class="w-full h-full object-cover" src="${local}" onerror="this.onerror=null; this.src='${img}';" />
        </div>
        <div class="p-4">
          <h3 class="text-xl font-semibold">${r.title}</h3>
          <p class="text-gray-600">${r.desc}</p>
        </div>`;
      routesEl.appendChild(card);
    });
  }

  function renderThemes(state){
    const themes = state.themes || ['Beach','Honeymoon','Family','Nature','Culture','Hill'];
    themes.forEach(t => {
      const pill = document.createElement('a');
      pill.href = `#${t.toLowerCase()}`;
      pill.className = 'inline-flex items-center gap-2 px-3 py-2 rounded-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50';
      pill.textContent = t;
      themesEl.appendChild(pill);
    });
  }

  function unsplashUrl(q){
    return `https://source.unsplash.com/1600x900/?${encodeURIComponent(q)},india`;
  }
})();