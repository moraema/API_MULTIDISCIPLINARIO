const express = require('express');
const bodyParser = require('body-parser');
require('./src/configs/db.configs');
const usuariosRouter = require('./src/routes/clientes.router');

const app = express();

app.use(bodyParser.json());
app.use('/usuarios', usuariosRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT}`);
});