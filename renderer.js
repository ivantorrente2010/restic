const { ipcRenderer } = require('electron');

// Enviar nueva comanda
document.getElementById('comanda-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const mesa = document.getElementById('mesa').value;
  const platos = document.getElementById('platos').value;

  ipcRenderer.send('nueva-comanda', { mesa, platos });
  e.target.reset();
});

// Recibir lista de comandas
ipcRenderer.on('lista-comandas', (event, comandas) => {
  const list = document.getElementById('comandas-list');
  list.innerHTML = '';
  comandas.forEach((cmd) => {
    const li = document.createElement('li');
    li.textContent = `${cmd.mesa} - ${cmd.platos}`;
    list.appendChild(li);
  });
});

// Pedir lista de comandas al cargar
window.onload = () => {
  ipcRenderer.send('cargar-comandas');
};
