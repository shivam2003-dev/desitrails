/* DesiTrails — itinerary renderer */
/* Version: 6.0 - BEAUTIFUL KERALA - Stunning Interesting Facts Section */
/* Updated: 2025-12-28 - Completely redesigned facts section with beautiful gradients, icons, and animations */
(function(){
  console.log('Itinerary.js: Script loaded! (v5.3 - Enhanced with Interesting Facts)');
  
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
        
        // Ensure sidebar element exists before rendering
        const sidebarEl = document.getElementById('itinerary-sidebar');
        if (!sidebarEl) {
          console.error('Itinerary.js: Sidebar element not found when trying to render');
          root.innerHTML = '<div class="text-gray-600 p-4 border border-red-200 rounded bg-red-50">Error: Sidebar element not found</div>';
          return;
        }
        
        try {
          renderSidebar(it, basePath, sidebarEl);
          it.days.forEach((d, idx) => root.appendChild(renderDay(d, idx+1, id, basePath)) );
        } catch (renderError) {
          console.error('Itinerary.js: Error rendering content:', renderError);
          root.innerHTML = `<div class="text-gray-600 p-4 border border-red-200 rounded bg-red-50">
            <p class="font-semibold text-red-800">Error rendering itinerary</p>
            <p class="text-sm text-red-600">${renderError.message}</p>
          </div>`;
        }
      })
      .catch(err => {
        console.error('Itinerary.js: Failed to load:', err);
        const errorMsg = err.message || 'Unknown error';
        root.innerHTML = `<div class="text-gray-600 p-4 border border-red-200 rounded bg-red-50">
          <p class="font-semibold text-red-800">Error loading itinerary</p>
          <p class="text-sm text-red-600">${errorMsg}</p>
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
    try {
      basePath = basePath || '';
      if (!sidebarEl) {
        throw new Error('Sidebar element not provided to renderSidebar');
      }
      const routeSummary = it.route.join(' → ');
      
      // Calculate total distance and travel time
      const totalDistance = it.days.reduce((sum, day) => sum + (day.distanceKm || 0), 0);
      const totalDays = it.days.length;
      
      sidebarEl.innerHTML = `
      <div class="space-y-5">
        <!-- Title Section -->
        <div class="bg-gradient-to-br from-earth-500 to-earth-600 rounded-2xl p-5 text-white shadow-xl">
          <h3 class="text-xl font-bold mb-2 leading-tight">${it.title}</h3>
          <p class="text-sm text-earth-100 leading-relaxed">${it.summary}</p>
        </div>
        
        <!-- Trip Summary Card -->
        <div class="bg-white rounded-xl p-5 border-2 border-earth-100 shadow-lg">
          <div class="flex items-center gap-2 mb-4">
            <span class="text-2xl">📊</span>
            <h4 class="text-base font-bold text-gray-800">Trip Summary</h4>
          </div>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-gradient-to-r from-earth-50 to-white rounded-lg border border-earth-100">
              <span class="text-sm font-medium text-gray-700 flex items-center gap-2">
                <span>📅</span> Duration
              </span>
              <span class="text-lg font-bold text-earth-700">${it.durationDays} days</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-gradient-to-r from-earth-50 to-white rounded-lg border border-earth-100">
              <span class="text-sm font-medium text-gray-700 flex items-center gap-2">
                <span>🗺️</span> Total Distance
              </span>
              <span class="text-lg font-bold text-earth-700">${totalDistance} km</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-gradient-to-r from-earth-50 to-white rounded-lg border border-earth-100">
              <span class="text-sm font-medium text-gray-700 flex items-center gap-2">
                <span>🌤️</span> Best Time
              </span>
              <span class="text-sm font-bold text-earth-700 text-right">${it.bestTime}</span>
            </div>
          </div>
        </div>
        
        <!-- Route Card -->
        <div class="bg-white rounded-xl p-5 border-2 border-earth-100 shadow-lg">
          <div class="flex items-center gap-2 mb-4">
            <span class="text-2xl">🗺️</span>
            <h4 class="text-base font-bold text-gray-800">Your Route</h4>
          </div>
          <div class="space-y-2">
            ${it.route.map((place, idx) => {
              const dayDistance = (it.days && it.days[idx] && it.days[idx].distanceKm) ? it.days[idx].distanceKm : '?';
              return `<div class="flex items-center ${idx < it.route.length - 1 ? 'mb-2' : ''}">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-earth-400 to-earth-600 text-white flex items-center justify-center text-sm font-bold shadow-md mr-3">${idx + 1}</div>
                <div class="flex-1">
                  <div class="text-sm font-semibold text-gray-800">${place}</div>
                  ${idx < it.route.length - 1 ? `<div class="text-xs text-gray-400 mt-1 ml-11">↓ ${dayDistance} km</div>` : ''}
                </div>
              </div>`;
            }).join('')}
          </div>
        </div>
        
        ${it.generalTips && it.generalTips.length > 0 ? `
        <!-- General Tips Section -->
        <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border-2 border-purple-100 shadow-lg">
          <div class="flex items-center gap-2 mb-4">
            <span class="text-2xl">🌟</span>
            <h4 class="text-base font-bold text-gray-800">General Travel Tips</h4>
          </div>
          <div class="grid md:grid-cols-1 gap-2">
            ${it.generalTips.map(tip => `<div class="text-xs text-gray-700 flex items-start gap-2 p-2 bg-white/60 rounded-lg"><span class="text-purple-500 mt-0.5 flex-shrink-0">✓</span><span>${tip}</span></div>`).join('')}
          </div>
        </div>
        ` : ''}
        
        <!-- Back Link -->
        <a class="block w-full text-center bg-earth-500 hover:bg-earth-600 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105" href="${basePath ? basePath + '/states/' + it.state + '/' : '/states/' + it.state + '/'}">
          ← Back to ${capitalize(it.state)}
        </a>
      </div>`;
    } catch (error) {
      console.error('Itinerary.js: Error in renderSidebar:', error);
      throw error; // Re-throw to be caught by caller
    }
  }

  function renderDay(d, n, itineraryId, basePath){
    basePath = basePath || '';
    
    // Debug: Log interesting facts
    if (d.interestingFacts && d.interestingFacts.length > 0) {
      console.log(`Itinerary.js: Day ${n} has ${d.interestingFacts.length} interesting facts`);
    }
    
    const el = document.createElement('section');
    el.className = 'space-y-6 mb-12';
    
    // Extract location name from day title for image
    const locationMap = {
      'trivandrum': 'trivandrum', 'kovalam': 'kovalam', 'varkala': 'varkala',
      'alleppey': 'alleppey', 'kumarakom': 'kumarakom', 'kochi': 'kochi',
      'munnar': 'munnar', 'thekkady': 'thekkady', 'wayanad': 'wayanad', 'calicut': 'calicut'
    };
    
    let locationName = '';
    const dayLower = d.day.toLowerCase();
    for (const [key, value] of Object.entries(locationMap)) {
      if (dayLower.includes(key)) {
        locationName = value;
        break;
      }
    }
    
    const imagePath = locationName ? `${basePath}/assets/images/states/kerala/gallery/${locationName}.jpg` : '';
    
    // Beautiful day card with gradient and shadow
    el.innerHTML = `
      <div class="bg-gradient-to-r from-earth-50 to-white rounded-2xl shadow-lg border border-earth-100 p-6 md:p-8 overflow-hidden">
        ${imagePath ? `
        <!-- Location Image -->
        <div class="mb-6 -mx-6 -mt-6">
          <img src="${imagePath}" 
               alt="${d.day}" 
               class="w-full h-64 object-cover"
               onerror="this.style.display='none'"
               loading="lazy">
        </div>
        ` : ''}
        
        <!-- Day Header with Icon -->
        <div class="flex items-start justify-between mb-6 pb-4 border-b-2 border-earth-200">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-10 h-10 rounded-full bg-earth-500 text-white flex items-center justify-center font-bold text-lg shadow-md">${n}</div>
              <h2 class="text-3xl font-bold text-gray-900">${d.day}</h2>
            </div>
            <p class="text-earth-600 font-medium ml-13 mt-1 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-earth-400"></span>
              ${d.theme}
            </p>
          </div>
        </div>
        
        <!-- Beautiful Activity Timeline -->
        <div class="space-y-4 mb-6">
          <div class="flex gap-4 group">
            <div class="flex flex-col items-center">
              <div class="w-3 h-3 rounded-full bg-amber-400 border-2 border-white shadow-md"></div>
              <div class="w-0.5 h-full bg-gradient-to-b from-amber-200 to-transparent mt-1"></div>
            </div>
            <div class="flex-1 bg-gradient-to-r from-amber-50 to-white rounded-xl p-4 border-l-4 border-amber-400 shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-amber-600 font-bold text-sm uppercase tracking-wide">🌅 Morning</span>
              </div>
              <p class="text-gray-700 leading-relaxed">${d.morning}</p>
            </div>
          </div>
          
          <div class="flex gap-4 group">
            <div class="flex flex-col items-center">
              <div class="w-3 h-3 rounded-full bg-blue-400 border-2 border-white shadow-md"></div>
              <div class="w-0.5 h-full bg-gradient-to-b from-blue-200 to-transparent mt-1"></div>
            </div>
            <div class="flex-1 bg-gradient-to-r from-blue-50 to-white rounded-xl p-4 border-l-4 border-blue-400 shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-blue-600 font-bold text-sm uppercase tracking-wide">☀️ Afternoon</span>
              </div>
              <p class="text-gray-700 leading-relaxed">${d.afternoon}</p>
            </div>
          </div>
          
          <div class="flex gap-4">
            <div class="flex flex-col items-center">
              <div class="w-3 h-3 rounded-full bg-purple-400 border-2 border-white shadow-md"></div>
            </div>
            <div class="flex-1 bg-gradient-to-r from-purple-50 to-white rounded-xl p-4 border-l-4 border-purple-400 shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-purple-600 font-bold text-sm uppercase tracking-wide">🌙 Evening</span>
              </div>
              <p class="text-gray-700 leading-relaxed">${d.evening}</p>
            </div>
          </div>
        </div>
        
        <!-- Enhanced Info Cards -->
        <div class="grid md:grid-cols-2 gap-4 mb-4">
          <!-- Travel Info Card -->
          <div class="bg-white rounded-xl p-5 border-2 border-earth-100 shadow-md hover:shadow-lg transition-all">
            <div class="flex items-center gap-2 mb-3">
              <span class="text-2xl">🚗</span>
              <h3 class="text-base font-bold text-gray-800">Travel Details</h3>
            </div>
            <div class="space-y-3">
              <div class="flex items-center justify-between p-2 bg-earth-50 rounded-lg">
                <span class="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <span>📏</span> Distance
                </span>
                <span class="text-base font-bold text-earth-700">${d.distanceKm} km</span>
              </div>
              <div class="flex items-center justify-between p-2 bg-earth-50 rounded-lg">
                <span class="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <span>⏱️</span> Drive Time
                </span>
                <span class="text-base font-bold text-earth-700">${d.driveTime}</span>
              </div>
            </div>
          </div>
          
          <!-- Attractions Card -->
          <div class="bg-white rounded-xl p-5 border-2 border-earth-100 shadow-md hover:shadow-lg transition-all">
            <div class="flex items-center gap-2 mb-3">
              <span class="text-2xl">📍</span>
              <h3 class="text-base font-bold text-gray-800">Places to Visit</h3>
            </div>
            <div class="space-y-3">
              <div>
                <div class="text-xs font-semibold text-green-700 mb-2 uppercase tracking-wide">Must-see</div>
                <div class="flex flex-wrap gap-2">
                  ${d.mustSee.map(place => `<span class="inline-flex items-center gap-1 bg-gradient-to-r from-green-100 to-green-50 text-green-800 px-3 py-1.5 rounded-full text-xs font-semibold border border-green-200 shadow-sm">✨ ${place}</span>`).join('')}
                </div>
              </div>
              ${d.optional && d.optional.length > 0 ? `
              <div>
                <div class="text-xs font-semibold text-blue-700 mb-2 uppercase tracking-wide">Optional</div>
                <div class="flex flex-wrap gap-2">
                  ${d.optional.map(place => `<span class="inline-flex items-center gap-1 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 px-3 py-1.5 rounded-full text-xs font-semibold border border-blue-200 shadow-sm">💫 ${place}</span>`).join('')}
                </div>
              </div>
              ` : ''}
            </div>
          </div>
        </div>
        
        ${d.food || d.hotels || d.tips ? `
        <!-- Food, Hotels & Tips Section - DETAILED -->
        <div class="mt-6 space-y-4">
          <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>📋</span>
            <span>Travel Essentials for ${d.day.split('—')[1]?.trim() || 'This Day'}</span>
          </h3>
          
          <div class="grid md:grid-cols-3 gap-4">
            ${d.food ? `
            <!-- Food Card - ENHANCED -->
            <div class="bg-gradient-to-br from-orange-50 via-orange-25 to-white rounded-xl p-6 border-2 border-orange-200 shadow-lg hover:shadow-xl transition-all">
              <div class="flex items-center gap-3 mb-4">
                <span class="text-3xl">🍽️</span>
                <h3 class="text-lg font-bold text-gray-900">Food & Dining</h3>
              </div>
              <div class="space-y-4">
                <div>
                  <div class="text-sm font-bold text-orange-800 mb-3 flex items-center gap-2">
                    <span>✨</span>
                    <span>Must Try Dishes</span>
                  </div>
                  <ul class="space-y-2">
                    ${d.food.mustTry.map(item => `<li class="text-sm text-gray-800 flex items-start gap-2 bg-white/70 p-2 rounded-lg"><span class="text-orange-600 mt-0.5 flex-shrink-0">🍴</span><span class="font-medium">${item}</span></li>`).join('')}
                  </ul>
                </div>
                ${d.food.restaurants && d.food.restaurants.length > 0 ? `
                <div class="mt-4 pt-4 border-t-2 border-orange-200">
                  <div class="text-sm font-bold text-orange-800 mb-3 flex items-center gap-2">
                    <span>📍</span>
                    <span>Recommended Restaurants</span>
                  </div>
                  <ul class="space-y-2">
                    ${d.food.restaurants.map(rest => `<li class="text-sm text-gray-700 flex items-start gap-2 bg-white/70 p-2 rounded-lg"><span class="text-orange-500 mt-0.5 flex-shrink-0">🏪</span><span>${rest}</span></li>`).join('')}
                  </ul>
                </div>
                ` : ''}
              </div>
            </div>
            ` : ''}
            
            ${d.hotels ? `
            <!-- Hotels Card - ENHANCED -->
            <div class="bg-gradient-to-br from-blue-50 via-blue-25 to-white rounded-xl p-6 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all">
              <div class="flex items-center gap-3 mb-4">
                <span class="text-3xl">🏨</span>
                <h3 class="text-lg font-bold text-gray-900">Accommodation</h3>
              </div>
              <div class="space-y-4">
                ${d.hotels.budget && d.hotels.budget.length > 0 ? `
                <div>
                  <div class="text-sm font-bold text-green-700 mb-2 flex items-center gap-2">
                    <span>💰</span>
                    <span>Budget Options</span>
                  </div>
                  <ul class="space-y-1.5">
                    ${d.hotels.budget.map(hotel => `<li class="text-sm text-gray-800 bg-white/70 p-2 rounded-lg font-medium">${hotel}</li>`).join('')}
                  </ul>
                </div>
                ` : ''}
                ${d.hotels.midRange && d.hotels.midRange.length > 0 ? `
                <div>
                  <div class="text-sm font-bold text-blue-700 mb-2 flex items-center gap-2">
                    <span>⭐</span>
                    <span>Mid-Range</span>
                  </div>
                  <ul class="space-y-1.5">
                    ${d.hotels.midRange.map(hotel => `<li class="text-sm text-gray-800 bg-white/70 p-2 rounded-lg font-medium">${hotel}</li>`).join('')}
                  </ul>
                </div>
                ` : ''}
                ${d.hotels.luxury && d.hotels.luxury.length > 0 ? `
                <div>
                  <div class="text-sm font-bold text-purple-700 mb-2 flex items-center gap-2">
                    <span>✨</span>
                    <span>Luxury</span>
                  </div>
                  <ul class="space-y-1.5">
                    ${d.hotels.luxury.map(hotel => `<li class="text-sm text-gray-800 bg-white/70 p-2 rounded-lg font-medium">${hotel}</li>`).join('')}
                  </ul>
                </div>
                ` : ''}
              </div>
            </div>
            ` : ''}
            
            ${d.tips ? `
            <!-- Tips Card - ENHANCED -->
            <div class="bg-gradient-to-br from-amber-50 via-amber-25 to-white rounded-xl p-6 border-2 border-amber-200 shadow-lg hover:shadow-xl transition-all">
              <div class="flex items-center gap-3 mb-4">
                <span class="text-3xl">💡</span>
                <h3 class="text-lg font-bold text-gray-900">Tips & Tricks</h3>
              </div>
              <ul class="space-y-2.5">
                ${d.tips.map(tip => `<li class="text-sm text-gray-800 flex items-start gap-2 bg-white/70 p-2.5 rounded-lg"><span class="text-amber-600 mt-0.5 flex-shrink-0 text-base">💡</span><span class="leading-relaxed">${tip}</span></li>`).join('')}
              </ul>
            </div>
            ` : ''}
          </div>
        </div>
        ` : ''}
        
        ${d.interestingFacts && Array.isArray(d.interestingFacts) && d.interestingFacts.length > 0 ? `
        <!-- Interesting Facts - Beautiful Collapsible -->
        <div class="mt-8 mb-6">
          <details class="group facts-details" open="false">
            <summary class="cursor-pointer list-none outline-none focus:outline-none">
              <div class="relative bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 rounded-2xl p-6 border-4 border-purple-300 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-between transform hover:scale-[1.02] overflow-hidden">
                <!-- Decorative background pattern -->
                <div class="absolute inset-0 opacity-10">
                  <div class="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl"></div>
                  <div class="absolute bottom-0 right-0 w-40 h-40 bg-indigo-300 rounded-full blur-3xl"></div>
                </div>
                
                <div class="relative flex items-center gap-4 z-10">
                  <div class="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 shadow-lg">
                    <span class="text-4xl">✨</span>
                  </div>
                  <div class="flex flex-col">
                    <h3 class="text-xl font-bold text-white drop-shadow-lg">Interesting Facts</h3>
                    <p class="text-sm text-purple-100 font-medium">Discover amazing things about this place</p>
                  </div>
                  <div class="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                    <span class="text-white font-bold text-lg">${d.interestingFacts.length}</span>
                    <span class="text-purple-100 text-sm">facts</span>
                  </div>
                </div>
                
                <div class="relative z-10">
                  <span class="arrow text-white font-bold text-2xl transform transition-transform duration-500 drop-shadow-lg">▼</span>
                </div>
              </div>
            </summary>
            <div class="mt-4 bg-gradient-to-br from-purple-50 via-indigo-50/30 to-purple-50 rounded-2xl p-6 border-4 border-purple-200/50 shadow-xl backdrop-blur-sm animate-fadeIn overflow-hidden">
              <!-- Decorative top border -->
              <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400"></div>
              
              <ul class="space-y-4 relative z-10">
                ${d.interestingFacts.map((fact, idx) => {
                  const icons = ['🌟', '💎', '🏛️', '🌊', '🎭', '🌿', '⛰️', '🦋', '🎨', '🏆'];
                  const icon = icons[idx % icons.length];
                  const colors = [
                    'from-purple-400 to-indigo-500',
                    'from-indigo-400 to-purple-500',
                    'from-purple-500 to-pink-500',
                    'from-indigo-500 to-blue-500',
                    'from-purple-400 to-pink-400'
                  ];
                  const colorClass = colors[idx % colors.length];
                  
                  return `
                  <li class="group/fact flex items-start gap-4 bg-white/90 backdrop-blur-sm p-5 rounded-xl border-2 border-purple-100 hover:border-purple-300 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1">
                    <div class="flex-shrink-0 relative">
                      <div class="w-12 h-12 rounded-xl bg-gradient-to-br ${colorClass} text-white flex items-center justify-center text-xl font-bold shadow-lg transform group-hover/fact:rotate-6 transition-transform duration-300">
                        <span class="drop-shadow-md">${icon}</span>
                      </div>
                      <div class="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white flex items-center justify-center text-xs font-bold shadow-md border-2 border-white">
                        ${idx + 1}
                      </div>
                    </div>
                    <div class="flex-1 pt-1">
                      <p class="text-base text-gray-800 leading-relaxed font-medium group-hover/fact:text-gray-900 transition-colors">
                        ${fact}
                      </p>
                    </div>
                  </li>
                `;
                }).join('')}
              </ul>
              
              <!-- Decorative bottom accent -->
              <div class="mt-6 pt-4 border-t-2 border-purple-200/50">
                <div class="flex items-center justify-center gap-2 text-purple-600">
                  <span class="text-sm font-semibold">💡</span>
                  <span class="text-xs font-medium italic">Tap to learn more amazing facts!</span>
                </div>
              </div>
            </div>
          </details>
        </div>
        ` : ''}
      </div>`;
      return el;
    }

  function capitalize(s){ return s.charAt(0).toUpperCase() + s.slice(1); }
})();