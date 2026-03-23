import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/admin/pos/:path*",
    "/admin/sales/:path*",
    "/admin/menu/:path*",
    "/admin/tables/:path*",
    "/admin/reservations",
    "/admin/reservations/:path*",
    "/admin/kitchen/:path*",
    "/admin/users/:path*",
  ],
};
