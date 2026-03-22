-- À exécuter si la base existait avant l’ajout des colonnes (Supabase / SQL brut).
-- Sinon : npx prisma db push

ALTER TABLE "TableReservation" ADD COLUMN IF NOT EXISTS "reservationDate" TEXT;
ALTER TABLE "TableReservation" ADD COLUMN IF NOT EXISTS "reservationTime" TEXT;
