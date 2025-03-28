const multer = require('multer');
const storage = multer.diskStorage({});


const uploadFile = multer({ storage: storage});

module.exports = {
    uploadFile
}