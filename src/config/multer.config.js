const multer = require('multer')
const db = require('../models')
const Petition = db.petition
const FileDb = db.file
const path = require('path')
const fs = require('fs')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `./uploads`)
    },
    filename: (req, file, cb) => {
        cb(null, Date.now()+'_'+req.query.studentId+'_'+(file.originalname).split(" ").join(""))
    }
})
exports.uploadStorage = multer({ storage: storage })

const updateStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `./uploads`)
    },
    filename: async (req, file, cb) => {
        const { fileList, oldFiles } = JSON.parse(req.body.data)
        const petitionId = Number.parseInt(req.params.petitionId)
        for (let i =0; i < oldFiles.length; i++) {
            let remove = false
            if (oldFiles[i].name === fileList[0].name) {
            } else if (oldFiles[i].name === fileList[1].name) {
            } else {
                remove = true
            }

            if (remove) {
                FileDb.destroy({
                    where: { 
                        petitionId: petitionId,
                        name: oldFiles[i].name
                    }
                })
                try {
                    fs.unlinkSync(path.resolve('uploads',  oldFiles[i].name));
                    console.log("Delete File successfully.");
                  } catch (error) {
                    console.log(error);
                  }
            }
        }
            cb(null, Date.now()+'_'+req.query.studentId+'_'+(file.originalname).split(" ").join(""))
    }
})

exports.updateStorage = multer({ storage: updateStorage })
// module.exports = uploadStorage