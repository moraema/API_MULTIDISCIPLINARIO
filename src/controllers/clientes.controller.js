const db = require('../configs/db.configs');


const getAdmin = (req, res) => {
    db.query('SELECT * FROM administrador', (err, results) => {
        if (err) {
            console.log("Error al optener los datos del administrador", err);
            res.status(500).json({ error: "Error al optener al administrador" });

        } else {
            res.json({ message: 'datos del administrador:', data: results });
        }
    });
}


const getProduct = (req, res) => {
    db.query('SELECT productos.*, categoria.categoria AS categoria FROM productos INNER JOIN categoria ON productos.categoria_id_categoria = categoria.id_categoria', (err, results) => {
        if (err) {
            console.log("Error al optener los productos", err);
            res.status(500).json({ error: "Error al optener los productos" });

        } else {
            res.json({ message: 'Productos:', data: results });
        }
    });
}





module.exports = {
    getAdmin,
    getProduct
}