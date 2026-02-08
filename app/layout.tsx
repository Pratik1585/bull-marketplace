import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

// ✅ Font optimized (display: swap = no blocking)
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

// ✅ SEO + Google optimized metadata
export const metadata: Metadata = {
  title: "महाराष्ट्र बैलगाडा शर्यत बाजार | बैल खरेदी विक्री",
  description:
    "महाराष्ट्रातील बैलगाडा शर्यत साठी सर्वोत्तम बैल खरेदी व विक्री करण्यासाठी विश्वासार्ह वेबसाइट.",
  keywords: [
    "बैल विक्री",
    "बैल खरेदी",
    "बैलगाडा शर्यत",
    "महाराष्ट्र बैल बाजार",
    "bull selling maharashtra",
  ],
  metadataBase: new URL("https://bailgadasharyat.in"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mr">
      <body className={inter.className}>
        {/* ✅ AuthProvider kept (no logic change) */}
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
