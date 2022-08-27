const controller = require('../../controllers/agency.controller')

const express = require('express') 
const router = express.Router()

router.get('/numberOfStudent', controller.numberOfStudent)
router.get('/numberOfRequest', controller.numberOfRequest)
router.get('/numberOfRequestSuccess', controller.numberOfRequestSuccess)

module.exports = router
