#!/bin/bash

# Download images for all states using curl
# This script downloads hero, route, and gallery images

set -e

BASE_DIR="assets/images/states"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_DIR"

echo "🚀 Starting image download for all states..."
echo ""

# Function to download image
download_image() {
    local url=$1
    local output=$2
    local desc=$3
    
    mkdir -p "$(dirname "$output")"
    
    if [ -f "$output" ] && [ -s "$output" ]; then
        echo "⏭  Skipping: $desc (exists)"
        return 0
    fi
    
    echo "⬇  Downloading: $desc"
    if curl -L -f -s -o "$output" "$url" 2>/dev/null; then
        if [ -s "$output" ]; then
            echo "✅ Success: $desc"
            return 0
        fi
    fi
    echo "❌ Failed: $desc"
    rm -f "$output"
    return 1
}

# Download images for each state
node -e "
const fs = require('fs');
const states = JSON.parse(fs.readFileSync('data/states.json', 'utf8')).states;
const itineraries = JSON.parse(fs.readFileSync('data/itineraries.json', 'utf8')).itineraries;

// Hero images
console.log('=== HERO IMAGES ===');
states.forEach(state => {
    const query = encodeURIComponent((state.heroQuery || state.name) + ',india');
    const url = \`https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1600&h=900&fit=crop&q=80\`;
    console.log(\`HERO|\${state.slug}|\${url}\`);
});

// Route images
console.log('=== ROUTE IMAGES ===');
const stateItineraries = {};
itineraries.forEach(it => {
    if (!stateItineraries[it.state]) stateItineraries[it.state] = [];
    stateItineraries[it.state].push(it.durationDays);
});
Object.keys(stateItineraries).forEach(stateSlug => {
    const state = states.find(s => s.slug === stateSlug);
    const name = state ? state.name : stateSlug;
    stateItineraries[stateSlug].forEach(days => {
        const url = \`https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=800&fit=crop&q=80\`;
        console.log(\`ROUTE|\${stateSlug}|\${days}|\${url}\`);
    });
});

// Gallery images (first 5 places per state)
console.log('=== GALLERY IMAGES ===');
states.forEach(state => {
    state.places.slice(0, 5).forEach(place => {
        const placeSlug = place.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const url = \`https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&h=600&fit=crop&q=80\`;
        console.log(\`GALLERY|\${state.slug}|\${placeSlug}|\${url}\`);
    });
});
" | while IFS='|' read -r type slug value1 value2; do
    case "$type" in
        "HERO")
            url="$value1"
            output="$BASE_DIR/$slug/hero.jpg"
            download_image "$url" "$output" "Hero: $slug"
            ;;
        "ROUTE")
            days="$value1"
            url="$value2"
            output="$BASE_DIR/$slug/routes/$days.jpg"
            download_image "$url" "$output" "Route: $slug ($days days)"
            ;;
        "GALLERY")
            place_slug="$value1"
            url="$value2"
            output="$BASE_DIR/$slug/gallery/$place_slug.jpg"
            download_image "$url" "$output" "Gallery: $slug/$place_slug"
            ;;
    esac
done

echo ""
echo "✅ Image download complete!"
echo "📊 Summary:"
find "$BASE_DIR" -name "*.jpg" 2>/dev/null | wc -l | xargs echo "Total images:"

