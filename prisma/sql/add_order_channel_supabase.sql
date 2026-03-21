-- À exécuter dans Supabase : SQL Editor (si tu ne peux pas lancer prisma db push)
-- Corrige : column Order.channel does not exist

-- 1) Enum canal de commande
DO $$ BEGIN
  CREATE TYPE "OrderChannel" AS ENUM ('DINE_IN', 'TAKEAWAY', 'DELIVERY');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 2) tableId nullable (commandes sans table : emporter / livraison)
ALTER TABLE "Order" ALTER COLUMN "tableId" DROP NOT NULL;

-- 3) Nouvelles colonnes sur "Order"
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "channel" "OrderChannel" NOT NULL DEFAULT 'DINE_IN';
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "publicCode" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "customerName" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "customerPhone" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "customerAddress" TEXT;

-- 4) Index unique sur le code affiché au client (plusieurs NULL autorisés en PostgreSQL)
CREATE UNIQUE INDEX IF NOT EXISTS "Order_publicCode_key" ON "Order"("publicCode");

-- 5) Table réservations (si elle n’existe pas encore)
CREATE TABLE IF NOT EXISTS "TableReservation" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "people" INTEGER NOT NULL,
  "preferredDate" TEXT,
  "message" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "handled" BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT "TableReservation_pkey" PRIMARY KEY ("id")
);

-- 6) FK Order → Table avec ON DELETE SET NULL (comme dans schema.prisma)
--    Décommente seulement si tu as une erreur de contrainte sur tableId :
-- ALTER TABLE "Order" DROP CONSTRAINT IF EXISTS "Order_tableId_fkey";
-- ALTER TABLE "Order" ADD CONSTRAINT "Order_tableId_fkey"
--   FOREIGN KEY ("tableId") REFERENCES "Table"("id") ON DELETE SET NULL ON UPDATE CASCADE;
