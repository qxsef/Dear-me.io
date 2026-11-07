Object.assign(I18N.id,{forgot:"Lupa kata sandi?",fTitle:"Atur ulang kata sandi",fText:"Masukkan email akunmu. Kami kirim tautan untuk membuat kata sandi baru.",fSend:"Kirim tautan",fSent:"Jika email terdaftar, tautan reset sudah dikirim. Cek kotak masuk dan spam.",fLimit:"Terlalu banyak permintaan. Coba lagi nanti.",rTitle:"Buat kata sandi baru",rNew:"Kata sandi baru",rSave:"Simpan kata sandi",rDone:"Kata sandi diperbarui. Silakan masuk.",rInvalid:"Tautan tidak valid atau sudah kedaluwarsa. Minta tautan baru."});
Object.assign(I18N.en,{forgot:"Forgot password?",fTitle:"Reset your password",fText:"Enter your account email. We'll send a link to create a new password.",fSend:"Send link",fSent:"If the email is registered, a reset link was sent. Check your inbox and spam.",fLimit:"Too many requests. Try again later.",rTitle:"Create a new password",rNew:"New password",rSave:"Save password",rDone:"Password updated. Please log in.",rInvalid:"This link is invalid or has expired. Request a new one."});
const fForm = document.getElementById("forgotForm"), rForm = document.getElementById("resetForm");
if(fForm) fForm.addEventListener("submit", async e=>{
  e.preventDefault();
  if(!sb) return toast(t("errConfig"),"err");
  const email = fForm.elements.email.value.trim();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return toast(t("errEmail"),"err");
  const btn = fForm.querySelector("button"); btn.disabled = true;
  const { error } = await sb.auth.resetPasswordForEmail(email,{redirectTo:new URL("reset.html",location.href).href});
  btn.disabled = false;
  if(error && error.status===429) return toast(t("fLimit"),"err");
  toast(t("fSent"));
});
if(rForm){
  let ready = false;
  const show = ()=>{ ready = true; rForm.hidden = false; document.getElementById("invalid").hidden = true; };
  if(sb){
    sb.auth.onAuthStateChange(ev=>{ if(ev==="PASSWORD_RECOVERY") show(); });
    setTimeout(async()=>{ if(!ready){ (await getSession()) ? show() : document.getElementById("invalid").hidden = false; } },1500);
  }
  rForm.addEventListener("submit", async e=>{
    e.preventDefault();
    const p = rForm.elements.password.value;
    if(p.length < 8) return toast(t("errPass"),"err");
    if(p !== rForm.elements.confirm.value) return toast(t("errMatch"),"err");
    const { error } = await sb.auth.updateUser({password:p});
    if(error) return toast(error.message,"err");
    toast(t("rDone")); await sb.auth.signOut(); setTimeout(()=>location.href="login.html",1500);
  });
}
