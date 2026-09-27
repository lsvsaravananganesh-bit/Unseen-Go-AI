(function(){
const $=id=>document.getElementById(id);
let sb,user;
function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])||m)}
async function init(){
 sb=window.unseenGoSupabase;if(!sb)return;
 const {data:{user:u}}=await sb.auth.getUser();user=u;
 if(!user){location.href='login.html?redirect=admin.html';return}
 const {data:admin}=await sb.from('admin_users').select('role').eq('user_id',user.id).maybeSingle();
 if(!admin){$('gate').innerHTML='<h2>Admin access required</h2><p>This account is signed in but is not registered as an UnseenGo administrator.</p><a class="ug-btn" href="dashboard.html">Go to dashboard</a>';return}
 $('gate').classList.add('hidden');$('app').classList.remove('hidden');load();
}
async function load(){
 const [p,c,s,r]=await Promise.all([
 sb.from('places').select('id,name,category,city_id,description,image_url,source,source_url,verification_status,is_hidden_gem').order('name'),
 sb.from('cities').select('id,name,state').order('name'),
 sb.from('community_submissions').select('id,place_name,city,state,category,description,image_url,source_url,status,created_at').order('created_at',{ascending:false}),
 sb.from('reviews').select('id,place_name,reviewer_name,rating,review_text,created_at').order('created_at',{ascending:false})
 ]);
 const places=p.data||[], cities=c.data||[], subs=s.data||[], reviews=r.data||[];
 $('placeCount').textContent=places.length;$('cityCount').textContent=cities.length;$('pendingCount').textContent=subs.filter(x=>x.status==='pending').length;$('reviewCount').textContent=reviews.length;
 $('placeList').innerHTML=places.map(x=>'<div class="row"><div><b>'+esc(x.name)+'</b><div class="status">'+esc(x.category||'')+' · '+esc(x.verification_status)+'</div></div><div class="actions"><button onclick="window.ugEdit('+JSON.stringify(x.id)+')">Edit</button><button onclick="window.ugVerify('+JSON.stringify(x.id)+')">Verify</button></div></div>').join('')||'<p>No destinations.</p>';
 $('submissionList').innerHTML=subs.map(x=>'<div class="row"><div><b>'+esc(x.place_name)+'</b><div>'+esc(x.city||'')+' · '+esc(x.status)+'</div></div><div class="actions">'+(x.status==='pending'?'<button onclick="window.ugSubmission('+JSON.stringify(x.id)+',\'approved\')">Approve</button><button onclick="window.ugSubmission('+JSON.stringify(x.id)+',\'rejected\')">Reject</button>':'')+'</div></div>').join('')||'<p>No submissions.</p>';
 $('reviewList').innerHTML=reviews.map(x=>'<div class="row"><div><b>'+esc(x.place_name||x.city)+'</b><div>'+esc(x.reviewer_name||'Traveller')+' · '+esc(x.rating)+'/5</div><p>'+esc(x.review_text)+'</p></div></div>').join('')||'<p>No reviews.</p>';
}
window.ugEdit=async id=>{const {data:x}=await sb.from('places').select('*').eq('id',id).single();if(!x)return;$('placeId').value=x.id;$('placeName').value=x.name||'';$('placeCategory').value=x.category||'';$('cityId').value=x.city_id||'';$('imageUrl').value=x.image_url||'';$('source').value=x.source||'';$('sourceUrl').value=x.source_url||'';$('verification').value=x.verification_status||'needs_verification';$('hiddenGem').value=String(!!x.is_hidden_gem);$('description').value=x.description||'';scrollTo(0,0)}
window.ugVerify=async id=>{const r=await sb.from('places').update({verification_status:'verified',verified_at:new Date().toISOString().slice(0,10)}).eq('id',id);if(r.error)alert(r.error.message);else load()}
window.ugSubmission=async(id,status)=>{const r=await sb.from('community_submissions').update({status,reviewed_at:new Date().toISOString(),reviewed_by:user.id}).eq('id',id);if(r.error)alert(r.error.message);else load()}
document.addEventListener('DOMContentLoaded',()=>{
 document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{document.querySelectorAll('#app section').forEach(x=>x.classList.add('hidden'));$(b.dataset.tab).classList.remove('hidden');document.querySelectorAll('[data-tab]').forEach(x=>x.classList.remove('active'));b.classList.add('active')});
 $('placeForm').onsubmit=async e=>{e.preventDefault();const id=$('placeId').value;const payload={name:$('placeName').value.trim(),category:$('placeCategory').value.trim(),city_id:$('cityId').value.trim(),image_url:$('imageUrl').value.trim()||null,source:$('source').value.trim()||null,source_url:$('sourceUrl').value.trim()||null,verification_status:$('verification').value,is_hidden_gem:$('hiddenGem').value==='true',description:$('description').value.trim()||null,updated_at:new Date().toISOString()};const q=id?sb.from('places').update(payload).eq('id',id):sb.from('places').insert(payload);const r=await q;if(r.error)alert(r.error.message);else{$('placeForm').reset();$('placeId').value='';load()}};
 $('resetForm').onclick=()=>{$('placeForm').reset();$('placeId').value=''};
 $('signOut').onclick=async()=>{await sb.auth.signOut();location.href='index.html'};
 if(window.unseenGoSupabase)init();else window.addEventListener('unseengo:supabase-ready',init,{once:true});
});
})();