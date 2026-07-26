import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { GlobalFooter } from "@/components/GlobalFooter";
import { BrandingHead } from "@/components/BrandingHead";
import { getRestaurantBranding } from "@/lib/restaurantSettings";

const font = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  weight: ["400", "500", "600", "700"],
});

export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export async function generateMetadata(): Promise<Metadata> {
  const { restaurantName, logoUrl, logoUpdatedAt } = await getRestaurantBranding();
  const iconHref = logoUrl
    ? `${logoUrl}${logoUrl.includes("?") ? "&" : "?"}v=${encodeURIComponent(logoUpdatedAt ?? "1")}`
    : "/api/branding/favicon";

  return {
    title: restaurantName,
    description: "Restaurant Point of Sale & QR Menu Ordering",
    icons: {
      icon: [{ url: iconHref }],
      shortcut: [{ url: iconHref }],
      apple: logoUrl ? [{ url: iconHref }] : undefined,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className={`${font.variable} font-sans antialiased`}>
        <Providers>
          <BrandingHead />
          <div className="flex min-h-screen w-full flex-col">
            <div className="w-full flex-1">{children}</div>
            <GlobalFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
