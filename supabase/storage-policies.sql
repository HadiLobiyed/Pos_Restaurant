-- Supabase → SQL Editor → Run
-- Bucket public « products » (comme dans vos URLs /public/products/...)
-- Supprimez les anciennes politiques « PRODUITS » / « JPG only » si présentes.

DROP POLICY IF EXISTS "PRODUITS_public_read" ON storage.objects;
DROP POLICY IF EXISTS "PRODUITS_menu_upload" ON storage.objects;
DROP POLICY IF EXISTS "products_public_read" ON storage.objects;
DROP POLICY IF EXISTS "products_menu_upload" ON storage.objects;

CREATE POLICY "products_public_read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'products');

CREATE POLICY "products_upload"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'products');
