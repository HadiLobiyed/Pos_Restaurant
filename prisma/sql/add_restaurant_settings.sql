-- Horaires d’ouverture (dashboard). Sinon : npx prisma db push

CREATE TABLE IF NOT EXISTS "RestaurantSettings" (
  "id" TEXT NOT NULL,
  "openingHours" JSONB,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "RestaurantSettings_pkey" PRIMARY KEY ("id")
);
