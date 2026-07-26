import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { UserCreateForm } from "@/components/admin/UserCreateForm";
import { UserListAdmin } from "@/components/admin/UserListAdmin";
import { RestaurantNameSettings } from "@/components/admin/RestaurantNameSettings";
import { HomePageEditor } from "@/components/admin/HomePageEditor";

export default async function UsersPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role ?? "STAFF";

  if (role !== "ADMIN") redirect("/admin/dashboard");

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold text-dark-900">Utilisateurs</h1>
      <RestaurantNameSettings />
      <HomePageEditor />
      <UserCreateForm />
      <UserListAdmin />
    </div>
  );
}

