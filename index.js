const express = require('express');
const bodyParser = require('body-parser');
require('./src/configs/db.configs');
const usuariosRouter = require('./src/routes/clientes.router');
const adminRouter = require('./src/routes/admin.router');
const authRouter = require('./src/routes/auth.cliente.route');
const app = express();
const cors = require("cors");


app.use(cors({ origin: "http://localhost:5173" }));




app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    next();
});


app.use(cors());
app.use(bodyParser.json());
app.use('/', usuariosRouter);
app.use('/auth', authRouter);
app.use('/admin', adminRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT}`);
});