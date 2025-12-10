create table if not exists comments (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references projects(id) on delete cascade not null,
  name text not null,
  content text not null,
  created_at timestamptz default now()
);

alter table comments enable row level security;

-- Allow everyone to read comments
create policy "Public comments are viewable by everyone"
  on comments for select
  using ( true );

-- Allow everyone to create comments
create policy "Public can insert comments"
  on comments for insert
  with check ( true );

-- Allow admins to delete comments
create policy "Admins can delete comments"
  on comments for delete
  using (
    exists (
      select 1 from user_roles
      where user_id = auth.uid()
      and role = 'admin'
    )
  );
