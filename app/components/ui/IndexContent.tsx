import { IndexIcons } from "../icons/IndexIcons"
import IndexBox from "./IndexBox"

export default function IndexContent() {
  return (
    <article className="flex flex-col gap-10 w-full justify-center items-center">
      <h2 className=" text-3xl font-bold">
        Desbloquea el Pasado. Conquista el Presente.
      </h2>
      <h3 className="text-xl font-semibold text-primarygreen">
        Descubre una forma nueva y entretenida de aprender con nuestra
        plataforma gamificada.
      </h3>
      <div className="flex gap-10">
        <IndexBox title="Aprende Jugando" text="Gana puntos, sube de nivel y colecciona medallas mientras exploras la historia de Chile." icon={<IndexIcons.book />} />
        <IndexBox title="Contenido Completo" text="Viaja desde los pueblos originarios hasta la historia moderna con lecciones interactivas." icon={<IndexIcons.gamepad />} />
        <IndexBox title="Compite y Diviértete" text="Desafía a tus amigos, compite en la tabla de líderes y demuestra cuánto sabes." icon={<IndexIcons.trophy />} />
      </div>
    </article>
  );
}
