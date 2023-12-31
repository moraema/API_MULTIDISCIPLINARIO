const db = require('../configs/db.configs');


const getPedidos = async(req, res) => {
    try {
        const ventas = await new Promise((resolve, reject) => {
            db.query(`SELECT 
                     p.id_pedido, 
                     p.detalle_pedido, 
                     p.total, 
                     p.pedido_fecha, 
                     p.id_cliente, 
                     p.id_metodo_pago, 
                     mp.metodo_pago, 
                     c.nombre, 
                     c.apellido, 
                     c.ubicación, 
                     c.teléfono
                     FROM pedidos p 
                     JOIN clientes c ON p.id_cliente = c.id_cliente
                     JOIN metodos_pagos mp ON p.id_metodo_pago = mp.id_metodo_pago 
                     WHERE p.deleted = 0
                     ORDER BY pedido_fecha ASC;`,
                (err, results) => {
                    if (err) {
                        reject(err);

                    } else {
                        resolve(results);
                    }
                });
        });

        res.status(200).json({
            message: 'se obtuvieron las ventas correctamente',
            initialData: ventas
        });
    } catch (error) {
        return res.status(500).json({
            message: 'ocurrio un error al obtener las ventas',
            error: error.message
        });
    }
};




const getVentaProduct = async(req, res) => {
    try {
        const { page, limit } = req.query;
        const offset = (page - 1) * limit;

        const VentasProduct = await new Promise((resolve, reject) => {
            db.query(`
                SELECT
                    p.id_producto,
                    p.nombre_producto,
                    p.precio,
                    SUM(vp.cantidad) as cantidad_total,
                    SUM(vp.cantidad * p.precio) as total_vendido
                FROM
                    productos p
                    JOIN ventas_productos vp ON p.id_producto = vp.id_producto
                GROUP BY
                    p.id_producto, p.nombre_producto, p.precio
                ORDER BY
                    cantidad_total DESC
                LIMIT ${limit} OFFSET ${offset}
            `, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        let response = {
            message: 'Se obtuvieron correctamente los productos vendidos',
            data: VentasProduct
        };

        if (page && limit) {
            const totalVentasProduct = await new Promise((resolve, reject) => {
                db.query('SELECT COUNT(DISTINCT p.id_producto) as total FROM productos p JOIN ventas_productos vp ON p.id_producto = vp.id_producto', (err, results) => {
                    if (err) reject(err);
                    else resolve(results[0].total);
                });
            });
            const totalpages = Math.ceil(totalVentasProduct / parseInt(limit));
            const currentPage = parseInt(page);
            response = {
                ...response,
                total: totalVentasProduct,
                totalpages,
                currentPage
            };
        }

        res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message: 'Ocurrió un error al obtener los productos vendidos',
            error: error.message
        });
    }
};



const deletePedido = async(req, res) => {
    try {
        const pedidoId = req.params.id;
        const clienteAutenticado = req.cliente.id;

        const result = await new Promise((resolve, reject) => {
            const currentTime = new Date();
            db.query('UPDATE pedidos SET deleted = 1, deleted_by = ?, deleted_at = ? WHERE id_pedido = ?', [clienteAutenticado, currentTime, pedidoId], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'No se encontró ningún pedido con el ID proporcionado'
            });
        }

        res.status(200).json({
            message: 'El pedido fue eliminado correctamente',
            deletePedidoId: pedidoId
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Hubo un error al eliminar  el pedido',
            error: error.message
        });
    }
};






const saveTransaction = async(req, res) => {
    try {
        const { subtotal, total, idCliente, idPago, productos } = req.body;
        const clienteAutenticado = req.cliente.id;

        await db.promise().beginTransaction();

        const queryVentas =
            'INSERT INTO ventas (subtotal, total, id_cliente, id_metodo_pago, created_by) VALUES (?, ?, ?, ?, ?)';
        const valuesVentas = [subtotal, total, idCliente, idPago, clienteAutenticado];
        const [ventasResult] = await db.promise().execute(queryVentas, valuesVentas);

        const idVentas = ventasResult.insertId;


        for (const producto of productos) {
            const { cantidad, totalProducto, idProducto } = producto;

            const queryProductosVentas =
                'INSERT INTO ventas_productos (cantidad, total, id_producto, id_venta, created_by) VALUES (?, ?, ?, ?, ?)';
            const valuesProductosVentas = [cantidad, totalProducto, idProducto, idVentas, clienteAutenticado];
            await db.promise().execute(queryProductosVentas, valuesProductosVentas);
        }

        await db.promise().commit();

        return res.status(200).json({
            message: 'Venta creada exitosamente',
            idVentas: idVentas,
        });
    } catch (error) {
        await db.promise().rollback();

        return res.status(500).json({
            message: 'Ocurrió un error al hacer la venta',
            error: error.message,
        });
    }
};


module.exports = {
    getPedidos,
    getVentaProduct,
    saveTransaction,
    deletePedido,

}