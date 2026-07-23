import { getAllInterviewReports, generateInterviewReport, getInterviewReportById } from "../services/interview.api"
import { useContext, useEffect } from "react"
import { interviewContext } from "../interview.context"
import {useParams} from "react-router"


export const useInterview = () => {
    const context = useContext(interviewContext)
    const { interviewId } = useParams()

    if(!context){
        throw new Error("useInterview must be used within interviewProvider")
    }

    const {loading, setLoading , report , setReport, reports, setReports} = context

    const normalizeReport = (report) => {
        if (!report) return report
        if (report.behavioralQuestions == null && report.behaviouralQuestions != null) {
            return { ...report, behavioralQuestions: report.behaviouralQuestions }
        }
        return report
    }

    const generateReport = async({jobDescription, selfDescription, resumeFile}) => {
        setLoading(true)
        let response = null
        try{
            response = await generateInterviewReport({jobDescription,selfDescription,resumeFile})
            const normalized = normalizeReport(response.interviewReport)
            setReport(normalized)
            return normalized
        }catch(err){
            console.log(err)
        }
        finally{
            setLoading(false)
        }

        return response.interviewReport
    }

    const getReportById = async(interviewId)=> {
        setLoading(true)
        let response = null
        try{
            response = await getInterviewReportById(interviewId)
            const normalized = normalizeReport(response.interviewReport)
            setReport(normalized)
            return normalized
        }
        catch(err){
            console.log(err)
        }
        finally{
            setLoading(false)
        }
        
        return response.interviewReport
    }

    const getReportsById = async() => {
        setLoading(true)
        let response = null
        try{
            response = await getAllInterviewReports()
            setReports(response.interviewReports)
        }
        catch(err){
            console.log(err)
        }
        finally{
            setLoading(false)
        }

        return response.interviewReports
    }

    useEffect(()=> {
        if(interviewId)
            getReportById(interviewId)
        else
            getReportsById()
    },[interviewId])

    return {loading, report, reports, generateReport, getReportById, getReportsById }
}
