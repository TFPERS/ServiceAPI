const { verifySignUp } = require('../../middlewares')
const controller = require('../../controllers/petition.controller')

const express = require('express') 
const router = express.Router()

router.post('/form', controller.petitionForm)
router.get('/', controller.petitionAll)
router.get('/me/:id', controller.petitionById)

module.exports = router
