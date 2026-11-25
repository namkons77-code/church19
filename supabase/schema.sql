-- church19 Supabase Schema (Run in Supabase SQL Editor)

-- 1. Profiles table linked to auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text not null,
  parish text not null default '새가족',
  provider text not null default 'email',
  role text not null default 'member' check (role in ('member', 'admin')),
  avatar_url text,
  school text,
  department text,
  gender text,
  hobby text,
  specialty text,
  profile_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists role text not null default 'member';
alter table public.profiles add column if not exists school text;
alter table public.profiles add column if not exists department text;
alter table public.profiles add column if not exists gender text;
alter table public.profiles add column if not exists hobby text;
alter table public.profiles add column if not exists specialty text;
alter table public.profiles add column if not exists profile_completed boolean not null default false;

alter table public.profiles enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin());

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  raw_provider text;
  user_name text;
begin
  raw_provider := coalesce(new.raw_app_meta_data ->> 'provider', 'email');
  user_name := coalesce(
    new.raw_user_meta_data ->> 'name',
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'nickname',
    split_part(coalesce(new.email, 'member@church19.org'), '@', 1)
  );

  insert into public.profiles (id, email, name, parish, provider, role, avatar_url, profile_completed)
  values (
    new.id,
    coalesce(new.email, ''),
    user_name,
    coalesce(new.raw_user_meta_data ->> 'parish', '새가족'),
    raw_provider,
    case
      when lower(coalesce(new.email, '')) in ('namkons77@gmail.com', 'admin@test.com') then 'admin'
      else 'member'
    end,
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture'),
    false
  )
  on conflict (id) do update
    set email = excluded.email,
        updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Online applications table
create table if not exists public.online_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  service_id text not null,
  service_title text not null,
  applicant_name text not null,
  contact text not null,
  note text not null,
  status text not null default '접수완료',
  created_at timestamptz not null default now()
);

alter table public.online_applications enable row level security;

drop policy if exists "Anyone can submit online application" on public.online_applications;
create policy "Anyone can submit online application"
  on public.online_applications for insert
  with check (auth.uid() = user_id or user_id is null);

drop policy if exists "Authenticated users can view own applications" on public.online_applications;
create policy "Authenticated users can view own applications"
  on public.online_applications for select
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Admins can update applications" on public.online_applications;
create policy "Admins can update applications"
  on public.online_applications for update
  using (public.is_admin());

-- 3. Community Posts & Comments (나눔터)
create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references auth.users(id) on delete set null,
  author_name text not null,
  category text not null default '나눔글',
  title text not null,
  content text not null,
  pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.community_posts enable row level security;

drop policy if exists "Anyone can read community posts" on public.community_posts;
create policy "Anyone can read community posts"
  on public.community_posts for select
  using (true);

drop policy if exists "Only admins can insert community posts" on public.community_posts;
create policy "Only admins can insert community posts"
  on public.community_posts for insert
  with check (public.is_admin());

drop policy if exists "Only admins can update community posts" on public.community_posts;
create policy "Only admins can update community posts"
  on public.community_posts for update
  using (public.is_admin());

drop policy if exists "Only admins can delete community posts" on public.community_posts;
create policy "Only admins can delete community posts"
  on public.community_posts for delete
  using (public.is_admin());

create table if not exists public.community_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  author_id uuid references auth.users(id) on delete set null,
  author_name text not null,
  author_avatar text,
  author_role text not null default 'member',
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.community_comments enable row level security;

drop policy if exists "Anyone can read community comments" on public.community_comments;
create policy "Anyone can read community comments"
  on public.community_comments for select
  using (true);

drop policy if exists "Authenticated users can write comments" on public.community_comments;
create policy "Authenticated users can write comments"
  on public.community_comments for insert
  with check (auth.uid() = author_id);

drop policy if exists "Comment author or admin can delete comments" on public.community_comments;
create policy "Comment author or admin can delete comments"
  on public.community_comments for delete
  using (auth.uid() = author_id or public.is_admin());

-- Ensure designated administrator emails have 'admin' role in profiles
update public.profiles
set role = 'admin'
where lower(email) in ('namkons77@gmail.com', 'admin@test.com');
