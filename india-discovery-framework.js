/* UnseenGo AI — India-wide discovery framework.
   Keeps every city discoverable without inventing attraction records.
   Curated records are shown when available; otherwise category cards link to
   live Google Maps searches for verified places in the selected city.
*/
(function(){
  'use strict';
  window.UNSEENGO_CATEGORIES = [
    'Nature','Heritage','Temples','Forts & Palaces','Museums','Waterfalls','Beaches',
    'Lakes & Rivers','Wildlife','Caves','Architecture','Markets & Food','Culture','Adventure'
  ];
  window.UNSEENGO_CATEGORY_META = {
    Nature:['🌿','Nature & Scenic Places'], Heritage:['🏛','Historic & Heritage'], Temples:['🛕','Temples & Spiritual'],
    'Forts & Palaces':['🏰','Forts & Palaces'], Museums:['🏺','Museums & Galleries'], Waterfalls:['💧','Waterfalls'],
    Beaches:['🏖️','Beaches & Coast'], 'Lakes & Rivers':['🌊','Lakes & Rivers'], Wildlife:['🐅','Wildlife & Sanctuaries'],
    Caves:['🪨','Caves & Rock Sites'], Architecture:['🏗️','Architecture & Monuments'], 'Markets & Food':['🍜','Markets & Food'],
    Culture:['🎭','Culture & Arts'], Adventure:['🥾','Outdoor Adventure']
  };
  window.UNSEENGO_CATEGORY_QUERY = {
    Nature:'nature park scenic viewpoint garden', Heritage:'heritage historic monument', Temples:'temple shrine mandir',
    'Forts & Palaces':'fort palace', Museums:'museum gallery', Waterfalls:'waterfall', Beaches:'beach',
    'Lakes & Rivers':'lake river waterfront', Wildlife:'wildlife sanctuary national park zoo', Caves:'cave rock formations',
    Architecture:'monument architecture landmark', 'Markets & Food':'market bazaar street food local food', Culture:'cultural centre art theatre',
    Adventure:'trek hiking adventure activities'
  };
  window.unseenGoMapsSearch = function(city, category){
    const q = encodeURIComponent((window.UNSEENGO_CATEGORY_QUERY[category]||category)+' in '+city+', India');
    return 'https://www.google.com/maps/search/?api=1&query='+q;
  };
  window.unseenGoHistoryPrompt = function(city, category){
    const label = category.toLowerCase();
    return 'Explore verified '+label+' in '+city+'. UnseenGo combines official tourism information, local sources and map listings so travelers can check the history, location, photos, timings and current visitor information before visiting.';
  };
})();
