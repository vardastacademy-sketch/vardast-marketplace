import type { Metadata } from "next";
import { Inter, Vazirmatn } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const vazir = Vazirmatn({ subsets: ["arabic"], variable: '--font-vazir' });

export const metadata: Metadata = {
  title: "Ostakaran | اوستاکاران",
  description: "Vardast Experts Directory",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${inter.variable} ${vazir.variable} font-sans bg-gray-50 text-gray-900 min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
