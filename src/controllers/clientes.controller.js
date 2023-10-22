const db = require('../configs/db.configs');


const getAdmin = async(req, res) => {
    try {
        const results = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM administrador', (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        res.json({ message: 'Datos del administrador', data: results });
    } catch (error) {
        res.status(500).json({
            message: 'ocurrio un error al optener los datos',
            error: error.message
        });
    }
};


const getProduct = async(req, res) => {
    try {
        const results = await new Promise((resolve, reject) => {
            db.query('SELECT productos.*, categoria.categoria AS categoria FROM productos INNER JOIN categoria ON productos.categoria_id_categoria = categoria.id_categoria', (err, results) => {
                if (err) reject(err);
                else(resolve)(results);
            });
        });
        res.json({ message: 'Datos de  los productos :', data: results });
    } catch (error) {
        return res.status(500).json({
            message: 'ocurrio un error al obtener los productos',
            error: error.message
        });
    }
}


module.exports = {
    getAdmin,
    getProduct
}