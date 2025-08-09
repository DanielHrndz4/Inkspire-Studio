const bcrypt = require('bcrypt');
const saltRounds = process.env.SALT || 12;

async function hashPassword(plainPassword) {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(plainPassword, salt);
    return hash;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error;
  }
}

async function verifyPassword(plainPassword, hashedPassword) {
  try {
    const match = await bcrypt.compare(plainPassword, hashedPassword);
    return match; 
  } catch (error) {
    console.error('Error verifying password:', error);
    throw error;
  }
}

module.exports = {hashPassword, verifyPassword}