import NavBar from "./NavBar";

export default function Header() {
  return (
    <header className="w-full h-16 flex items-center bg-headerbg border-b border-b-gray-200 fixed top-0 ">
      <NavBar />
    </header>
  );
}
