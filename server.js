const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Servir les fichiers statiques du dossier Afristock-main
app.use(express.static(path.join(__dirname, 'Afristock-main')));

// Pour toutes les autres routes, renvoyer le fichier login.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'Afristock-main', 'login.html'));
});

app.listen(port, () => {
  console.log(`Serveur frontend démarré sur http://localhost:${port}`);
});
