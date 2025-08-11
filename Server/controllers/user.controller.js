const {
  userExist,
  userCreate,
  userLogin,
} = require("../services/user.service");

const create = async (req, res) => {
  const user = req.body;
  try {
    const userEx = await userExist(user.email);
    if (userEx)
      return res
        .status(409)
        .json({ message: "El usuario con este email ya existe" });
    const newUser = await userCreate(user);
    if (!newUser)
      return res.status(400).json({ message: "Usuario no guardado" });
    const login = await userLogin(newUser.email, newUser.password);
    if (!login)
      return res
        .status(400)
        .json({ message: "Error al registrar usuario, intenta nuevamente" });
    return res
      .status(200)
      .json({ message: "Usuario creado con exito", data: login });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (email && password) {
      const user = await userLogin(email, password);
      if (!user) res.status(400).json({ message: "Credenciales invalidas" });
      return res
        .status(200)
        .json({ message: "Usuario logueado con exito", data: user });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  create,
  login,
};
