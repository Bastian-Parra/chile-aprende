import { useEffect, useState } from "react";

export function useMission(id: string) {
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/missions/${id}`);
      const data = await res.json();
      setMission(data);
      setLoading(false);
    }
    load();
  }, [id]);

  return { mission, loading };
}