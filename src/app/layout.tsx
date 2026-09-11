import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "স্বপ্নছোঁয়া | স্বপ্ননগর, মিরপুর-৯, ঢাকা",
  description:
    "স্বপ্ননগরের সর্বপ্রথম এবং ঐতিহ্যবাহী একটি সংগঠন — ব্যায়ামের পাশাপাশি পারস্পরিক পরিচয়, সৌহার্দ্য ও সম্প্রীতির বন্ধনে আবদ্ধ একটি পরিবার।",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+Da+2:wght@500;600;700;800&family=Noto+Sans+Bengali:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
