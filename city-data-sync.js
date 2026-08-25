/* UnseenGo AI — client helper for Supabase city enrichment */
(function(){'use strict';
const ENDPOINT='https://jpqbvliaaucyqnhcclbz.supabase.co/functions/v1/city-data';
window.UnseenGoCityData={async enrich(city,state){const r=await fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({city,state})});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||'City enrichment failed');return d;},async enrichBatch(cities){const r=await fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({cities})});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||'City enrichment failed');return d;}};
})();