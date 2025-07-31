const mysql = require('mysql2');

// Configura los datos de tu base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',       // <- cambia esto
  password: 'root', // <- cambia esto
  database: 'restic'               // <- este es el nombre de la base de datos
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conectado a la base de datos MySQL');
  }
});

module.exports = connection;
