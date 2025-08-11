const isNotEmpty = (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email && !password) {
      res.status(400).json({ message: "Los campos no pueden estar vacios" });
    } else {
      !email &&
        res
          .status(400)
          .json({ message: "El campo de email no debe ser vacio" });
      !password &&
        res.status(400).json({ message: "La contraseña es requerida" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { isNotEmpty };
