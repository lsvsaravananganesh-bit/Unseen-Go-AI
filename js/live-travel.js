/* UnseenGo AI — Live Travel Decision Engine client
   Calls the Supabase Edge Function. Provider secrets stay server-side.
*/
(function(){'use strict';
const ENDPOINT='https://jpqbvliaaucyqnhcclbz.supabase.co/functions/v1/live-travel';
async function liveTravel(payload){const r=await fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload||{})});const d=await r.json();if(!r.ok)throw new Error(d.error||'Live travel service unavailable');return d;}
function status(label,obj){const s=obj?.status;return {label,status:s==='live'?'LIVE':s==='not_configured'?'SETUP NEEDED':s==='needs_location'?'LOCATION NEEDED':s||'UNAVAILABLE',provider:obj?.provider||'—'};}
window.UnseenGoLive={liveTravel,status,endpoint:ENDPOINT};
})();
