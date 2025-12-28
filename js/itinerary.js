/* DesiTrails — itinerary renderer */
(function(){
  const id = document.body.dataset.itineraryId || new URL(location.href).searchParams.get('id');
  const root = document.getElementById('itinerary-root');
  const sidebar = document.getElementById('itinerary-sidebar');
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const base = document.querySelector('base')?.href || '';
  const basePath = base.endsWith('/') ? base.slice(0, -1) : base;
  
  fetch(`${basePath}/data/itineraries.json`).then(r=>r.json()).then(data => {
    const it = (data.itineraries || []).find(x => x.id === id);
    if (!it){ root.innerHTML = '<div class="text-gray-600">Itinerary not found.</div>'; return; }
    document.title = `${it.title} — DesiTrails`;
    renderSidebar(it);
    it.days.forEach((d, idx) => root.appendChild(renderDay(d, idx+1, id)) );
    setupLazyImages();
  });

  function renderSidebar(it){
    const routeSummary = it.route.join(' → ');
    const base = document.querySelector('base')?.href || '';
    const basePath = base.endsWith('/') ? base.slice(0, -1) : base;
    sidebar.innerHTML = `
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

  function renderDay(d, n, itineraryId){
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
          ${d.galleryQueries.map((q,i) => imageCard(q, n, i, itineraryId)).join('')}
        </div>
      </div>`;
    return el;
  }

  function imageCard(q, dayNum, idx, itineraryId){
    const src = unsplashUrl(q);
    return `<figure class="rounded-xl overflow-hidden border border-gray-100">
      <img class="w-full h-40 sm:h-48 object-cover fade-in" alt="${q}" src="${src}" loading="lazy" />
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

  function unsplashUrl(q){
    // Use a more reliable image service
    const seed = q.toLowerCase().replace(/\s+/g, '-');
    return `https://picsum.photos/seed/${seed}/1200/800`;
  }

  function capitalize(s){ return s.charAt(0).toUpperCase() + s.slice(1); }
})();