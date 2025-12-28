# DesiTrails - GitHub Copilot Instructions

## Project Overview
**DesiTrails** is a curated travel website featuring slow-travel itineraries and destination guides for all states and union territories of India. The focus is on authentic experiences, mindful exploration, and quality over quantity.

## Core Philosophy
- **Slow Travel**: Emphasis on depth, not breadth. Each itinerary prioritizes quality time at fewer places.
- **Authentic Experiences**: Local food, culture, and off-beat destinations alongside popular spots.
- **Sustainable Tourism**: Encouraging responsible travel and supporting local communities.
- **Realistic Planning**: All itineraries include drive times, distances, and practical tips.

## Tech Stack
- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **No Build Tools**: Direct browser execution for simplicity
- **Data Format**: JSON files for states and itineraries
- **Image Loading**: Unsplash API for placeholder images (must be replaced with licensed images)
- **Deployment**: GitHub Pages via GitHub Actions

## Project Structure

```
trip/
├── index.html              # Homepage with state grid
├── about.html              # About page explaining project philosophy
├── data/
│   ├── states.json         # All 28 states + 8 UTs with metadata
│   └── itineraries.json    # Detailed day-by-day trip plans
├── js/
│   ├── app.js             # Homepage logic, state grid rendering
│   ├── state.js           # State detail page logic
│   └── itinerary.js       # Itinerary page logic
├── states/
│   └── [state-slug]/
│       ├── index.html                    # State overview page
│       └── itinerary-[duration]-days.html # Specific trip plan
└── assets/
    └── images/
        └── states/[state-slug]/
            ├── hero.jpg                   # State hero image
            └── routes/[duration].jpg      # Route-specific images
```

## Data Schema

### states.json
Each state object contains:
```json
{
  "name": "Kerala",
  "slug": "kerala",
  "vibe": "Beaches • Backwaters • Nature",
  "heroQuery": "kerala backwaters",
  "hasDetailPage": true,
  "themes": ["Beach", "Honeymoon", "Family", "Nature", "Culture"],
  "places": ["Trivandrum", "Varkala", "Alleppey", "Kochi", ...]
}
```

**Key Fields:**
- `slug`: URL-friendly identifier, used for routing
- `vibe`: 3-5 word description of state's character
- `heroQuery`: Unsplash search query for hero image
- `hasDetailPage`: Boolean indicating if `/states/{slug}/` exists
- `themes`: Tags for filtering (Beach, Hills, Heritage, Wildlife, etc.)
- `places`: List of top destinations in that state

### itineraries.json
Each itinerary object contains:
```json
{
  "id": "kerala-4-days",
  "state": "kerala",
  "title": "Kerala 4 Days: Trivandrum → Varkala → Alleppey → Kochi",
  "durationDays": 4,
  "summary": "Beach, backwaters, and heritage with slow travel emphasis.",
  "bestTime": "October to March",
  "route": ["Trivandrum", "Varkala", "Alleppey", "Kochi"],
  "days": [...]
}
```

**Day Structure:**
```json
{
  "day": "Day 1 — Trivandrum & Kovalam",
  "theme": "Beach & Culture",
  "morning": "Activity description",
  "afternoon": "Activity description",
  "evening": "Activity description",
  "distanceKm": 20,
  "driveTime": "45m",
  "mustSee": ["Attraction 1", "Attraction 2"],
  "optional": ["Attraction 3"],
  "galleryQueries": ["Query1", "Query2"]
}
```

## Code Conventions

### JavaScript
- Use ES6+ features (arrow functions, template literals, destructuring)
- Prefer `const` over `let`; avoid `var`
- Use async/await for asynchronous operations
- Follow functional programming patterns where appropriate
- No jQuery or external libraries unless necessary

### HTML
- Semantic HTML5 elements (`<header>`, `<main>`, `<section>`, `<article>`)
- Accessible markup (ARIA labels, alt text for images)
- SEO-friendly structure (proper heading hierarchy, meta tags)

### CSS
- Use CSS Grid and Flexbox for layouts
- CSS variables for theming (defined in `:root`)
- Mobile-first responsive design
- Smooth animations and transitions

