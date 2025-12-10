-- Create a specific bucket for portfolio assets
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

-- Enable RLS on storage.objects (if not already enabled)
-- alter table storage.objects enable row level security; -- Commented out due to permission restriction

-- Policy: Public can view any file in 'portfolio' bucket
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'portfolio' );

-- Policy: Authenticated users (Admins) can upload/insert
create policy "Authenticated users can upload"
  on storage.objects for insert
  with check (
    bucket_id = 'portfolio' 
    and auth.role() = 'authenticated'
  );

-- Policy: Authenticated users can update
create policy "Authenticated users can update"
  on storage.objects for update
  using (
    bucket_id = 'portfolio' 
    and auth.role() = 'authenticated'
  );

-- Policy: Authenticated users can delete
create policy "Authenticated users can delete"
  on storage.objects for delete
  using (
    bucket_id = 'portfolio' 
    and auth.role() = 'authenticated'
  );
