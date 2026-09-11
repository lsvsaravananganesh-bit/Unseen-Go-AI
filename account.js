(function(){
  function ready(fn){if(window.unseenGoSupabase) fn(window.unseenGoSupabase); else window.addEventListener('unseengo:supabase-ready',function(e){fn(e.detail)},{once:true});}
  window.UnseenGoAccount={
    ready,
    async user(){return new Promise(resolve=>ready(async s=>{const {data}=await s.auth.getUser();resolve(data.user||null)}))},
    async savePreferences(p){return new Promise(resolve=>ready(async s=>{const {data:{user}}=await s.auth.getUser();if(!user)return resolve({error:new Error('Please sign in first.')});const result=await s.from('user_preferences').upsert({user_id:user.id,interests:p.interests||[],budget:p.budget||'moderate',pace:p.pace||'balanced',updated_at:new Date().toISOString()},{onConflict:'user_id'});resolve(result)}))},
    async getPreferences(){return new Promise(resolve=>ready(async s=>{const {data:{user}}=await s.auth.getUser();if(!user)return resolve(null);const {data}=await s.from('user_preferences').select('*').eq('user_id',user.id).maybeSingle();resolve(data||null)}))},
    async saveRecommendation(rec){return new Promise(resolve=>ready(async s=>{const {data:{user}}=await s.auth.getUser();if(!user)return resolve({error:new Error('Please sign in to save places.')});const result=await s.from('saved_recommendations').insert({user_id:user.id,place_name:rec.name,score:rec.score||0,reason:rec.why||'',place_data:rec.place||{}});resolve(result)}))},
    async savedRecommendations(){return new Promise(resolve=>ready(async s=>{const {data:{user}}=await s.auth.getUser();if(!user)return resolve([]);const {data}=await s.from('saved_recommendations').select('*').order('created_at',{ascending:false});resolve(data||[])}))},
    async saveTrip(title,destination,tripData){return new Promise(resolve=>ready(async s=>{const {data:{user}}=await s.auth.getUser();if(!user)return resolve({error:new Error('Please sign in to save trips.')});const result=await s.from('saved_trips').insert({user_id:user.id,title,destination,trip_data:tripData||{}});resolve(result)}))},
    async signOut(){return new Promise(resolve=>ready(async s=>resolve(await s.auth.signOut())))},
    async signInEmail(email,password){return new Promise(resolve=>ready(async s=>resolve(await s.auth.signInWithPassword({email,password}))))},
    async signUp(email,password,name){return new Promise(resolve=>ready(async s=>resolve(await s.auth.signUp({email,password,options:{data:{full_name:name||''}}}))))},
    async google(){return new Promise(resolve=>ready(async s=>resolve(await s.auth.signInWithOAuth({provider:'google',options:{redirectTo:window.location.origin+window.location.pathname.replace(/[^/]*$/,'')+'dashboard.html'}}))))}
  };
})();