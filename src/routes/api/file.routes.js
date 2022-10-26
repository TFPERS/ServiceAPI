const controller = require('../../controllers/file.controller')

const express = require('express') 
const router = express.Router()

router.get('/receivefilePdf/:filename', controller.getFile)

module.exports = router
