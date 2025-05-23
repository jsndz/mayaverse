import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { IncomingCallModal } from "@/components/IncomingCallModal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Collab Space - Real-time Collaboration Platform",
  description: "A modern platform for real-time collaboration and interaction",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <IncomingCallModal />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
