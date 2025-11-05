"use client";

import { useUser } from "@clerk/nextjs";

export default function Profile() {
  const { user } = useUser();

  return (
    <>
      <h1 className="text-4xl font-extrabold">Mi progreso</h1>
      <header className="shadow-xl overflow-hidden rounded-2xl border border-gray-100">
        <div className="w-full h-80 flex gap-10 items-center">
          <div
            className="h-full w-2/7 bg-amber-50 rounded-bl-2xl rounded-tl-2xl overflow-hidden"
            style={{
              backgroundImage: `url(${user?.imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
          <div>
            <h2 className="text-2xl font-bold">{user?.fullName}</h2>
            <p className="text-md">{user?.emailAddresses[0].emailAddress}</p>
            
          </div>
        </div>
      </header>
    </>
  );
}
