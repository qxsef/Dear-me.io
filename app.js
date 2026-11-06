// RuangBebas — HTML/CSS/JS murni, siap GitHub Pages
const $ = id => document.getElementById(id);
const DEFAULT_PFP = "https://api.dicebear.com/9.x/thumbs/svg?seed=";

function getProfile(){
  let name = localStorage.getItem("rb_name") || ("Anon#" + Math.floor(1000 + Math.random()*9000));
  let pfp = localStorage.getItem("rb_pfp") || (DEFAULT_PFP + encodeURIComponent(name));
  return {name, pfp};
}
function saveProfile(){
  const n = ($("myName").value || "").trim();
  if(n) localStorage.setItem("rb_name", n);
  alert("Profil disimpan 💜");
  location.reload();
}
function fileToBase64(file, cb){
  const r = new FileReader();
  r.onload = e => cb(e.target.result);
  r.readAsDataURL(file);
}

// ---------- CHAT ----------
let tempChatImg = "";
function initChat(){
  const p = getProfile();
  if($("myPfp")) $("myPfp").src = p.pfp;
  if($("myName")) $("myName").value = localStorage.getItem("rb_name") || "";

  $("pfpInput").addEventListener("change", e=>{
    const f = e.target.files[0]; if(!f) return;
    fileToBase64(f, data=>{
      localStorage.setItem("rb_pfp", data);
      $("myPfp").src = data;
      alert("PFP diganti 💜");
    });
  });

  $("chatImg").addEventListener("change", e=>{
    const f = e.target.files[0]; if(!f) return;
    fileToBase64(f, data=>{
      tempChatImg = data;
      const pv = $("imgPreview");
      pv.src = data; pv.style.display = "block";
    });
  });

  $("chatText").addEventListener("keydown", e=>{
    if(e.key === "Enter") sendChat();
  });

  // pesan contoh kalau kosong
  if(!localStorage.getItem("rb_chat")){
    localStorage.setItem("rb_chat", JSON.stringify([
      {name:"SenjaUngu", pfp: DEFAULT_PFP+"SenjaUngu", text:"Selamat datang di RuangBebas 💜 tulis apa aja, aman.", time: Date.now(), img:""},
      {name:"Anon#4821", pfp: DEFAULT_PFP+"Anon4821", text:"Akhirnya ada tempat curhat anonim...", time: Date.now(), img:""}
    ]));
  }
  renderChat();
}

function renderChat(){
  const box = $("chatBox");
  const me = getProfile();
  let data = [];
  try{ data = JSON.parse(localStorage.getItem("rb_chat")||"[]"); }catch{ data=[]; }
  box.innerHTML = "";
  data.forEach(m=>{
    const mine = m.name === me.name;
    const div = document.createElement("div");
    div.className = "bubble" + (mine ? " mine" : "");
    const t = new Date(m.time).toLocaleString("id-ID",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"});
    div.innerHTML = `<img class="avatar" src="${m.pfp}"><div class="body"><span class="name">${escapeHtml(m.name)}</span><span class="time">${t}</span><p>${escapeHtml(m.text)}</p>${m.img?`<img class="send" src="${m.img}">`:""}</div>`;
    box.appendChild(div);
  });
  box.scrollTop = box.scrollHeight;
}

function sendChat(){
  const txt = ($("chatText").value||"").trim();
  if(!txt && !tempChatImg){ return; }
  const p = getProfile();
  // simpan nama custom kalau user belum simpan
  const inputName = ($("myName") && $("myName").value.trim()) || p.name;
  localStorage.setItem("rb_name", inputName);
  let data = JSON.parse(localStorage.getItem("rb_chat")||"[]");
  data.push({name: inputName, pfp: localStorage.getItem("rb_pfp") || p.pfp, text: txt || "📷 mengirim gambar", time: Date.now(), img: tempChatImg});
  localStorage.setItem("rb_chat", JSON.stringify(data));
  $("chatText").value = ""; tempChatImg = "";
  $("imgPreview").style.display = "none";
  renderChat();
}

function clearChat(){
  if(confirm("Hapus semua chat di browser ini?")){
    localStorage.removeItem("rb_chat");
    location.reload();
  }
}

// ---------- DIARY ----------
let tempDiaryImg = "";
function initDiary(){
  const p = getProfile();
  if($("diaryPfp")) $("diaryPfp").src = p.pfp;
  $("diaryImg").addEventListener("change", e=>{
    const f = e.target.files[0]; if(!f) return;
    fileToBase64(f, data=>{
      tempDiaryImg = data;
      const pv = $("diaryPreview");
      pv.src = data; pv.style.display = "block";
    });
  });
  renderDiary();
}
function addDiary(){
  const title = ($("diaryTitle").value||"Tanpa judul").trim();
  const mood = $("diaryMood").value;
  const text = ($("diaryText").value||"").trim();
  if(!text){ alert("Tulis dulu isi diary-nya bro 😅"); return; }
  let data = JSON.parse(localStorage.getItem("rb_diary")||"[]");
  data.unshift({title, mood, text, img: tempDiaryImg, time: Date.now()});
  localStorage.setItem("rb_diary", JSON.stringify(data));
  $("diaryTitle").value=""; $("diaryText").value=""; tempDiaryImg="";
  $("diaryPreview").style.display="none";
  renderDiary();
}
function renderDiary(){
  const list = $("diaryList");
  let data = JSON.parse(localStorage.getItem("rb_diary")||"[]");
  if(!data.length){ list.innerHTML = `<div class="card">Belum ada diary. Tulis yang pertama 💜</div>`; return; }
  list.innerHTML = "";
  data.forEach((d,i)=>{
    const t = new Date(d.time).toLocaleString("id-ID",{day:"numeric",month:"long",hour:"2-digit",minute:"2-digit"});
    const el = document.createElement("div");
    el.className = "diary-item";
    el.innerHTML = `<h4>${escapeHtml(d.title)}</h4><small>${d.mood} • ${t}</small><p>${escapeHtml(d.text)}</p>${d.img?`<img src="${d.img}">`:""}<br><button onclick="delDiary(${i})">Hapus</button>`;
    list.appendChild(el);
  });
}
function delDiary(i){
  let data = JSON.parse(localStorage.getItem("rb_diary")||"[]");
  data.splice(i,1);
  localStorage.setItem("rb_diary", JSON.stringify(data));
  renderDiary();
}
function escapeHtml(s){
  return (s||"").replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
