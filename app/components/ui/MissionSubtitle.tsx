export default function MissionSubtitle({ title }: { title: string }) {
  return (
    <h2 className="text-2xl font-bold pl-5 border-l-4 border-primarygreen">
      {title}
    </h2>
  );
}
