import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { UserCreateForm } from "@/components/admin/UserCreateForm";

export default async function UsersPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role ?? "STAFF";

  if (role !== "ADMIN") redirect("/admin/dashboard");

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold text-dark-900">Utilisateurs</h1>
      <UserCreateForm />
    </div>
  );
}

