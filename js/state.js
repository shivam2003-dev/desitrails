/* DesiTrails — state page renderer */
(function(){
  console.log('State.js: Script loaded!');
  
  // Wait for DOM to be ready
  function init() {
    try {
      console.log('State.js: init() called');
      const body = document.body;
      const stateSlug = new URL(location.href).searchParams.get('state') || body.dataset.state || 'kerala';
      console.log('State.js: State slug:', stateSlug);
    
    const routesEl = document.getElementById('routes');
    const themesEl = document.getElementById('themes');
    console.log('State.js: routesEl:', routesEl, 'themesEl:', themesEl);

    if (!routesEl || !themesEl) {
      console.error('State.js: Routes or themes element not found. routesEl:', routesEl, 'themesEl:', themesEl);
      // Try to find them again after a delay
      setTimeout(() => {
        const retryRoutes = document.getElementById('routes');
        const retryThemes = document.getElementById('themes');
        console.log('State.js: Retry - routesEl:', retryRoutes, 'themesEl:', retryThemes);
        if (retryRoutes && retryThemes) {
          console.log('State.js: Found elements on retry, continuing...');
          // Re-run init with found elements
          init();
        }
      }, 500);
      return;
    }
    
    // Test: Can we modify the DOM?
    console.log('State.js: Testing DOM modification...');
    try {
      routesEl.innerHTML = '<div class="col-span-full text-blue-600">Script is running! Loading data...</div>';
      console.log('State.js: Successfully modified routesEl innerHTML');
    } catch (e) {
      console.error('State.js: Failed to modify DOM:', e);
    }

    // Get base path - check if we're on GitHub Pages
    let basePath = '';
    const base = document.querySelector('base');
    console.log('State.js: Base tag:', base);
    
    if (base && base.href) {
      console.log('State.js: Base href:', base.href);
      try {
        // base.href returns full URL, extract just the pathname
        const url = new URL(base.href);
        basePath = url.pathname.endsWith('/') ? url.pathname.slice(0, -1) : url.pathname;
        console.log('State.js: Extracted basePath from URL:', basePath);
      } catch (e) {
        console.log('State.js: URL parsing failed, trying regex');
        // Fallback: extract from base.href string
        const match = base.href.match(/\/\/[^\/]+(\/.*)/);
        if (match) {
          basePath = match[1].endsWith('/') ? match[1].slice(0, -1) : match[1];
          console.log('State.js: Extracted basePath from regex:', basePath);
        }
      }
    }
    
    // Fallback: extract from current pathname
    if (!basePath) {
      console.log('State.js: No basePath from base tag, trying pathname');
      if (window.location.hostname.includes('github.io')) {
        const pathParts = window.location.pathname.split('/').filter(p => p);
        console.log('State.js: Path parts:', pathParts);
        if (pathParts.length > 0 && pathParts[0] === 'desitrails') {
          basePath = '/desitrails';
        } else if (pathParts.length > 0) {
          basePath = '/' + pathParts[0];
        }
        console.log('State.js: Fallback basePath:', basePath);
      }
    }

    const statesUrl = basePath ? `${basePath}/data/states.json` : '/data/states.json';
    console.log('State.js: Base path:', basePath);
    console.log('State.js: Loading state:', stateSlug, 'from:', statesUrl);
    console.log('State.js: Base tag href:', base ? base.href : 'not found');
    
    fetch(statesUrl)
      .then(r => {
        if (!r.ok) {
          throw new Error(`HTTP error! status: ${r.status}`);
        }
        return r.json();
      })
      .then(data => {
        console.log('State.js: State data loaded, finding state:', stateSlug);
        const state = data.states.find(s => s.slug === stateSlug);
        if (!state){
          console.error('State.js: State not found:', stateSlug);
          routesEl.innerHTML = '<div class="text-gray-600 col-span-full">State not found.</div>';
          return;
        }
        console.log('State.js: Found state:', state.name, 'calling renderHeroImage');
        renderHeroImage(state, basePath);
        console.log('State.js: renderHeroImage completed');
        renderRoutes(state, basePath);
        renderThemes(state);
      })
      .catch(err => {
        console.error('Failed to load state data:', err);
        const errorMsg = `<div class="text-gray-600 col-span-full p-4 border border-red-200 rounded bg-red-50">
          <p class="font-semibold text-red-800">Error loading state data</p>
          <p class="text-sm text-red-600">${err.message}</p>
          <p class="text-xs text-gray-500 mt-2">URL tried: ${statesUrl}</p>
        </div>`;
        if (routesEl) routesEl.innerHTML = errorMsg;
      });
    } catch (error) {
      console.error('State.js: Fatal error in init():', error);
      const routesEl = document.getElementById('routes');
      if (routesEl) {
        routesEl.innerHTML = `<div class="col-span-full p-4 border border-red-500 rounded bg-red-100">
          <p class="font-semibold text-red-800">JavaScript Error</p>
          <p class="text-sm text-red-600">${error.message}</p>
          <p class="text-xs text-gray-600 mt-2">Check console for details</p>
        </div>`;
      }
    }
  }

  // Wait for DOM to be ready and base tag to be set
  function startApp() {
    console.log('State.js: Starting app, readyState:', document.readyState);
    
    // Try multiple times to ensure base tag is set
    function tryInit(attempts) {
      if (attempts <= 0) {
        console.error('State.js: Failed to initialize after multiple attempts - running anyway');
        // Run anyway even if base tag isn't found
        init();
        return;
      }
      
      const base = document.querySelector('base');
      if (!base || !base.href) {
        console.log('State.js: Base tag not ready, retrying...', attempts);
        setTimeout(() => tryInit(attempts - 1), 100);
        return;
      }
      
      console.log('State.js: Base tag found, initializing...');
      init();
    }
    
    // Use window.load to ensure everything is ready
    if (document.readyState === 'complete') {
      console.log('State.js: Document already complete');
      setTimeout(() => tryInit(5), 100);
    } else {
      window.addEventListener('load', function() {
        console.log('State.js: Window load event fired');
        setTimeout(() => tryInit(5), 100);
      });
      
      // Also try on DOMContentLoaded as backup
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
          console.log('State.js: DOMContentLoaded fired');
          setTimeout(() => tryInit(5), 200);
        });
      }
    }
  }
  startApp();

  function renderHeroImage(state, basePath){
    basePath = basePath || '';
    
    // Try to find hero image element - with retry logic
    function findAndSetHeroImage(attempts) {
      const heroImg = document.getElementById('hero-img');
      
      if (!heroImg) {
        if (attempts > 0) {
          console.log(`renderHeroImage: hero-img not found, retrying... (${attempts} attempts left)`);
          setTimeout(() => findAndSetHeroImage(attempts - 1), 100);
          return;
        }
        console.error('renderHeroImage: hero-img element not found after retries!');
        return;
      }
      
      const localHero = `${basePath}/assets/images/states/${state.slug}/hero.jpg`;
      const fallbackHero = getImageUrl(state.heroQuery || state.name, 1600, 900);
      
      console.log('renderHeroImage: Setting src to:', localHero);
      
      // Set the image source
      heroImg.src = localHero;
      heroImg.alt = state.name || 'State hero image';
      
      // Handle error - fallback to Picsum
      heroImg.onerror = function() {
        console.log('renderHeroImage: Local image failed, using fallback:', fallbackHero);
        this.onerror = null; // Prevent infinite loop
        this.src = fallbackHero;
      };
      
      // Log success when image loads
      heroImg.onload = function() {
        console.log('renderHeroImage: Image loaded successfully:', this.src);
      };
    }
    
    // Start with retry logic (5 attempts)
    findAndSetHeroImage(5);
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
        const errorMsg = `<div class="text-gray-600 col-span-full p-4 border border-red-200 rounded bg-red-50">
          <p class="font-semibold text-red-800">Error loading itineraries</p>
          <p class="text-sm text-red-600">${err.message}</p>
          <p class="text-xs text-gray-500 mt-2">URL tried: ${itinerariesUrl}</p>
        </div>`;
        if (routesEl) routesEl.innerHTML = errorMsg;
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