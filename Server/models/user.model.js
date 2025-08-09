const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
    maxlength: [50, 'El nombre no puede exceder los 50 caracteres'],
    match: [/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras']
  },
  lastname: {
    type: String,
    required: [true, 'El apellido es obligatorio'],
    trim: true,
    minlength: [2, 'El apellido debe tener al menos 2 caracteres'],
    maxlength: [50, 'El apellido no puede exceder los 50 caracteres'],
    match: [/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El apellido solo puede contener letras']
  },
  tel: {
    type: String,
    required: [true, 'El teléfono es obligatorio'],
    validate: {
      validator: function(v) {
        return /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{3,6}$/.test(v);
      },
      message: props => `${props.value} no es un número de teléfono válido!`
    }
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: validator.isEmail,
      message: 'Por favor ingrese un email válido'
    }
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
    select: false // No se incluye en los resultados de consultas
  },
  passwordChangedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

// Middleware para hashear la contraseña antes de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordChangedAt = Date.now() - 1000; // Asegura que el token JWT se cree después
  next();
});

// Método para comparar contraseñas
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Método para verificar si cambió la contraseña después de un timestamp
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Plugin para auto-incremento
userSchema.plugin(AutoIncrement, { 
  inc_field: "id", 
  start_seq: 1,
  disableHooks: true // Evita conflictos con otros middlewares
});

// Filtro para no mostrar usuarios inactivos
userSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } });
  next();
});

const User = mongoose.model("Users", userSchema);

module.exports = User;