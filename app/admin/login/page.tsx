"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Email ou mot de passe incorrect.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-100 to-dark-200 p-4">
      <div className="w-full max-w-md">
        <div className="animate-slide-up overflow-hidden rounded-3xl border border-dark-200/60 bg-white shadow-elevated">
          <div className="border-b border-dark-100 bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-6 text-center">
            <Link href="/" className="inline-block">
              <h1 className="text-2xl font-bold text-white">Restaurant POS</h1>
            </Link>
            <p className="mt-1 text-sm text-primary-100">Connexion administration</p>
          </div>
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-dark-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
                placeholder="admin@restaurant.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-dark-700">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field"
              />
            </div>
            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>
        <p className="mt-6 text-center text-sm text-dark-500">
          <Link href="/" className="hover:text-primary-600 font-medium transition">
            ← Retour à l'accueil
          </Link>
        </p>
      </div>
    </main>
  );
}
