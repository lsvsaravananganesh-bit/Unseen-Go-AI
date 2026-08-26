/* UnseenGo AI — Kurnool discovery dataset
   Curated from Andhra Pradesh Government tourism information and local discovery sources.
   Loaded after app.js so the existing global cities database is extended safely. */
(function () {
  'use strict';
  const kurnool = {
    region: 'South',
    Nature: [
      ['Orvakal Rock Garden', 'Orvakal · 20 km', 96, 'Dramatic igneous rock formations, walking trails and open landscapes close to Kurnool.'],
      ['Rollapadu Wildlife Sanctuary', 'Kurnool district · 45 km', 95, 'A dry-grassland wildlife destination known for birdwatching and the Great Indian Bustard habitat.'],
      ['Nagaravanam (Gargeyapuram)', 'Kurnool · City', 91, 'A large forest recreation area with cycling, trekking and yoga spaces.']
    ],
    Heritage: [
      ['Konda Reddy Fort', 'Kurnool · City', 98, 'Historic fortification in the heart of Kurnool, associated with Vijayanagara-era history and Konda Reddy.'],
      ['Kurnool Museum', 'Budavarapupeta · City', 93, 'Archaeological museum with stone sculptures, inscriptions, pottery, paintings and historical artefacts.'],
      ['Gol Gummaz', 'Osmania College Road · City', 91, 'Historic tomb popularly known as Gol Gummaz, linked to Abdul Wahab and the early history of Kurnool.']
    ],
    Food: [
      ['Rayalaseema Food Experience', 'Kurnool · City', 94, 'Discover the bold, chilli-forward flavours of Rayalaseema through local meals, snacks and traditional dishes.'],
      ['Kurnool Local Breakfast Trail', 'Kurnool · City', 90, 'A neighbourhood-focused food experience for tiffin, tea and everyday Andhra flavours.'],
      ['Old City Evening Food Trail', 'Kurnool · City', 88, 'Explore local evening snacks and casual food spots around the older parts of Kurnool.']
    ],
    Culture: [
      ['Ketavaram Rock Paintings', 'Kurnool district · Regional', 96, 'Ancient rock art offering a glimpse into prehistoric human life and storytelling.'],
      ['Sunkesula Dam & Tungabhadra Landscape', 'Sunkesula · 22 km', 90, 'Historic barrage and riverside landscape with connections to nearby temples and villages.'],
      ['Jagannatha Gattu Cave Temple', 'Lakshmipuram · 10 km', 94, 'A cave-temple setting surrounded by hills and greenery, combining local legend, spirituality and landscape.']
    ],
    Adventure: [
      ['Mahanandi & Nallamala Trail', 'Mahanandi · Regional', 95, 'A nature-and-spirituality escape near the Nallamala hills with opportunities for scenic walks and exploration.'],
      ['Orvakal Rock Trails', 'Orvakal · 20 km', 94, 'Walk through unusual rock formations and developed hiking paths in an open geological landscape.'],
      ['Sunkesula Riverside Route', 'Sunkesula · 22 km', 89, 'A relaxed road-trip route combining the Tungabhadra river landscape, villages and nearby heritage sites.']
    ]
  };

  function install() {
    if (typeof cities !== 'undefined') {
      cities.Kurnool = kurnool;
      window.cities = cities;
    } else {
      window.cities = window.cities || {};
      window.cities.Kurnool = kurnool;
    }
    window.CITY_STATE = window.CITY_STATE || {};
    window.CITY_STATE.Kurnool = 'Andhra Pradesh';
  }

  install();
})();
