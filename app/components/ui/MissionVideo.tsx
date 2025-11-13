"use server";

export default async function MissionVideo({ src }: { src: string }) {
    return (
        <iframe src={src} width={350} height={225} allowFullScreen className="rounded-xl"/>
    );
}