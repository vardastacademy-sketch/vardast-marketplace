-- Users Table (Profiles)
-- This table extends the default auth.users table in Supabase
create table public.profiles (
  id uuid not null references auth.users(id) on delete cascade primary key,
  email text,
  full_name text,
  role text default 'engineer' check (role in ('admin', 'engineer')),
  bio text,
  avatar_url text,
  phone text,
  contact_link text,
  is_verified boolean default false,
  rating float default 0,
  rating_count int default 0,
  specialties text[], -- Array of categories they specialize in
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Projects Table (Portfolio)
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  engineer_id uuid not null references public.profiles(id) on delete cascade,
  business_name text not null,
  description text,
  platform text check (platform in ('telegram', 'instagram', 'web', 'other')),
  chat_url text,
  image_url text,
  created_at timestamptz default now()
);

-- Reviews Table
create table public.reviews (
  id uuid default gen_random_uuid() primary key,
  engineer_id uuid not null references public.profiles(id) on delete cascade,
  reviewer_name text,
  rating int check (rating >= 1 and rating <= 5),
  comment text,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz default now()
);

-- Job Requests Table (NEW)
create table public.requests (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  category text not null, -- One of the 5 fixed categories
  budget text, -- "Negotiable" or specific amount
  deadline text,
  contact_type text check (contact_type in ('phone', 'email', 'telegram', 'whatsapp')),
  contact_value text not null,
  status text default 'open' check (status in ('open', 'closed')),
  created_at timestamptz default now()
);

-- Site Content (CMS)
create table public.site_content (
  key text primary key,
  value text,
  description text
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.reviews enable row level security;
alter table public.site_content enable row level security;
alter table public.requests enable row level security;

-- Policies

-- PROFILES
create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- PROJECTS
create policy "Projects are viewable by everyone"
  on public.projects for select using (true);

create policy "Engineers can insert own projects"
  on public.projects for insert with check (auth.uid() = engineer_id);

create policy "Engineers can update own projects"
  on public.projects for update using (auth.uid() = engineer_id);

create policy "Engineers can delete own projects"
  on public.projects for delete using (auth.uid() = engineer_id);

-- REVIEWS
create policy "Anyone can insert reviews"
  on public.reviews for insert with check (true);

create policy "Public can view approved reviews"
  on public.reviews for select using (status = 'approved');

-- REQUESTS (Job Board)
create policy "Anyone can insert requests"
  on public.requests for insert with check (true);

create policy "Public can view open requests"
  on public.requests for select using (status = 'open');

-- ADMIN Policies (Using function)
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- Admin All Access
create policy "Admins can view all reviews" on public.reviews for select using (public.is_admin());
create policy "Admins can update reviews" on public.reviews for update using (public.is_admin());
create policy "Admins can delete reviews" on public.reviews for delete using (public.is_admin());

create policy "Admins can view all requests" on public.requests for select using (public.is_admin());
create policy "Admins can update requests" on public.requests for update using (public.is_admin());
create policy "Admins can delete requests" on public.requests for delete using (public.is_admin());

create policy "Admins can update content" on public.site_content for update using (public.is_admin());
create policy "Admins can insert content" on public.site_content for insert with check (public.is_admin());
create policy "Content is viewable by everyone" on public.site_content for select using (true);

-- User Signup Trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'engineer');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Seed Default Content
insert into public.site_content (key, value, description) values
('home_hero_title_fa', 'بهترین مهندسین هوش مصنوعی را پیدا کنید', 'Title of the hero section in Persian'),
('home_hero_subtitle_fa', 'دسترسی مستقیم به متخصصین ساخت چت‌بات و اتوماسیون', 'Subtitle of the hero section in Persian'),
('home_hero_title_en', 'Find the Best AI Experts', 'Title of the hero section in English'),
('home_hero_subtitle_en', 'Direct access to Chatbot and Automation specialists', 'Subtitle of the hero section in English')
on conflict (key) do nothing;
