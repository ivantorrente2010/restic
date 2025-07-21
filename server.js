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
  const { mesa, plato } = req.body;

  const sql = 'INSERT INTO comandas (mesa, platos) VALUES (?, ?)';
  db.query(sql, [mesa, JSON.stringify(plato)], (err, result) => {
    if (err) {
      console.error('❌ Error al guardar comanda:', err);
      return res.status(500).json({ status: 'ERROR', mensaje: 'No se pudo guardar la comanda' });
    }

    console.log('📥 Comanda guardada:', req.body);
    res.json({ status: 'OK', mensaje: 'Comanda recibida y guardada correctamente' });
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`🚀 Servidor RESTIC activo en http://localhost:${port}`);
});
