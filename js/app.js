/* DesiTrails — common app code */
(function(){
  const gridEl = document.getElementById('state-grid');
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  if (!gridEl) return;

  const base = document.querySelector('base')?.href || '';
  const basePath = base.endsWith('/') ? base.slice(0, -1) : base;
  
  fetch(`${basePath}/data/states.json`)
    .then(r => r.json())
    .then(data => {
      const states = data.states;
      const cards = states.map(state => createStateCard(state));
      cards.forEach(card => gridEl.appendChild(card));
      observeFadeIns();
    })
    .catch(err => {
      console.error('Failed to load states', err);
      gridEl.innerHTML = '<div class="text-gray-600">Unable to load states right now.</div>';
    });

  function createStateCard(state){
    const base = document.querySelector('base')?.href || '';
    const basePath = base.endsWith('/') ? base.slice(0, -1) : base;
    const link = (state.hasDetailPage ? `${basePath}/states/${state.slug}/` : `${basePath}/states/index.html?state=${state.slug}`);
    const fallback = unsplashUrl(state.heroQuery || state.name);
    const localHero = `${basePath}/assets/images/states/${state.slug}/hero.jpg`;
    const card = document.createElement('a');
    card.href = link;
    card.className = 'group block rounded-xl overflow-hidden border border-gray-100 hover:shadow transition-shadow fade-in';
    card.innerHTML = `
      <div class="aspect-video bg-gray-100">
        <img alt="${state.name}" loading="lazy" class="w-full h-full object-cover" src="${localHero}" onerror="this.onerror=null; this.src='${fallback}';" />
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

  function unsplashUrl(q){
    return `https://source.unsplash.com/1600x900/?${encodeURIComponent(q)},india`;
  }

  function observeFadeIns(){
    const els = document.querySelectorAll('.fade-in');
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('show'); io.unobserve(e.target); } });
    },{rootMargin:'0px 0px -50px 0px'});
    els.forEach(el => io.observe(el));
  }
})();