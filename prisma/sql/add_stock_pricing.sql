-- Prix d'achat boissons (MenuItem)
ALTER TABLE "MenuItem" ADD COLUMN IF NOT EXISTS "purchasePrice" DECIMAL(10, 2);

-- Prix d'achat par unité (ingrédients)
ALTER TABLE "StockIngredient" ADD COLUMN IF NOT EXISTS "unitPrice" DECIMAL(10, 2);

-- Achats journaliers stock
CREATE TABLE IF NOT EXISTS "StockPurchase" (
  "id" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "itemId" TEXT NOT NULL,
  "itemName" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL,
  "unitPrice" DECIMAL(10, 2) NOT NULL,
  "totalCost" DECIMAL(10, 2) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "StockPurchase_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "StockPurchase_createdAt_idx" ON "StockPurchase"("createdAt");
