Object.assign(I18N.id,{eSearch:"Cari pesan…",eAll:"Semua kategori",eEmpty:"Belum ada pesan yang cocok.",eMore:"Muat lebih banyak",eReport:"Laporkan",eReason:"Alasan melaporkan pesan ini?",eReported:"Laporan terkirim. Terima kasih.",eAlready:"Kamu sudah melaporkan pesan ini.",eLogin:"Masuk dulu untuk melaporkan.",rLogin:"Masuk dulu untuk memberi reaksi.",c_general:"Umum",c_love:"Cinta",c_study:"Belajar",c_family:"Keluarga",c_hope:"Harapan",c_vent:"Curhat"});
Object.assign(I18N.en,{eSearch:"Search messages…",eAll:"All categories",eEmpty:"No matching messages yet.",eMore:"Load more",eReport:"Report",eReason:"Why are you reporting this message?",eReported:"Report sent. Thank you.",eAlready:"You already reported this message.",eLogin:"Log in to report.",rLogin:"Log in to react.",c_general:"General",c_love:"Love",c_study:"Study",c_family:"Family",c_hope:"Hope",c_vent:"Venting"});
const $ = id => document.getElementById(id);
const PAGE = 12; let page = 0, timer = null, session = null;
const RX = {heart:"💜",hug:"🤗",cry:"🥹",sprout:"🌱"};
let counts = {}, mine = {};
const fmt = d => new Date(d).toLocaleString(getLang()==="id"?"id-ID":"en-US",{dateStyle:"medium",timeStyle:"short"});
function rx(id){ const c = counts[id]||{}; return Object.keys(RX).map(k=>`<button class="rx ${mine[id]===k?"on":""}" data-id="${esc(id)}" data-k="${k}">${RX[k]} <span>${c[k]||0}</span></button>`).join(""); }
function paint(id){ const el = document.querySelector(`[data-rx="${id}"]`); if(el) el.innerHTML = rx(id); }
function card(m){
  return `<article class="mcard"><span class="tag">${esc(t("c_"+m.category))}</span><p>${esc(m.content)}</p><div class="rxs" data-rx="${esc(m.id)}">${rx(m.id)}</div><div class="foot"><span>${fmt(m.created_at)}</span><button class="rep" data-id="${esc(m.id)}">${esc(t("eReport"))}</button></div></article>`;
}
async function loadReactions(ids){
  if(!sb || !ids.length) return;
  const [c,m] = await Promise.all([
    sb.from("message_reaction_counts").select("message_id,emoji,n").in("message_id",ids),
    session ? sb.from("message_reactions").select("message_id,emoji").in("message_id",ids) : Promise.resolve({data:[]})]);
  (c.data||[]).forEach(r=>{ (counts[r.message_id] ??= {})[r.emoji] = r.n; });
  (m.data||[]).forEach(r=>{ mine[r.message_id] = r.emoji; });
  ids.forEach(paint);
}
async function load(reset){
  if(!sb) return toast(t("errConfig"),"err");
  if(reset){ page = 0; $("msgs").innerHTML = ""; }
  let q = sb.from("anonymous_messages").select("id,content,category,created_at").eq("status","visible").order("created_at",{ascending:false}).range(page*PAGE,page*PAGE+PAGE-1);
  const term = $("q").value.trim().replace(/[%_\\,()]/g," ");
  if(term) q = q.ilike("content","%"+term+"%");
  if($("fcat").value) q = q.eq("category",$("fcat").value);
  const { data, error } = await q;
  if(error) return toast(error.message,"err");
  $("msgs").insertAdjacentHTML("beforeend", data.map(card).join(""));
  $("empty").hidden = $("msgs").children.length > 0;
  $("more").hidden = data.length < PAGE;
  page++; applyLang(); loadReactions(data.map(m=>m.id));
}
$("msgs").addEventListener("click", async e=>{
  const b = e.target.closest(".rx"); if(!b) return;
  if(!session) return toast(t("rLogin"),"err");
  const id = b.dataset.id, k = b.dataset.k, prev = mine[id], uid = session.user.id;
  let res;
  if(prev===k) res = await sb.from("message_reactions").delete().eq("message_id",id).eq("user_id",uid);
  else if(prev) res = await sb.from("message_reactions").update({emoji:k}).eq("message_id",id).eq("user_id",uid);
  else res = await sb.from("message_reactions").insert({message_id:id,emoji:k});
  if(res.error) return toast(res.error.message,"err");
  const c = (counts[id] ??= {});
  if(prev) c[prev] = Math.max(0,(c[prev]||0)-1);
  if(prev===k) delete mine[id]; else { mine[id] = k; c[k] = (c[k]||0)+1; }
  paint(id);
});
$("msgs").addEventListener("click", async e=>{
  const b = e.target.closest(".rep"); if(!b) return;
  if(!session) return toast(t("eLogin"),"err");
  const reason = (prompt(t("eReason"))||"").trim();
  if(reason.length < 3) return;
  const { error } = await sb.from("message_reports").insert({ message_id:b.dataset.id, reason:reason.slice(0,300) });
  if(error) return toast(error.code==="23505"?t("eAlready"):error.message,"err");
  toast(t("eReported"));
});
(async()=>{
  if(sb) session = await getSession();
  $("q").oninput = ()=>{ clearTimeout(timer); timer = setTimeout(()=>load(true),350); };
  $("fcat").onchange = ()=>load(true);
  $("more").onclick = ()=>load(false);
  load(true);
})();
