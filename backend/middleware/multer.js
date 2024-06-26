const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

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

module.exports.optimizeImage = async (req, res, next) => {
    if (!req.file) return next();

    const filePath = req.file.path;
    const fileName = req.file.filename;
    const pathOldFile = './images/' + fileName;

    const outputFile = path.posix.join('images', 'optimized_' + fileName);
    let isResized = false;
    sharp.cache(false);
    await sharp(filePath)
        .resize({
            width: 405,
            height: 568,
        })
        .toFile(outputFile)
        .then(() => {
            fs.unlink(pathOldFile, (err) => {
                if (!err) {
                    req.file.path =
                        req.protocol +
                        '://' +
                        req.get('host') +
                        '/' +
                        outputFile;
                    next();
                } else {
                    return res.status(500).json({ err });
                }
            });
        });
};
