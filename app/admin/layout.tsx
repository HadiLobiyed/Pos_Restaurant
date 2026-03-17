import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  // Allow unauthenticated only on login page (middleware handles /admin/dashboard etc.)
  return (
    <div className="min-h-screen flex">
      {session && <AdminSidebar />}
      <main className="flex-1 overflow-auto bg-dark-100">{children}</main>
    </div>
  );
}
