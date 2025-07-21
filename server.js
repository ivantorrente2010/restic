const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// Middleware para poder leer JSON en las peticiones
app.use(express.json());

// Conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',      // <-- reemplaza con tu usuario MySQL
  password: 'root',  // <-- reemplaza con tu contraseña
  database: 'restic'
});

db.connect((err) => {
  if (err) {
    console.error('❌ Error conectando a MySQL:', err);
    return;
  }
  console.log('✅ Conexión a MySQL establecida');
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor RESTIC funcionando en Windows');
});

// Ruta para recibir comandas
app.post('/comanda', (req, res) => {
  console.log('📥 Comanda recibida:', req.body);
  res.json({ status: 'OK', mensaje: 'Comanda recibida correctamente' });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`🚀 Servidor RESTIC activo en http://localhost:${port}`);
});
