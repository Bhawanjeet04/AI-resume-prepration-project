const {Router} = require('express')
const authMiddleware = require('../middlewares/auth.middleware')
const upload = require('../middlewares/file.middleware')
const interviewController = require('../controllers/interview.controller')

const interviewRouter = Router()

/**
 * @route POST /api/interview
 * @description generate new interview report on the basis of user self description , resume pdf and job description
 * @access Private
 */
interviewRouter.post('/',authMiddleware.authUser,upload.single("resume"),interviewController.generateInterviewReportController)


module.exports = interviewRouter