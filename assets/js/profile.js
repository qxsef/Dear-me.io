Object.assign(I18N.id,{pAvatar:"Foto profil (dari perangkat, opsional)",pLang:"Bahasa",pSave:"Simpan profil",pSaved:"Profil tersimpan",pJoined:"Bergabung",pBadImg:"File harus berupa gambar.",pUpErr:"Gagal mengunggah foto."});
Object.assign(I18N.en,{pAvatar:"Profile photo (from your device, optional)",pLang:"Language",pSave:"Save profile",pSaved:"Profile saved",pJoined:"Joined",pBadImg:"File must be an image.",pUpErr:"Failed to upload photo."});
const $ = id => document.getElementById(id);
let newBlob = null;
function showAvatar(u){ const a=$("avatar"); if(u){ a.src=u; a.hidden=false; } else a.hidden=true; }
function toSquare(file){
  return new Promise((ok,fail)=>{
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = ()=>{
      const n = 256, m = Math.min(img.width,img.height), c = document.createElement("canvas");
      c.width = c.height = n;
      c.getContext("2d").drawImage(img,(img.width-m)/2,(img.height-m)/2,m,m,0,0,n,n);
      URL.revokeObjectURL(url);
      c.toBlob(b=>b?ok(b):fail(),"image/jpeg",0.85);
    };
    img.onerror = fail; img.src = url;
  });
}
(async()=>{
  if(!sb) return toast(t("errConfig"),"err");
  const s = await requireAuth(); if(!s) return;
  const p = await getProfile(s.user.id);
  let avatarUrl = p?.avatar_url || null;
  $("uname").value = p?.username || "";
  $("plang").value = getLang(); $("pemail").value = s.user.email;
  $("pjoined").textContent = t("pJoined")+": "+new Date(s.user.created_at).toLocaleDateString(getLang()==="id"?"id-ID":"en-US",{dateStyle:"long"});
  showAvatar(avatarUrl);
  if(p?.role==="admin") $("adminLink").hidden = false;
  $("plang").onchange = ()=>setLang($("plang").value);
  $("pOut").onclick = logout;
  $("avfile").onchange = async e=>{
    const f = e.target.files[0]; if(!f) return;
    if(!f.type.startsWith("image/")) return toast(t("pBadImg"),"err");
    try{ newBlob = await toSquare(f); showAvatar(URL.createObjectURL(newBlob)); }
    catch(_){ newBlob = null; toast(t("pBadImg"),"err"); }
  };
  $("pForm").addEventListener("submit", async e=>{
    e.preventDefault();
    const username = $("uname").value.trim();
    if(username.length<2 || username.length>30) return toast(t("errName"),"err");
    if(newBlob){
      const path = s.user.id+"/avatar.jpg";
      const up = await sb.storage.from("avatars").upload(path,newBlob,{upsert:true,contentType:"image/jpeg"});
      if(up.error) return toast(t("pUpErr"),"err");
      avatarUrl = sb.storage.from("avatars").getPublicUrl(path).data.publicUrl+"?v="+Date.now();
      newBlob = null;
    }
    const { error } = await sb.from("profiles").update({username, avatar_url:avatarUrl, language:$("plang").value}).eq("id",s.user.id);
    if(error) return toast(error.message,"err");
    showAvatar(avatarUrl); toast(t("pSaved")); renderChrome();
  });
})();
