-- Supabase → SQL Editor → Run
-- 1) Bucket public « PRODUITS » (Storage → New bucket → Public ON)
-- 2) Supprimez l’ancienne politique « JPG only » (Storage → PRODUITS → Policies)

DROP POLICY IF EXISTS "PRODUITS_public_read" ON storage.objects;
DROP POLICY IF EXISTS "PRODUITS_menu_upload" ON storage.objects;

CREATE POLICY "PRODUITS_public_read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'PRODUITS');

CREATE POLICY "PRODUITS_menu_upload"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'PRODUITS');
