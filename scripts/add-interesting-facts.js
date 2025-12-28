const fs = require('fs');
const path = require('path');

const ITINERARIES_PATH = path.join(__dirname, '../data/itineraries.json');

// Interesting facts for each day of Kerala 10-day itinerary
const interestingFacts = {
  'Day 1 — Trivandrum Arrival': [
    "Trivandrum (Thiruvananthapuram) means 'City of Lord Anantha' - the serpent god",
    "Padmanabhaswamy Temple is one of the richest temples in the world with vaults containing billions in treasure",
    "Kovalam Beach got its name from 'Koval' meaning coconut groves",
    "The lighthouse at Kovalam is 30 meters tall and offers panoramic views",
    "Trivandrum was the capital of the Travancore Kingdom, one of the most powerful kingdoms in South India"
  ],
  'Day 2 — Varkala Cliffs': [
    "Varkala is the only place in Kerala where cliffs meet the Arabian Sea",
    "The cliffs are made of mineral-rich soil and are believed to have healing properties",
    "Varkala Beach is considered a holy place - Hindus perform last rites here",
    "The Janardhana Swamy Temple here is over 2000 years old",
    "Varkala is known as the 'Papanasam Beach' - meaning 'destroyer of sins'"
  ],
  'Day 3 — Alleppey Backwaters': [
    "Alleppey is called the 'Venice of the East' due to its extensive network of canals",
    "The backwaters are a unique ecosystem where saltwater and freshwater meet",
    "Houseboats were originally used to transport rice and spices",
    "Alleppey has over 900 km of interconnected canals, rivers, and lakes",
    "The backwaters are home to unique species like the Karimeen (pearl spot fish)"
  ],
  'Day 4 — Kumarakom & Kuttanad': [
    "Kumarakom Bird Sanctuary is home to over 180 species of birds including migratory birds from Siberia",
    "Kuttanad is the lowest point in India, lying 2.2 meters below sea level",
    "Vembanad Lake is the longest lake in India at 96.5 km",
    "Kuttanad is known as the 'Rice Bowl of Kerala' - rice is grown below sea level",
    "Pathiramanal Island means 'midnight sand' and is a bird watcher's paradise"
  ],
  'Day 5 — Kochi Heritage': [
    "Kochi (Cochin) was a major spice trading center for over 600 years",
    "The Chinese fishing nets are a legacy from Chinese traders in the 14th century",
    "Fort Kochi has the oldest European church in India - St. Francis Church (1503)",
    "Jew Town has one of the oldest synagogues in the Commonwealth (1568)",
    "Kochi was the first European colonial settlement in India"
  ],
  'Day 6 — Kochi to Munnar': [
    "Munnar means 'three rivers' - referring to Mudhirapuzha, Nallathanni, and Kundaly rivers",
    "Munnar was the summer resort of the British during colonial times",
    "The region produces some of the world's finest tea",
    "Munnar is located at an altitude of 1,600 meters above sea level",
    "The tea plantations cover over 50,000 acres in the region"
  ],
  'Day 7 — Munnar Exploration': [
    "Eravikulam National Park is home to the endangered Nilgiri Tahr",
    "Mattupetty Dam was built in 1953 for hydroelectric power generation",
    "Top Station offers views of both Kerala and Tamil Nadu",
    "Munnar's tea was first planted by the British in the 1880s",
    "The region receives heavy monsoon rains making it lush green"
  ],
  'Day 8 — Munnar to Thekkady': [
    "Periyar Wildlife Sanctuary is one of India's most famous tiger reserves",
    "Thekkady is named after the Thekkady Lake created by the Mullaperiyar Dam",
    "The sanctuary is home to over 60 species of mammals and 320 species of birds",
    "Spice plantations here grow cardamom, pepper, vanilla, and cinnamon",
    "Thekkady is one of the few places where you can see elephants in the wild"
  ],
  'Day 9 — Thekkady to Wayanad': [
    "Wayanad means 'land of paddy fields' in Malayalam",
    "Edakkal Caves contain 6000-year-old rock carvings - some of the oldest in India",
    "Wayanad is part of the Western Ghats, a UNESCO World Heritage Site",
    "The region is home to many indigenous tribes",
    "Wayanad has the highest concentration of tribal population in Kerala"
  ],
  'Day 10 — Wayanad & Departure': [
    "Soochipara Falls is a three-tiered waterfall with a height of 200 meters",
    "Banasura Sagar Dam is the largest earth dam in India",
    "Calicut (Kozhikode) was the capital of the Zamorin Kingdom",
    "Vasco da Gama landed in Calicut in 1498, opening the sea route to India",
    "Calicut is famous for its handloom industry and Malabar cuisine"
  ]
};

function addInterestingFacts() {
  console.log('📝 Adding interesting facts to Kerala 10-day itinerary...');
  
  const data = JSON.parse(fs.readFileSync(ITINERARIES_PATH, 'utf8'));
  const itinerary = data.itineraries.find(it => it.id === 'kerala-10-days-complete');
  
  if (!itinerary) {
    console.error('❌ Kerala 10-day itinerary not found!');
    return;
  }
  
  let addedCount = 0;
  
  itinerary.days.forEach((day, index) => {
    if (interestingFacts[day.day]) {
      if (!day.interestingFacts) {
        day.interestingFacts = interestingFacts[day.day];
        addedCount++;
        console.log(`✅ Added facts for ${day.day}`);
      } else {
        console.log(`⏭️  Facts already exist for ${day.day}`);
      }
    } else {
      console.log(`⚠️  No facts found for ${day.day}`);
    }
  });
  
  fs.writeFileSync(ITINERARIES_PATH, JSON.stringify(data, null, 2));
  console.log(`\n✅ Added interesting facts to ${addedCount} days!`);
  console.log(`📁 Updated: ${ITINERARIES_PATH}`);
}

addInterestingFacts();

