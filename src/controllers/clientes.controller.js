const db = require('../configs/db.configs');
const bcrypt = require('bcrypt');
const saltosBcrypt = parseInt(process.env.SALTOS_BCRYPT);
const Stripe = require("stripe");
const stripe = new Stripe("sk_test_51NWAB9K41Y6guxcOOFoiCHcHl8aFYqRWNFAEn56uUitmybjSJvJfZdvoOnqc4NggtMa03cRjA0ZKCv718LJJPnrb00Gn0sMvkf")






const getProduct = async(req, res) => {
    try {
        const products = await new Promise((resolve, reject) => {
            db.query('SELECT productos.*, categorias.categoria AS categorias FROM productos INNER JOIN categorias ON productos.id_categoria = categorias.id_categoria', (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        res.status(200).json({
            message: 'Se obtuvieron todos los productos correctamente:',
            data: products
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Ocurrió un error al obtener los productos',
            error: error.message
        });
    }
}



const CreateClient = async(req, res) => {
    try {
        const { nombre, apellido, correo, contraseña, ubicacion, telefono } = req.body;

        const hashedPassword = await bcrypt.hash(contraseña, saltosBcrypt);

        const queryCliente = 'INSERT INTO clientes (nombre, apellido, correo, contraseña, ubicacion, telefono) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(queryCliente, [nombre, apellido, correo, hashedPassword, ubicacion, telefono], (error, result) => {
            if (error) {
                res.status(500).json({
                    message: 'Hubo un error al insertar los datos del cliente',
                    error: error.message
                });
            } else {
                res.status(201).json({
                    message: "Los datos se insertaron correctamente en clientes"
                });
            }
        });

    } catch (error) {
        res.status(500).json({
            message: 'Hubo un error al insertar los datos',
            error: error.message,
        });
    }
};

const payments = async(req, res) => {
    const { id, amount, descripcion } = req.body;

    try {
        const payment = await stripe.paymentIntents.create({
            amount,
            currency: "MXN",
            description: descripcion,
            payment_method: id,
            confirm: true

        });

        console.log(payment);

        return res.status(200).json({
            message: 'el pago se efectu de manera correcta'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'hubo un error al realizar el pago',
            error: error.message
        })
    }
}


module.exports = {
    getProduct,
    CreateClient,
    payments
}