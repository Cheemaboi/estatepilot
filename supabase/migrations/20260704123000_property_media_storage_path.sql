alter table public.property_images
add column if not exists storage_path text;

create unique index if not exists property_images_storage_path_key
on public.property_images(storage_path)
where storage_path is not null;
