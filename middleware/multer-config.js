// import multer //
const multer = require('multer')

// create a dictionary of image extensions //
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}

// create a configuration object for multer and use diskStorage //
const storage = multer.diskStorage({
    // We indicate the destination to store the images //
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    // We indicate the file name to use //
    filename: (req, file, callback) => {
        // use the original name and replace the spaces with underscores //
        const name = file.originalname.split('').join('_')
        // We indicate the extension according to that of the original image //
        const extension = MIME_TYPES[file.mimetype]
        // name + timestamp + extension //
        callback(null, name + Date.now() + '.' + extension)
    }
})

// export middleware multer //
module.exports = multer({ storage }).single('image')