Object.assign(I18N.id,{pAvatar:"Foto profil (tautan gambar, opsional)",pLang:"Bahasa",pSave:"Simpan profil",pSaved:"Profil tersimpan",pJoined:"Bergabung",pBadUrl:"Tautan foto harus diawali https://"});
Object.assign(I18N.en,{pAvatar:"Profile photo (image link, optional)",pLang:"Language",pSave:"Save profile",pSaved:"Profile saved",pJoined:"Joined",pBadUrl:"Photo link must start with https://"});
const $ = id => document.getElementById(id);
function showAvatar(u){ const a=$("avatar"); if(u && /^https:\/\//.test(u)){ a.src=u; a.hidden=false; } else a.hidden=true; }
(async()=>{
  if(!sb) return toast(t("errConfig"),"err");
  const s = await requireAuth(); if(!s) return;
  const p = await getProfile(s.user.id);
  $("uname").value = p?.username || ""; $("avurl").value = p?.avatar_url || "";
  $("plang").value = getLang(); $("pemail").value = s.user.email;
  $("pjoined").textContent = t("pJoined")+": "+new Date(s.user.created_at).toLocaleDateString(getLang()==="id"?"id-ID":"en-US",{dateStyle:"long"});
  showAvatar(p?.avatar_url);
  if(p?.role==="admin") $("adminLink").hidden = false;
  $("plang").onchange = ()=>setLang($("plang").value);
  $("pOut").onclick = logout;
  $("pForm").addEventListener("submit", async e=>{
    e.preventDefault();
    const username = $("uname").value.trim(), avatar = $("avurl").value.trim();
    if(username.length<2 || username.length>30) return toast(t("errName"),"err");
    if(avatar && !/^https:\/\//.test(avatar)) return toast(t("pBadUrl"),"err");
    const { error } = await sb.from("profiles").update({username, avatar_url:avatar||null, language:$("plang").value}).eq("id",s.user.id);
    if(error) return toast(error.message,"err");
    showAvatar(avatar); toast(t("pSaved")); renderChrome();
  });
})();
