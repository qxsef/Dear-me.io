-- DEAR ME — jalankan seluruh file ini di Supabase > SQL Editor
create extension if not exists pgcrypto;

create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- PROFILES
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null check (char_length(username) between 2 and 30),
  avatar_url text check (avatar_url is null or char_length(avatar_url) <= 500),
  language text not null default 'id' check (language in ('id','en')),
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger profiles_upd before update on public.profiles for each row execute function public.set_updated_at();

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') $$;

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, username)
  values (new.id, coalesce(nullif(left(new.raw_user_meta_data->>'username', 30), ''), split_part(new.email, '@', 1)));
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
create policy "profil: baca milik sendiri" on public.profiles for select using (auth.uid() = id);
create policy "profil: ubah milik sendiri" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
revoke update on public.profiles from anon, authenticated;
grant update (username, avatar_url, language) on public.profiles to authenticated; -- role TIDAK bisa diubah klien

-- DIARIES
create table public.diaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 150),
  content text not null default '' check (char_length(content) <= 20000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index diaries_user_created_idx on public.diaries (user_id, created_at desc);
create trigger diaries_upd before update on public.diaries for each row execute function public.set_updated_at();
alter table public.diaries enable row level security;
create policy "diary: baca" on public.diaries for select using (auth.uid() = user_id);
create policy "diary: tulis" on public.diaries for insert with check (auth.uid() = user_id);
create policy "diary: ubah" on public.diaries for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "diary: hapus" on public.diaries for delete using (auth.uid() = user_id);
revoke update on public.diaries from anon, authenticated;
grant update (title, content) on public.diaries to authenticated; -- user_id tidak bisa diubah

-- ANONYMOUS MESSAGES (author_id untuk anti-spam, TIDAK bisa dibaca klien)
create table public.anonymous_messages (
  id uuid primary key default gen_random_uuid(),
  author_id uuid default auth.uid() references auth.users(id) on delete set null,
  content text not null check (char_length(btrim(content)) between 3 and 500),
  category text not null default 'general' check (category in ('general','love','study','family','hope','vent')),
  status text not null default 'visible' check (status in ('visible','hidden')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index msg_status_created_idx on public.anonymous_messages (status, created_at desc);
create index msg_category_idx on public.anonymous_messages (category);
create index msg_author_idx on public.anonymous_messages (author_id, created_at desc);
create trigger msg_upd before update on public.anonymous_messages for each row execute function public.set_updated_at();

create or replace function public.limit_message_spam() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.anonymous_messages where author_id = new.author_id and created_at > now() - interval '1 hour') >= 5 then
    raise exception 'rate_limit' using errcode = 'P0001';
  end if;
  return new;
end $$;
create trigger msg_spam before insert on public.anonymous_messages for each row execute function public.limit_message_spam();

alter table public.anonymous_messages enable row level security;
create policy "pesan: publik baca yang tampil" on public.anonymous_messages for select using (status = 'visible' or public.is_admin());
create policy "pesan: login boleh kirim" on public.anonymous_messages for insert to authenticated with check (author_id = auth.uid() and status = 'visible');
create policy "pesan: admin moderasi" on public.anonymous_messages for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "pesan: admin hapus" on public.anonymous_messages for delete to authenticated using (public.is_admin());
revoke all on public.anonymous_messages from anon, authenticated;
grant select (id, content, category, status, created_at) on public.anonymous_messages to anon, authenticated;
grant insert (content, category) on public.anonymous_messages to authenticated;
grant update (status) on public.anonymous_messages to authenticated;
grant delete on public.anonymous_messages to authenticated;

-- MESSAGE REPORTS
create table public.message_reports (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.anonymous_messages(id) on delete cascade,
  reporter_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  reason text not null check (char_length(reason) between 3 and 300),
  resolved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (message_id, reporter_id)
);
create index reports_resolved_idx on public.message_reports (resolved, created_at desc);
create trigger reports_upd before update on public.message_reports for each row execute function public.set_updated_at();
alter table public.message_reports enable row level security;
create policy "laporan: login boleh lapor" on public.message_reports for insert to authenticated with check (reporter_id = auth.uid());
create policy "laporan: admin baca" on public.message_reports for select to authenticated using (public.is_admin());
create policy "laporan: admin ubah" on public.message_reports for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "laporan: admin hapus" on public.message_reports for delete to authenticated using (public.is_admin());
revoke update on public.message_reports from anon, authenticated;
grant update (resolved) on public.message_reports to authenticated;

-- JADIKAN ADMIN (jalankan manual, ganti email Anda):
-- update public.profiles set role='admin' where id=(select id from auth.users where email='emailanda@contoh.com');
