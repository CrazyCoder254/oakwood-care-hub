
-- ROLES
create type public.app_role as enum ('patient','doctor','admin');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  unique(user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.get_user_role(_user_id uuid)
returns public.app_role language sql stable security definer set search_path = public as $$
  select role from public.user_roles where user_id = _user_id
  order by case role when 'admin' then 1 when 'doctor' then 2 else 3 end limit 1
$$;

-- Auto-create profile + default patient role
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email,'@',1)),
          new.raw_user_meta_data->>'avatar_url');
  insert into public.user_roles (user_id, role) values (new.id, 'patient') on conflict do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Profiles policies
create policy "Profiles viewable by owner or admin" on public.profiles for select
  using (auth.uid() = id or public.has_role(auth.uid(),'admin'));
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Admins update any profile" on public.profiles for update using (public.has_role(auth.uid(),'admin'));

-- user_roles policies
create policy "Users view own roles" on public.user_roles for select using (auth.uid() = user_id);
create policy "Admins view all roles" on public.user_roles for select using (public.has_role(auth.uid(),'admin'));
create policy "Admins manage roles" on public.user_roles for all using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- DOCTORS
create table public.doctors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  title text,
  specialty text not null,
  bio text,
  photo_url text,
  schedule_days text[] default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.doctors enable row level security;
create policy "Doctors publicly readable" on public.doctors for select using (true);
create policy "Admins manage doctors" on public.doctors for all using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- SERVICES
create table public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'general',
  description text,
  icon text,
  available_days text[] default '{}',
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.services enable row level security;
create policy "Services publicly readable" on public.services for select using (true);
create policy "Admins manage services" on public.services for all using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- COURSES
create table public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  duration text,
  modules text[] default '{}',
  price_text text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.courses enable row level security;
create policy "Courses publicly readable" on public.courses for select using (true);
create policy "Admins manage courses" on public.courses for all using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.course_enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  status text not null default 'pending',
  notes text,
  created_at timestamptz not null default now()
);
alter table public.course_enrollments enable row level security;
create policy "Users view own enrollments" on public.course_enrollments for select using (auth.uid() = user_id or public.has_role(auth.uid(),'admin'));
create policy "Users create own enrollments" on public.course_enrollments for insert with check (auth.uid() = user_id);
create policy "Admins update enrollments" on public.course_enrollments for update using (public.has_role(auth.uid(),'admin'));

-- APPOINTMENTS
create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  doctor_id uuid references public.doctors(id) on delete set null,
  service text not null,
  appointment_date date not null,
  appointment_time time not null,
  notes text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);
alter table public.appointments enable row level security;
create policy "Users view own appointments" on public.appointments for select
  using (auth.uid() = user_id
    or public.has_role(auth.uid(),'admin')
    or (public.has_role(auth.uid(),'doctor') and doctor_id in (select id from public.doctors where user_id = auth.uid())));
create policy "Users create own appointments" on public.appointments for insert with check (auth.uid() = user_id);
create policy "Owner or doctor or admin update appointments" on public.appointments for update
  using (auth.uid() = user_id
    or public.has_role(auth.uid(),'admin')
    or (public.has_role(auth.uid(),'doctor') and doctor_id in (select id from public.doctors where user_id = auth.uid())));

-- CMS sections (about, team intro, etc.)
create table public.cms_sections (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  title text,
  body text,
  updated_at timestamptz not null default now()
);
alter table public.cms_sections enable row level security;
create policy "CMS publicly readable" on public.cms_sections for select using (true);
create policy "Admins manage CMS" on public.cms_sections for all using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
