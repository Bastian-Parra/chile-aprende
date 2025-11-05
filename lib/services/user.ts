import { supabase } from "../supabase";

export const getUsers = async () => {
  try {
    const { data, error } = await supabase.from("users").select("*");

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return null;
  }
}