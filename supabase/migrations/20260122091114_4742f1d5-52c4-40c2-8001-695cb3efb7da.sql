-- Fix: prevent public exposure of sensitive fields in public.profiles by moving public reads to sanitized mirror tables

begin;

-- 1) Remove overly permissive public SELECT policies on profiles
DO $$
begin
  if exists (
    select 1 from pg_policies 
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'Public can view provider profiles'
  ) then
    execute 'drop policy "Public can view provider profiles" on public.profiles';
  end if;

  if exists (
    select 1 from pg_policies 
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'Public can view basic provider info'
  ) then
    execute 'drop policy "Public can view basic provider info" on public.profiles';
  end if;
end $$;

-- 2) Create sanitized mirror table for public provider/seller profile display
create table if not exists public.public_profiles (
  id uuid primary key,
  role text not null,
  first_name text,
  last_name text,
  avatar_url text,
  business_name text,
  bio text,
  seller_slug text,
  shop_description text,
  shop_logo_url text,
  brand_color_primary text,
  brand_color_accent text,
  city text,
  state text,
  country text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.public_profiles enable row level security;

-- public read for provider/seller storefront and listings
DO $$
begin
  if not exists (
    select 1 from pg_policies 
    where schemaname='public' and tablename='public_profiles' and policyname='Anyone can view provider/seller public profiles'
  ) then
    execute $pol$
      create policy "Anyone can view provider/seller public profiles"
      on public.public_profiles
      for select
      using (role in ('provider','seller'))
    $pol$;
  end if;
end $$;

-- 3) Create sanitized directory for authenticated messaging/user search
create table if not exists public.user_directory (
  id uuid primary key,
  role text not null,
  first_name text,
  last_name text,
  avatar_url text,
  business_name text,
  seller_slug text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_directory enable row level security;

DO $$
begin
  if not exists (
    select 1 from pg_policies 
    where schemaname='public' and tablename='user_directory' and policyname='Authenticated can view user directory'
  ) then
    execute $pol$
      create policy "Authenticated can view user directory"
      on public.user_directory
      for select
      to authenticated
      using (true)
    $pol$;
  end if;
end $$;

-- 4) Sync functions + triggers to keep mirrors up-to-date
create or replace function public.sync_public_profiles_from_profiles()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (tg_op = 'DELETE') then
    delete from public.public_profiles where id = old.id;
    return old;
  end if;

  insert into public.public_profiles (
    id, role, first_name, last_name, avatar_url,
    business_name, bio, seller_slug, shop_description, shop_logo_url,
    brand_color_primary, brand_color_accent, city, state, country,
    created_at, updated_at
  ) values (
    new.id, new.role, new.first_name, new.last_name, new.avatar_url,
    new.business_name, new.bio, new.seller_slug, new.shop_description, new.shop_logo_url,
    new.brand_color_primary, new.brand_color_accent, new.city, new.state, new.country,
    coalesce(new.created_at, now()), coalesce(new.updated_at, now())
  )
  on conflict (id) do update set
    role = excluded.role,
    first_name = excluded.first_name,
    last_name = excluded.last_name,
    avatar_url = excluded.avatar_url,
    business_name = excluded.business_name,
    bio = excluded.bio,
    seller_slug = excluded.seller_slug,
    shop_description = excluded.shop_description,
    shop_logo_url = excluded.shop_logo_url,
    brand_color_primary = excluded.brand_color_primary,
    brand_color_accent = excluded.brand_color_accent,
    city = excluded.city,
    state = excluded.state,
    country = excluded.country,
    created_at = excluded.created_at,
    updated_at = excluded.updated_at;

  return new;
end;
$$;

create or replace function public.sync_user_directory_from_profiles()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (tg_op = 'DELETE') then
    delete from public.user_directory where id = old.id;
    return old;
  end if;

  insert into public.user_directory (
    id, role, first_name, last_name, avatar_url, business_name, seller_slug,
    created_at, updated_at
  ) values (
    new.id, new.role, new.first_name, new.last_name, new.avatar_url, new.business_name, new.seller_slug,
    coalesce(new.created_at, now()), coalesce(new.updated_at, now())
  )
  on conflict (id) do update set
    role = excluded.role,
    first_name = excluded.first_name,
    last_name = excluded.last_name,
    avatar_url = excluded.avatar_url,
    business_name = excluded.business_name,
    seller_slug = excluded.seller_slug,
    created_at = excluded.created_at,
    updated_at = excluded.updated_at;

  return new;
end;
$$;

DO $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'trg_sync_public_profiles') then
    execute 'create trigger trg_sync_public_profiles after insert or update or delete on public.profiles for each row execute function public.sync_public_profiles_from_profiles()';
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'trg_sync_user_directory') then
    execute 'create trigger trg_sync_user_directory after insert or update or delete on public.profiles for each row execute function public.sync_user_directory_from_profiles()';
  end if;
end $$;

-- 5) Backfill mirrors from existing profiles
insert into public.public_profiles (
  id, role, first_name, last_name, avatar_url,
  business_name, bio, seller_slug, shop_description, shop_logo_url,
  brand_color_primary, brand_color_accent, city, state, country,
  created_at, updated_at
)
select
  id, role, first_name, last_name, avatar_url,
  business_name, bio, seller_slug, shop_description, shop_logo_url,
  brand_color_primary, brand_color_accent, city, state, country,
  coalesce(created_at, now()), coalesce(updated_at, now())
from public.profiles
on conflict (id) do nothing;

insert into public.user_directory (
  id, role, first_name, last_name, avatar_url, business_name, seller_slug,
  created_at, updated_at
)
select
  id, role, first_name, last_name, avatar_url, business_name, seller_slug,
  coalesce(created_at, now()), coalesce(updated_at, now())
from public.profiles
on conflict (id) do nothing;

commit;
