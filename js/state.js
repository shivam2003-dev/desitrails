/* DesiTrails — state page renderer */
(function(){
  // Wait for DOM to be ready
  function init() {
    const body = document.body;
    const stateSlug = new URL(location.href).searchParams.get('state') || body.dataset.state || 'kerala';
    const routesEl = document.getElementById('routes');
    const themesEl = document.getElementById('themes');

    if (!routesEl || !themesEl) {
      console.error('Routes or themes element not found');
      return;
    }

    // Get base path - check if we're on GitHub Pages
    let basePath = '';
    const base = document.querySelector('base');
    if (base && base.href) {
      try {
        const url = new URL(base.href, window.location.origin);
        basePath = url.pathname.endsWith('/') ? url.pathname.slice(0, -1) : url.pathname;
      } catch (e) {
        const match = base.href.match(/\/\/[^\/]+(\/.*)/);
        if (match) {
          basePath = match[1].endsWith('/') ? match[1].slice(0, -1) : match[1];
        }
      }
    }
    
    // Fallback: extract from current pathname
    if (!basePath && window.location.hostname.includes('github.io')) {
      const pathParts = window.location.pathname.split('/').filter(p => p);
      if (pathParts.length > 0 && pathParts[0] === 'desitrails') {
        basePath = '/desitrails';
      } else if (pathParts.length > 0) {
        basePath = '/' + pathParts[0];
      }
    }

    const statesUrl = basePath ? `${basePath}/data/states.json` : '/data/states.json';
    console.log('Loading state:', stateSlug, 'from:', statesUrl);
    
    fetch(statesUrl)
      .then(r => {
        if (!r.ok) {
          throw new Error(`HTTP error! status: ${r.status}`);
        }
        return r.json();
      })
      .then(data => {
        const state = data.states.find(s => s.slug === stateSlug);
        if (!state){
          routesEl.innerHTML = '<div class="text-gray-600 col-span-full">State not found.</div>';
          return;
        }
        renderHeroImage(state, basePath);
        renderRoutes(state, basePath);
        renderThemes(state);
      })
      .catch(err => {
        console.error('Failed to load state data:', err);
        routesEl.innerHTML = '<div class="text-gray-600 col-span-full">Unable to load state data. Error: ' + err.message + '</div>';
      });
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function renderHeroImage(state, basePath){
    basePath = basePath || '';
    const heroImg = document.getElementById('hero-img');
    if (!heroImg) return;
    
    const localHero = `${basePath}/assets/images/states/${state.slug}/hero.jpg`;
    const fallbackHero = getImageUrl(state.heroQuery || state.name, 1600, 900);
    
    heroImg.src = localHero;
    heroImg.onerror = function() {
      this.onerror = null;
      this.src = fallbackHero;
    };
  }

  function renderRoutes(state, basePath){
    basePath = basePath || '';
    const routesEl = document.getElementById('routes');
    if (!routesEl) {
      console.error('Routes element not found');
      return;
    }
    
    const itinerariesUrl = basePath ? `${basePath}/data/itineraries.json` : '/data/itineraries.json';
    console.log('Loading itineraries from:', itinerariesUrl);
    
    fetch(itinerariesUrl)
      .then(r => {
        if (!r.ok) {
          throw new Error(`HTTP error! status: ${r.status}`);
        }
        return r.json();
      })
      .then(data => {
        const stateItineraries = (data.itineraries || []).filter(it => it.state === state.slug);
        console.log(`Found ${stateItineraries.length} itineraries for ${state.slug}`);
        
        if (stateItineraries.length === 0) {
          routesEl.innerHTML = '<div class="text-gray-600 col-span-full">Itineraries coming soon for this state.</div>';
          return;
        }
        
        // Clear any loading message
        routesEl.innerHTML = '';
        
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
      })
      .catch(err => {
        console.error('Failed to load itineraries:', err);
        routesEl.innerHTML = '<div class="text-gray-600 col-span-full">Unable to load routes. Error: ' + err.message + '</div>';
      });
  }

  function renderThemes(state){
    const themesEl = document.getElementById('themes');
    if (!themesEl) {
      console.error('Themes element not found');
      return;
    }
    
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