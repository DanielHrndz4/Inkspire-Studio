import { supabase } from "@/utils/supabase/server";

interface userDataProps {
  name: string;
  lastname: string;
  tel: string;
  email: string;
  password: string;
}

const signUp = async (userData: userDataProps) => {
  const { name, lastname, tel, email, password } = userData;

  const { data, error: errorAuth } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, lastname },
    },
  });

  if (errorAuth) throw new Error(errorAuth.message);

  const user = data.user;
  if (!user) throw new Error("Usuario no creado en auth");

  // 👇 insert solo si existe en auth.users
  const { error: errorPublic } = await supabase.from("users").insert({
    id: user.id,
    name,
    lastname,
    tel,
    email,
    active: true,
  });

  if (errorPublic) {
    // rollback: borro el user en auth
    await supabase.auth.admin.deleteUser(user.id);
    throw new Error("Error al crear el perfil: " + errorPublic.message);
  }

  return user;
};


export default signUp;
