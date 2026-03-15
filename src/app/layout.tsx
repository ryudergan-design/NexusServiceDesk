import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "sonner"
import { CustomCursor } from "@/components/custom-cursor";
import { RouteBodyState } from "@/components/route-body-state";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "I9 Chamados",
  description: "Sistema Moderno de Gestão de Chamados",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-950 text-white selection:bg-primary/30`}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <RouteBodyState />
            <CustomCursor />
            {children}
            <Toaster richColors closeButton position="top-right" />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
