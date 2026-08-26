/* UnseenGo AI — Kurnool temple catalogue enrichment
 * Verified/curated temple names and regional context. Photos are resolved separately by the site's Google Places photo service.
 */
(function(){
  'use strict';
  const temples = [
    ['Sri Neelakantheswara Devalayam','Kurnool · Joharapuram',95,'Historic Shiva temple in Kurnool city and a local place of worship.'],
    ['Sri Raghavendra Swami Math','Kurnool · N R Peta',93,'Raghavendra Swamy spiritual centre in the city.'],
    ['New Ayyappa Swamy Temple','Kurnool · A Camp',92,'Ayyappa temple and devotional destination within Kurnool city.'],
    ['Sri Suryanarayana Swamy Devalayam','Kallur · Kurnool',94,'Sun temple on the Kurnool–Hyderabad highway, useful as a nearby heritage stop.'],
    ['Sri Rambolta Devalayam','Kurnool · City',90,'Historic temple listed among Kurnool district heritage structures.'],
    ['Sri Rupala Sangameswara Swamy Temple','Kurnool district · Regional',94,'Historic Shiva temple associated with the Sangameswara tradition of the region.'],
    ['Sri Lakshmi Jagannatha Swamy Cave Temple','Lakshmipuram · Kurnool district',93,'Cave temple and heritage site listed in the Kurnool district heritage inventory.'],
    ['Sri Eswara Veerabhadra Swamy Temple','Panchalingala · Kurnool district',92,'Traditional Shiva and Veerabhadra temple in the Kurnool region.'],
    ['Sri Nandeeswara & Nageswara Swamy Temples','Prathakota · Kurnool district',91,'Historic Shiva temples forming part of the district heritage landscape.'],
    ['Nivruthi Sangameswaram Temple','Sangameswaram · Kurnool district',94,'Historic temple landscape at the confluence region and an important pilgrimage stop.'],
    ['Sri Mahanandiswara Swamy Temple','Mahanandi · Regional',99,'Major Shiva pilgrimage destination known for its perennial spring water and temple tank.'],
    ['Sri Yaganti Uma Maheswara Swamy Temple','Yaganti · Regional',99,'Famous Shiva-Parvati temple with distinctive rock-cut surroundings and the celebrated Nandi shrine.'],
    ['Sri Lakshmi Narasimha Swamy Temple','Ahobilam · Regional',99,'Major Narasimha pilgrimage centre associated with the Nava Narasimha shrines.'],
    ['Sri Bhramaramba Mallikarjuna Swamy Temple','Srisailam · Regional',99,'Major Shaiva pilgrimage centre associated with Mallikarjuna and Bhramaramba.'],
    ['Sri Lakshmi Maddileti Narasimha Swamy Temple','R.S. Rangapuram · Kurnool region',91,'Regional Narasimha temple and pilgrimage destination.']
  ];
  function add(){
    if(!window.cities || !window.cities.Kurnool) return;
    const d=window.cities.Kurnool;
    d.Heritage=d.Heritage||[];
    const names=new Set(d.Heritage.map(x=>String(x[0]).toLowerCase()));
    temples.forEach(t=>{ if(!names.has(t[0].toLowerCase())) d.Heritage.push(t); });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',add); else add();
})();
