import { CSSProperties } from "react";
import { SignUpButton } from "@clerk/nextjs";
export default function RegisterButton({
  text,
  style,
}: {
  text: string;
  style?: CSSProperties;
}) {
  return (
    <SignUpButton mode="modal">
      <button
        className="bg-none px-3 py-1 font-bold rounded bg-primarygreen hover:bg-fff hover:text-primarygreen hover:bg-white transition-colors duration-200 ease-in-out cursor-pointer border border-primarygreen text-white"
        style={style}
      >
        {text}
      </button>
    </SignUpButton>
  );
}
