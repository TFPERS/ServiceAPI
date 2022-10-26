const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `./uploads`)
    },
    filename: (req, file, cb) => {
        console.log(file)
        // console.log(Buffer.from(file.originalname).toString('utf8'))
        cb(null, Date.now()+'_'+req.query.studentId+'_'+(file.originalname).split(" ").join(""))
    }
})
const uploadStorage = multer({ storage: storage })

module.exports = uploadStorage