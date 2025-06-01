import App from "@/components/App";
import Navigation from "@/components/Navigation";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
          <main className="min-h-screen bg-white text-gray-900">
            {children}
          </main>
        </App>
      </body>
    </html>
  );
}
