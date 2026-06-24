-- Nom du restaurant + résumés journaliers ventes/achats
-- Exécuter sur Supabase ou : npx prisma db push

ALTER TABLE "RestaurantSettings"
  ADD COLUMN IF NOT EXISTS "restaurantName" TEXT NOT NULL DEFAULT 'Restaurant POS';

CREATE TABLE IF NOT EXISTS "DailySalesSummary" (
  "id" TEXT NOT NULL,
  "date" TEXT NOT NULL,
  "totalRevenue" DECIMAL(10,2) NOT NULL,
  "totalSales" INTEGER NOT NULL,
  "paidCount" INTEGER NOT NULL,
  "beverageProfit" DECIMAL(10,2) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "DailySalesSummary_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "DailySalesSummary_date_key" ON "DailySalesSummary"("date");

CREATE TABLE IF NOT EXISTS "DailyPurchaseSummary" (
  "id" TEXT NOT NULL,
  "date" TEXT NOT NULL,
  "totalProducts" INTEGER NOT NULL,
  "totalSpent" DECIMAL(10,2) NOT NULL,
  "purchaseCount" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "DailyPurchaseSummary_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "DailyPurchaseSummary_date_key" ON "DailyPurchaseSummary"("date");
