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

  const { data: userAuth, error: errorAuth } = await supabase.auth.signUp({
    email,
    password,
    options: {
      //Se guarda en auth como metadata
      data: {
        name,
        lastname,
      },
    },
  });

  if (errorAuth) throw new Error(errorAuth.message);

  const { error: errorPublic } = await supabase.from("users").insert({
    id: userAuth.user?.id,
    name,
    lastname,
    tel,
    email,
    active: true,
  });

  if (errorPublic && userAuth.user) {
    await supabase.auth.admin.deleteUser(userAuth.user?.id);
    throw new Error("Error al crear el perfil: " + errorPublic.message);
  }

  return userAuth.user;
};

export default signUp;
