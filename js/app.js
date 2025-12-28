/* DesiTrails — common app code */
(function(){
  // Wait for DOM to be ready
  function startApp() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      // DOM already loaded, run immediately
      init();
    }
  }
  startApp();
  
  function init() {
    console.log('App.js: init() called');
    const gridEl = document.getElementById('state-grid');
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    if (!gridEl) {
      console.error('App.js: state-grid element not found');
      return;
    }
    console.log('App.js: state-grid element found:', gridEl);

    // Get base path - check if we're on GitHub Pages
    let basePath = '';
    const base = document.querySelector('base');
    if (base && base.href) {
      console.log('App.js: Base href:', base.href);
      // base.href returns full URL, extract just the pathname
      try {
        const url = new URL(base.href);
        basePath = url.pathname.endsWith('/') ? url.pathname.slice(0, -1) : url.pathname;
        console.log('App.js: Extracted basePath from URL:', basePath);
      } catch (e) {
        console.log('App.js: URL parsing failed, trying regex');
        // Fallback: extract from base.href string
        const match = base.href.match(/\/\/[^\/]+(\/.*)/);
        if (match) {
          basePath = match[1].endsWith('/') ? match[1].slice(0, -1) : match[1];
          console.log('App.js: Extracted basePath from regex:', basePath);
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
    
    const dataUrl = basePath ? `${basePath}/data/states.json` : '/data/states.json';
    console.log('Fetching from:', dataUrl, 'Base path:', basePath);
    
    fetch(dataUrl)
      .then(r => {
        console.log('Response status:', r.status);
        if (!r.ok) {
          throw new Error(`HTTP error! status: ${r.status}`);
        }
        return r.json();
      })
      .then(data => {
        console.log('Loaded states:', data.states?.length || 0);
        const states = data.states;
        if (!states || states.length === 0) {
          gridEl.innerHTML = '<div class="text-gray-600">No states found.</div>';
          return;
        }
        const cards = states.map(state => createStateCard(state, basePath));
        cards.forEach(card => gridEl.appendChild(card));
        observeFadeIns();
      })
      .catch(err => {
        console.error('Failed to load states', err);
        gridEl.innerHTML = '<div class="text-gray-600 p-4">Unable to load states right now. Error: ' + err.message + '<br>URL tried: ' + dataUrl + '</div>';
      });
  }

  function createStateCard(state, basePath){
    basePath = basePath || '';
    // Ensure basePath starts with / if it's not empty
    const normalizedBasePath = basePath && !basePath.startsWith('/') ? '/' + basePath : basePath;
    const link = (state.hasDetailPage ? `${normalizedBasePath}/states/${state.slug}/` : `${normalizedBasePath}/states/index.html?state=${state.slug}`);
    const localHero = `${normalizedBasePath}/assets/images/states/${state.slug}/hero.jpg`;
    const fallbackImage = getImageUrl(state.heroQuery || state.name, 1600, 900);
    const card = document.createElement('a');
    card.href = link;
    console.log('Creating card for', state.name, 'with link:', link);
    card.className = 'group block rounded-xl overflow-hidden border border-gray-100 hover:shadow transition-shadow fade-in';
    card.innerHTML = `
      <div class="aspect-video bg-gray-100">
        <img alt="${state.name}" loading="lazy" class="w-full h-full object-cover" src="${localHero}" onerror="this.onerror=null; this.src='${fallbackImage}';" />
      </div>
      <div class="p-4">
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-semibold">${state.name}</h3>
          <span class="text-xs px-2 py-1 rounded bg-earth-100 text-earth-800">${state.vibe}</span>
        </div>
        <p class="text-gray-600 mt-1 text-sm">Places: ${state.places.slice(0,4).join(', ')}...</p>
      </div>`;
    return card;
  }

  function getImageUrl(q, width = 1600, height = 900){
    // Try local image first, then use reliable image service
    // Using Picsum Photos with seed for consistent images
    const seed = q.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return `https://picsum.photos/seed/${seed}/${width}/${height}`;
  }

  function observeFadeIns(){
    const els = document.querySelectorAll('.fade-in');
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('show'); io.unobserve(e.target); } });
    },{rootMargin:'0px 0px -50px 0px'});
    els.forEach(el => io.observe(el));
  }
})();