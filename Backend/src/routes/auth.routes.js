const {Router} = require('express')
const authController = require('../controllers/auth.controller')
const authMiddleware = require('../middlewares/auth.middleware')


const authRouter = Router()

/**
 * @route POST /api/auth/register
 * @description Registers a new user
 * @access Public
 */
authRouter.post('/register',authController.registerUserController)

/**
 * @route POST /api/auth/login
 * @description Logs in an existing user
 * @access Public
 */
authRouter.post('/login',authController.loginUserController)

/**
 * @route GET /api/auth/logout
 * @description clear cookie  from the user , and add token in the blacklist
 * @access Public
 */
authRouter.get('/logout',authController.logoutUserController)

/**
 * @route GET /api/auth/get-me
 * @description get the current loggedin user details
 * @access Private
 */
authRouter.get('/get-me',authMiddleware.authUser,authController.getMeController)

module.exports = authRouter