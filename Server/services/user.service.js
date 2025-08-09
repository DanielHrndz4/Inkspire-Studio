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

const userLogin = async (email, password) => {
  try {
    const user = await userModel.findOne({ email });
    if (!user) return null;
    const checkPass = userModel.correctPassword(password, user.password);
    if (!checkPass) return null;
    return user;
  } catch (error) {
    throw new Error("Error user not found");
  }
};

module.exports = {
  userExist,
  userCreate,
  userLogin
};
