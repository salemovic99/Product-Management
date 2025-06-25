// app/layout.tsx (NO "use client" here)
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

import LayoutWrapper from "../components/LayoutWrapper";


// Fonts (if used in classname)
const geist = Geist({ subsets: ["latin"] });


export const metadata = {
  title: {
    default: "Product Management App",
    template: "%s | Product Management App",
  },
  description:
    "Effortlessly manage your products, stock levels, and locations with InventoryFlow — a modern solution designed for businesses to track, organize, and optimize their inventory in real time.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className="">
        <body className={`${geist.className} min-h-screen bg-gray-100 dark:bg-gray-900`}>
          <LayoutWrapper>{children}</LayoutWrapper>
          <Toaster position="top-center" expand={false} />
        </body>
      </html>
    </ClerkProvider>
  );
}
