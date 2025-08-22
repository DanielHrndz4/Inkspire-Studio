import { supabase } from "@/utils/supabase/server";

interface signInProps {
  email: string;
  password: string;
}
export async function signIn(signInData: signInProps) {
  const { email, password } = signInData;
  try {
    // Paso 1: Autenticación
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) throw authError;

    // Paso 2: Obtener sesión con JWT
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();
    if (sessionError) throw sessionError;

    // Paso 3: Obtener perfil extendido
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("name, lastname, tel, active, role")
      .eq("id", authData.user.id)
      .single();

    if (profileError) throw profileError;

    return {
      user: {
        ...authData.user,
        profile,
      },
      session: sessionData.session,
      accessToken: sessionData.session?.access_token,
    };
  } catch (error: any) {
    if (error.message.includes("Invalid login credentials")) {
      throw new Error("Email o contraseña incorrectos");
    }
  }
}
