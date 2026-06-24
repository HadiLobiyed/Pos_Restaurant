-- Logo restaurant (favicon + admin) + colonne nom si absente
-- Supabase → SQL Editor → New query → Coller → Run
-- Puis : Storage → bucket « products » (public) — les images vont dans branding/

-- Nom du restaurant (si pas déjà fait)
ALTER TABLE "RestaurantSettings"
  ADD COLUMN IF NOT EXISTS "restaurantName" TEXT NOT NULL DEFAULT 'Restaurant POS';

-- Table dédiée au logo (URL Supabase Storage)
CREATE TABLE IF NOT EXISTS "RestaurantLogo" (
  "id"          TEXT NOT NULL DEFAULT 'default',
  "imageUrl"    TEXT,
  "storagePath" TEXT,
  "mimeType"    TEXT,
  "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "RestaurantLogo_pkey" PRIMARY KEY ("id")
);

INSERT INTO "RestaurantLogo" ("id", "updatedAt")
VALUES ('default', CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

-- Storage : uploadez le logo dans le bucket public « products », dossier branding/
-- Si l’upload échoue (403), exécutez aussi : supabase/storage-policies.sql
