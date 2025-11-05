import { getUsers } from "@/lib/services/user";

export default async function User() {
  const users = await getUsers();

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users?.map((user) => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
    </div>
  );
}
