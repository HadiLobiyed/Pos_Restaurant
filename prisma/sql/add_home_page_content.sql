-- Contenu éditable page d'accueil (admin → Utilisateurs)
ALTER TABLE "RestaurantSettings"
  ADD COLUMN IF NOT EXISTS "homePageContent" JSONB;
