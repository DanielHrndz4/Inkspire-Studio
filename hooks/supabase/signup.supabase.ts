import { supabase } from "@/utils/supabase/server";
import { supabaseAdmin } from "@/utils/supabase/admin";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface userDataProps {
  name: string;
  lastname: string;
  tel: string;
  email: string;
  password: string;
}

const signUp = async (
  userData: userDataProps,
): Promise<{ data: SupabaseUser | null; error: string | null }> => {
  const { name, lastname, tel, email, password } = userData;

  const { data, error: errorAuth } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, lastname },
    },
  });

  if (errorAuth) return { data: null, error: errorAuth.message };

  const user = data.user;
  if (!user) return { data: null, error: "Usuario no creado en auth" };

  const { error: errorPublic } = await supabase.from("users").insert({
    id: user.id,
    name,
    lastname,
    tel,
    email,
    active: true,
  });

  if (errorPublic) {
    await supabaseAdmin.auth.admin.deleteUser(user.id);
    return {
      data: null,
      error: "Error al crear el perfil: " + errorPublic.message,
    };
  }

  return { data: user, error: null };
};


export default signUp;
