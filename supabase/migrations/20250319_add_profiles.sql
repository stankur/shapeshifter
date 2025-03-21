--
-- PostgreSQL database migration
-- Requires: supabase
--

-- Create profiles table
create table profiles (
    id uuid not null primary key references auth.users on delete cascade,
    username text unique,
    updated_at timestamptz not null default now()
);

-- Set up RLS
alter table profiles enable row level security;

create policy "Allow public read access"
    on profiles for select
    using (true);

create policy "Allow individual update access"
    on profiles for update
    using (auth.uid() = id);

-- Function to create profile on signup
create function handle_new_user()
returns trigger
security definer
language plpgsql
as $$
begin
    insert into profiles (id)
    values (new.id);
    return new;
end;
$$;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function handle_new_user();
