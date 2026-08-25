/* UnseenGo AI — Supabase destination loader
 * Supabase is the preferred source when verified place records exist.
 * The existing static dataset remains a safe demo fallback when the database is empty/unavailable.
 */
(function(){'use strict';
 const URL='https://jpqbvliaaucyqnhcclbz.supabase.co';const KEY='sb_publishable_K-0R9a2lSginTIfxHk-cxQ_joorBonp';
 async function load(city){try{const q=`${URL}/rest/v1/places?select=*,cities!inner(name)&cities.name=eq.${encodeURIComponent(city)}&is_active=eq.true&order=is_hidden_gem.desc,name.asc`;const r=await fetch(q,{headers:{apikey:KEY,Authorization:`Bearer ${KEY}`}});if(!r.ok)throw new Error(`Supabase ${r.status}`);const rows=await r.json();return rows.map(x=>({...x,name:x.name,city:city,category:x.category,description:x.description,lat:x.latitude,lng:x.longitude,baseScore:x.is_hidden_gem?90:70,verification:{source:x.source,sourceUrl:x.source_url,verifiedAt:x.verified_at,verificationStatus:x.verification_status},crowdLevel:x.crowd_level,budgetLevel:x.budget_level,paceLevel:x.pace_level,photographyScore:x.photography_score,openingTime:x.opening_time,closingTime:x.closing_time,visitDurationMinutes:x.visit_duration_minutes}));}catch(e){console.warn('Supabase destination load failed; using static dataset.',e);return[]}}
 window.UnseenGoSupabasePlaces={load};
})();