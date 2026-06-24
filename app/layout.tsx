import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { GlobalFooter } from "@/components/GlobalFooter";

const font = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Restaurant POS",
  description: "Restaurant Point of Sale & QR Menu Ordering",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${font.variable} font-sans antialiased`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <div className="flex-1">{children}</div>
            <GlobalFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
