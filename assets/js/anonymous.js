Object.assign(I18N.id,{aIntro:"Tulis apa yang ingin kamu sampaikan. Namamu tidak akan ditampilkan.",aCategory:"Kategori",aMessage:"Pesan",aPlaceholder:"Tulis pesanmu di sini…",aSend:"Kirim pesan",aSent:"Pesan terkirim",aShort:"Pesan minimal 3 karakter.",aWait:"Tunggu sebentar sebelum mengirim lagi.",aLimit:"Batas kirim tercapai (5 pesan per jam). Coba lagi nanti.",aLogin:"Masuk dulu untuk mengirim pesan.",c_general:"Umum",c_love:"Cinta",c_study:"Belajar",c_family:"Keluarga",c_hope:"Harapan",c_vent:"Curhat"});
Object.assign(I18N.en,{aIntro:"Write what you want to say. Your name will not be shown.",aCategory:"Category",aMessage:"Message",aPlaceholder:"Write your message here…",aSend:"Send message",aSent:"Message sent",aShort:"Message must be at least 3 characters.",aWait:"Please wait a moment before sending again.",aLimit:"Send limit reached (5 messages per hour). Try again later.",aLogin:"Log in first to send a message.",c_general:"General",c_love:"Love",c_study:"Study",c_family:"Family",c_hope:"Hope",c_vent:"Venting"});
const $ = id => document.getElementById(id);
(async()=>{
  const s = await getSession();
  if(!s){ const h=$("loginHint"); h.innerHTML=`<a href="login.html">${esc(t("aLogin"))}</a>`; }
  $("text").addEventListener("input",()=>$("count").textContent=$("text").value.length);
  $("msgForm").addEventListener("submit", async e=>{
    e.preventDefault();
    if(!sb) return toast(t("errConfig"),"err");
    if(!(await getSession())) return toast(t("aLogin"),"err");
    if($("website").value) return; // jebakan bot
    const content = $("text").value.trim();
    if(content.length < 3) return toast(t("aShort"),"err");
    let last = 0; try{ last = +localStorage.getItem("dearme_last")||0; }catch(_){}
    if(Date.now()-last < 30000) return toast(t("aWait"),"err");
    $("sendBtn").disabled = true;
    const { error } = await sb.from("anonymous_messages").insert({ content, category:$("cat").value });
    $("sendBtn").disabled = false;
    if(error) return toast(String(error.message).includes("rate_limit")?t("aLimit"):error.message,"err");
    try{ localStorage.setItem("dearme_last",Date.now()); }catch(_){}
    $("text").value=""; $("count").textContent="0"; toast(t("aSent"));
  });
})();
