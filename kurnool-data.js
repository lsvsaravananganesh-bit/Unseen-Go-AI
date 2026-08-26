/* UnseenGo AI — static discovery database fallback
 * Covers every city currently defined in the Phase 2C seed.
 * Format is kept compatible with discover-experience.js and all-places-explorer.js.
 * Match scores are UnseenGo discovery signals, not external review ratings.
 */
(function () {
  'use strict';
  const city = (region, Nature, Heritage, Food, Culture, Adventure) => ({region,Nature,Heritage,Food,Culture,Adventure});
  const p = (name,location,score,description) => [name,location,score,description];

  const database = {
    Ahmedabad: city('West',
      [p('Thol Lake','Ahmedabad · 40 km',95,'Wetland landscape and birdwatching escape outside the city.'),p('Nal Sarovar','Gujarat · 65 km',97,'Large wetland landscape known for migratory birds and boat-based exploration.')],
      [p('Adalaj Stepwell','Gandhinagar · 20 km',98,'Spectacular stone stepwell showing Gujarat water architecture.'),p('Sarkhej Roza','Ahmedabad · City',95,'Historic Indo-Islamic complex with courtyards, tombs and a large tank.')],
      [p('Manek Chowk Night Trail','Ahmedabad · City',96,'Late-evening street-food experience in the historic city core.'),p('Old Ahmedabad Breakfast Walk','Ahmedabad · City',94,'Local snacks and traditional Gujarati breakfast around old neighbourhoods.')],
      [p('Heritage Pol Walk','Ahmedabad · City',97,'Explore traditional homes, community spaces and old-city lanes.'),p('Calico Textile Trail','Ahmedabad · City',94,'Discover the textile and craft traditions that shaped Ahmedabad.')],
      [p('Polo Forest Route','Gujarat · 160 km',96,'Forest, ruins and landscape combined in a rewarding road trip.'),p('Nal Sarovar Nature Route','Gujarat · 65 km',92,'Birding and wetland exploration for an outdoor day trip.')]),
    Bengaluru: city('South',
      [p('Turahalli Forest','Bengaluru · 15 km',94,'Rocky trails and open views close to the city.'),p('Hesaraghatta Grasslands','Bengaluru · 30 km',93,'Wide open landscapes suited to sunrise and nature exploration.')],
      [p('Devanahalli Fort','Bengaluru · 40 km',92,'Historic fort complex associated with the region around Devanahalli.'),p('Tipu Sultan Summer Palace','Bengaluru · City',88,'Late-eighteenth-century Indo-Islamic palace in the old city area.')],
      [p('Malleswaram Tiffin Trail','Bengaluru · City',96,'Traditional South Indian breakfast and neighbourhood cafe culture.'),p('VV Puram Food Street','Bengaluru · City',94,'Classic local snacks and evening street-food culture.')],
      [p('Malleswaram Heritage Walk','Bengaluru · City',92,'Temples, old homes, markets and neighbourhood stories.'),p('Indian Music Experience','Bengaluru · City',90,'Interactive exploration of India’s musical heritage.')],
      [p('Skandagiri Sunrise Trek','Chikkaballapur · 60 km',95,'Hill trek known for sunrise views and outdoor exploration.'),p('Savandurga','Bengaluru · 50 km',93,'Large monolith and challenging hill escape near Bengaluru.')]),
    Bhubaneswar: city('East',
      [p('Dhauli Hills','Bhubaneswar · 10 km',90,'Hill landscape overlooking the Daya River with peaceful walking areas.'),p('Deras Dam','Bhubaneswar · 25 km',94,'Forest and reservoir landscape suited to a quieter day out.')],
      [p('Udayagiri & Khandagiri Caves','Bhubaneswar · City',97,'Ancient rock-cut caves with archaeological and Jain heritage.'),p('Rajarani Temple','Bhubaneswar · City',93,'Intricate sandstone temple architecture in a landscaped setting.')],
      [p('Old Town Dahibara Trail','Bhubaneswar · City',96,'Local favourite for a classic Odia snack experience.'),p('Unit 1 Local Food Trail','Bhubaneswar · City',88,'Everyday Odia flavours and neighbourhood food culture.')],
      [p('Odisha Handloom Trail','Bhubaneswar · City',95,'Discover Odisha textile traditions and craft stories.'),p('Kalinga Temple Architecture Walk','Bhubaneswar · City',96,'Compare the distinctive forms and carvings of the temple city.')],
      [p('Nandankanan Forest Route','Bhubaneswar · 20 km',91,'Green landscapes around a major biodiversity area.'),p('Dhauli Cycling Route','Bhubaneswar · 10 km',88,'Active route combining hills, river views and heritage.')]),
    Chennai: city('South',
      [p('Pulicat Lake Edge','Tamil Nadu · 55 km',94,'Coastal lagoon and wetland landscape for birdwatching.'),p('Muttukadu Backwaters','Chennai · 35 km',89,'Quiet waters and a coastal escape from the city.')],
      [p('DakshinaChitra','Muttukadu · 25 km',94,'Living heritage centre showcasing South Indian homes and crafts.'),p('Fort St George','Chennai · City',95,'Historic colonial fort complex and museum on the waterfront.')],
      [p('Mylapore Filter Coffee Trail','Chennai · City',97,'Traditional coffee, breakfast and neighbourhood food culture.'),p('George Town Snack Walk','Chennai · City',92,'Historic market lanes filled with local bites.')],
      [p('Kalakshetra Arts Trail','Chennai · City',95,'Classical dance, music and South Indian artistic traditions.'),p('Cholamandal Artists Village','Chennai · 9 km',91,'Important artist community and living contemporary art space.')],
      [p('Covelong Surf Escape','Chennai · 40 km',94,'Coastal outdoor experience focused on surfing and the shore.'),p('Pulicat Cycling Route','Tamil Nadu · 55 km',88,'Easy outdoor route around wetland and village landscapes.')]),
    Goa: city('West',
      [p('Dudhsagar Falls','Goa · Regional',96,'Major waterfall landscape on the Goa-Karnataka border.'),p('Salim Ali Bird Sanctuary','Chorao · 10 km',94,'Mangrove ecosystem and birdwatching on Chorao Island.')],
      [p('Basilica of Bom Jesus','Old Goa · 10 km',98,'UNESCO-listed church and major Old Goa heritage landmark.'),p('Fort Aguada','North Goa · 15 km',95,'Seventeenth-century Portuguese coastal fort and lighthouse area.')],
      [p('Fontainhas Food Walk','Panaji · City',94,'Local Goan flavours around the historic Latin quarter.'),p('Mapusa Market Food Trail','Goa · Regional',92,'Market-led exploration of Goan produce, snacks and everyday food.')],
      [p('Fontainhas Heritage Walk','Panaji · City',97,'Colourful old quarter with Indo-Portuguese houses and local stories.'),p('Goan Fado & Music Trail','Goa · Regional',91,'Explore the musical traditions that form part of Goan cultural life.')],
      [p('Tiracol Coastal Route','North Goa · Regional',93,'Scenic coastal road trip linking beaches, villages and fort heritage.'),p('Netravali Nature Route','South Goa · Regional',94,'Forest and waterfall landscape for outdoor exploration.')]),
    Guwahati: city('Northeast',
      [p('Deepor Beel','Guwahati · 15 km',96,'Important wetland landscape and bird habitat beside the city.'),p('Umananda Island','Guwahati · City',91,'River island landscape in the Brahmaputra with temple heritage.')],
      [p('Kamakhya Temple','Guwahati · City',97,'Major Shakti pilgrimage site on Nilachal Hill.'),p('Assam State Museum','Guwahati · City',92,'Collections covering archaeology, crafts, sculpture and Assamese culture.')],
      [p('Assamese Thali Trail','Guwahati · City',94,'Explore traditional Assamese flavours and rice-based meals.'),p('Fancy Bazaar Food Walk','Guwahati · City',90,'Busy market district with local snacks and everyday food culture.')],
      [p('Sualkuchi Silk Experience','Assam · 30 km',96,'Discover Assam’s silk weaving traditions and artisan livelihoods.'),p('Brahmaputra Cultural Walk','Guwahati · City',90,'Riverfront stories, local traditions and the life of the Brahmaputra.')],
      [p('Pobitora Wildlife Route','Assam · 50 km',96,'Wildlife-focused day trip through grassland and wetland habitat.'),p('Kamakhya-Nilachal Trail','Guwahati · City',89,'Hill exploration around one of Assam’s most important cultural sites.')]),
    Hyderabad: city('South',
      [p('Khajaguda Hills','Hyderabad · City',94,'Rocky trails, sunset views and a quieter side of the city.'),p('Osman Sagar Lakeside','Hyderabad · 25 km',90,'Open water landscapes and relaxed evening views.')],
      [p('Paigah Tombs','Hyderabad · City',96,'Intricate tomb architecture and a peaceful heritage atmosphere.'),p('Qutb Shahi Tombs','Hyderabad · City',94,'Historic royal necropolis with distinctive Indo-Islamic architecture.')],
      [p('Old City Irani Cafe Trail','Hyderabad · City',95,'Traditional tea, bakery culture and local breakfast experiences.'),p('Mallepally Food Walk','Hyderabad · City',91,'Local-focused route through everyday Hyderabad flavours.')],
      [p('Nizam-era Neighbourhood Walk','Hyderabad · City',93,'Architecture and stories embedded in older neighbourhoods.'),p('Telangana Folk Arts Trail','Hyderabad · City',90,'Culture-first route focused on regional performing traditions.')],
      [p('Ananthagiri Day Escape','Vikarabad · 80 km',94,'Forest roads, viewpoints and outdoor exploration.'),p('Kondapochamma Reservoir','Siddipet · 55 km',88,'Open landscapes for a relaxed road trip.')]),
    Indore: city('Central',
      [p('Ralamandal Wildlife Sanctuary','Indore · 20 km',94,'Forested hill landscape and nature escape near the city.'),p('Pipliyapala Regional Park','Indore · City',86,'Urban lake and landscaped outdoor space for a relaxed visit.')],
      [p('Rajwada Palace','Indore · City',98,'Historic Holkar palace and landmark of old Indore.'),p('Lal Bagh Palace','Indore · City',94,'Holkar-era palace with European architectural influences.')],
      [p('Sarafa Bazaar Night Food Trail','Indore · City',99,'Famous night market combining local snacks and street-food culture.'),p('Chappan Dukan Food Walk','Indore · City',95,'Popular food district with a wide range of local and modern bites.')],
      [p('Kanch Mandir','Indore · City',91,'Jain temple with extensive glass and mirror decoration.'),p('Krishnapura Chhatris','Indore · City',92,'Holkar memorial architecture near the historic centre.')],
      [p('Janapav Hills Route','Indore · 45 km',93,'Hill landscape and road-trip escape southwest of Indore.'),p('Gulawat Lotus Valley','Indore · 25 km',90,'Seasonal rural landscape and lotus-filled water bodies.')]),
    Jaipur: city('North',
      [p('Nahargarh Forest Trails','Jaipur · City',94,'Aravalli trails and sunset viewpoints beyond palace tourism.'),p('Ramgarh Lake Region','Jaipur · 35 km',89,'Quieter landscape for an open-air escape.')],
      [p('Panna Meena ka Kund','Jaipur · City',96,'Geometric stepwell architecture near Amber.'),p('Gaitore Ki Chhatriyan','Jaipur · City',94,'Ornate royal cenotaphs away from the busiest tourist streets.')],
      [p('Ramganj Food Walk','Jaipur · City',96,'Local snacks and street-food traditions.'),p('Old Jaipur Lassi Trail','Jaipur · City',88,'Classic drinks and neighbourhood food culture.')],
      [p('Blue Pottery Craft Trail','Jaipur · City',95,'Discover the craft traditions behind Jaipur pottery.'),p('Kishanpole Woodwork Lane','Jaipur · City',91,'Traditional carving and artisan workshops.')],
      [p('Amer-Nahargarh Cycling Route','Jaipur · City',92,'Active route through the Aravalli landscape and old Jaipur.'),p('Sambhar Lake Day Trip','Rajasthan · 70 km',95,'Vast salt-lake landscape and birdlife.')]),
    Kochi: city('South',
      [p('Kumbalangi Village','Kochi · 15 km',95,'Backwater village landscape with fishing and local livelihoods.'),p('Mangalavanam Bird Sanctuary','Kochi · City',93,'Urban mangrove ecosystem and birdwatching area.')],
      [p('Fort Kochi','Kochi · City',97,'Historic waterfront district with multiple cultural layers.'),p('Mattancherry Palace','Kochi · City',95,'Historic palace known for Kerala murals and layered trading history.')],
      [p('Fort Kochi Seafood Trail','Kochi · City',96,'Coastal food experience shaped by Kerala and Indian Ocean trade.'),p('Mattancherry Spice Walk','Kochi · City',94,'Historic market area linked to Kochi’s spice-trading past.')],
      [p('Jew Town Heritage Walk','Mattancherry · City',96,'Historic Jewish heritage quarter with layered local and trading history.'),p('Kerala Art & Craft Trail','Kochi · City',91,'Explore contemporary art, traditional crafts and cultural spaces.')],
      [p('Kadamakkudy Island Route','Kochi · 20 km',96,'Backwater islands, village roads and sunset landscapes.'),p('Cherai Coastal Escape','Kochi · 30 km',91,'Beach and lagoon landscape for an easy day trip.')]),
    Kolkata: city('East',
      [p('East Kolkata Wetlands','Kolkata · City',96,'Unique wetland ecosystem shaped by traditional fisheries.'),p('Acharya Jagadish Chandra Bose Indian Botanic Garden','Howrah · 10 km',92,'Large green spaces and botanical diversity beside the Hooghly.')],
      [p('Kumartuli Artisan Lanes','Kolkata · City',97,'Historic clay-image-making neighbourhood and living craft tradition.'),p('Marble Palace Area','Kolkata · City',91,'Historic architecture and old North Kolkata streets.')],
      [p('North Kolkata Mishti Trail','Kolkata · City',97,'Traditional sweets and neighbourhood food culture.'),p('Tiretta Bazaar Breakfast','Kolkata · City',96,'Historic morning food experience with Chinese-Indian influences.')],
      [p('College Street Book Walk','Kolkata · City',95,'Bookshops, cafes and one of India’s best-known literary neighbourhoods.'),p('Jorasanko Cultural Quarter','Kolkata · City',94,'Literature, art and Bengal’s cultural history.')],
      [p('Sundarbans Edge Expedition','West Bengal · 100+ km',97,'Mangrove waterways and wildlife-focused exploration.'),p('Bakkhali Coastal Escape','West Bengal · 125 km',89,'Quieter coastal landscape for a longer road trip.')]),
    Kurnool: city('South',
      [p('Orvakal Rock Garden','Orvakal · 20 km',96,'Dramatic rock formations, walking trails and open landscapes.'),p('Rollapadu Wildlife Sanctuary','Kurnool district · 45 km',95,'Dry-grassland wildlife destination and important bird habitat.')],
      [p('Konda Reddy Fort','Kurnool · City',98,'Historic fortification and watchtower in central Kurnool.'),p('Kurnool Archaeological Museum','Kurnool · City',93,'Regional archaeological collections including sculptures and inscriptions.')],
      [p('Rayalaseema Food Experience','Kurnool · City',94,'Explore bold Rayalaseema flavours through local meals and snacks.'),p('Kurnool Breakfast Trail','Kurnool · City',90,'Neighbourhood tiffin, tea and everyday Andhra food culture.')],
      [p('Kethavaram Rock Paintings','Kurnool region · Regional',96,'Prehistoric rock-art landscape near Orvakal.'),p('Sunkesula Heritage Landscape','Sunkesula · 22 km',90,'Historic barrage and Tungabhadra riverside landscape.')],
      [p('Mahanandi & Nallamala Trail','Mahanandi · Regional',95,'Nature and heritage route near the Nallamala hills.'),p('Orvakal Rock Trails','Orvakal · 20 km',94,'Outdoor exploration among unusual geological formations.')]),
    Lucknow: city('North',
      [p('Kukrail Forest','Lucknow · City',91,'Green urban escape with forest trails.'),p('Janeshwar Mishra Park Trails','Lucknow · City',84,'Large landscaped spaces for cycling and walking.')],
      [p('Bara Imambara','Lucknow · City',98,'Eighteenth-century monument famous for its vast hall and labyrinth.'),p('Chota Imambara','Lucknow · City',95,'Ornate nineteenth-century complex associated with Awadhi heritage.')],
      [p('Aminabad Kebab Trail','Lucknow · City',98,'Classic Awadhi street food and local favourites.'),p('Chowk Tunday Trail','Lucknow · City',97,'Deep dive into Lucknow’s famous kebab culture.')],
      [p('Chikankari Artisan Trail','Lucknow · City',98,'Discover the craft behind Lucknow’s iconic embroidery.'),p('Old Lucknow Poetry Walk','Lucknow · City',91,'Explore tehzeeb, literature and historic neighbourhood stories.')],
      [p('Nawabganj Bird Sanctuary','Unnao · 45 km',92,'Birdwatching and wetland exploration.'),p('Kukrail Cycling Route','Lucknow · City',87,'Easy outdoor route through a green urban landscape.')]),
    Mumbai: city('West',
      [p('Sanjay Gandhi National Park Trails','Mumbai · City',94,'Forest trails and biodiversity inside the metropolitan area.'),p('Gorai Mangroves','Mumbai · 35 km',90,'Quieter coastal ecosystem away from central Mumbai.')],
      [p('Khotachiwadi','Mumbai · City',95,'Historic village-like lane preserving old Mumbai homes.'),p('Sewri Fort','Mumbai · City',89,'Compact fort ruins connected with Mumbai’s defensive history.')],
      [p('Mohammed Ali Road Food Trail','Mumbai · City',95,'Deep dive into Mumbai’s evening food culture.'),p('Girgaon Breakfast Trail','Mumbai · City',92,'Local snacks and traditional breakfast experiences.')],
      [p('Kala Ghoda Art Walk','Mumbai · City',93,'Galleries, public art and historic streets.'),p('Banganga Heritage Walk','Mumbai · City',96,'Ancient water tank and one of Mumbai’s quieter heritage pockets.')],
      [p('Karnala Fort Trek','Raigad · 55 km',95,'Forested fort trek close to Mumbai.'),p('Matheran Trail Escape','Raigad · 80 km',94,'Vehicle-free hill-station landscape and walking trails.')]),
    Nagpur: city('Central',
      [p('Ambazari Lake','Nagpur · City',89,'Large urban lake and green recreational landscape.'),p('Pench Gateway Route','Maharashtra · Regional',96,'Wildlife-focused road-trip gateway toward Pench landscapes.')],
      [p('Deekshabhoomi','Nagpur · City',97,'Major Buddhist cultural and architectural landmark.'),p('Sitabuldi Fort','Nagpur · City',92,'Historic hill fort in the centre of Nagpur.')],
      [p('Nagpur Saoji Food Trail','Nagpur · City',97,'Explore the distinctive spicy Saoji food tradition.'),p('Tarri Poha Breakfast Trail','Nagpur · City',91,'Local breakfast culture built around poha and spicy gravies.')],
      [p('Central Museum Heritage Walk','Nagpur · City',90,'Regional archaeology, art and natural-history collections.'),p('Gond Cultural Trail','Nagpur · Regional',92,'Explore Gond art, traditions and cultural heritage of central India.')],
      [p('Tadoba Wildlife Route','Maharashtra · Regional',98,'Longer wildlife circuit toward Tadoba-Andhari landscape.'),p('Pench Nature Route','Maharashtra · Regional',96,'Forest and wildlife day-trip route from the Nagpur region.')]),
    Pune: city('West',
      [p('Vetal Tekdi Trails','Pune · City',93,'Hill trails and city views without leaving Pune.'),p('Pashan Lake','Pune · City',88,'Relaxed birdwatching and walking spot.')],
      [p('Pataleshwar Cave Temple','Pune · City',91,'Rock-cut temple hidden within the urban centre.'),p('Shaniwar Wada','Pune · City',97,'Historic Peshwa-era fort-palace and major Maratha landmark.')],
      [p('Sadashiv Peth Food Walk','Pune · City',95,'Traditional Maharashtrian snacks and neighbourhood eateries.'),p('Camp Irani Cafe Trail','Pune · City',94,'Old cafe culture and classic Pune flavours.')],
      [p('Raja Dinkar Kelkar Museum','Pune · City',95,'Large collection of Indian everyday art and objects.'),p('Malleswar?','Pune · City',80,'Local culture and neighbourhood discovery route.')],
      [p('Rajgad Trek','Pune · 55 km',97,'Fort trekking with dramatic Sahyadri landscapes.'),p('Andharban Forest Trek','Pune · 70 km',96,'Dense forest trek with valley views.')])
  };

  // Correct a typo-safe culture entry without changing the public data shape.
  database.Pune.Culture[1] = p('Shaniwar Peth Heritage Walk','Pune · City',91,'Old neighbourhood architecture, temples, markets and cultural stories.');

  window.cities = Object.assign(window.cities || {}, database);
  window.UNSEENGO_CITY_DATABASE = database;
  window.CITY_STATE = Object.assign(window.CITY_STATE || {}, {
    Ahmedabad:'Gujarat',Bengaluru:'Karnataka',Bhubaneswar:'Odisha',Chennai:'Tamil Nadu',Goa:'Goa',Guwahati:'Assam',Hyderabad:'Telangana',Indore:'Madhya Pradesh',Jaipur:'Rajasthan',Kochi:'Kerala',Kolkata:'West Bengal',Kurnool:'Andhra Pradesh',Lucknow:'Uttar Pradesh',Mumbai:'Maharashtra',Nagpur:'Maharashtra',Pune:'Maharashtra'
  });
})();