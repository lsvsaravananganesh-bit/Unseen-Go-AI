-- UnseenGo AI — Phase 2C starter city data
-- Run this once in Supabase SQL Editor after schema.sql.
-- Existing website place data remains available as a fallback while individual
-- place rows are progressively migrated into public.places.

insert into public.cities (name, state, region, description, history, is_active)
values
('Ahmedabad','Gujarat','West','Explore old-city pols, stepwells, crafts, food trails and quieter natural escapes.','Ahmedabad blends historic pol neighbourhoods, Indo-Islamic architecture, textile traditions and a living street culture shaped over centuries.',true),
('Bengaluru','Karnataka','South','Explore green trails, heritage quarters, local food streets, arts and hill escapes.','Bengaluru grew from historic fort and market settlements into a modern technology city while retaining strong neighbourhood, craft and cultural traditions.',true),
('Bhubaneswar','Odisha','East','Discover ancient caves, temples, crafts, forests, lakes and Odia food culture.','Bhubaneswar is known for its historic temple architecture and the wider Kalinga cultural landscape surrounding the city.',true),
('Chennai','Tamil Nadu','South','Discover coastal heritage, classical arts, neighbourhood food and nature escapes.','Chennai combines Tamil cultural traditions, historic neighbourhoods, colonial-era layers and a long relationship with the Bay of Bengal.',true),
('Goa','Goa','West','Go beyond the beaches into heritage villages, forts, food, forests and local culture.','Goa carries layers of indigenous, Kadamba, Portuguese and modern coastal history across its towns, villages and landscapes.',true),
('Guwahati','Assam','Northeast','Explore river landscapes, temples, hills, wildlife gateways and Assamese culture.','Guwahati sits beside the Brahmaputra and has long been an important cultural and trading centre of the Northeast.',true),
('Hyderabad','Telangana','South','Explore forts, tombs, old neighbourhoods, lakes, food trails and local arts.','Hyderabad combines Deccan, Qutb Shahi, Mughal and Nizam-era influences with a vibrant contemporary culture.',true),
('Indore','Madhya Pradesh','Central','Discover heritage markets, food streets, palaces, temples and nearby nature.','Indore developed as an important Holkar-era centre and retains a strong connection between historic markets, food and civic culture.',true),
('Jaipur','Rajasthan','North','Explore forts, stepwells, crafts, old neighbourhoods, food and Aravalli landscapes.','Jaipur was founded in the eighteenth century and is recognised for its planned historic city, Rajput architecture and craft traditions.',true),
('Kochi','Kerala','South','Discover waterfront heritage, art spaces, historic quarters, food and backwater experiences.','Kochi grew as a major Indian Ocean trading centre, leaving Portuguese, Dutch, British, Jewish, Arab and Malayali cultural layers.',true),
('Kolkata','West Bengal','East','Explore old neighbourhoods, crafts, literature, food, wetlands and riverfront heritage.','Kolkata developed around the Hooghly and became a major centre of trade, administration, literature, arts and intellectual life.',true),
('Kurnool','Andhra Pradesh','South','Explore forts, caves, temples, river landscapes, local food and nearby adventure routes.','Kurnool has deep historical connections with the Deccan and Rayalaseema regions and serves as a gateway to several archaeological and natural landscapes.',true),
('Lucknow','Uttar Pradesh','North','Discover Awadhi heritage, architecture, chikankari, poetry and famous local food.','Lucknow is strongly associated with Awadhi culture, Nawabi architecture, refined crafts, literature, music and cuisine.',true),
('Mumbai','Maharashtra','West','Explore historic villages, forts, art districts, food trails, mangroves and urban nature.','Mumbai grew from a group of islands into a major port and global city, retaining many distinct historic neighbourhoods and coastal ecosystems.',true),
('Nagpur','Maharashtra','Central','Discover lakes, heritage sites, markets, temples, food and nature around the city.','Nagpur has long been a regional centre of central India and is associated with the historic Bhonsle period and later urban development.',true),
('Pune','Maharashtra','West','Explore forts, old neighbourhoods, museums, food trails, hills and cultural spaces.','Pune grew into an important Maratha-era centre and later became a major educational and cultural city.',true)
on conflict (name) do update set
  state = excluded.state,
  region = excluded.region,
  description = excluded.description,
  history = excluded.history,
  is_active = true,
  updated_at = now();

