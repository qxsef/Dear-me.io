Object.assign(I18N.id,{eSearch:"Cari pesan…",eAll:"Semua kategori",eEmpty:"Belum ada pesan yang cocok.",eMore:"Muat lebih banyak",eReport:"Laporkan",eReason:"Alasan melaporkan pesan ini?",eReported:"Laporan terkirim. Terima kasih.",eAlready:"Kamu sudah melaporkan pesan ini.",eLogin:"Masuk dulu untuk melaporkan.",c_general:"Umum",c_love:"Cinta",c_study:"Belajar",c_family:"Keluarga",c_hope:"Harapan",c_vent:"Curhat"});
Object.assign(I18N.en,{eSearch:"Search messages…",eAll:"All categories",eEmpty:"No matching messages yet.",eMore:"Load more",eReport:"Report",eReason:"Why are you reporting this message?",eReported:"Report sent. Thank you.",eAlready:"You already reported this message.",eLogin:"Log in to report.",c_general:"General",c_love:"Love",c_study:"Study",c_family:"Family",c_hope:"Hope",c_vent:"Venting"});
const $ = id => document.getElementById(id);
const PAGE = 12; let page = 0, timer = null, session = null;
const fmt = d => new Date(d).toLocaleString(getLang()==="id"?"id-ID":"en-US",{dateStyle:"medium",timeStyle:"short"});
function card(m){
  return `<article class="mcard"><span class="tag">${esc(t("c_"+m.category))}</span><p>${esc(m.content)}</p><div class="foot"><span>${fmt(m.created_at)}</span><button class="rep" data-id="${esc(m.id)}">${esc(t("eReport"))}</button></div></article>`;
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
  page++; applyLang();
}
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
