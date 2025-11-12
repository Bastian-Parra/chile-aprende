import Hero from "./components/ui/Hero";
import IndexContent from "./components/ui/IndexContent";

export default function Home() {
  return (
    <article className="mt-5 flex justify-center flex-col w-full gap-30">
      <Hero />
      <IndexContent />
    </article>
  );
}
