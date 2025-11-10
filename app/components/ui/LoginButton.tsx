import { CSSProperties } from "react";
import { SignInButton } from "@clerk/nextjs";

export default function LoginButton({
  text,
  style,
}: {
  text: string;
  style?: CSSProperties;
}) {
  return (
    <SignInButton mode="modal">
      <button
        className="bg-none px-3 py-1 font-bold rounded hover:bg-primarygreen hover:text-white transition-colors duration-200 ease-in-out cursor-pointer border border-primarygreen text-primarygreen"
        style={style}
      >
        {text}
      </button>
    </SignInButton>
  );
}
