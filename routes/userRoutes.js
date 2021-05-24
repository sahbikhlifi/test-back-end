const express = require("express")
const router = express.Router()

// Load controllers
const { signupController, loginController, refreshToken } = require('../controllers/userControllers')

// Routes
router.post("/signup", signupController)
router.post("/login",loginController)
router.post("/refreshToken", refreshToken)

module.exports = router