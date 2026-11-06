const form = document.getElementById("authForm");
const isRegister = form.dataset.mode === "register";
form.addEventListener("submit", async (e)=>{
  e.preventDefault();
  if(!sb) return toast(t("errConfig"), "err");
  const v = n => (form.elements[n]?.value || "").trim();
  const email = v("email"), pass = form.elements.password.value;
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return toast(t("errEmail"), "err");
  if(pass.length < 8) return toast(t("errPass"), "err");
  if(isRegister){
    const name = v("username");
    if(name.length < 2 || name.length > 30) return toast(t("errName"), "err");
    if(pass !== form.elements.confirm.value) return toast(t("errMatch"), "err");
  }
  const btn = form.querySelector("button[type=submit]"); btn.disabled = true;
  try{
    if(isRegister){
      const { data, error } = await sb.auth.signUp({ email, password: pass, options: { data: { username: v("username") } } });
      if(error) throw error;
      if(data.session){ location.href = "diary.html"; } else { toast(t("registered")); }
    } else {
      const { error } = await sb.auth.signInWithPassword({ email, password: pass });
      if(error) return toast(t("errLogin"), "err");
      location.href = "diary.html";
    }
  } catch(err){ toast(err.message || t("errGeneric"), "err"); }
  finally{ btn.disabled = false; }
});
document.addEventListener("DOMContentLoaded", ()=>{ if(sb) redirectIfAuth(); });
