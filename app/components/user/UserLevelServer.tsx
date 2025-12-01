import { getUserLevelData } from "@/lib/services/userProgress";
import UserLevelClient from "./UserLevelClient";
import { auth } from "@clerk/nextjs/server";

export default async function UserLevelServer() {

  const { userId } = await auth()

  if (!userId) return null

  const data = await getUserLevelData(userId);
  return <UserLevelClient initialData={data} />;
}
