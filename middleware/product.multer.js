const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
 
   cb(null, 'assets/product_uploads/');
  
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extname = path.extname(file.originalname);
    cb(null, uniqueSuffix + extname);
  }
});

const upload = multer({ storage: storage });

module.exports = upload;

