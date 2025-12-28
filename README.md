# DesiTrails 🇮🇳

> Curated slow-travel itineraries and destination guides for exploring India authentically.

[![Live Site](https://img.shields.io/badge/Live-DesiTrails-blue)](https://shivam2003-dev.github.io/desitrails/)
[![GitHub Pages](https://github.com/shivam2003-dev/desitrails/actions/workflows/deploy.yml/badge.svg)](https://github.com/shivam2003-dev/desitrails/actions/workflows/deploy.yml)

## 🌟 About

**DesiTrails** is a travel website focused on **slow travel** across India. Instead of cramming 10 cities in 5 days, we believe in spending quality time at fewer places, experiencing local culture, authentic food, and mindful exploration.

### Philosophy
- **Quality over Quantity**: Fewer destinations, deeper experiences
- **Realistic Planning**: All itineraries include actual drive times and distances
- **Authentic Experiences**: Local food, culture, and off-beat spots
- **Sustainable Tourism**: Supporting local communities and responsible travel

## 🗺️ Coverage

Currently featuring:
- **All 28 States + 8 Union Territories** of India
- **7 Detailed Itineraries**: Kerala (4 days), Rajasthan (7 days), Goa (4 days), Himachal (6 days), Karnataka (5 days), Uttarakhand (5 days), Ladakh (7 days)
- **Expanding**: More state detail pages and itineraries coming soon

### Popular Itineraries
| State | Duration | Highlights |
|-------|----------|------------|
| 🥥 **Kerala** | 4 days | Beaches → Backwaters → Heritage |
| 🏰 **Rajasthan** | 7 days | Jaipur → Udaipur → Jodhpur → Jaisalmer |
| 🏖️ **Goa** | 4 days | North beaches → Old Goa → South serenity |
| ⛰️ **Himachal** | 6 days | Manali → Kasol → Dharamshala circuit |
| 🏛️ **Karnataka** | 5 days | Coorg → Mysuru → Hampi ruins |
| 🕉️ **Uttarakhand** | 5 days | Rishikesh → Mussoorie → Nainital |
| 🏔️ **Ladakh** | 7 days | Leh → Nubra → Pangong → Tso Moriri |

## 🛠️ Tech Stack

- **Vanilla JavaScript** (ES6+) - No frameworks, pure browser JS
- **HTML5 + CSS3** - Semantic, accessible markup
- **JSON** - All travel data in structured format
- **GitHub Pages** - Static site hosting
- **GitHub Actions** - Automated deployment

### Why No Build Tools?
Keeping it simple! No webpack, no npm dependencies, just clean code that runs directly in the browser.

## 📁 Project Structure

```
trip/
├── index.html              # Homepage with state grid
├── about.html              # About page
├── data/
│   ├── states.json         # All states metadata
│   └── itineraries.json    # Detailed trip plans
├── js/
│   ├── app.js              # Homepage logic
│   ├── state.js            # State detail page
│   └── itinerary.js        # Itinerary page
├── states/
│   └── [state-slug]/       # Individual state pages
│       ├── index.html
│       └── itinerary-*.html
└── assets/images/          # Hero and gallery images
```

## 🚀 Getting Started

### Local Development
```bash
# Clone the repository
git clone https://github.com/shivam2003-dev/desitrails.git
cd desitrails

# Open in browser (no build required!)
open index.html

# Or use a simple HTTP server
python -m http.server 8000
# Visit http://localhost:8000
```

### Data Format

**Adding a New State:**
```json
{
  "name": "Kerala",
  "slug": "kerala",
  "vibe": "Beaches • Backwaters • Nature",
  "heroQuery": "kerala backwaters",
  "hasDetailPage": true,
  "themes": ["Beach", "Honeymoon", "Nature"],
  "places": ["Trivandrum", "Varkala", "Alleppey", "Kochi"]
}
```

**Adding an Itinerary:**
```json
{
  "id": "kerala-4-days",
  "state": "kerala",
  "title": "Kerala 4 Days: Trivandrum → Varkala → Alleppey → Kochi",
  "durationDays": 4,
  "bestTime": "October to March",
  "route": ["Trivandrum", "Varkala", "Alleppey", "Kochi"],
  "days": [...]
}
```

See [`.github/copilot-instructions.md`](.github/copilot-instructions.md) for complete data schema and guidelines.

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Ways to Contribute
1. **Add Itineraries**: Create detailed trip plans for states
2. **Improve Content**: Better descriptions, local tips, realistic times
3. **Fix Errors**: Correct distances, places, spellings
4. **Add Features**: Filters, search, maps
5. **Images**: Replace Unsplash placeholders with properly licensed photos

### Contribution Guidelines
- Follow the slow travel philosophy (quality over quantity)
- Use realistic drive times and distances (verify with Google Maps)
- Include local food, culture, and practical tips
- Maintain JSON schema consistency
- Test your changes locally

### Pull Request Process
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-itinerary`)
3. Commit your changes (`git commit -m 'Add Sikkim 5-day itinerary'`)
4. Push to the branch (`git push origin feature/amazing-itinerary`)
5. Open a Pull Request

## 📸 Images

Current implementation uses **Unsplash API** for placeholder images. For production:
- Use properly licensed images (Unsplash, Pexels, CC-licensed)
- Optimize images (< 500KB for heroes, < 300KB for gallery)
- Store in `assets/images/states/{state-slug}/`
- Always include descriptive alt text

## 🗺️ Roadmap

### Phase 1 (Current)
- [x] Basic website structure
- [x] All states listed in JSON
- [x] Kerala detail page + itinerary
- [x] 7 popular itineraries
- [x] GitHub Copilot instructions for LLMs

### Phase 2 (In Progress)
- [ ] Detail pages for 10 priority states
- [ ] At least 1 itinerary per major state
- [ ] Improved mobile responsiveness
- [ ] State filtering by themes

### Phase 3 (Future)
- [ ] Search functionality
- [ ] Interactive route maps
- [ ] User reviews/ratings
- [ ] Multi-state itineraries
- [ ] Regional guides (North India, South India, etc.)
- [ ] Offline PWA support

## 📱 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Android)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

**Note**: Content (itineraries, descriptions) may have different licensing. Always verify image licenses before use.

## 👨‍💻 Author

**Shivam Kumar**
- GitHub: [@shivam2003-dev](https://github.com/shivam2003-dev)

## 🙏 Acknowledgments

- India Tourism Boards for destination information
- Unsplash contributors for placeholder images
- Open source community for inspiration

## 📞 Contact

Have suggestions, feedback, or want to collaborate? 
- Open an issue on GitHub
- Submit a pull request
- Star ⭐ the repo if you find it useful!

---

<p align="center">Made with ❤️ for slow travelers exploring incredible India</p>
