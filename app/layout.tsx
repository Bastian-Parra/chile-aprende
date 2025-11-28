import type { Metadata } from "next";
import { Onest } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { esES } from "@clerk/localizations";
import HideLayoutWrapper from "./components/layout/HideLayoutWrapper";
import ToastProvider from "./components/messages/Toast";

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
          <HideLayoutWrapper>
            <ToastProvider/>
              {children}
          </HideLayoutWrapper>
        </body>
      </html>
    </ClerkProvider>
  );
}
