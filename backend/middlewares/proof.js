const multer = require("multer");
const path = require("path");

// Multer config
module.exports = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'proof')
        },
        filename: (req, file, cb) => {
            cb(null, new Date().getTime() + '-' + file.originalname)
        },
        onFileUploadStart: function (file) {
            console.log("Inside uploads");
            if (file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
                return true;
            }
            else {
                return false;
            }
        },
        limits: { fieldSize: 25 * 1024 * 1024 }
    }),
});