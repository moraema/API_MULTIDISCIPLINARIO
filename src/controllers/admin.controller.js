const db = require('../configs/db.configs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltosBcrypt = parseInt(process.env.SALTOS_BCRYPT);
const { cloudinary } = require('../service/cloudinary/cloud.service');



const getPedidos = async (req, res) => {
    try {
        const adminId = req.cliente.id;
        const ventas = await new Promise((resolve, reject) => {
            db.query(`
                SELECT 
                    c.nombre AS cliente_nombre, 
                    c.apellido AS cliente_apellido, 
                    c.teléfono AS cliente_teléfono,
                    p.id_pedido, 
                    p.pedido_fecha, 
                    p.total, 
                    p.detalle_pedido
                FROM 
                    pedidos p
                JOIN 
                    clientes c ON p.id_cliente = c.id_cliente
                WHERE 
                    p.id_administrador = ?`, 
                [adminId], 
                (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
        });

        res.status(200).json({
            message: 'Se obtuvieron las ventas correctamente',
            data: ventas
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Ocurrió un error al obtener las ventas',
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

const CreateAdmin = async(req, res) => {
    try {
       const {usuario, contraseña} = req.body;

       const hasedPassword = await bcrypt.hash(contraseña, saltosBcrypt);

       const queryAdmin = 'INSERT INTO administradores (usuario, contraseña) VALUES (?, ?)';
       db.query(queryAdmin, [usuario, hasedPassword], (error, result) => {
        if (error) {
            res.status(500).json({
                message: 'Hubo un error al insertar los datos del administrador',
                error: error.message
            });
        } else {
            res.status(200).json({
                message: "Los datos se insertaron correctamente en administradores",
                status: "success",
                data: result
            });
        }
    });
    } catch (error) {
        res.status(500).json({
            message: 'Hubo un error al crear el cliente',
            error: error.message
        });
    }
}


const UpdateProductStatus = async (req, res) => {
    try {
      const { productId } = req.params; // Obtener el ID del producto desde los parámetros de la URL
      const { deleted } = req.body; // Obtener el nuevo estado desde el cuerpo de la solicitud
  
      if (deleted === undefined) {
        return res.status(400).json({
          message: 'El estado del producto (deleted) debe ser proporcionado.',
        });
      }
  
      // Query para actualizar el estado del producto
      const queryUpdate = 'UPDATE productos SET deleted = ?, updated_at = NOW() WHERE id_producto = ?';
      
      db.query(queryUpdate, [deleted, productId], (updateError, updateResult) => {
        if (updateError) {
          return res.status(500).json({
            message: 'Hubo un error al actualizar el estado del producto',
            error: updateError.message,
          });
        }
  
        return res.status(200).json({
          message: `Producto ${deleted === 1 ? 'activado' : 'desactivado'} correctamente.`,
          status: 'success',
          data: updateResult,
        });
      });
    } catch (error) {
      res.status(500).json({
        message: 'Hubo un error al cambiar el estado del producto',
        error: error.message,
      });
    }
  };
  

const getProductosByCreator = async (req, res) => {
    try {
        const creatorId = req.cliente.id; 

        const productos = await new Promise((resolve, reject) => {
            db.query(`
                SELECT 
                    p.id_producto, 
                    p.nombre_producto, 
                    p.precio, 
                    p.descripcion, 
                    p.imagen, 
                    p.categoria, 
                    p.created_at,
                    p.deleted
                FROM 
                    productos p
                WHERE 
                    p.created_by = ?`, 
                [creatorId], 
                (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
        });

        res.status(200).json({
            message: 'Se obtuvieron los productos correctamente',
            data: productos 
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Ocurrió un error al obtener los productos',
            error: error.message
        });
    }
};


const agregarProducto = async (req, res) => {

    const creatorId = req.cliente.id; 
    try {
        const { nombre_producto, precio, descripcion, imagen, categoria } = req.body;

        if (!nombre_producto || !precio || !descripcion || !categoria) {
            return res.status(400).json({
                message: 'Todos los campos son obligatorios'
            });
        }

        let imagenUrl;

        try {
            // Si el usuario proporciona una imagen, subirla a Cloudinary
            const imagenParaSubir = imagen || 'https://thumbs.dreamstime.com/b/sin-vector-de-icono-imagen-ning%C3%BAn-s%C3%ADmbolo-disponible-aislado-en-fondo-blanco-adecuado-para-elemento-interfaz-usuario-205805243.jpg'; // URL de la imagen por defecto

            const uploadResponse = await cloudinary.v2.uploader.upload(imagenParaSubir, {
                folder: 'gastroTech',
                format: "jpg"
            });

            imagenUrl = uploadResponse.secure_url; 
        } catch (uploadError) {
            return res.status(500).json({
                message: 'Error al subir la imagen a Cloudinary',
                error: uploadError.message
            });
        }

        const queryProducto = 'INSERT INTO productos (nombre_producto, precio, descripcion, imagen, categoria, created_by) VALUES (?, ?, ?, ?, ?, ?)';

        db.query(queryProducto, [nombre_producto, precio, descripcion, imagenUrl, categoria, creatorId], (error, result) => {
            if (error) {
                return res.status(500).json({
                    message: 'Hubo un error al insertar los datos del producto',
                    error: error.message
                });
            }
            res.status(200).json({
                message: "Los datos del producto se insertaron correctamente",
                status: "success",
                data: result
            });
        });

    } catch (error) {
        res.status(500).json({
            message: 'Hubo un error al agregar el producto',
            error: error.message
        });
    }
};


const UpdateProducto = async (req, res) => {
    try {
      const { productId } = req.params;
      const { nombre_producto, precio, descripcion, categoria } = req.body;

  
      const queryUpdate = `UPDATE productos SET nombre_producto = ?, precio = ?, descripcion = ?, categoria = ? WHERE id_producto = ?`;

      db.query(queryUpdate, [nombre_producto, precio, descripcion, categoria, productId], (updateError, updateResult) => {
        if (updateError) {
          return res.status(500).json({
            message: 'Hubo un error al actualizar el estado del producto',
            error: updateError.message,
          });
        }
  
      res.status(200).json({
        message: 'Producto actualizado correctamente',
        data: updateResult,
      });
    });
    } catch (error) {
      return res.status(500).json({
        message: 'Ocurrió un error al actualizar el producto',
        error: error.message,
      });
    }
  };
  
  



module.exports = {
    getPedidos,
    getVentaProduct,
    saveTransaction,
    deletePedido,
    CreateAdmin,
    getProductosByCreator,
    agregarProducto,
    UpdateProductStatus,
    UpdateProducto
}