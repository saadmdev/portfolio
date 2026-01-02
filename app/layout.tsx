import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Muhammad Saad's Portfolio",
  description: "Check out my projects, skills, and work experience.",
  openGraph: {
    title: "Muhammad Saad's Portfolio",
    description: "Check out my projects, skills, and work experience.",
    url: "https://portfolio-lvpd4p766-muhammd-saads-projects.vercel.app",
    type: "website",
    images: [
      {
        url: "https://portfolio-lvpd4p766-muhammd-saads-projects.vercel.app/preview-image.png",
        width: 1200,
        height: 630,
        alt: "Muhammad Saad's Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Saad's Portfolio",
    description: "Check out my projects, skills, and work experience.",
    images: ["https://portfolio-lvpd4p766-muhammd-saads-projects.vercel.app/preview-image.png"],
  },
};

// Ensure mobile devices render using device width
export const viewport = 'width=device-width, initial-scale=1';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
