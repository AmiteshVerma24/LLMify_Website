import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// import AuthProvider from '@/components/AuthProvider';
import { Providers } from "./providers";
import { Hero, NavBar } from "@/components";
import Sidebar from "@/components/global/SideBar";

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
  title: "SmartSnip",
  description: "Highlight, save notes, and get AI-powered insights directly from your browser. Boost productivity with SmartSnip!",
  authors: [{ name: "Amitesh Verma", url: "https://x.com/AmitesH2419" }]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <div className="flex min-h-screen">
            {/* Sidebar - takes up full height */}
            <Sidebar />
            
            {/* Main content area with navbar and children */}
            <div className="flex flex-col flex-1">
              <NavBar />
              <main 
                className="flex-1"
                style={{ minHeight: "calc(100vh - 4rem)" }}
              >
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
