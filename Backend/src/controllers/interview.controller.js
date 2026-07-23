const pdfParse = require('pdf-parse')
const {generateInterviewReport} = require('../services/ai.service')
const interviewReportModel = require('../models/interview.model')
const mongoose = require('mongoose')



async function generateInterviewReportController(req,res){

    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()


    const {selfDescription, jobDescription} = req.body

    const response = await generateInterviewReport({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    })



    const interviewReport = await interviewReportModel.create({
        user : req.user.id,
        resume : resumeContent.text,
        selfDescription,
        jobDescription,
        ...response
    })

    res.status(201).json({
        message : "Interview report generated successfully",
        interviewReport
    })
}

async function getInterviewReportByIdController(req,res){
    let {interviewId} = req.params

    interviewId = interviewId && typeof interviewId === 'string' ? interviewId : String(interviewId)

    if(!mongoose.Types.ObjectId.isValid(interviewId)){
        return res.status(400).json({message: "Invalid interview id"})
    }

    const interviewReport = await interviewReportModel.findOne({_id : interviewId, user: req.user.id})

    if(!interviewReport){
        return res.status(404).json({
            message : "Interview Report not found"
        })
    }

    res.status(200).json({
        message : "Interview report fetched successfully",
        interviewReport
    })
}

async function getAllInterviewReportsController(req,res){
    const interviewReports = await interviewReportModel.find({user : req.user.id})
    .sort({createdAt : -1})
    .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behaviouralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message : "Interview Reports fetched successfully",
        interviewReports
    })
}

module.exports = {generateInterviewReportController, getInterviewReportByIdController, getAllInterviewReportsController}