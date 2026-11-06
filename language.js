const I18N = {
 id: { home:"Beranda", diary:"Jurnalku", anonymous:"Kirim Pesan", explore:"Jelajahi", profile:"Profil", about:"Tentang", login:"Masuk", register:"Daftar", logout:"Keluar",
  tagline:"Ruang kecil untuk mengungkapkan dirimu.", heroText:"DEAR ME adalah jurnal digital pribadi sekaligus tempat berbagi pesan anonim yang hangat.", start:"Mulai sekarang",
  diaryTitle:"Jurnalku", diaryText:"Tulis apa saja. Jurnalmu tersimpan online dan hanya bisa dibaca olehmu, di perangkat mana pun.",
  anonTitle:"Pesan Anonim", anonText:"Kirim dan baca pesan tanpa nama. Identitas pengirim tidak pernah ditampilkan.",
  privacyTitle:"Privasimu terjaga", privacyText:"Jurnal dilindungi aturan database (RLS) sehingga hanya pemiliknya yang bisa mengaksesnya. Pesan anonim tidak menyimpan identitas yang bisa dilihat orang lain.",
  aboutTitle:"Tentang DEAR ME", aboutText:"Dibuat sebagai ruang yang tenang untuk menulis, melepas, dan saling menguatkan.", footer:"Dibuat dengan hati.",
  email:"Email", password:"Kata sandi", username:"Nama pengguna", confirm:"Ulangi kata sandi", haveAccount:"Sudah punya akun?", noAccount:"Belum punya akun?",
  loginTitle:"Selamat datang kembali", registerTitle:"Buat akunmu", registered:"Akun dibuat. Cek email untuk konfirmasi jika diminta, lalu masuk.",
  errEmail:"Format email tidak valid.", errPass:"Kata sandi minimal 8 karakter.", errMatch:"Kata sandi tidak sama.", errName:"Nama pengguna 2–30 karakter.", errGeneric:"Terjadi kesalahan. Coba lagi.", errLogin:"Email atau kata sandi salah.", errConfig:"Supabase belum dikonfigurasi. Isi assets/js/config.js." },
 en: { home:"Home", diary:"My Diary", anonymous:"Send Message", explore:"Explore", profile:"Profile", about:"About", login:"Log in", register:"Sign up", logout:"Log out",
  tagline:"A little space to express yourself.", heroText:"DEAR ME is a private digital journal and a warm place to share anonymous messages.", start:"Get Started",
  diaryTitle:"My Diary", diaryText:"Write anything. Your entries are saved online and only you can read them, on any device.",
  anonTitle:"Anonymous Messages", anonText:"Send and read messages without names. The sender's identity is never shown.",
  privacyTitle:"Your privacy, protected", privacyText:"Diaries are guarded by database rules (RLS) so only the owner can access them. Anonymous messages carry no identity anyone else can see.",
  aboutTitle:"About DEAR ME", aboutText:"Built as a calm space to write, let go, and lift each other up.", footer:"Made with care.",
  email:"Email", password:"Password", username:"Username", confirm:"Repeat password", haveAccount:"Already have an account?", noAccount:"No account yet?",
  loginTitle:"Welcome back", registerTitle:"Create your account", registered:"Account created. Check your email to confirm if asked, then log in.",
  errEmail:"Invalid email format.", errPass:"Password must be at least 8 characters.", errMatch:"Passwords don't match.", errName:"Username must be 2–30 characters.", errGeneric:"Something went wrong. Try again.", errLogin:"Wrong email or password.", errConfig:"Supabase isn't configured. Fill in assets/js/config.js." }
};
function getLang(){ try{ return localStorage.getItem("dearme_lang")||"id"; }catch(e){ return "id"; } }
function t(k){ return (I18N[getLang()]||I18N.id)[k] || k; }
function applyLang(){
  document.documentElement.lang = getLang();
  document.querySelectorAll("[data-i18n]").forEach(el=>el.textContent=t(el.dataset.i18n));
  document.querySelectorAll("[data-i18n-ph]").forEach(el=>el.placeholder=t(el.dataset.i18nPh));
  document.querySelectorAll(".lang-btn").forEach(b=>b.classList.toggle("on",b.dataset.lang===getLang()));
}
function setLang(l){ try{ localStorage.setItem("dearme_lang",l); }catch(e){} applyLang(); }
