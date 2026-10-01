(function(){
const $=id=>document.getElementById(id);
let sb,user;
function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])||m)}
function report(message){const el=$('adminMessage');if(!el)return;el.textContent=message||'';el.classList.toggle('hidden',!message)}
function err(result,action){if(result?.error){report((action||'Operation')+' failed: '+result.error.message);return true}report('');return false}
async function init(){
 sb=window.unseenGoSupabase;if(!sb)return;
 const {data:{user:u},error:ue}=await sb.auth.getUser();if(ue){report('Authentication check failed: '+ue.message);return}user=u;
 if(!user){location.href='login.html?redirect=admin.html';return}
 const {data:admin,error:ae}=await sb.from('admin_users').select('role').eq('user_id',user.id).maybeSingle();
 if(ae){$('gate').innerHTML='<h2>Admin check failed</h2><p>'+esc(ae.message)+'</p>';return}
 if(!admin){$('gate').innerHTML='<h2>Admin access required</h2><p>This account is signed in but is not registered as an UnseenGo administrator.</p><a class="ug-btn" href="dashboard.html">Go to dashboard</a>';return}
 $('gate').classList.add('hidden');$('app').classList.remove('hidden');$('adminRole').textContent=admin.role||'admin';await load();
}
async function load(){
 const [p,c,s,r]=await Promise.all([
  sb.from('places').select('id,name,category,city_id,description,image_url,source,source_url,verification_status,is_hidden_gem').order('name'),
  sb.from('cities').select('id,name,state').order('name'),
  sb.from('community_submissions').select('id,place_name,city,state,category,description,image_url,source_url,status,created_at').order('created_at',{ascending:false}),
  sb.from('reviews').select('id,place_name,reviewer_name,rating,review_text,created_at').order('created_at',{ascending:false})
 ]);
 if(err(p,'Loading destinations')||err(c,'Loading cities')||err(s,'Loading community submissions')||err(r,'Loading reviews'))return;
 const places=p.data||[],cities=c.data||[],subs=s.data||[],reviews=r.data||[];
 $('placeCount').textContent=places.length;$('cityCount').textContent=cities.length;$('pendingCount').textContent=subs.filter(x=>x.status==='pending').length;$('reviewCount').textContent=reviews.length;
 $('cityId').innerHTML='<option value="">Select city</option>'+cities.map(x=>'<option value="'+esc(x.id)+'">'+esc(x.name)+(x.state?' — '+esc(x.state):'')+'</option>').join('');
 $('placeList').innerHTML=places.map(x=>'<div class="row"><div><b>'+esc(x.name)+'</b><div class="status">'+esc(x.category||'')+' · '+esc(x.verification_status||'needs_verification')+'</div></div><div class="actions"><button type="button" onclick="window.ugEdit('+JSON.stringify(x.id)+')">Edit</button><button type="button" onclick="window.ugVerify('+JSON.stringify(x.id)+')">Verify</button></div></div>').join('')||'<p>No destinations.</p>';
 $('submissionList').innerHTML=subs.map(x=>'<div class="row"><div><b>'+esc(x.place_name)+'</b><div>'+esc(x.city||'')+' · '+esc(x.status)+'</div></div><div class="actions">'+(x.status==='pending'?'<button type="button" onclick="window.ugSubmission('+JSON.stringify(x.id)+',\'approved\')">Approve</button><button type="button" onclick="window.ugSubmission('+JSON.stringify(x.id)+',\'rejected\')">Reject</button>':'')+'</div></div>').join('')||'<p>No submissions.</p>';
 $('reviewList').innerHTML=reviews.map(x=>'<div class="row"><div><b>'+esc(x.place_name||x.city||'Review')+'</b><div>'+esc(x.reviewer_name||'Traveller')+' · '+esc(x.rating)+'/5</div><p>'+esc(x.review_text||'')+'</p></div></div>').join('')||'<p>No reviews.</p>';
}
window.ugEdit=async id=>{const {data:x,error}=await sb.from('places').select('*').eq('id',id).single();if(error){report('Could not open destination: '+error.message);return} $('placeId').value=x.id;$('placeName').value=x.name||'';$('placeCategory').value=x.category||'';$('cityId').value=x.city_id||'';$('imageUrl').value=x.image_url||'';$('source').value=x.source||'';$('sourceUrl').value=x.source_url||'';$('verification').value=x.verification_status||'needs_verification';$('hiddenGem').value=String(!!x.is_hidden_gem);$('description').value=x.description||'';scrollTo({top:0,behavior:'smooth'})}
window.ugVerify=async id=>{const r=await sb.from('places').update({verification_status:'verified',verified_at:new Date().toISOString().slice(0,10),updated_at:new Date().toISOString()}).eq('id',id);if(err(r,'Verification'))return;await load()}
window.ugSubmission=async(id,status)=>{const r=await sb.from('community_submissions').update({status,reviewed_at:new Date().toISOString(),reviewed_by:user.id}).eq('id',id);if(err(r,'Submission update'))return;await load()}
document.addEventListener('DOMContentLoaded',()=>{
 document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{document.querySelectorAll('#app section').forEach(x=>x.classList.add('hidden'));$(b.dataset.tab).classList.remove('hidden');document.querySelectorAll('[data-tab]').forEach(x=>x.classList.remove('active'));b.classList.add('active')});
 $('placeForm').onsubmit=async e=>{e.preventDefault();const id=$('placeId').value;const city=$('cityId').value;if(!city){report('Please select a city.');return}const payload={name:$('placeName').value.trim(),category:$('placeCategory').value.trim(),city_id:city,image_url:$('imageUrl').value.trim()||null,source:$('source').value.trim()||null,source_url:$('sourceUrl').value.trim()||null,verification_status:$('verification').value,is_hidden_gem:$('hiddenGem').value==='true',description:$('description').value.trim()||null,updated_at:new Date().toISOString()};const r=id?await sb.from('places').update(payload).eq('id',id):await sb.from('places').insert(payload);if(err(r,id?'Saving destination':'Creating destination'))return;$('placeForm').reset();$('placeId').value='';report('Destination saved successfully.');await load()};
 $('resetForm').onclick=()=>{$('placeForm').reset();$('placeId').value='';report('')};
 $('signOut').onclick=async()=>{await sb.auth.signOut();location.href='index.html'};
 if(window.unseenGoSupabase)init();else window.addEventListener('unseengo:supabase-ready',init,{once:true});
});
})();