const db = require('../configs/db.configs');
const bcrypt = require('bcrypt');
const saltosBcrypt = parseInt(process.env.SALTOS_BCRYPT);
const Stripe = require("stripe");
const stripe = require('stripe')('sk_test_51NWAB9K41Y6guxcOOFoiCHcHl8aFYqRWNFAEn56uUitmybjSJvJfZdvoOnqc4NggtMa03cRjA0ZKCv718LJJPnrb00Gn0sMvkf');




const getProduct = async(req, res) => {
    try {
        const products = await new Promise((resolve, reject) => {
            db.query('SELECT productos.*, categorias.categoria AS categorias FROM productos INNER JOIN categorias ON productos.id_categoria = categorias.id_categoria', (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
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



const getCliente = async(req, res) => {
    try {

        const { id } = req.params;

        const Clientes = await new Promise((resolve, reject) => {
            db.query('SELECT id_clientes, nombre, apellido, ubicacion, telefono FROM clientes WHERE id_clientes = ?;', [id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results[0]);
                }
            });
        });

        if (!Clientes) {
            return res.status(404).json({
                message: "el cliente no fue encontrado"
            });
        }

        res.status(200).json({
            message: 'se obtuvieron los clientes correctamente',
            data: Clientes
        });
    } catch (error) {
        res.status(500).json({
            message: 'hubo un error al obtener a los usuarios',
            error: error.message
        })
    }
}


const updateubicacion = async(req, res) => {
    try {

        const { id } = req.params;
        const { ubicacion } = req.body;


        const queryCliente = 'UPDATE clientes SET ubicacion = ? WHERE id_clientes = ?;'

        const client = await new Promise((resolve, reject) => {
            db.query(queryCliente, [ubicacion, id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results.affectedRows);
                }
            });
        });

        if (client == 0) {
            return res.status(404).json({
                message: 'no se encontro al cliente a actualizar'
            });
        }

        res.status(200).json({
            message: 'el cliente fue actualizado correctamente',
            data: client
        })
    } catch (error) {
        res.status(500).json({
            message: 'hubo un error al actualizar el cliente',
            error: error.message
        })
    }
}


const CreatePedido = async(req, res) => {
    try {
        const { total, detallePedido, idCliente, idPago } = req.body;

        const queryPedido = 'INSERT INTO pedidos (total, detalle_pedido, id_clientes, id_metodo_pago) VALUES (?, ?, ?, ?)';

        db.query(queryPedido, [total, detallePedido, idCliente, idPago], (error, result) => {
            if (error) {
                res.status(500).json({
                    message: 'hubo un error al realizar el pedido',
                    error: error.message
                });
            } else {
                res.status(201).json({
                    message: 'el pedido fue realizado correctamente'
                });
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'hubo un error al realizar el pedido'
        })
    }
}

const pagos = async(req, res) => {
    try {
        const { amount, descripcion, pago, nombre } = req.body;


        const customer = await stripe.customers.create({
            name: nombre,

        });

        const amountInCents = pago.toLowerCase() === 'mxn' ? amount * 100 : amount;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: pago,
            description: descripcion,
            customer: customer.id,
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            customerId: customer.id, // Aquí obtienes el ID del cliente recién creado
        });
    } catch (error) {
        console.error('Error al crear el pago:', error);
        res.status(500).send('Error al crear el pago');
    }
};




module.exports = {
    getProduct,
    CreateClient,
    pagos,
    getCliente,
    updateubicacion,
    CreatePedido
}