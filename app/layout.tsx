import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AMMS",
  description: "Alarm & Maintenance Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-bg-primary text-text-primary">
        {children}
      </body>
    </html>
  );
}
