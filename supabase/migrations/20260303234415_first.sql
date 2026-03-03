-- Enable necessary extensions
create extension if not exists "uuid-ossp";
-- create extension if not exists "pgcrypto";

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email varchar(255) unique not null,
  full_name varchar(255),
  phone varchar(50),
  role varchar(20) default 'student' check (role in ('student', 'teacher', 'admin')),
  billing_address text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can view own profile" on profiles for select using ((select auth.uid()) = id);
create policy "Users can insert own profile" on profiles for insert with check ((select auth.uid()) = id);
create policy "Users can update own profile" on profiles for update using ((select auth.uid()) = id);

create policy "Teachers/admins view all profiles" on profiles for select using (
  exists (
    select 1 from profiles p 
    where p.id = (select auth.uid()) and p.role in ('teacher', 'admin')
  )
);

create table courses (
  id uuid primary key default gen_random_uuid(),
  title varchar(255) not null,
  course_number varchar(50) unique,
  description text,
  duration_days integer,
  type varchar(20) not null check (type in ('live_classroom', 'live_online', 'on_demand')),
  price decimal(10,2) default 0,
  image_url text,
  average_rating decimal(3,2) default 0,
  rating_count integer default 0,
  created_at timestamptz default now()
);

alter table courses enable row level security;

create policy "Public read courses" on courses for select using (true);
create policy "Authenticated insert courses" on courses for insert with check (auth.role() = 'authenticated');
create policy "Authenticated update courses" on courses for update using (auth.role() = 'authenticated');

create table course_sessions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  start_date date not null,
  end_date date,
  location varchar(255),
  teacher_id uuid references profiles(id),
  min_participants integer default 5,
  status varchar(20) default 'planned' check (status in ('planned', 'active', 'cancelled', 'completed')),
  cancellation_reason text,
  cancelled_at timestamptz,
  created_at timestamptz default now()
);

alter table course_sessions enable row level security;

create policy "Public read sessions" on course_sessions for select using (true);
create policy "Authenticated insert sessions" on course_sessions for insert with check (auth.role() = 'authenticated');

create table enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  course_session_id uuid references course_sessions(id) on delete cascade,
  course_id uuid references courses(id) on delete cascade,
  enrolled_at timestamptz default now(),
  status varchar(20) default 'pending' check (status in ('confirmed', 'pending', 'cancelled', 'attended')),
  payment_status varchar(20) default 'pending' check (payment_status in ('pending', 'paid', 'refunded')),
  is_subscription boolean default false
);

alter table enrollments enable row level security;

create policy "Users view own enrollments" on enrollments for select using (user_id = (select auth.uid()));
create policy "Users insert own enrollments" on enrollments for insert with check (user_id = (select auth.uid()));

create table purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  course_id uuid references courses(id) on delete cascade,
  purchased_at timestamptz default now(),
  price_paid decimal(10,2),
  is_subscription boolean default false,
  subscription_start timestamptz,
  subscription_end timestamptz
);

alter table purchases enable row level security;

create policy "Users view own purchases" on purchases for select using (user_id = (select auth.uid()));
create policy "Users insert own purchases" on purchases for insert with check (user_id = (select auth.uid()));

create table course_questions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  question_text text not null,
  answer_text text,
  answered_by uuid references profiles(id),
  created_at timestamptz default now(),
  answered_at timestamptz
);

alter table course_questions enable row level security;

create policy "Course participants view questions" on course_questions for select using (
  exists (
    select 1 from enrollments e 
    where e.course_id = course_questions.course_id 
    and e.user_id = (select auth.uid())
  )
);
create policy "Users insert own questions" on course_questions for insert with check (
  user_id = (select auth.uid())
);

-- Course reviews table
create table course_reviews (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  rating integer check (rating >= 1 and rating <= 5),
  review_text text,
  created_at timestamptz default now()
);

alter table course_reviews enable row level security;

create policy "Public read reviews" on course_reviews for select using (true);
create policy "Users insert own reviews" on course_reviews for insert with check (
  exists (
    select 1 from enrollments e 
    where e.course_id = course_reviews.course_id 
    and e.user_id = course_reviews.user_id
  ) and user_id = (select auth.uid())
);

create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  start_date date not null,
  end_date date,
  status varchar(20) default 'active' check (status in ('active', 'cancelled', 'expired')),
  created_at timestamptz default now()
);

alter table subscriptions enable row level security;

create policy "Users view own subscriptions" on subscriptions for select using (user_id = (select auth.uid()));
