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
    fetch('/data/itineraries.json').then(r=>r.json()).then(data => {
      const stateItineraries = (data.itineraries || []).filter(it => it.state === state.slug);
      if (stateItineraries.length === 0) {
        routesEl.innerHTML = '<div class="text-gray-600 col-span-full">Itineraries coming soon for this state.</div>';
        return;
      }
      stateItineraries.forEach(it => {
        const card = document.createElement('a');
        card.href = `/states/${state.slug}/itinerary-${it.durationDays}-days.html`;
        card.className = 'block rounded-xl overflow-hidden border border-gray-100 hover:shadow transition-shadow';
        const local = `/assets/images/states/${state.slug}/routes/${it.durationDays}.jpg`;
        const img = unsplashUrl(`${state.name} ${it.durationDays} days`);
        card.innerHTML = `
          <div class="aspect-video bg-gray-100">
            <img alt="${it.title}" loading="lazy" class="w-full h-full object-cover" src="${local}" onerror="this.onerror=null; this.src='${img}';" />
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

  function unsplashUrl(q){
    return `https://source.unsplash.com/1600x900/?${encodeURIComponent(q)},india`;
  }
})();