import React, { useState, useRef } from 'react'
import { Sparkles, Briefcase, User, UploadCloud, Info } from 'lucide-react'
import "../styles/home.scss"
import { useInterview } from '../hooks/useInterview'
import { useNavigate } from 'react-router'

const Home = () => {
    const {loading, generateReport, reports } = useInterview()
    const [jobDescription, setJobDescription] = useState("") 
    const [selfDescription, setSelfDescription] = useState("") 
    const [resumeFile, setResumeFile] = useState(null)
    const resumeInputRef = useRef()

    const navigate = useNavigate()

    const handleResumeClick = () => {
        resumeInputRef.current?.click()
    }

    const handleResumeChange = (event) => {
        const file = event.target.files?.[0] ?? null
        setResumeFile(file)
    }

    const handleResumeDrop = (event) => {
        event.preventDefault()
        const file = event.dataTransfer?.files?.[0] ?? null
        if (file) {
            setResumeFile(file)
        }
    }

    const handleDragOver = (event) => {
        event.preventDefault()
    }

    async function handleGenerateReport(){
        const data = await generateReport({jobDescription, selfDescription, resumeFile})
        navigate(`/interview/${data._id}`)
    }

    if(loading){
        return(
            <main>
                <h1>Loading your interview plan..</h1>
            </main>
        )
    }

  return (
    <main className='home'>
        <header className="page-header">
            <div className="page-header__row">
                <div className="page-header__brand">
                    <span className="page-header__brand-icon">
                        <Sparkles size={16} strokeWidth={2.5} />
                    </span>
                    <span className="page-header__brand-name">PrepAI :</span>
                </div>

                <h1 className="page-header__title">
                    Create Your Custom{" "}
                    <span className="page-header__title-accent">Interview Plan</span>
                </h1>
            </div>

            <p className="page-header__subtitle">
                Let AI analyze the job requirements and your unique profile to build a winning strategy.
            </p>
        </header>

        <section className="plan-card">
            <div className="plan-card__body">
                <div className="interview-input-group">
                    <div className="left panel job-panel">
                        <div className="panel__header">
                            <h2 className="panel__title">
                                <Briefcase size={16} strokeWidth={2.5} />
                                Target Job Description
                            </h2>
                            <span className="badge badge--required">Required</span>
                        </div>

                        <div className="job-panel__field">
                            <textarea
                                onChange={(e) => {setJobDescription(e.target.value)}}
                                name="jobDescription"
                                id="jobDescription"
                                placeholder={"Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'"}
                            ></textarea>
                        </div>
                    </div>

                    <div className="plan-card__divider" aria-hidden="true">
                        <span className="plan-card__divider-dot" />
                    </div>

                    <div className="right panel profile-panel">
                        

                        <div className="input-group profile-panel__field">
                            <p className='profile-panel__label'>Resume <small className='highlight'>(Use Resume and self description together for better report generation)</small></p>

                            <div
                                className="upload-box"
                                onClick={handleResumeClick}
                                onDrop={handleResumeDrop}
                                onDragOver={handleDragOver}
                            >
                                <input
                                    ref={resumeInputRef}
                                    hidden
                                    type="file"
                                    name="resume"
                                    id="resume"
                                    accept='.pdf,.docx'
                                    onChange={handleResumeChange}
                                />

                                <div className="upload-box__icon">
                                    <UploadCloud size={22} strokeWidth={2} />
                                </div>

                                <p className="upload-box__title">Click to upload or drag &amp; drop</p>

                                <p className="upload-box__hint">PDF (Max 3MB)</p>
                                {resumeFile && (
                                    <p className="upload-box__selected-file">{resumeFile.name}</p>
                                )}
                            </div>
                        </div>

                        <div className="profile-panel__or">
                            <span>OR</span>
                        </div>

                        <div className="input-group profile-panel__field">
                            <label htmlFor="selfDescription">Self-Description</label>
                            <textarea
                                onChange={(e)=> {setSelfDescription(e.target.value)}}
                                name="selfDescription"
                                id="selfDescription"
                                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                            ></textarea>
                        </div>

                        <div className="notice">
                            <span className="notice__icon">
                                <Info size={13} strokeWidth={2.5} />
                            </span>
                            <p className="notice__text">
                                Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate a personalized plan.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="generate-bar">
                <button
                    onClick={handleGenerateReport} 
                 className='button primary-button'>
                    <Sparkles size={16} strokeWidth={2.5} />
                    Generate My Interview Strategy
                </button>
            </div>
        </section>

        {reports.length > 0 && (
            <section className='recent-reports'>
                <h2>My recent Interview Plans</h2>
                <ul className='reports-list' aria-label="Recent interview reports">
                    {
                        reports.map((report) => (
                            <li key={report._id} className='report-item' onClick={() => navigate(`/interview/${report._id}`)}>
                                <div className='report-card-top'>
                                    <div className='score-ring'>{report.matchScore ?? '--'}%</div>
                                </div>
                                <h3>{report.title || 'Untitled Position'}</h3>
                                <p className='report-meta'>Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                            </li>
                        ))
                    }   
                </ul>
            </section>
        )}

    </main>
  )
}

export default Home