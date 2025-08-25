
const express = require('express');
const { registerController, logincontroller , logoutController} = require('../controllers/auth.controllers');
const router = express.Router()



// auth.routes.js ka kaam hai batna ki kaun kaunsi API hongi , unke andar ka logic 
// auth.controller.js mai hoga


router.post('/register', registerController)
router.post("/login",logincontroller)
router.post('/logout',logoutController)








module.exports = router