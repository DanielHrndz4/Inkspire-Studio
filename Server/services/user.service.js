const { generateToken } = require("../auth/jwt");
const createPayload = require("../constants/payload.constant");
const userModel = require("../models/user.model");

const userExist = async (email) => {
  try {
    const user = await userModel.findOne({ email }).select("+password");
    return !!user;
  } catch (error) {
    throw new Error("Error to search user");
  }
};

const userCreate = async (userData) => {
  try {
    const newUser = await userModel.create(userData);
    return newUser;
  } catch (error) {
    throw new Error("Error user not created");
  }
};

const userLogin = async (email, ps) => {
  try {
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) return null;
    const checkPass = user.correctPassword(ps, user.password);
    if (!checkPass) return null;
    const { password, createdAt, passwordChangedAt, ...userWithoutPass } = user.toObject();
    const payload = createPayload(user)
    const token = generateToken(payload)
    return {
      user: payload,
      token
    };
  } catch (error) {
    throw new Error("Error user not found");
  }
};

module.exports = {
  userExist,
  userCreate,
  userLogin,
};
