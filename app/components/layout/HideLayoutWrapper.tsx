"use client";
import Header from "./Header";
import Footer from "./Footer";
import { UserSync } from "../user/UserSync";
import { usePathname } from "next/navigation";

export default function HideLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideLayout =
    pathname.startsWith("/missions/") && pathname.includes("/start");

  if (hideLayout) {
    return <div className="w-full h-full">{children}</div>;
  }

  return (
    <>
      <Header />
      <main className="w-6xl m-auto min-h-screen flex flex-col gap-5 mt-30">
        <UserSync />
        {children}
      </main>
      <Footer />
    </>
  );
}
