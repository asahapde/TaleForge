import type { Metadata } from "next";
import { Inter } from "next/font/google";
import App from "../App";
import Navigation from "../components/Navigation";
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
      <body className={inter.className}>
        <App>
          <Navigation />
          <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {children}
          </main>
        </App>
      </body>
    </html>
  );
}
