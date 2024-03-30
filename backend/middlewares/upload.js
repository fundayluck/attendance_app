const multer = require("multer");
const path = require("path");

// Multer config
module.exports = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'upload')
        },
        filename: (req, file, cb) => {
            cb(null, new Date().getTime() + '-' + file.originalname)
        },
    }),
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname);

        cb(null, true);
    },
    limits: { fieldSize: 25 * 1024 * 1024 }
});