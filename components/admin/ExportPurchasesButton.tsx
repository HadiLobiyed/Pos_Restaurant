"use client";

type ExportPurchasesButtonProps = {
  date: string;
  className?: string;
};

export function ExportPurchasesButton({
  date,
  className = "btn-secondary",
}: ExportPurchasesButtonProps) {
  return (
    <a href={`/api/admin/stock/purchases/export?date=${date}`} download className={className}>
      Exporter fichier achats
    </a>
  );
}
