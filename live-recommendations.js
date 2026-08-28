/* UnseenGo AI — Priority 2 live/verified recommendation layer
 * Reads active destination records from Supabase. Falls back only when the live request fails.
 */
(function(){'use strict';
const URL='https://jpqbvliaaucyqnhcclbz.supabase.co';
const KEY='sb_publishable_K-0R9a2lSginTIfxHk-cxQ_joorBonP';
const headers={apikey:KEY,Authorization:'Bearer '+KEY};
const select='id,city_id,name,category,description,history,image_url,latitude,longitude,map_url,is_hidden_gem,is_famous,is_active,source,source_url,verified_at,verification_status,crowd_level,budget_level,pace_level,photography_score,opening_time,closing_time,visit_duration_minutes,wheelchair_access,walking_distance_m,steps,road_access,parking_available,local_experience_score,road_distance_source,route_profile,route_updated_at,data_quality_score,verification_notes';
async function getJSON(path){const r=await fetch(URL+'/rest/v1/'+path,{headers});if(!r.ok)throw new Error('Supabase request failed ('+r.status+')');return r.json();}
async function load(){
 const [cities,places]=await Promise.all([
   getJSON('cities?select=id,name,state,region,verification_status,verified_at&is_active=eq.true&order=name.asc'),
   getJSON('places?select='+encodeURIComponent(select)+'&is_active=eq.true&order=name.asc')
 ]);
 const cm=new Map(cities.map(c=>[c.id,c]));
 const rows=places.map(r=>{const c=cm.get(r.city_id)||{};return {...r,city_name:c.name||'India',city_state:c.state||'',city_region:c.region||''};});
 window.UnseenGoLivePlaces=rows;
 window.UnseenGoLiveStatus={ok:true,count:rows.length,cities:cities.length,loadedAt:new Date().toISOString(),source:'Supabase'};
 document.dispatchEvent(new CustomEvent('unseengo:live-data',{detail:window.UnseenGoLiveStatus}));
 return rows;
}
function mapPlace(r){return {id:r.id,name:r.name,location:r.city_name+(r.city_state?', '+r.city_state:''),baseScore:Number(r.data_quality_score||70),description:r.description||'A distinctive local experience.',category:r.category,city:r.city_name,lat:r.latitude,lng:r.longitude,verification:{crowdLevel:r.crowd_level,budgetLevel:r.budget_level,paceLevel:r.pace_level,photographyScore:r.photography_score},crowdLevel:r.crowd_level,budgetLevel:r.budget_level,paceLevel:r.pace_level,photographyScore:r.photography_score,verificationStatus:r.verification_status||'unverified',verifiedAt:r.verified_at||null,source:r.source||null,sourceUrl:r.source_url||null,openingTime:r.opening_time,closingTime:r.closing_time,visitDuration:r.visit_duration_minutes,localExperienceScore:r.local_experience_score,dataQualityScore:r.data_quality_score,verificationNotes:r.verification_notes,history:r.history,imageUrl:r.image_url,mapUrl:r.map_url};}
function rank(rows,profile){const engine=window.UnseenGoAI;return rows.map(r=>{const p=mapPlace(r);const b=engine.scoreBreakdown(p,profile);const interest=(profile.interests||[]).join(' + ')||'your selected interests';const reason=(profile.interests||[]).length&&profile.interests.some(x=>String(x).toLowerCase()===String(p.category).toLowerCase())?`Matches your ${p.category.toLowerCase()} focus and fits the selected budget and pace.`:`Selected from verified destination data using your preference profile.`;return {...p,...b,unseenScore:b.score,why:reason};}).sort((a,b)=>b.unseenScore-a.unseenScore||b.baseScore-a.baseScore||a.name.localeCompare(b.name));}
async function recommend(city,profile={}){let rows=window.UnseenGoLivePlaces;if(!rows||!rows.length)rows=await load();if(city)rows=rows.filter(r=>String(r.city_name).toLowerCase()===String(city).toLowerCase());return rank(rows,profile);}
window.UnseenGoLive={load,recommend,mapPlace};
load().catch(e=>{window.UnseenGoLiveStatus={ok:false,count:0,error:e.message};document.dispatchEvent(new CustomEvent('unseengo:live-data',{detail:window.UnseenGoLiveStatus}));});
})();
