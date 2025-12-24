-- Remove linkedin_url from contact_info table
ALTER TABLE public.contact_info DROP COLUMN IF EXISTS linkedin_url;

-- Remove linkedin_url from founders table
ALTER TABLE public.founders DROP COLUMN IF EXISTS linkedin_url;
