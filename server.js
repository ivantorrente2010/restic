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
    console.error('Error conectando a MySQL:', err);
    return;
  }
  console.log('Conexión a MySQL establecida');
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor RESTIC funcionando en Windows');
});

// Ruta para recibir comandas
app.post('/comandas', (req, res) => {
  const { mesa, platos } = req.body;

  const sql = 'INSERT INTO comandas (mesa, platos) VALUES (?, ?)';
  db.query(sql, [mesa, JSON.stringify(platos)], (err, result) => {
    if (err) {
      console.error('Error al guardar comanda:', err);
      return res.status(500).json({ status: 'ERROR', mensaje: 'No se pudo guardar la comanda' });
    }

    console.log('📥 Comanda guardada:', req.body);
    res.json({ status: 'OK', mensaje: 'Comanda recibida y guardada correctamente' });
  });
});

// Ruta para obtener todas las comandas
app.get('/comandas', (req, res) => {
  const sql = 'SELECT * FROM comandas ORDER BY fecha DESC';
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener comandas:', err);
      return res.status(500).json({ status: 'ERROR', mensaje: 'No se pudieron obtener las comandas' });
    }

    // Parseamos los platos de JSON string a array
    const comandas = results.map(c => ({
      ...c,
      platos: JSON.parse(c.platos)
    }));

    res.json({ status: 'OK', comandas });
  });
});

// Actualizar una comanda
app.put('/comandas/:id', (req, res) => {
  const { id } = req.params;
  const { mesa, platos } = req.body;

  const sql = 'UPDATE comandas SET mesa = ?, platos = ? WHERE id = ?';
  db.query(sql, [mesa, JSON.stringify(platos), id], (err, result) => {
    if (err) {
      console.error('❌ Error al actualizar comanda:', err);
      return res.status(500).json({ status: 'ERROR', mensaje: 'No se pudo actualizar la comanda' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: 'ERROR', mensaje: 'Comanda no encontrada' });
    }

    res.json({ status: 'OK', mensaje: 'Comanda actualizada correctamente' });
  });
});

// Eliminar comandas
app.delete('/comandas/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM comandas WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar comanda:', err);
      return res.status(500).json({ status: 'ERROR', mensaje: 'No se pudo eliminar la comanda' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: 'ERROR', mensaje: 'Comanda no encontrada' });
    }

    res.json({ status: 'OK', mensaje: 'Comanda eliminada correctamente' });
  });
});

// Editar una comanda

app.put('/comandas/:id', (req, res) => {
  const { id } = req.params;
  const { mesa, platos } = req.body;

  const sql = 'UPDATE comandas SET mesa = ?, platos = ? WHERE id = ?' ;
  db.query(sql, [mesa, stringify.JSON(platos), id], (err, result) => {

    if (err) {
      console.error('La comanda no se ha podido actualizar correctamente', err); 
      return res.status(500).json({ status: 'ERROR', mensaje: 'No se pudo actualizar la comanda' });
    }
    
    if(result.affectedRows === 0 ) {
      return res.status(404).json({ status: 'ERROR', mensaje: 'Comanda no encontrada' });
    }

    res.json({status: 'OK', mensaje: 'Comanda actualizada correctamente'});

  });
});


// Iniciar el servidor
app.listen(port, () => {
  console.log(` Servidor RESTIC activo en http://localhost:${port}`);
});
