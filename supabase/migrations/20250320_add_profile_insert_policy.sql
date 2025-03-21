--
-- PostgreSQL database migration
-- Requires: 20250319_add_profiles
--

-- Add insert policy for profiles
create policy "Allow individual insert access"
    on profiles for insert
    with check (auth.uid() = id);
