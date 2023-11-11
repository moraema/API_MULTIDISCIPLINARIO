const db = require('../configs/db.configs');


const getPedidos = async(req, res) => {
    try {
        const ventas = await new Promise((resolve, reject) => {
            db.query('SELECT p.id_pedido, p.detalle_pedido, p.total, p.pedido_fecha, p.id_clientes, p.id_metodo_pago, mp.metodo_pago, c.nombre, c.apellido, c.ubicacion, c.telefono FROM pedidos p JOIN clientes c ON p.id_clientes = c.id_clientes JOIN metodo_pago mp ON p.id_metodo_pago = mp.id_metodo_pago;', (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        res.status(200).json({
            message: 'se obtuvieron las ventas correctamente',
            data: ventas
        });
    } catch (error) {
        return res.status(500).json({
            message: 'ocurrio un error al obtener las ventas',
            error: error.message
        });
    }
};


const insertVenta = async(req, res) => {
    try {

        const { detalles, subtotal, total, idCliente, idPago } = req.body;

        const queryVentas = 'INSERT INTO venta (detalles, subtotal, total, id_cliente, id_metodo_pago) VALUES (?, ?, ?, ?, ?)';

        db.query(queryVentas, [detalles, subtotal, total, idCliente, idPago], (error, result) => {
            if (error) {
                res.status(500).json({
                    message: 'hubo un error al insertar las ventas',
                    error: error.message
                });
            } else {
                res.status(201).json({
                    message: 'se insertaron las ventas correctamente'
                });
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'hubo un error al insertar los datos',
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
                    p.id_productos,
                    p.nombre_producto,
                    p.precio,
                    SUM(vp.cantidad) as cantidad_total,
                    SUM(vp.cantidad * p.precio) as total_vendido
                FROM
                    productos p
                    JOIN ventas_productos vp ON p.id_productos = vp.id_productos
                GROUP BY
                    p.id_productos, p.nombre_producto, p.precio
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
                db.query('SELECT COUNT(DISTINCT p.id_productos) as total FROM productos p JOIN ventas_productos vp ON p.id_productos = vp.id_productos', (err, results) => {
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

        const result = await new Promise((resolve, reject) => {
            db.query('DELETE FROM pedidos WHERE id_pedido = ?', [pedidoId], (err, results) => {
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
            message: 'el pedido fue eliminado correctamente',
            deletePedidoId: pedidoId
        });
    } catch (error) {
        return res.status(500).json({
            message: 'hubo un error al eliminar el pedido',
            error: error.message
        });
    }
};



const productoVenta = async(req, res) => {
    try {
        const { cantidad, total, idproductos, idVentas } = req.body;

        const queryproductosVentas = 'INSERT INTO ventas_productos (cantidad, total, id_productos, id_ventas) VALUES (?, ?, ?, ?);';

        db.query(queryproductosVentas, [cantidad, total, idproductos, idVentas], (error, result) => {
            if (error) {
                res.status(500).json({
                    message: 'bubo un error al insertar los datos',
                    error: error.message
                });
            } else {
                res.status(201).json({
                    message: 'Se insertaro las ventas de productos correctamente'
                });
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'hubo un error al insertar los datos',
            error: error.message
        })
    }
};

module.exports = {
    getPedidos,
    getVentaProduct,
    insertVenta,
    deletePedido,
    productoVenta
}

// pendiente para componer la parte de las ventas y ventas del pructo para insertar en ventas y ventas_producto serian insert venta y producto venat
// la parte del get para mostrar las veentas y su cantida ya fue realizada y es getventaproduct