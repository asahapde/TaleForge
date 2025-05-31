import Navigation from "@/components/Navigation";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tale Forge - Interactive Story Platform",
  description:
    "Create and experience interactive stories with branching narratives",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900`}>
        <Navigation />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
