import { MissionsIcons } from "../icons/MissionsIcons";

export default function Difficulty({ difficulty }: { difficulty: string }) {
  return (
    <p className="text-xl flex gap-1 p-1 rounded">
      <span
        className={
          difficulty === "medium"
            ? "text-yellow-500"
            : difficulty === "hard"
            ? "text-red-500"
            : "text-green-500"
        }
      >
        <MissionsIcons.difficulty />
      </span>{" "}
      {difficulty === "medium"
        ? "Media"
        : difficulty === "hard"
        ? "Dificil"
        : "Facil"}
    </p>
  );
}
