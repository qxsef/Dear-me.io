const cfg = window.DEARME_CONFIG || {};
const configured = cfg.SUPABASE_URL && !cfg.SUPABASE_URL.includes("YOUR-PROJECT");
const sb = configured && window.supabase ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY) : null;

function esc(s){ return String(s ?? "").replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function toast(msg, type="ok"){
  let box = document.getElementById("toasts");
  if(!box){ box = document.createElement("div"); box.id = "toasts"; box.setAttribute("aria-live","polite"); document.body.appendChild(box); }
  const el = document.createElement("div"); el.className = "toast " + type; el.textContent = msg; box.appendChild(el);
  setTimeout(()=>el.remove(), 4000);
}
async function getSession(){ if(!sb) return null; const { data } = await sb.auth.getSession(); return data.session; }
async function getProfile(uid){ const { data } = await sb.from("profiles").select("username,avatar_url,language,role").eq("id", uid).maybeSingle(); return data; }
async function requireAuth(){ const s = await getSession(); if(!s) location.href = "login.html"; return s; }
async function redirectIfAuth(){ const s = await getSession(); if(s) location.href = "diary.html"; }
async function logout(){ if(sb) await sb.auth.signOut(); location.href = "index.html"; }

const PAGES = [["index.html","home"],["diary.html","diary"],["anonymous.html","anonymous"],["explore.html","explore"],["profile.html","profile"],["about.html","about"]];
async function renderChrome(){
  const cur = location.pathname.split("/").pop() || "index.html";
  const s = await getSession();
  let who = "";
  if(s){ const p = await getProfile(s.user.id); who = `<span class="who">${esc(p?.username || s.user.email)}</span><button class="btn ghost" id="outBtn" data-i18n="logout"></button>`; }
  else who = `<a class="btn ghost" href="login.html" data-i18n="login"></a><a class="btn" href="register.html" data-i18n="register"></a>`;
  const nav = document.getElementById("nav");
  if(nav) nav.innerHTML = `<div class="bar"><a class="logo" href="index.html">DEAR ME</a>
    <nav>${PAGES.map(([h,k])=>`<a href="${h}" class="${h===cur?"cur":""}" data-i18n="${k}"></a>`).join("")}</nav>
    <div class="side"><span class="langs"><button class="lang-btn" data-lang="id">ID</button><button class="lang-btn" data-lang="en">EN</button></span>${who}</div></div>`;
  const ft = document.getElementById("foot");
  if(ft) ft.innerHTML = `<p><b>DEAR ME</b> — <span data-i18n="tagline"></span></p><p class="small">© ${new Date().getFullYear()} · <span data-i18n="footer"></span></p>`;
  document.querySelectorAll(".lang-btn").forEach(b=>b.addEventListener("click",()=>setLang(b.dataset.lang)));
  const o = document.getElementById("outBtn"); if(o) o.addEventListener("click", logout);
  applyLang();
}
document.addEventListener("DOMContentLoaded", renderChrome);
