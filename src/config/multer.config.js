const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `./uploads`)
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, Date.now()+'_'+req.query.studentId+'_'+file.originalname)
    }
})
const uploadStorage = multer({ storage: storage })

module.exports = uploadStorage