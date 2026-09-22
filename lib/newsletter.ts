import { createClient } from "@/lib/supabase/client";

export async function subscribeToNewsletter(email: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email });

  if (error) {
    if (error.code === "23505") {
      throw new Error("Este e-mail já está inscrito.");
    }
    throw error;
  }
}