-- Example database places. Add the remaining curated places from the app here
-- as the project moves through Phase 2C. These rows are enough to verify the
-- live Supabase city/places relationship immediately.
insert into public.places (city_id,name,category,description,history,latitude,longitude,is_hidden_gem,is_famous,is_active)
select c.id, x.name, x.category, x.description, x.history, x.latitude, x.longitude, x.hidden_gem, x.famous, true
from public.cities c
join (values
('Ahmedabad','Adalaj Stepwell','Heritage','A spectacular stepwell with detailed stone architecture.','The stepwell is a major example of Gujarat stepwell architecture and water-management heritage.',23.1667,72.5815,false,true),
('Ahmedabad','Sarkhej Roza','Heritage','Historic courtyards and Indo-Islamic architecture.','The complex reflects the architectural traditions of medieval Gujarat.',22.9892,72.4980,true,false),
('Ahmedabad','Manek Chowk Night Trail','Food','A famous late-evening street-food experience.','The old-city market area becomes a lively food destination after dark.',23.0258,72.5873,false,true),
('Bengaluru','Turahalli Forest','Nature','Rocky trails and open views close to the city.','A remaining rocky and forested landscape on Bengaluru’s southern edge.',12.8786,77.5292,true,false),
('Bengaluru','Devanahalli Fort','Heritage','Historic fort walls and local stories beyond central Bengaluru.','The fort is associated with the history of the region around Devanahalli.',13.2472,77.7101,false,true),
('Bengaluru','Malleswaram Tiffin Trail','Food','Traditional South Indian breakfast and neighbourhood café culture.','Malleswaram retains a strong connection to Bengaluru’s older residential and food traditions.',13.0034,77.5704,true,false),
('Chennai','DakshinaChitra','Culture','Living heritage showcasing South Indian homes and crafts.','The heritage centre preserves examples of traditional architecture, crafts and performing arts.',12.8229,80.2273,false,true),
('Chennai','Mylapore Filter Coffee Trail','Food','Traditional coffee, breakfast and neighbourhood food culture.','Mylapore is one of Chennai’s long-established cultural neighbourhoods.',13.0339,80.2676,true,false),
('Chennai','Pulicat Lake Edge','Nature','Wetland landscapes and birdwatching beyond the city.','Pulicat is a major coastal lagoon ecosystem north of Chennai.',13.4186,80.3160,true,false),
('Hyderabad','Paigah Tombs','Heritage','Intricate architecture and a peaceful heritage atmosphere.','The tomb complex is known for its distinctive stucco and stone architectural details.',17.3427,78.5058,true,false),
('Hyderabad','Khajaguda Hills','Nature','Rocky trails, sunset views and a quieter side of the city.','The granite landscape provides a natural counterpoint to Hyderabad’s urban growth.',17.3928,78.3666,true,false),
('Hyderabad','Old City Irani Café Trail','Food','Explore traditional tea, bakery culture and local breakfast spots.','Irani cafés became an important part of Hyderabad’s urban food culture.',17.3616,78.4747,true,false),
('Jaipur','Panna Meena ka Kund','Heritage','Geometric stepwell architecture in a quieter setting.','The stepwell reflects Rajasthan’s historic water architecture and community infrastructure.',27.0592,75.8507,true,false),
('Jaipur','Gaitore Ki Chhatriyan','Heritage','Ornate royal cenotaphs away from the busiest sights.','The cenotaph complex commemorates members of Jaipur’s former ruling family.',26.9476,75.8230,true,false),
('Jaipur','Ramganj Food Walk','Food','Local snacks and street-food traditions.','Ramganj is part of Jaipur’s historic food and market culture.',26.9216,75.8240,true,false),
('Kolkata','Kumartuli Artisan Lanes','Culture','Walk through workshops where traditional clay idols are made.','Kumartuli is a long-established artisan neighbourhood known for clay image making.',22.6000,88.3660,true,false),
('Kolkata','East Kolkata Wetlands','Nature','A unique wetland ecosystem on the edge of the metropolis.','The wetlands form an important ecological landscape shaped by traditional wastewater-fed fisheries.',22.5200,88.4300,true,false),
('Kolkata','College Street Book Walk','Culture','Bookshops, cafés and classic literary culture.','College Street has long been associated with Kolkata’s publishing, education and intellectual life.',22.9570,88.3630,true,false),
('Lucknow','Dilkusha Kothi Ruins','Heritage','Atmospheric colonial-era ruins in a green setting.','The ruins preserve a fragment of Lucknow’s late eighteenth- and nineteenth-century architectural history.',26.8448,80.9724,true,false),
('Lucknow','Chikankari Artisan Trail','Culture','Discover the craft behind Lucknow’s iconic embroidery.','Chikankari is one of Lucknow’s best-known textile traditions.',26.8500,80.9500,true,false),
('Mumbai','Khotachiwadi','Heritage','A historic village-like lane of old homes in the city.','The neighbourhood preserves a distinctive layer of Mumbai’s older residential architecture.',18.9576,72.8240,true,false),
('Mumbai','Sewri Fort','Heritage','Compact fort ruins with a very different urban setting.','The fort is part of Mumbai’s defensive and maritime history.',18.9676,72.8610,true,false),
('Pune','Pataleshwar Cave Temple','Heritage','Rock-cut architecture hidden within the urban centre.','The cave temple is an early rock-cut monument associated with Pune’s historic landscape.',18.5260,73.8478,true,false),
('Pune','Rajgad Trek','Adventure','Fort trekking with dramatic Sahyadri landscapes.','Rajgad served as an important fort in Maratha history.',18.2465,73.6820,false,true)
) as x(city_name,name,category,description,history,latitude,longitude,hidden_gem,famous)
on c.name = x.city_name
on conflict (city_id,name) do update set
  category=excluded.category,
  description=excluded.description,
  history=excluded.history,
  latitude=excluded.latitude,
  longitude=excluded.longitude,
  is_hidden_gem=excluded.is_hidden_gem,
  is_famous=excluded.is_famous,
  is_active=true,
  updated_at=now();
