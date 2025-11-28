import Image from "next/image";

interface ResourceItemProps {
  item: {
    id: string;
    type: string;
    x: number;
    y: number;
  };
  icons: Record<string, string>
  onCollect: (type: string, id: string) => void;
}

export default function ResourceItem({ item, icons, onCollect }: ResourceItemProps) {
  return (
    <Image
      src={icons[item.type]}
      alt={item.type}
      className="resource-item absolute cursor-pointer"
      style={{
        top: item.y,
        left: item.x,
      }}
      width={40}
      height={40}
      onClick={() => onCollect(item.type, item.id)}
    />
  );
}
