"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { supabase } from "@/app/lib/supabase";

export default function UserSync() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded && !user) return;

      try {
        const { data: existingUser } = await supabase
          .from("users")
          .select("id")
          .eq("id", user?.id)
          .single();

        if (!existingUser) {
          await supabase.from("users").upsert({
            id: user?.id,
            email: user?.primaryEmailAddress?.emailAddress,
            username: user?.username || user?.firstName,
          });

          await supabase.from("user_progress").upsert({
            user_id: user?.id,
            level: 1,
            total_xp: 0,
            game_state: {},
            completed_missions: {},
            unlocked_missions: [],
          });
        }

        console.log("Usuario creado en supabase");
      } catch (error) {
        console.log(error);
      }
    };

    syncUser();
  }, [isLoaded, user]);

  return null
}
