Object.assign(I18N.id,{dNew:"Jurnal baru",dSearch:"Cari jurnal…",dNewest:"Terbaru dulu",dOldest:"Terlama dulu",dTitle:"Judul",dContent:"Tulis ceritamu di sini…",dSave:"Simpan",dDelete:"Hapus",dEmpty:"Belum ada jurnal. Mulai tulis yang pertama.",dSaved:"Tersimpan",dSaving:"Menyimpan…",dNeedTitle:"Isi judul dulu.",dConfirm:"Hapus jurnal ini? Tindakan ini tidak bisa dibatalkan.",dDeleted:"Jurnal dihapus",dCreated:"Dibuat",dEdited:"Diedit",dUntitled:"(tanpa judul)"});
Object.assign(I18N.en,{dNew:"New entry",dSearch:"Search entries…",dNewest:"Newest first",dOldest:"Oldest first",dTitle:"Title",dContent:"Write your story here…",dSave:"Save",dDelete:"Delete",dEmpty:"No entries yet. Write your first one.",dSaved:"Saved",dSaving:"Saving…",dNeedTitle:"Add a title first.",dConfirm:"Delete this entry? This can't be undone.",dDeleted:"Entry deleted",dCreated:"Created",dEdited:"Edited",dUntitled:"(untitled)"});

let items = [], cur = null, saving = false, timer = null;
const $ = id => document.getElementById(id);
const fmt = d => new Date(d).toLocaleString(getLang()==="id"?"id-ID":"en-US",{dateStyle:"medium",timeStyle:"short"});

function renderList(){
  const q = $("search").value.trim().toLowerCase();
  const rows = items.filter(i => (i.title+" "+i.content).toLowerCase().includes(q));
  $("list").innerHTML = rows.length ? rows.map(i=>`<li><button data-id="${esc(i.id)}" class="${i.id===cur?"on":""}"><b>${esc(i.title)||t("dUntitled")}</b><span>${fmt(i.created_at)}</span></button></li>`).join("") : `<li class="small">${t("dEmpty")}</li>`;
  $("list").querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>open(b.dataset.id)));
}
function open(id){
  const i = items.find(x=>x.id===id); cur = id;
  $("title").value = i ? i.title : ""; $("content").value = i ? i.content : "";
  $("meta").textContent = i ? `${t("dCreated")}: ${fmt(i.created_at)} · ${t("dEdited")}: ${fmt(i.updated_at)}` : "";
  $("status").textContent = ""; renderList();
}
async function load(){
  const { data, error } = await sb.from("diaries").select("id,title,content,created_at,updated_at").order("created_at",{ascending:$("sort").value==="asc"});
  if(error) return toast(error.message,"err");
  items = data; renderList();
}
async function save(auto){
  if(saving) return;
  const title = $("title").value.trim(), content = $("content").value;
  if(!title){ if(!auto) toast(t("dNeedTitle"),"err"); return; }
  saving = true; $("status").textContent = t("dSaving");
  const q = cur ? sb.from("diaries").update({title,content}).eq("id",cur) : sb.from("diaries").insert({title,content});
  const { data, error } = await q.select().single();
  saving = false;
  if(error){ $("status").textContent = ""; return toast(error.message,"err"); }
  cur = data.id; const k = items.findIndex(x=>x.id===data.id);
  if(k>=0) items[k] = data; else items.unshift(data);
  open(data.id); $("status").textContent = t("dSaved");
}
async function del(){
  if(!cur) return;
  if(!confirm(t("dConfirm"))) return;
  const { error } = await sb.from("diaries").delete().eq("id",cur);
  if(error) return toast(error.message,"err");
  items = items.filter(x=>x.id!==cur); cur = null; open(null); toast(t("dDeleted"));
}
(async()=>{
  if(!sb) return toast(t("errConfig"),"err");
  if(!(await requireAuth())) return;
  $("newBtn").onclick = ()=>open(null);
  $("saveBtn").onclick = ()=>save(false);
  $("delBtn").onclick = del;
  $("search").oninput = renderList; $("sort").onchange = load;
  const auto = ()=>{ clearTimeout(timer); timer = setTimeout(()=>save(true),1500); };
  $("title").oninput = auto; $("content").oninput = auto;
  await load(); applyLang();
})();
