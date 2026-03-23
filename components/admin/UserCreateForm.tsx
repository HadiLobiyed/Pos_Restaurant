"use client";

import { useState } from "react";

export function UserCreateForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"ADMIN" | "STAFF">("STAFF");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (!name.trim()) return setMessage("Nom requis.");
    if (!email.trim()) return setMessage("Email requis.");
    if (!password.trim() || password.trim().length < 6) return setMessage("Mot de passe (min 6 caractères) requis.");

    setLoading(true);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });
    setLoading(false);

    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setMessage(typeof d.error === "string" ? d.error : "Erreur lors de la création.");
      return;
    }

    setMessage("Utilisateur créé.");
    setName("");
    setEmail("");
    setPassword("");
    setRole("STAFF");
  }

  return (
    <div className="rounded-2xl border border-dark-200 bg-white p-6 shadow-card">
      <h2 className="mb-4 text-xl font-semibold text-dark-900">Créer un utilisateur</h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-dark-700">Nom</label>
          <input
            className="input-field w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Marie"
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-dark-700">Email</label>
          <input
            className="input-field w-full"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ex: marie@restaurant.com"
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-dark-700">Mot de passe</label>
          <input
            className="input-field w-full"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min 6 caractères"
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-dark-700">Rôle</label>
          <select
            className="input-field w-full py-2"
            value={role}
            onChange={(e) => setRole(e.target.value as "ADMIN" | "STAFF")}
          >
            <option value="STAFF">STAFF</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        {message && <p className="text-sm text-dark-600">{message}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Création..." : "Créer"}
        </button>
      </form>
    </div>
  );
}

