#!/bin/bash

# Image Download Script for DesiTrails
# Downloads images for all states, routes, and galleries

set -e

BASE_DIR="assets/images/states"
DATA_DIR="data"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting image download for DesiTrails...${NC}\n"

# Function to download image
download_image() {
    local url=$1
    local output=$2
    local description=$3
    
    # Create directory if it doesn't exist
    mkdir -p "$(dirname "$output")"
    
    # Check if file already exists
    if [ -f "$output" ]; then
        echo -e "${YELLOW}⏭  Skipping $description (already exists)${NC}"
        return 0
    fi
    
    echo -e "${GREEN}⬇  Downloading $description...${NC}"
    
    # Download with curl, follow redirects, show progress
    if curl -L -f -s -o "$output" "$url" 2>/dev/null; then
        # Check if downloaded file is valid (not empty and is an image)
        if [ -s "$output" ] && file "$output" | grep -q "image"; then
            echo -e "${GREEN}✅ Downloaded: $description${NC}"
            return 0
        else
            echo -e "${RED}❌ Invalid image: $description${NC}"
            rm -f "$output"
            return 1
        fi
    else
        echo -e "${RED}❌ Failed: $description${NC}"
        return 1
    fi
}

# Function to get Unsplash image URL
get_unsplash_url() {
    local query=$1
    local width=${2:-1600}
    local height=${3:-900}
    # Use Unsplash Source API (no key needed for basic usage)
    echo "https://source.unsplash.com/${width}x${height}/?${query},india"
}

# Function to get Pexels image URL (alternative)
get_pexels_url() {
    local query=$1
    local width=${2:-1600}
    local height=${3:-900}
    # Pexels API requires key, so we'll use a placeholder service
    echo "https://picsum.photos/seed/${query}/${width}/${height}"
}

# Read states from JSON
echo -e "${GREEN}Reading states data...${NC}\n"

# Download hero images for all states
echo -e "${GREEN}=== Downloading Hero Images ===${NC}"
while IFS= read -r state_data; do
    slug=$(echo "$state_data" | grep -o '"slug":"[^"]*' | cut -d'"' -f4)
    name=$(echo "$state_data" | grep -o '"name":"[^"]*' | cut -d'"' -f4)
    hero_query=$(echo "$state_data" | grep -o '"heroQuery":"[^"]*' | cut -d'"' -f4 || echo "$name")
    
    if [ -n "$slug" ]; then
        query="${hero_query},india"
        url=$(get_unsplash_url "$query" 1600 900)
        output="${BASE_DIR}/${slug}/hero.jpg"
        download_image "$url" "$output" "Hero: $name"
    fi
done < <(node -e "
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/states.json', 'utf8'));
data.states.forEach(s => console.log(JSON.stringify(s)));
")

# Download route images for states with itineraries
echo -e "\n${GREEN}=== Downloading Route Images ===${NC}"
while IFS= read -r it_data; do
    state=$(echo "$it_data" | grep -o '"state":"[^"]*' | cut -d'"' -f4)
    days=$(echo "$it_data" | grep -o '"durationDays":[0-9]*' | cut -d':' -f2)
    
    if [ -n "$state" ] && [ -n "$days" ]; then
        # Get state name for query
        state_name=$(node -e "
        const fs = require('fs');
        const data = JSON.parse(fs.readFileSync('data/states.json', 'utf8'));
        const s = data.states.find(x => x.slug === '$state');
        console.log(s ? s.name : '$state');
        ")
        
        query="${state_name} ${days} days route,india"
        url=$(get_unsplash_url "$query" 1200 800)
        output="${BASE_DIR}/${state}/routes/${days}.jpg"
        download_image "$url" "$output" "Route: $state_name ($days days)"
    fi
done < <(node -e "
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/itineraries.json', 'utf8'));
data.itineraries.forEach(it => console.log(JSON.stringify({state: it.state, durationDays: it.durationDays})));
")

# Download gallery images for places
echo -e "\n${GREEN}=== Downloading Gallery Images ===${NC}"
while IFS= read -r state_data; do
    slug=$(echo "$state_data" | grep -o '"slug":"[^"]*' | cut -d'"' -f4)
    places=$(echo "$state_data" | grep -o '"places":\[[^\]]*' | sed 's/"places":\[//' | tr -d '[]"')
    
    if [ -n "$slug" ] && [ -n "$places" ]; then
        echo "$places" | tr ',' '\n' | while read -r place; do
            place=$(echo "$place" | xargs) # trim whitespace
            if [ -n "$place" ]; then
                place_slug=$(echo "$place" | tr '[:upper:]' '[:lower:]' | sed 's/ /-/g')
                query="${place},${slug},india"
                url=$(get_unsplash_url "$query" 800 600)
                output="${BASE_DIR}/${slug}/gallery/${place_slug}.jpg"
                download_image "$url" "$output" "Gallery: $place ($slug)"
            fi
        done
    fi
done < <(node -e "
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/states.json', 'utf8'));
data.states.forEach(s => console.log(JSON.stringify({slug: s.slug, places: s.places})));
")

echo -e "\n${GREEN}=== Download Complete ===${NC}"
echo -e "${GREEN}Images downloaded to: ${BASE_DIR}${NC}\n"

# Show summary
total_images=$(find "$BASE_DIR" -name "*.jpg" 2>/dev/null | wc -l | tr -d ' ')
echo -e "${GREEN}Total images: ${total_images}${NC}"

