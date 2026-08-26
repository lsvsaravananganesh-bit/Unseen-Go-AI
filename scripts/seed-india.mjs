import { createClient } from '@supabase/supabase-js';
import { INDIA_STATES_UTS, SWADESH_DARSHAN_DESTINATIONS } from '../data/india-registry.js';

const url=process.env.SUPABASE_URL;
const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
if(!url||!key) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
const supabase=createClient(url,key,{auth:{autoRefreshToken:false,persistSession:false}});
const today=new Date().toISOString().slice(0,10);

for(const c of INDIA_STATES_UTS){
  const {error}=await supabase.from('cities').upsert({
    name:c.capital,state:c.state,region:c.type,description:`${c.capital}, the capital/administrative centre used for ${c.state} in the UnseenGo India registry.`,source:c.source,source_url:c.source_url,verified_at:today,verification_status:c.verification_status,is_active:true
  },{onConflict:'name'});
  if(error) throw error;
}

for(const d of SWADESH_DARSHAN_DESTINATIONS){
  let {data:city,error}=await supabase.from('cities').select('id').eq('name',d.name).maybeSingle();
  if(error) throw error;
  if(!city){
    const r=await supabase.from('cities').insert({name:d.name,state:d.state,region:'Tourism destination',description:`Government-notified tourism destination in ${d.state}.`,source:d.source,source_url:d.source_url,verified_at:today,verification_status:d.verification_status,is_active:true}).select('id').single();
    if(r.error) throw r.error; city=r.data;
  }
  const place={city_id:city.id,name:d.name,category:'Government-listed destination',description:`Government of India tourism destination notified under Swadesh Darshan 2.0. Live Google Places details should be refreshed before display of ratings, hours and photos.`,is_hidden_gem:false,is_famous:false,is_active:true,source:d.source,source_url:d.source_url,verified_at:today,verification_status:d.verification_status,data_quality_score:70,verification_notes:'Government-listed registry record. Not a substitute for live Google Places verification.',local_experience_score:70};
  const r=await supabase.from('places').upsert(place,{onConflict:'city_id,name'});
  if(r.error){
    const fallback=await supabase.from('places').select('id').eq('city_id',city.id).eq('name',d.name).maybeSingle();
    if(!fallback.data){
      const ins=await supabase.from('places').insert(place);
      if(ins.error) throw ins.error;
    }
  }
}

console.log(`Seeded ${INDIA_STATES_UTS.length} state/UT registry entries and ${SWADESH_DARSHAN_DESTINATIONS.length} government-notified destinations.`);
