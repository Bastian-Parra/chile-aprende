import type { Metadata } from "next";
import { Onest } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { esES } from "@clerk/localizations";
import Header from "./components/layout/Header";
import UserSync from "./components/user/UserSync";

const onest = Onest({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChileAprende",
  description:
    "Plataforma de aprendizaje de historia de Chile, cultura y geografía.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={esES}>
      <html lang="es">
        <body className={onest.className}>
          <Header />
          <main className="w-6xl m-auto h-screen flex flex-col gap-5 mt-10">
            <UserSync />
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
