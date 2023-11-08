const db = require('../configs/db.configs');
const bcrypt = require('bcrypt');
const saltosBcrypt = parseInt(process.env.SALTOS_BCRYPT);



const getVenta = async(req, res) => {
    try {
        const ventas = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM ventas', (err, results) => {
                if (err) reject(err);
                else resolve(results);
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
}

const getVentaProduct = async(req, res) => {
    try {
        const { page, limit } = req.query;
        const offset = (page - 1) * limit;

        const VentasProduct = await new Promise((resolve, reject) => {
            db.query(`SELECT * FROM ventas_productos LIMIT ${limit} OFFSET ${offset}`, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        let response = {
            message: ' se obtuvieron correctamente los productos vendidos',
            data: VentasProduct
        };

        if (page && limit) {
            const totalVentasProduct = await new Promise((resolve, reject) => {
                db.query('SELECT COUNT(*) as total FROM ventas_productos', (err, results) => {
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
            }
        }

        res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message: 'ocurrion un error al obtener los productos vendidos',
            error: error.message
        })
    }
};


module.exports = {
    getVenta,
    getVentaProduct
}