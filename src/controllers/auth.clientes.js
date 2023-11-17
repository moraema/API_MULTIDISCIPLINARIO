const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../configs/db.configs');
const jwtSecret = process.env.JWT_SECRET;

const loginCliente = async(req, res) => {

    const { correo, contraseña } = req.body;

    try {
        db.query('SELECT id_cliente, contraseña FROM clientes WHERE correo = ?', [correo], (error, results) => {
            if (error) {
                console.log('error al realizar la consulta:', error);

                res.status(500).json({
                    message: 'hubo un error al realizar la consulta'
                });
            } else {
                if (results.length > 0) {
                    const storedPassword = results[0].contraseña;


                    bcrypt.compare(contraseña, storedPassword, (err, bcryptResult) => {
                        if (err) {
                            console.log('error al comparar las contraseñas', err);

                            res.status(500).json({
                                message: 'hubo un erro al comparar las contraseñas'
                            });
                        } else {
                            if (bcryptResult) {
                                const accountId = results[0].id_cliente;

                                const payload = {
                                    cliente: {
                                        id: accountId
                                    }
                                };

                                const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });

                                res.status(200).json({
                                    message: 'inicio de sesion exitoso',
                                    token
                                });
                            } else {
                                res.status(401).json({
                                    message: 'usuario y/o contraseñas incorrecto'
                                });
                            }
                        }
                    });
                } else {
                    res.status(401).json({
                        message: 'usuario y/o contraseñas incorrecto'
                    });
                }
            }
        });
    } catch (error) {
        console.log('hubo un error en el servidor', error);
        res.status(500).json({
            message: 'hubo un error en el servidor'
        })
    }

}

module.exports = {
    loginCliente
}