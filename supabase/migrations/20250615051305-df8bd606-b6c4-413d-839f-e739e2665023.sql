
-- Create a public.profiles table to store user data
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  full_name text,
  created_at timestamp with time zone default now()
);

-- Enable row level security
alter table public.profiles enable row level security;

-- Policy: users can select/update/insert their own profile
create policy "Users can manage their own profile"
  on public.profiles
  for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Trigger to insert a row into profiles when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
