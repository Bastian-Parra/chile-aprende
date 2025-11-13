export default function IndexBox({
  title,
  text,
  icon,
}: {
  title: string;
  text: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="w-1/3 bg-[#F6F8F7] flex flex-col items-center p-5 gap-5 rounded-xl border border-primarygreen">
      <span className="text-primarygreen">{icon}</span>
      <h4 className="text-xl font-bold">{title}</h4>
      <p className="text-center">{text}</p>
    </div>
  );
}
