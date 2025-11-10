import RegisterButton from "./RegisterButton";
import LoginButton from "./LoginButton";

export default function Hero() {
  return (
    <section className="w-full flex justify-between gap-10">
      <div className="flex flex-col gap-5 w-1/2">
        <h1 className="text-6xl font-bold">
          ¡La Aventura de la <span className="text-primarygreen">Historia</span>{" "}
          de Chile Comienza Aquí!
        </h1>
        <h3 className="text-xl text-primarygreen bg-yellow-50 w-3/4">
          Aprende Historia y Geografía de Chile a través de desafíos, juegos y
          misiones emocionantes.
        </h3>
        <div className="flex gap-5 ">
          <RegisterButton text="Registrarse" style={{ padding: "10px" }} />
          <LoginButton text="Iniciar Sesión" style={{ padding: "10px" }} />
        </div>
      </div>
      <div className="w-1/2 rounded-2xl p-0 shadow-md" style={{
        backgroundImage: "url('/hero.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundPositionY: "70%",
      }}/>
    </section>
  );
}
