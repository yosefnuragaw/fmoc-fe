import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "../app/clientlayout";
import { poppins } from "../lib/fonts";
import { Toaster } from "../components/ui/sonner";

export const metadata: Metadata = {
  title: "F-MOC",
  description: "by Commit & Pray",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased bg-[#F7F9FB]`}>
        {/* navbar */}
        <div className="min-h-screen">
          <main className="flex-grow">
            <ClientLayout>{children}</ClientLayout>
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}