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
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      {session && <AdminSidebar />}
      <main className="min-w-0 flex-1 overflow-auto bg-dark-100 pt-14 lg:pt-0">{children}</main>
    </div>
  );
}
