/* DesiTrails — itinerary renderer */
(function(){
  console.log('Itinerary.js: Script loaded!');
  
  function init() {
    const root = document.getElementById('itinerary-root');
    const sidebar = document.getElementById('itinerary-sidebar');
    const yearEl = document.getElementById('year');
    
    if (!root || !sidebar) {
      console.error('Itinerary.js: Root or sidebar element not found');
      return;
    }
    
    try {
      const id = document.body.dataset.itineraryId || new URL(location.href).searchParams.get('id');
      console.log('Itinerary.js: Itinerary ID:', id);
    
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Get base path - check if we're on GitHub Pages
    let basePath = '';
    const base = document.querySelector('base');
    console.log('Itinerary.js: Base tag:', base);
    
    if (base && base.href) {
      console.log('Itinerary.js: Base href:', base.href);
      try {
        const url = new URL(base.href);
        basePath = url.pathname.endsWith('/') ? url.pathname.slice(0, -1) : url.pathname;
        console.log('Itinerary.js: Extracted basePath:', basePath);
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
    
    const itinerariesUrl = basePath ? `${basePath}/data/itineraries.json` : '/data/itineraries.json';
    console.log('Itinerary.js: Fetching from:', itinerariesUrl);
    
    fetch(itinerariesUrl)
      .then(r => {
        if (!r.ok) {
          throw new Error(`HTTP error! status: ${r.status}`);
        }
        return r.json();
      })
      .then(data => {
        const it = (data.itineraries || []).find(x => x.id === id);
        if (!it) {
          root.innerHTML = '<div class="text-gray-600">Itinerary not found.</div>';
          return;
        }
        console.log('Itinerary.js: Found itinerary:', it.title);
        document.title = `${it.title} — DesiTrails`;
        renderSidebar(it, basePath, sidebar);
        it.days.forEach((d, idx) => root.appendChild(renderDay(d, idx+1, id, basePath)) );
        setupLazyImages();
      })
      .catch(err => {
        console.error('Itinerary.js: Failed to load:', err);
        root.innerHTML = `<div class="text-gray-600 p-4 border border-red-200 rounded bg-red-50">
          <p class="font-semibold text-red-800">Error loading itinerary</p>
          <p class="text-sm text-red-600">${err.message}</p>
          <p class="text-xs text-gray-500 mt-2">URL tried: ${itinerariesUrl}</p>
        </div>`;
      });
    } catch (error) {
      console.error('Itinerary.js: Fatal error in init():', error);
      if (root) {
        root.innerHTML = `<div class="text-gray-600 p-4 border border-red-500 rounded bg-red-100">
          <p class="font-semibold text-red-800">JavaScript Error</p>
          <p class="text-sm text-red-600">${error.message}</p>
          <p class="text-xs text-gray-600 mt-2">Check console for details</p>
        </div>`;
      }
    }
  }
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(init, 100);
    });
  } else {
    setTimeout(init, 100);
  }

  function renderSidebar(it, basePath, sidebarEl){
    basePath = basePath || '';
    if (!sidebarEl) {
      console.error('Itinerary.js: sidebar element not provided to renderSidebar');
      return;
    }
    const routeSummary = it.route.join(' → ');
    sidebarEl.innerHTML = `
      <h3 class="text-xl font-semibold mb-2">${it.title}</h3>
      <div class="text-gray-700 mb-3">${routeSummary}</div>
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="border border-gray-100 rounded p-3">
          <div class="text-xs text-gray-500">Duration</div>
          <div class="text-lg font-semibold">${it.durationDays} days</div>
        </div>
        <div class="border border-gray-100 rounded p-3">
          <div class="text-xs text-gray-500">Best time</div>
          <div class="text-lg font-semibold">${it.bestTime}</div>
        </div>
      </div>
      <a class="text-earth-700 hover:underline" href="${basePath}/states/${it.state}/">Back to ${capitalize(it.state)}</a>`;
  }

  function renderDay(d, n, itineraryId, basePath){
    basePath = basePath || '';
    const el = document.createElement('section');
    el.className = 'space-y-4';
    el.innerHTML = `
      <div>
        <h2 class="text-2xl font-semibold">${d.day}</h2>
        <p class="text-gray-600">${d.theme}</p>
      </div>
      <div class="grid md:grid-cols-3 gap-4">
        <div class="space-y-2">
          <div class="text-sm"><span class="font-semibold">Morning:</span> ${d.morning}</div>
          <div class="text-sm"><span class="font-semibold">Afternoon:</span> ${d.afternoon}</div>
          <div class="text-sm"><span class="font-semibold">Evening:</span> ${d.evening}</div>
          <div class="text-sm text-gray-600">Distance: ${d.distanceKm} km • Travel: ${d.driveTime}</div>
          <div class="text-sm"><span class="font-semibold">Must-see:</span> ${d.mustSee.join(', ')}</div>
          <div class="text-sm"><span class="font-semibold">Optional:</span> ${d.optional.join(', ')}</div>
        </div>
        <div class="md:col-span-2 grid sm:grid-cols-2 gap-3">
          ${d.galleryQueries.map((q,i) => imageCard(q, n, i, itineraryId, basePath)).join('')}
        </div>
      </div>`;
    return el;
  }

  function imageCard(q, dayNum, idx, itineraryId, basePath){
    basePath = basePath || '';
    const local = `${basePath}/assets/images/itineraries/${itineraryId}/day-${dayNum}-${idx+1}.jpg`;
    const fallback = getImageUrl(q, 1200, 800);
    return `<figure class="rounded-xl overflow-hidden border border-gray-100">
      <img class="w-full h-40 sm:h-48 object-cover fade-in" alt="${q}" src="${local}" loading="lazy" onerror="this.onerror=null; this.src='${fallback}';" />
      <figcaption class="px-3 py-2 text-xs text-gray-600">${q}</figcaption>
    </figure>`;
  }

  function setupLazyImages(){
    const imgs = document.querySelectorAll('img[data-src]');
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting){ const img=e.target; img.src = img.dataset.src; img.classList.add('show'); io.unobserve(img); } });
    },{rootMargin:'100px'});
    imgs.forEach(img => io.observe(img));
  }

  function getImageUrl(q, width = 1200, height = 800){
    const seed = q.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return `https://picsum.photos/seed/${seed}/${width}/${height}`;
  }

  function capitalize(s){ return s.charAt(0).toUpperCase() + s.slice(1); }
})();