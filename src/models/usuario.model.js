const getProductQuery = 'SELECT productos.*, categoria.categoria AS categoria FROM productos INNER JOIN categoria ON productos.categoria_id_categoria = categoria.id_categoria';

module.exports = {
    getProductQuery
}


/*
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
*/