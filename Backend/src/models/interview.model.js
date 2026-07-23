const mongoose = require('mongoose')


const technicalQuestionsSchema = new mongoose.Schema({
    question : {
        type : String,
        required : true
    },
    intention : {
        type : String,
        required : true
    },
    answer : {
        type : String,
        required : true
    }
},{
    _id : false
})

const behaviouralQuestionsSchema = new mongoose.Schema({
    question : {
        type : String,
        required : true
    },
    intention : {
        type : String,
        required : true
    },
    answer : {
        type : String,
        required : true
    }
},{
    _id : false
})

const skillGapsSchema = new mongoose.Schema({
    skill: {
        type : String,
        required : [true, "Skill is required"]
    },
    severity:{
        type : String,
        enum : ["low","medium","high"],
        required: [true, "severity is required"]
    }
},{
    _id : false
})

const preprationPlanSchema = new mongoose.Schema({
    day : {
        type : Number,
        required : [true, "day is required"]
    },
    focus : {
        type : String,
        required : [true, "focus is required"]
    },
    tasks: [{
        type : String,
        required : [true, "tasks is required"]
    }]
},{
    _id : false
})

const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type : String,
        required: true
    },
    resume : {
        type : String
    },
    selfDescription: {
        type: String
    },
    matchScore: {
        type : Number,
        min : 0,
        max: 100
    },
    technicalQuestions : [technicalQuestionsSchema],
    behaviouralQuestions : [behaviouralQuestionsSchema],
    skillGaps : [skillGapsSchema],
    preparationPlan : [preprationPlanSchema],
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users"
    },
    title : {
        type : String,
        required : [true, "Job Title is required"]
    }
},{
    timestamps : true
})

const interviewReportModel = mongoose.model("interviewReport", interviewReportSchema)

module.exports = interviewReportModel