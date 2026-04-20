import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = { title: "Gully Stars", description: "Grassroots sports platform" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 flex justify-center min-h-screen font-sans text-black">
        <main className="w-full max-w-[390px] bg-white min-h-screen shadow-2xl relative overflow-x-hidden">
          <AuthProvider>
            {children}
          </AuthProvider>
        </main>
      </body>
    </html>
  );
}