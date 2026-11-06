# DEAR ME — A little space to express yourself.
Status: **Tahap 1 selesai** (fondasi, database, auth, beranda). Tahap 2: diary, anonymous, explore. Tahap 3: profile, about, admin.

## Pasang Supabase
1. Buat proyek di supabase.com.
2. SQL Editor → tempel isi `database/schema.sql` → Run.
3. Settings → API: salin **Project URL** dan **anon/publishable key** ke `assets/js/config.js` (jangan pernah pakai service_role).
4. Authentication → URL Configuration: isi Site URL `https://USERNAME.github.io/Dear-me.io/`.
5. Jadi admin: jalankan query komentar di akhir `schema.sql` dengan email Anda.

## Unggah ke GitHub & aktifkan Pages
1. Buat repo publik bernama `Dear-me.io`, unggah semua isi folder ini (index.html di root).
2. Settings → Pages → Source: *Deploy from a branch* → `main` / `/ (root)` → Save.
3. Buka `https://USERNAME.github.io/Dear-me.io/` setelah ±1 menit.
