-- Colonne servedAt : commande envoyée à la caisse après « Servie » en cuisine
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "servedAt" TIMESTAMP(3);
