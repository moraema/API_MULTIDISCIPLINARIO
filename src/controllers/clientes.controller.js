const db = require('../configs/db.configs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltosBcrypt = parseInt(process.env.SALTOS_BCRYPT);
const stripe = require('stripe')(process.env.SECRET_STRIPE);
const Pusher = require('pusher');
const { pusher } = require('../configs/pusher.config');




const getProduct = async(req, res) => {
    try {
        const products = await new Promise((resolve, reject) => {
            db.query(`
                SELECT 
                productos.id_producto,
                productos.nombre_producto,
                productos.precio,
                productos.descripcion,
                productos.imagen,
                categorias.categoria AS categorias,
                categorias.id_categoria
                FROM productos
                INNER JOIN categorias ON productos.id_categoria = categorias.id_categoria;`, (err, results) => {
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

        const queryCliente = 'INSERT INTO clientes (nombre, apellido, correo, contraseña, ubicación, teléfono) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(queryCliente, [nombre, apellido, correo, hashedPassword, ubicacion, telefono], (error, result) => {
            if (error) {
                res.status(500).json({
                    message: 'Hubo un error al insertar los datos del cliente',
                    error: error.message
                });
            } else {
                res.status(200).json({
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

        const clienteAutenticado = req.cliente.id;

        const Clientes = await new Promise((resolve, reject) => {
            db.query(`SELECT id_cliente, nombre, apellido, ubicación, correo, teléfono FROM clientes WHERE id_cliente = ?;`, [clienteAutenticado], (err, results) => {
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

        const clienteAutenticado = req.cliente.id;
        const { ubicacion } = req.body;


        const queryCliente = 'UPDATE clientes SET ubicación = ? WHERE id_cliente = ?;'

        const client = await new Promise((resolve, reject) => {
            db.query(queryCliente, [ubicacion, clienteAutenticado], (err, results) => {
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



const CreatePedidopusher = async(req, res) => {
    try {
        const clienteAutenticado = req.cliente.id;
        const { total, productos, idPago } = req.body;


        const detallePedido = JSON.stringify(productos);

        const queryPedido = 'INSERT INTO pedidos (total, detalle_pedido, id_cliente, id_metodo_pago) VALUES (?, ?, ?, ?)';

        db.query(queryPedido, [total, detallePedido, clienteAutenticado, idPago], (error, result) => {
            if (error) {
                res.status(500).json({
                    message: 'Hubo un error al realizar el pedido',
                    error: error.message
                });
            } else {

                const nuevoPedido = {
                    id: result.insertId,
                    total,
                    productos,
                    idPago,
                    id_cliente: clienteAutenticado,
                };

                pusher.trigger('canal-pedidos', 'nuevo-pedido', nuevoPedido);
                console.log('Pedido enviado a Pusher correctamente.');

                res.status(201).json({
                    message: 'El pedido fue realizado correctamente'
                });
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'Hubo un error al realizar el pedido',
            error: error.message
        });
    }
};

const pagos = async(req, res) => {
    try {
        const { amount, descripcion, pago } = req.body;

        const customer = await stripe.customers.create({

        });

        const amountInCents = pago.toLowerCase() === 'mxn' ? amount * 100 : amount;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: pago,
            description: descripcion,
            customer: customer.id,
        });

        res.json({
            message: 'El pago se efectuó con éxito',
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            customerId: customer.id,
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
    CreatePedidopusher
}