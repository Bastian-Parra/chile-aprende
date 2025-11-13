import { MissionsIcons } from "../icons/MissionsIcons";

export default function MissionObjectives({ text }: { text: string }) {
  return (
    <p className="flex gap-2 items-center text-xl">
      <span className="text-primarygreen">
        <MissionsIcons.check />
      </span>
      {text}
    </p>
  );
}
