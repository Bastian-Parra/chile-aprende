"use client";

import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { NavBarIcons } from "../icons/NavBarIcons";
import { usePathname } from "next/navigation";
export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="w-6xl mx-auto flex justify-between items-center">
      <a href="/" className="text-2xl font-bold p-0 flex items-center">
        <span className="flex items-center gap-1">
          <NavBarIcons.book2 />
          Chile
        </span>
        <span className="text-primarygreen p-0">Aprende</span>
      </a>
      <ul className="flex gap-15">
        <li>
          <Link
            href="/play"
            className="flex gap-1 border-2 rounded-3xl px-3 py-1 text-primarygreen hover:bg-primarygreen hover:text-white transition-colors duration-200 ease-in-out"
          >
            Jugar <NavBarIcons.play />
          </Link>
        </li>
        <li>
          {pathname === "/missions" ? (
            <Link
              href="/missions"
              className="flex gap-1 px-3 py-1 text-primarygreen font-bold border-b-2 border-primarygreen"
            >
              Misiones
            </Link>
          ) : (
            <Link href="/missions" className="flex gap-1 px-3 py-1">
              Misiones
            </Link>
          )}
        </li>
        <li>
          {pathname === "/leaderboard" ? (
            <Link
              href="/leaderboard"
              className="flex gap-1 px-3 py-1 font-bold border-b-2 border-primarygreen text-primarygreen"
            >
              Ranking
            </Link>
          ) : (
            <Link href="/leaderboard" className="flex gap-1 px-3 py-1">
              Ranking
            </Link>
          )}
        </li>
      </ul>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <button className="bg-primarygreen px-3 py-1 font-bold rounded hover:bg-primarygreen/80 transition-colors duration-200 ease-in-out cursor-pointer">
            Ingresar
          </button>
        </SignInButton>
      </SignedOut>
    </nav>
  );
}
