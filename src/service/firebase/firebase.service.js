const admin = require('firebase-admin');

const sendNotificationByToken = async (token) => {
    try {
        const message = {
            notification: {
                title: `GASTRO-TECH`,
                 body: `Su pedido ya sea ha realizado, puede pasar a buscarlo`
            },
            token: token,
        };

        await admin.messaging().send(message);
        console.log("Notificación enviada correctamente al token");
    } catch (error) {
        console.error("Error al enviar la notificación:", error);
    }
}

module.exports = {
    sendNotificationByToken
}