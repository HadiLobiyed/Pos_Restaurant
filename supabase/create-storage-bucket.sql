-- ============================================================
-- Supabase → SQL Editor → New query → Coller → Run
-- Crée le bucket public « produits » (photos menu + logo)
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'produits',
  'produits',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Politiques (si vous avez déjà 6 politiques sur « produits », ignorez la suite
-- ou exécutez supabase/storage-policies.sql à la place)

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

CREATE POLICY "produits_select_anon"
ON storage.objects FOR SELECT TO anon
USING (bucket_id = 'produits');

CREATE POLICY "produits_select_authenticated"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'produits');

CREATE POLICY "produits_insert_anon"
ON storage.objects FOR INSERT TO anon
WITH CHECK (bucket_id = 'produits');

CREATE POLICY "produits_insert_authenticated"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'produits');

CREATE POLICY "produits_update_anon"
ON storage.objects FOR UPDATE TO anon
USING (bucket_id = 'produits')
WITH CHECK (bucket_id = 'produits');

CREATE POLICY "produits_delete_anon"
ON storage.objects FOR DELETE TO anon
USING (bucket_id = 'produits');
