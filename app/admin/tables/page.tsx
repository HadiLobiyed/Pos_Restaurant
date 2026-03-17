"use client";

import { useEffect, useState } from "react";
import { TableCard } from "@/components/admin/TableCard";
import { TableForm } from "@/components/admin/TableForm";

type Table = {
  id: string;
  number: number;
  reserved: boolean;
  reservationTime: string | null;
};

export default function TablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  async function fetchTables() {
    const res = await fetch("/api/tables");
    if (res.ok) setTables(await res.json());
  }

  useEffect(() => {
    fetchTables().finally(() => setLoading(false));
  }, []);

  function onTableCreated() {
    setShowForm(false);
    fetchTables();
  }

  function onTableDeleted() {
    fetchTables();
  }

  function onTableUpdated() {
    fetchTables();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-dark-500">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="mb-8 text-2xl font-bold text-dark-900">Gestion des tables</h1>
      <div className="mb-6 flex justify-end">
        <button onClick={() => setShowForm(true)} className="btn-primary">
          + Ajouter une table
        </button>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {tables.map((table) => (
          <TableCard
            key={table.id}
            table={table}
            onUpdated={onTableUpdated}
            onDeleted={onTableDeleted}
          />
        ))}
      </div>
      {tables.length === 0 && (
        <p className="py-12 text-center text-dark-500">Aucune table. Ajoutez-en une pour commencer.</p>
      )}
      {showForm && (
        <TableForm onClose={() => setShowForm(false)} onCreated={onTableCreated} />
      )}
    </div>
  );
}
