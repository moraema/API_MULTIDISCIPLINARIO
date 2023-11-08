const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../configs/db.configs');

const login = async(req, res) => {
    try {
        const { correo, contraseña } = req.body;

        const query = `
        SELECT correo, contraseña
        FROM clientes
        WHERE correo = ? AND contraseña = ?
      `;

        db.query(query, [correo, contraseña], async(error, results) => {
            try {
                if (error) {
                    return res.status(500).json({
                        message: 'hubo un error al iniciar sesión',
                        error: error.message
                    });
                }
                if (results.length == 0) {
                    return res.status(400).json({
                        message: 'usuario o contraseña incorrectos'
                    });
                }

                const cliente = results[0];

                const contraseñaValida = bcrypt.compareSync(contraseña, cliente.contraseña);

                if (!contraseñaValida) {
                    return res.status(400).json({
                        message: 'usuario o contraseña incorrectos'
                    });
                }

                const payload = {
                    cliente: {
                        id: cliente.id,
                    },
                };

                const token = jwt.sign(payload, 'eternamente-siempre', { expiresIn: '1h' });
                res.json({ success: true, token });

            } catch (error) {
                res.status(500).json({
                    message: 'hubo un error al iniciar sesión',
                    error: error.message
                });
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'hubo un error al iniciar sesión',
            error: error.message
        });
    }
};


module.exports = {
    login
};