const express = require('express');
const bodyParser = require('body-parser');
require('./src/configs/db.configs');
const usuariosRouter = require('./src/routes/clientes.router');
const adminRouter = require('./src/routes/admin.router');
const authRouter = require('./src/routes/auth.cliente.route');
const app = express();

app.use(bodyParser.json());
app.use('/clientes', usuariosRouter);
app.use('/auth', authRouter);
app.use('/admin', adminRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT}`);
});