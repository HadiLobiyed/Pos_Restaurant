-- Table ingrédients stock (hors menu)
CREATE TABLE IF NOT EXISTS "StockIngredient" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL DEFAULT 0,
  "unit" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "StockIngredient_pkey" PRIMARY KEY ("id")
);
