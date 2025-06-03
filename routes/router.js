const express = require('express')
const userController = require('../controllers/userController')
const agentController = require('../controllers/agentController')
const jwtMiddleware = require('../middlewares/jwtMiddleware')
const multerMiddleware = require('../middlewares/multerMiddleware')
const router = new express.Router()
// login
router.post('/login',userController.loginController)
router.post('/add-agent',agentController.addAgentController)
router.post('/upload',jwtMiddleware,multerMiddleware.single('file'),agentController.addFileController)
module.exports = router