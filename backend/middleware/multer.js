const multer = require('multer');

const MIME_TYPE = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
};

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './images');
    },
    filename: (req, file, callback) => {
        const fileName = file.originalname.split(' ').join('_');
        const fileExtension = MIME_TYPE[file.mimetype];

        callback(null, fileName + Date.now() + '.' + fileExtension);
    },
});

module.exports = multer({ storage }).single('image');
