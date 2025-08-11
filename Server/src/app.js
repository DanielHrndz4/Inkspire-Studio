require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
const app = express();
const userRoute = require('../routes/user.route')

const PORT = process.env.PORT || 4444; 

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI || '')
  .then(() => console.log('🟢 Conectado a MongoDB'))
  .catch(err => console.error('🔴 Error de conexión:', err));

app.use('/api/v01/', userRoute); 

app.get('/', (req, res) => {
  res.send(`Servidor corriendo en puerto ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});