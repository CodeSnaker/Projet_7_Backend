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
    console.log(pathOldFile);

    const outputFile = path.join('images', 'optimized_' + fileName);
    console.log(outputFile);
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
                console.log(err);

                if (!err) {
                    req.file.path = outputFile;
                    next();
                } else {
                    return res.status(500).json({ err });
                }
            });
        });
};

// exports.uploadImage = upload.single('image');

// exports.compressAndSaveImage = async (req, res, next) => {
//     if (!req.file) return next();

//     const imageDir = 'images/';

//     fs.access(imageDir, (err) => {
//         if (err) fs.mkdirSync(imageDir);
//     });
//     const { buffer, originalName } = req.file;
//     console.log('Original Name: ' + originalName);

//     const timeStamp = Date.now();
//     const fileName = `${timeStamp}-${originalName}.webp`;
//     console.log('filename: ' + fileName);

//     await sharp(buffer)
//         .webp({ res: 20 })
//         .toFile(imageDir + fileName);

//     req.multer = {
//         imageUrl: imageDir + fileName,
//     };
//     // try {
//     //     const { buffer, originalName } = req.file;
//     //     const timeStamp = new Date().toISOString();
//     //     const fileName = `${timeStamp}-${originalName}.webp`;

//     //     await sharp(buffer)
//     //         .webp({ quality: 20 })
//     //         .toFile(imageDir + fileName);

//     //     req.multer = {
//     //         imageUrl: imageDir + fileName,
//     //     };
//     // } catch (err) {
//     //     res.status(500).json({ error });
//     // }

//     next();
// };
