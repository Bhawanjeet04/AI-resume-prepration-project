import { GoogleGenAI } from "@google/genai";
import * as z from "zod";


const ai = new GoogleGenAI({
    apiKey:  process.env.GEMINI_API_KEY
})

const interviewReportJSONSchema = {
  type: "object",
  properties: {
    matchScore: {
      type: "number",
      description:
        "A score between 0 and 100 indicating how well the candidate's profile matches the job description."
    },

    technicalQuestions: {
      type: "array",
      description:
        "Technical questions that may be asked in the interview along with their intention and suggested answers.",
      items: {
        type: "object",
        properties: {
          question: {
            type: "string",
            description: "A technical interview question."
          },
          intention: {
            type: "string",
            description:
              "The interviewer's intention behind asking this question."
          },
          answer: {
            type: "string",
            description:
              "How the candidate should answer the question, including important points and approach."
          }
        },
        required: ["question", "intention", "answer"],
        additionalProperties: false
      }
    },

    behaviouralQuestions: {
      type: "array",
      description:
        "Behavioral interview questions along with their intention and suggested answers.",
      items: {
        type: "object",
        properties: {
          question: {
            type: "string",
            description: "A behavioral interview question."
          },
          intention: {
            type: "string",
            description:
              "The interviewer's intention behind asking this question."
          },
          answer: {
            type: "string",
            description:
              "How the candidate should answer the question using relevant examples and experiences."
          }
        },
        required: ["question", "intention", "answer"],
        additionalProperties: false
      }
    },

    skillGaps: {
      type: "array",
      description:
        "List of skills that the candidate should improve, along with their severity.",
      items: {
        type: "object",
        properties: {
          skill: {
            type: "string",
            description: "The skill that the candidate is lacking."
          },
          severity: {
            type: "string",
            enum: ["low", "medium", "high"],
            description: "The severity of the skill gap."
          }
        },
        required: ["skill", "severity"],
        additionalProperties: false
      }
    },

    preparationPlan: {
      type: "array",
      description:
        "A day-wise preparation plan for the candidate based on the resume and job description.",
      items: {
        type: "object",
        properties: {
          day: {
            type: "number",
            description:
              "The day number in the preparation plan, starting from 1."
          },
          focus: {
            type: "string",
            description:
              "The primary topic to focus on for the day, such as Data Structures, System Design, Backend Development, Frontend Development, or Computer Science fundamentals."
          },
          tasks: {
            type: "array",
            description:
              "List of tasks to complete on that day.",
            items: {
              type: "string"
            }
          }
        },
        required: ["day", "focus", "tasks"],
        additionalProperties: false
      }
    }
  },

  required: [
    "matchScore",
    "technicalQuestions",
    "behaviouralQuestions",
    "skillGaps",
    "preparationPlan"
  ],

  additionalProperties: false
};

const interviewReportSchema = z.fromJSONSchema(interviewReportJSONSchema)



async function generateInterviewReport({resume,selfDescription,jobDescription}){

    const prompt = `Generate an interview report for a candidate with the following details :
                Resume : ${resume},
                Self Description : ${selfDescription},
                Job Description : ${jobDescription}`

    const response = await ai.interactions.create({
        model : "gemini-3-flash-preview",
        input : prompt,
        response_format : {
            type: 'text',
            mime_type : 'application/json',
            schema : interviewReportJSONSchema
        }
    })

    const parsed = JSON.parse(response.output_text);


    const result = interviewReportSchema.parse(parsed);


    return result;
}


export {generateInterviewReport}