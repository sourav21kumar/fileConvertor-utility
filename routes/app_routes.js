const express = require('express');
const multer = require('multer')

const path = require('path')

const route_controller = require('../controller/route_controller')
const router = express.Router();

const strorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/files')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }

})
const upload = multer({
    storage: strorage,
    fileFilter: function (req, file, cb) {

        checkFileType(file, cb);
    }
})

function checkFileType(file, cb) {
    const fileType = /pdf/
    const extname = fileType.test(path.extname(file.originalname))
    if (extname) {
        return cb(null, true)
    }
    else {

        cb('Error:file format not allowed')
    }

}



router.get('/try', route_controller.get_Try)
router.post('/uploadPreview',upload.single('data'),route_controller.post_uploadPreview)
router.post('/upload', upload.single('data'), route_controller.post_upload)


module.exports = router;