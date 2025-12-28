/* DesiTrails — state page renderer */
(function(){
  const body = document.body;
  const stateSlug = new URL(location.href).searchParams.get('state') || body.dataset.state || 'kerala';
  const routesEl = document.getElementById('routes');
  const themesEl = document.getElementById('themes');

  const base = document.querySelector('base')?.href || '';
  const basePath = base.endsWith('/') ? base.slice(0, -1) : base;
  
  fetch(`${basePath}/data/states.json`).then(r=>r.json()).then(data => {
    const state = data.states.find(s => s.slug === stateSlug);
    if (!state){
      document.querySelector('main').innerHTML = '<div class="text-gray-600">State not found.</div>';
      return;
    }
    renderRoutes(state);
    renderThemes(state);
  });

  function renderRoutes(state){
    const base = document.querySelector('base')?.href || '';
    const basePath = base.endsWith('/') ? base.slice(0, -1) : base;
    
    fetch(`${basePath}/data/itineraries.json`).then(r=>r.json()).then(data => {
      const stateItineraries = (data.itineraries || []).filter(it => it.state === state.slug);
      if (stateItineraries.length === 0) {
        routesEl.innerHTML = '<div class="text-gray-600 col-span-full">Itineraries coming soon for this state.</div>';
        return;
      }
      const base = document.querySelector('base')?.href || '';
      const basePath = base.endsWith('/') ? base.slice(0, -1) : base;
      
      stateItineraries.forEach(it => {
        const card = document.createElement('a');
        card.href = `${basePath}/states/${state.slug}/itinerary-${it.durationDays}-days.html`;
        card.className = 'block rounded-xl overflow-hidden border border-gray-100 hover:shadow transition-shadow';
        const localRoute = `${basePath}/assets/images/states/${state.slug}/routes/${it.durationDays}.jpg`;
        const fallbackRoute = getImageUrl(`${state.name} ${it.durationDays} days route`, 1600, 900);
        card.innerHTML = `
          <div class="aspect-video bg-gray-100">
            <img alt="${it.title}" loading="lazy" class="w-full h-full object-cover" src="${localRoute}" onerror="this.onerror=null; this.src='${fallbackRoute}';" />
          </div>
          <div class="p-4">
            <h3 class="text-xl font-semibold">${it.durationDays} Days</h3>
            <p class="text-gray-600">${it.summary}</p>
          </div>`;
        routesEl.appendChild(card);
      });
    }).catch(() => {
      routesEl.innerHTML = '<div class="text-gray-600 col-span-full">Unable to load routes.</div>';
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

  function getImageUrl(q, width = 1600, height = 900){
    const seed = q.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return `https://picsum.photos/seed/${seed}/${width}/${height}`;
  }
})();