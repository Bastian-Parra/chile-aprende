"use client";

import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { NavBarIcons } from "../icons/NavBarIcons";
import { usePathname } from "next/navigation";
import LoginButton from "../ui/LoginButton";
import RegisterButton from "../ui/RegisterButton";

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="w-6xl mx-auto flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold p-0 flex items-center">
        <span className="flex items-center gap-1">
          <NavBarIcons.book2 />
          Chile
        </span>
        <span className="text-primarygreen p-0">Aprende</span>
      </Link>
      <ul className="flex gap-15">
        <li>
          {pathname === "/play" ?  (
            <Link
              href="/play"
              className="flex gap-2 px-3 py-1 font-bold border-2 border-primarygreen bg-primarygreen text-white rounded-full "
            >
              <span>
                <NavBarIcons.play />
              </span>{" "}
              Jugar
            </Link>
          ) : (
            <Link href="/play" className="flex gap-2 px-3 py-1 bg-white text-primarygreen rounded-full border-2 border-primarygreen">
              <span>
                <NavBarIcons.play />
              </span>{" "}
              Jugar
            </Link>
          )}
        </li>
        <li>
          {pathname === "/leaderboard" ? (
            <Link
              href="/leaderboard"
              className="flex gap-2 px-3 py-1 font-bold border-b-2 border-primarygreen text-primarygreen"
            >
              <span className="text-yellow-400">
                <NavBarIcons.trophy />
              </span>{" "}
              Ranking
            </Link>
          ) : (
            <Link href="/leaderboard" className="flex gap-2 px-3 py-1">
              <span className="text-yellow-400">
                <NavBarIcons.trophy />
              </span>{" "}
              Ranking
            </Link>
          )}
        </li>
        <SignedIn>
          <li>
            {pathname === "/missions" ? (
              <Link
                href="/missions"
                className="flex gap-2 px-3 py-1 text-primarygreen font-bold border-b-2 border-primarygreen"
              >
                <NavBarIcons.mission /> Misiones
              </Link>
            ) : (
              <Link href="/missions" className="flex gap-2 px-3 py-1">
                <NavBarIcons.mission /> Misiones
              </Link>
            )}
          </li>
        </SignedIn>
      </ul>
      <SignedIn>
        <ul className="flex gap-15">
          <li>
            {pathname === "/profile" ? (
              <Link
                href="/profile"
                className="flex gap-2 px-3 py-1 text-primarygreen font-bold border-b-2 border-primarygreen"
              >
                <NavBarIcons.profile /> Mi Perfil
              </Link>
            ) : (
              <Link href="/profile" className="flex gap-2 px-3 py-1">
                <NavBarIcons.profile /> Mi Perfil
              </Link>
            )}
          </li>
          <UserButton />
        </ul>
      </SignedIn>
      <SignedOut>
        <div className=" flex gap-5">
          <SignInButton mode="modal">
            <LoginButton text="Ingresar" />
          </SignInButton>
          <SignUpButton mode="modal">
            <RegisterButton text="Registrarse" />
          </SignUpButton>
        </div>
      </SignedOut>
    </nav>
  );
}
