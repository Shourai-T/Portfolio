create table if not exists tags (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  created_at timestamptz default now()
);

alter table tags enable row level security;

-- Allow everyone to read tags
create policy "Public tags are viewable by everyone"
  on tags for select
  using ( true );

-- Allow admins to insert tags
create policy "Admins can insert tags"
  on tags for insert
  with check (
    exists (
      select 1 from user_roles
      where user_id = auth.uid()
      and role = 'admin'
    )
  );

-- Allow admins to delete tags
create policy "Admins can delete tags"
  on tags for delete
  using (
    exists (
      select 1 from user_roles
      where user_id = auth.uid()
      and role = 'admin'
    )
  );
