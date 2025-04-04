const express = require('express');
const bodyParser = require('body-parser');
require('./src/configs/db.configs');
const usuariosRouter = require('./src/routes/clientes.router');
const adminRouter = require('./src/routes/admin.router');
const authRouter = require('./src/routes/auth.cliente.route');
const app = express();
const cors = require("cors");
const admin = require('firebase-admin');

const serviceFirebase = require('./gastrotech-c750c-firebase-adminsdk-fbsvc-872783264b.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceFirebase),
});

app.use(cors({ origin: "*" }));
app.use(express.json());




app.use(cors());
app.use(bodyParser.json());
app.use('/', usuariosRouter);
app.use('/auth', authRouter);
app.use('/admin', adminRouter);

const PORT = process.env.DB_PORT;

app.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT}`);
});