### File Naming
- States: Use kebab-case for slugs (`himachal-pradesh`, `andaman-nicobar`)
- Itineraries: Format as `{state-slug}-{duration}-days` (e.g., `kerala-4-days`)
- HTML files: `itinerary-{duration}-days.html`

## Common Tasks

### Adding a New State
1. Add state object to `data/states.json`
2. Create directory: `states/{state-slug}/`
3. Create `states/{state-slug}/index.html` from template
4. Add hero image or configure Unsplash query
5. Update state detail page with places, best time, themes

### Adding a New Itinerary
1. Add itinerary object to `data/itineraries.json`
2. Create `states/{state-slug}/itinerary-{duration}-days.html`
3. Ensure `id` matches filename convention
4. Include realistic distances, drive times, and practical tips
5. Add 3-5 gallery queries per day for image loading

### Creating State Detail Pages
Use this template structure:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Standard meta tags -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>{State Name} Travel Guide | DesiTrails</title>
  <!-- SEO meta tags -->
  <meta name="description" content="...">
  <link rel="stylesheet" href="../../css/styles.css">
</head>
<body>
  <header><!-- Nav --></header>
  <main>
    <section class="hero"><!-- State hero --></section>
    <section class="overview"><!-- Intro --></section>
    <section class="places"><!-- Top places --></section>
    <section class="itineraries"><!-- Available trips --></section>
  </main>
  <footer><!-- Footer --></footer>
  <script type="module" src="../../js/state.js"></script>
</body>
</html>
```

## Image Guidelines

### Using Unsplash API
- Current implementation uses Unsplash for placeholder images
- Images are loaded via `heroQuery` and `galleryQueries`
- **Production**: Replace with properly licensed images

### Image Specifications
- Hero images: 1920×1080px, < 500KB
- Gallery images: 800×600px, < 300KB
- Formats: JPG for photos, PNG for graphics
- Always include descriptive alt text

### Storage Structure
```
assets/images/states/{state-slug}/
  ├── hero.jpg              # Main state image
  ├── routes/
  │   ├── 3.jpg            # 3-day itinerary route map
  │   ├── 4.jpg            # 4-day itinerary route map
  │   └── 7.jpg            # 7-day itinerary route map
  └── gallery/
      ├── place1.jpg
      └── place2.jpg
```

## State Coverage

### Completed States (with detail pages)
- Kerala (✓ with 4-day itinerary)

### States in JSON (need detail pages)
All 28 states and 8 union territories are listed in `states.json` with metadata but need:
1. Individual detail pages (`states/{slug}/index.html`)
2. Custom itineraries (3-7 days recommended)
3. Curated place descriptions
4. Best time to visit details
5. Local tips and recommendations

### Priority States for Expansion
Focus on these popular destinations first:
1. **Rajasthan** (Heritage circuit: Jaipur-Udaipur-Jodhpur-Jaisalmer)
2. **Himachal Pradesh** (Mountains: Manali-Kasol-Dharamshala)
3. **Goa** (Beach circuit: North-South beaches)
4. **Karnataka** (Hills + Heritage: Coorg-Mysuru-Hampi)
5. **Uttarakhand** (Spiritual + Adventure: Rishikesh-Mussoorie-Nainital)
6. **Ladakh** (High altitude: Leh-Nubra-Pangong)
7. **Tamil Nadu** (Temples + Hills: Chennai-Pondicherry-Ooty)
8. **Maharashtra** (Mumbai-Lonavala-Mahabaleshwar)

## Itinerary Design Principles

### Duration Guidelines
- **3-4 days**: Single region/theme (e.g., Kerala backwaters)
- **5-7 days**: Two regions (e.g., Rajasthan forts + desert)
- **7-10 days**: Full state circuit (e.g., complete Himachal)
- **10-14 days**: Multi-state (e.g., Rajasthan + Gujarat)

### Daily Structure
- **Morning**: 9 AM - 12 PM (sightseeing, activities)
- **Afternoon**: 12 PM - 5 PM (lunch, main activity, travel)
- **Evening**: 5 PM - 9 PM (sunset, dinner, relaxation)
- Include buffer time; don't over-schedule
- Realistic travel times (account for Indian traffic)

### What to Include
✅ Drive distances and realistic times
✅ Best season to visit
✅ "Must-see" vs "optional" attractions
✅ Local food recommendations
✅ Accommodation suggestions (budget range)
✅ Practical tips (permits, bookings, etc.)

### What to Avoid
❌ Cramming too many places
❌ Unrealistic timelines
❌ Ignoring travel time between locations
❌ Generic descriptions (be specific and authentic)
❌ Promoting overtourism hotspots without context

## SEO Best Practices
- Unique meta descriptions (150-160 characters)
- Title format: `{State/Place} - {Type} | DesiTrails`
- Use schema.org structured data for itineraries
- Descriptive alt text for all images
- Internal linking between related states and itineraries
- URL structure: `/states/{state}/` and `/states/{state}/itinerary-{days}-days`

## GitHub Actions Workflow
Automated deployment to GitHub Pages:
- Triggers on push to `main` branch
- No build step required (static site)
- Deploys to `https://shivam2003-dev.github.io/desitrails/`

