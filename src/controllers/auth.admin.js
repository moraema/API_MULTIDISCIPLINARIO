const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../configs/db.configs');

const loginAdmin = async(req, res) => {
    const { usuario, contraseña } = req.body;

    try {
        db.query('SELECT id_administrador, contraseña FROM administrador WHERE usuario = ?', [usuario], (error, results) => {
            if (error) {
                console.log('error al realizar la consulta: ', error);

                res.status(500).json({
                    message: 'hubo un error añ realizar la consulta'
                });
            } else {
                if (results.length > 0) {
                    const storedPassword = results[0].contraseña;

                    bcrypt.compare(contraseña, storedPassword, (err, bcryptResult) => {
                        if (err) {
                            console.log('error al comparara las contraseñas: ', err);

                            res.status(500).json({
                                message: 'hubo un error al comparar las contraseñas'
                            });
                        } else {
                            if (bcryptResult) {
                                const accountId = results[0].id_administrador;


                                const payload = {
                                    cliente: {
                                        id: accountId
                                    }
                                }
                                const token = jwt.sign(payload, 'eternamente-siempre', { expiresIn: '1h' });

                                res.status(200).json({
                                    message: 'inicio de sesion exitoso',
                                    token
                                });
                            } else {
                                res.status(401).json({
                                    message: 'usuario y/o contraseñas incorrectos'
                                });
                            }
                        }
                    });
                } else {
                    res.status(200).json({
                        message: 'usuario y/o contraseñas incorrecto'
                    });
                }
            }
        });
    } catch (error) {
        console.log('hubo un error en el servidor: ', error);
        res.status(500).json({
            message: 'hubo un erro en el servidor'
        })
    }
}

module.exports = {
    loginAdmin
}