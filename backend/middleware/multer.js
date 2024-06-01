const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');

// const MIME_TYPE = {
//     'image/jpg': 'jpg',
//     'image/jpeg': 'jpg',
//     'image/png': 'png',
//     'image/webp': 'webp',
// };

// const storage = multer.diskStorage({
//     destination: function (req, file, callback) {
//         callback(null, './images');
//     },
//     filename: (req, file, callback) => {
//         const fileName = file.originalname.split(' ').join('_');
//         const fileExtension = MIME_TYPE[file.mimetype];

//         callback(null, fileName + Date.now() + '.' + fileExtension);
//     },
// });

const storage = multer.memoryStorage(); //We need memoryStorage for the buffer
const upload = multer({ storage });

exports.uploadImage = upload.single('image');

exports.compressAndSaveImage = async (req, res, next) => {
    const imageDir = path.join(__dirname, '/images');

    fs.access(imageDir, (err) => {
        if (err) fs.mkdirSync(imageDir);
    });

    try {
        const { buffer, originalName } = req.file;
        const timeStamp = new Date().toISOString();
        const fileName = `${timeStamp}-${originalName}.webp`;

        await sharp(buffer)
            .webp({ quality: 20 })
            .toFile(imageDir + fileName);

        req.multer = {
            imageUrl: imageDir + fileName,
        };
    } catch (err) {
        res.status(500).json({ error });
    }

    next();
};