## Future Enhancements

### Planned Features
- [ ] Filter states by themes (Beach, Hills, Heritage, Wildlife)
- [ ] Search functionality
- [ ] Interactive maps for itineraries
- [ ] User-contributed itineraries (with moderation)
- [ ] Regional guides (North India, South India, etc.)
- [ ] Festival calendar integration
- [ ] Offline PWA support

### Content Roadmap
- [ ] Complete detail pages for all 36 states/UTs
- [ ] At least 1 itinerary per state (60-80 total)
- [ ] Multi-state itineraries (connecting regions)
- [ ] Thematic routes (Coastal India, Himalayan Circuit, etc.)
- [ ] Blog/articles on slow travel philosophy

## Contributing Guidelines

### For Copilot/AI Assistants
When generating code or content:
1. **Match existing style**: Check similar files before creating new ones
2. **Be authentic**: Use realistic place names, accurate distances, local insights
3. **Stay focused**: Prioritize quality itineraries over quantity
4. **Test data**: Ensure JSON is valid and matches schema
5. **Accessibility**: Include alt text, ARIA labels, semantic HTML
6. **Mobile-first**: Ensure responsive design

### Data Quality Standards
- Verify place names and spellings (use official tourism sources)
- Cross-check distances with Google Maps
- Include seasonal considerations (monsoon, winter, summer)
- Mention any required permits or bookings
- Be honest about overtourism (e.g., Manali, Goa in peak season)

## Resources

### Official Tourism Websites
- incredibleindia.org (National tourism board)
- State tourism websites: `{state}tourism.gov.in`

### Distance/Route Planning
- Google Maps API (for accurate distances)
- Rome2Rio (for multi-modal transport)

### Image Sources (Legal)
- Unsplash (free, attribution required)
- Pexels (free)
- Wikimedia Commons (check licenses)
- Indian government tourism portals (often CC-licensed)

## Contact & Maintenance
- **Repository**: github.com/shivam2003-dev/desitrails
- **Maintainer**: Shivam Kumar
- **License**: Specify in LICENSE file (suggest MIT for code, CC-BY for content)

---

## Quick Reference

### Adding Kerala-style Itinerary for Another State
1. Study existing Kerala itinerary structure
2. Research realistic routes (Google Maps)
3. Create daily breakdown with morning/afternoon/evening
4. Add distances, drive times, must-see/optional splits
5. Include local food, culture, practical tips
6. Add to `itineraries.json` with matching ID
7. Create corresponding HTML file in `states/{slug}/`

### Typical State Detail Page Sections
1. **Hero**: Large image, state name, vibe
2. **Overview**: 2-3 paragraphs, best time to visit
3. **Top Places**: Grid of 6-12 key destinations
4. **Itineraries**: Available trip plans with duration
5. **Tips**: Local transport, food, culture notes
6. **Gallery**: Curated images with captions

### JSON Validation
Before committing, validate JSON files:
```bash
# Check states.json
cat data/states.json | jq .

# Check itineraries.json
cat data/itineraries.json | jq .
```

---

*This document helps AI assistants understand DesiTrails' structure, philosophy, and conventions for better collaboration.*
