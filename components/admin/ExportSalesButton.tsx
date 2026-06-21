"use client";

type ExportSalesButtonProps = {
  /** YYYY-MM-DD — défaut : aujourd'hui côté serveur via l'API si omis */
  date?: string;
  className?: string;
};

export function ExportSalesButton({ date, className = "btn-secondary" }: ExportSalesButtonProps) {
  const href = date ? `/api/payments/export?date=${date}` : "/api/payments/export";

  return (
    <a href={href} download className={className}>
      Exporter fichier vente
    </a>
  );
}
