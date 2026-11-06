Object.assign(I18N.id,{adDenied:"Halaman ini hanya untuk admin.",adReports:"Laporan belum ditangani",adNone:"Tidak ada laporan.",adTotal:"Total pesan",adVisible:"Tampil",adHidden:"Disembunyikan",adPending:"Laporan baru",adHide:"Sembunyikan",adShow:"Tampilkan",adDelete:"Hapus pesan",adDone:"Selesai",adConfirm:"Hapus pesan ini secara permanen?",adReason:"Alasan"});
Object.assign(I18N.en,{adDenied:"This page is for admins only.",adReports:"Unresolved reports",adNone:"No reports.",adTotal:"Total messages",adVisible:"Visible",adHidden:"Hidden",adPending:"New reports",adHide:"Hide",adShow:"Show",adDelete:"Delete message",adDone:"Resolve",adConfirm:"Permanently delete this message?",adReason:"Reason"});
const $ = id => document.getElementById(id);
const count = (tbl, f) => { let q = sb.from(tbl).select("id",{count:"exact",head:true}); return f ? f(q) : q; };
async function stats(){
  const [a,b,c,d] = await Promise.all([
    count("anonymous_messages"), count("anonymous_messages",q=>q.eq("status","visible")),
    count("anonymous_messages",q=>q.eq("status","hidden")), count("message_reports",q=>q.eq("resolved",false))]);
  const box = (l,n)=>`<div class="card"><h2>${n.count ?? 0}</h2><p>${esc(t(l))}</p></div>`;
  $("stats").innerHTML = box("adTotal",a)+box("adVisible",b)+box("adHidden",c)+box("adPending",d);
}
async function reports(){
  const { data, error } = await sb.from("message_reports").select("id,reason,created_at,message_id,anonymous_messages(id,content,status)").eq("resolved",false).order("created_at",{ascending:false});
  if(error) return toast(error.message,"err");
  $("noRep").hidden = data.length>0;
  $("reports").innerHTML = data.map(r=>{ const m=r.anonymous_messages||{};
    return `<article class="mcard"><p>${esc(m.content)}</p><p class="small">${esc(t("adReason"))}: ${esc(r.reason)}</p>
    <div class="drow" style="display:flex;gap:6px;flex-wrap:wrap">
    <button class="btn ghost" data-a="${m.status==="hidden"?"show":"hide"}" data-m="${esc(r.message_id)}">${esc(t(m.status==="hidden"?"adShow":"adHide"))}</button>
    <button class="btn ghost" data-a="del" data-m="${esc(r.message_id)}">${esc(t("adDelete"))}</button>
    <button class="btn" data-a="done" data-r="${esc(r.id)}">${esc(t("adDone"))}</button></div></article>`; }).join("");
}
$("reports").addEventListener("click", async e=>{
  const b = e.target.closest("button"); if(!b) return;
  let res;
  if(b.dataset.a==="hide") res = await sb.from("anonymous_messages").update({status:"hidden"}).eq("id",b.dataset.m);
  else if(b.dataset.a==="show") res = await sb.from("anonymous_messages").update({status:"visible"}).eq("id",b.dataset.m);
  else if(b.dataset.a==="del"){ if(!confirm(t("adConfirm"))) return; res = await sb.from("anonymous_messages").delete().eq("id",b.dataset.m); }
  else res = await sb.from("message_reports").update({resolved:true}).eq("id",b.dataset.r);
  if(res.error) return toast(res.error.message,"err");
  await Promise.all([stats(),reports()]); applyLang();
});
(async()=>{
  if(!sb) return toast(t("errConfig"),"err");
  const s = await requireAuth(); if(!s) return;
  const p = await getProfile(s.user.id);
  if(!p || p.role!=="admin"){ $("denied").hidden=false; return; }
  $("panel").hidden=false; await Promise.all([stats(),reports()]); applyLang();
})();
