-- ============================================================
-- Supabase → SQL Editor → New query → Coller tout → Run
-- Bucket : products (public) — URL : .../object/public/products/...
-- ============================================================

DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "products_select_anon"
ON storage.objects FOR SELECT TO anon
USING (bucket_id = 'products');

CREATE POLICY "products_select_authenticated"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'products');

CREATE POLICY "products_insert_anon"
ON storage.objects FOR INSERT TO anon
WITH CHECK (bucket_id = 'products');

CREATE POLICY "products_insert_authenticated"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'products');

CREATE POLICY "products_update_anon"
ON storage.objects FOR UPDATE TO anon
USING (bucket_id = 'products')
WITH CHECK (bucket_id = 'products');

CREATE POLICY "products_delete_anon"
ON storage.objects FOR DELETE TO anon
USING (bucket_id = 'products');
