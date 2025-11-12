import { IndexIcons } from "../icons/IndexIcons";

export default function IndexContent() {
  return (
    <article className="flex flex-col gap-10 w-full justify-center items-center">
      <h2 className=" text-3xl font-bold">Desbloquea el Pasado. Conquista el Presente.</h2>
      <h3 className="text-xl font-semibold text-primarygreen">
        Descubre una forma nueva y entretenida de aprender con nuestra
        plataforma gamificada.
      </h3>
      <div className="flex gap-10">
        <div className="w-1/3 bg-[#F6F8F7] flex flex-col items-center p-5 gap-5 rounded-xl border border-primarygreen">
          <span className="text-primarygreen"><IndexIcons.book /></span>
          <h4 className="text-xl font-bold">Aprende Jugando</h4>
          <p className="text-center">
            Gana puntos, sube de nivel y colecciona medallas mientras exploras
            la historia de Chile.
          </p>
        </div>
        <div className="w-1/3 bg-[#F6F8F7] flex flex-col items-center p-5 gap-5 rounded-xl border border-primarygreen">
          <span className="text-primarygreen"><IndexIcons.gamepad /></span>
          <h4 className="text-xl font-bold">Contenido Completo</h4>
          <p className="text-center">
            Viaja desde los pueblos originarios hasta la historia moderna con
            lecciones interactivas.
          </p>
        </div>
        <div className="w-1/3 bg-[#F6F8F7] flex flex-col items-center p-5 gap-5 rounded-xl border border-primarygreen">
          <span className="text-primarygreen"><IndexIcons.trophy /></span>
          <h4 className="text-xl font-bold">Competite y Diviértete</h4>
          <p className="text-center">
            Desafía a tus amigos, compite en la tabla de líderes y desmuestra cuánto sabes.
          </p>
        </div>
      </div>
    </article>
  );
}
