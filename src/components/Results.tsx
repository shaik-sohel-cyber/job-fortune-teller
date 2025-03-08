
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Check, X, AlertTriangle, CheckCircle, Award, TrendingUp, BarChart, LineChart, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Results = () => {
  const [resumeScore, setResumeScore] = useState(0);
  const [assessmentScore, setAssessmentScore] = useState(0);
  const [interviewScore, setInterviewScore] = useState(0);
  const [roundScores, setRoundScores] = useState<number[]>([0, 0, 0, 0]);
  const [overallScore, setOverallScore] = useState(0);
  const [jobSuccess, setJobSuccess] = useState(0);
  const [strengths, setStrengths] = useState<string[]>([]);
  const [weaknesses, setWeaknesses] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [skillGaps, setSkillGaps] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [applicationStatus, setApplicationStatus] = useState("pending");
  const [showEmailSent, setShowEmailSent] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const resumeData = JSON.parse(localStorage.getItem('resumeData') || '{"jobTitle": "Software Developer", "company": "Tech Company"}');
  const selectedPackage = localStorage.getItem('selectedPackage') || 'entry';
  const userEmail = localStorage.getItem('userEmail') || '';
  
  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 70) return "Very Good";
    if (score >= 60) return "Good";
    if (score >= 50) return "Average";
    return "Needs Improvement";
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 70) return "text-green-500";
    if (score >= 60) return "text-blue-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };
  
  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-600";
    if (score >= 70) return "bg-green-500";
    if (score >= 60) return "bg-blue-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Generate strengths based on job title and package level
  const generateJobSpecificStrengths = (jobTitle: string, packageLevel: string) => {
    const commonStrengths = [
      "Clear and effective communication during interview",
      "Positive attitude and enthusiasm for the role",
      "Well-structured resume with relevant experience",
      "Demonstrated leadership and teamwork abilities"
    ];

    const technicalStrengths: {[key: string]: {[key: string]: string[]}} = {
      "Software Engineer": {
        "entry": [
          "Good understanding of basic programming concepts",
          "Familiarity with software development lifecycle",
          "Eagerness to learn new technologies",
          "Solid foundation in computer science principles"
        ],
        "mid": [
          "Strong problem-solving approaches demonstrated in assessment",
          "Experience with multiple programming languages and frameworks",
          "Ability to design maintainable and scalable solutions",
          "Good understanding of software architecture concepts"
        ],
        "senior": [
          "Extensive experience with complex system architecture",
          "Strong leadership skills and mentoring abilities",
          "Strategic thinking and technical vision",
          "Deep expertise in multiple technical domains"
        ]
      },
      "Frontend Developer": {
        "entry": [
          "Understanding of HTML, CSS, and JavaScript fundamentals",
          "Familiarity with responsive design principles",
          "Basic knowledge of frontend frameworks",
          "Attention to visual details"
        ],
        "mid": [
          "Strong expertise in modern frontend frameworks",
          "Good understanding of performance optimization",
          "Experience with state management solutions",
          "Knowledge of accessibility standards"
        ],
        "senior": [
          "Advanced understanding of frontend architecture",
          "Experience building and maintaining component libraries",
          "Strong focus on performance and user experience",
          "Deep knowledge of browser rendering and optimization"
        ]
      },
      "Data Scientist": {
        "entry": [
          "Solid foundation in statistics and probability",
          "Familiarity with data analysis tools and libraries",
          "Basic understanding of machine learning concepts",
          "Good data visualization skills"
        ],
        "mid": [
          "Strong analytical and problem-solving skills",
          "Experience with various machine learning algorithms",
          "Proficiency in data cleaning and feature engineering",
          "Ability to communicate complex findings effectively"
        ],
        "senior": [
          "Deep expertise in advanced machine learning techniques",
          "Experience building end-to-end data science pipelines",
          "Strategic thinking about data architecture",
          "Ability to translate business problems into data science solutions"
        ]
      }
    };

    // Determine job category
    const jobCategory = Object.keys(technicalStrengths).find(key => 
      jobTitle.toLowerCase().includes(key.toLowerCase())
    ) || "Software Engineer";

    // Get package-specific strengths
    const jobSpecificStrengths = technicalStrengths[jobCategory][packageLevel] || 
                               technicalStrengths[jobCategory]["mid"];

    return [...commonStrengths, ...jobSpecificStrengths];
  };

  // Generate weaknesses based on job title and package level
  const generateJobSpecificWeaknesses = (jobTitle: string, packageLevel: string) => {
    const commonWeaknesses = [
      "Responses could be more concise and structured",
      "Limited examples of problem-solving experiences",
      "Resume could highlight achievements more effectively"
    ];

    const technicalWeaknesses: {[key: string]: {[key: string]: string[]}} = {
      "Software Engineer": {
        "entry": [
          "Limited practical experience with industry tools",
          "Knowledge gaps in software design patterns",
          "Need more exposure to collaborative development workflows",
          "Testing and debugging skills need improvement"
        ],
        "mid": [
          "System architecture knowledge could be stronger",
          "Limited experience with performance optimization",
          "Team leadership skills need development",
          "Could improve on technical documentation practices"
        ],
        "senior": [
          "Strategic technical vision needs refinement",
          "Could improve approach to managing technical debt",
          "Experience with enterprise-scale systems is limited",
          "Mentoring and team development skills could be enhanced"
        ]
      },
      "Frontend Developer": {
        "entry": [
          "Limited experience with modern JavaScript frameworks",
          "Basic understanding of CSS preprocessors",
          "Needs more practice with responsive design techniques",
          "Limited exposure to frontend testing methodologies"
        ],
        "mid": [
          "Performance optimization techniques need improvement",
          "Limited experience with complex state management",
          "Accessibility knowledge could be stronger",
          "Frontend security practices need enhancement"
        ],
        "senior": [
          "Enterprise-scale frontend architecture experience is limited",
          "Microfrontend knowledge needs development",
          "Could improve approach to frontend performance monitoring",
          "Team leadership in frontend contexts could be stronger"
        ]
      },
      "Data Scientist": {
        "entry": [
          "Limited experience with real-world datasets",
          "Statistical analysis skills need development",
          "Basic understanding of machine learning model evaluation",
          "Data visualization techniques could be improved"
        ],
        "mid": [
          "Experience with large-scale data processing is limited",
          "Model deployment knowledge needs improvement",
          "Feature engineering approaches could be more sophisticated",
          "Limited experience with deep learning frameworks"
        ],
        "senior": [
          "Enterprise data science strategy skills need development",
          "Limited experience leading data science teams",
          "Knowledge of cutting-edge ML research could be improved",
          "Experience with MLOps and production deployment is limited"
        ]
      }
    };

    // Determine job category
    const jobCategory = Object.keys(technicalWeaknesses).find(key => 
      jobTitle.toLowerCase().includes(key.toLowerCase())
    ) || "Software Engineer";

    // Get package-specific weaknesses
    const jobSpecificWeaknesses = technicalWeaknesses[jobCategory][packageLevel] || 
                                technicalWeaknesses[jobCategory]["mid"];

    return [...commonWeaknesses, ...jobSpecificWeaknesses];
  };

  // Generate recommendations based on job title and package level
  const generateJobSpecificRecommendations = (jobTitle: string, packageLevel: string, weaknesses: string[]) => {
    const commonRecommendations = [
      "Practice structured interview responses using the STAR method",
      "Revise your resume to highlight specific achievements with measurable metrics",
      "Develop more comprehensive examples of relevant experience for interviews"
    ];

    const technicalRecommendations: {[key: string]: {[key: string]: string[]}} = {
      "Software Engineer": {
        "entry": [
          "Build small personal projects to demonstrate practical coding skills",
          "Contribute to open-source projects to gain collaborative experience",
          "Take online courses in algorithms and data structures",
          "Practice coding challenges on platforms like LeetCode or HackerRank"
        ],
        "mid": [
          "Lead a small team project to develop leadership skills",
          "Study system design and architecture patterns",
          "Gain experience with cloud services and deployment pipelines",
          "Learn more about performance optimization techniques"
        ],
        "senior": [
          "Mentor junior developers to strengthen leadership abilities",
          "Study enterprise architecture patterns and anti-patterns",
          "Develop expertise in technical strategy and roadmapping",
          "Contribute to technical communities through articles or talks"
        ]
      },
      "Frontend Developer": {
        "entry": [
          "Build portfolio projects showing responsive design skills",
          "Practice with modern JavaScript frameworks like React",
          "Learn about browser rendering and performance",
          "Study CSS preprocessors and component libraries"
        ],
        "mid": [
          "Learn advanced state management techniques",
          "Study frontend performance optimization in depth",
          "Gain experience with frontend accessibility standards",
          "Practice building complex interactive UI components"
        ],
        "senior": [
          "Learn about micro-frontend architectures",
          "Study design systems and component library management",
          "Gain experience with frontend performance monitoring tools",
          "Lead frontend architecture decisions in collaborative projects"
        ]
      },
      "Data Scientist": {
        "entry": [
          "Work on Kaggle competitions to build practical skills",
          "Take courses in statistics and probability",
          "Practice data cleaning and preparation techniques",
          "Build a portfolio of data visualization projects"
        ],
        "mid": [
          "Implement and compare multiple ML algorithms on real datasets",
          "Learn about model deployment and MLOps",
          "Study advanced feature engineering techniques",
          "Gain experience with big data processing frameworks"
        ],
        "senior": [
          "Lead end-to-end data science projects",
          "Study data science team management techniques",
          "Follow latest research in machine learning",
          "Gain experience with enterprise data strategy"
        ]
      }
    };

    // Determine job category
    const jobCategory = Object.keys(technicalRecommendations).find(key => 
      jobTitle.toLowerCase().includes(key.toLowerCase())
    ) || "Software Engineer";

    // Get package-specific recommendations
    const jobSpecificRecommendations = technicalRecommendations[jobCategory][packageLevel] || 
                                     technicalRecommendations[jobCategory]["mid"];
                                     
    // Match recommendations to weaknesses if possible
    const matchedRecommendations = weaknesses.map(weakness => {
      if (weakness.includes("experience")) {
        return "Gain more hands-on experience through side projects or volunteering opportunities";
      }
      if (weakness.includes("leadership")) {
        return "Take on leadership roles in team projects or community activities";
      }
      if (weakness.includes("technical")) {
        return "Deepen technical knowledge through online courses and practical application";
      }
      return null;
    }).filter(Boolean) as string[];

    return [...commonRecommendations, ...jobSpecificRecommendations, ...matchedRecommendations].slice(0, 5);
  };
  
  // Generate skill gaps based on assessment score and job role
  const generateSkillGaps = (jobTitle: string, assessmentScore: number) => {
    const skillGapsByRole: {[key: string]: string[]} = {
      "Software Engineer": [
        "Algorithms and data structures",
        "System design principles",
        "Testing methodologies",
        "Performance optimization",
        "Design patterns"
      ],
      "Frontend Developer": [
        "JavaScript frameworks",
        "CSS preprocessors",
        "Responsive design",
        "Web accessibility",
        "Frontend performance optimization"
      ],
      "Data Scientist": [
        "Statistical analysis",
        "Machine learning algorithms",
        "Data visualization",
        "Feature engineering",
        "Big data processing"
      ]
    };
    
    // Determine job category
    const jobCategory = Object.keys(skillGapsByRole).find(key => 
      jobTitle.toLowerCase().includes(key.toLowerCase())
    ) || "Software Engineer";
    
    // Lower scores indicate more skill gaps
    const numberOfGaps = Math.max(1, Math.min(4, Math.floor((100 - assessmentScore) / 15)));
    const allPossibleGaps = skillGapsByRole[jobCategory];
    
    // Randomly select skill gaps based on assessment score
    return shuffleArray([...allPossibleGaps]).slice(0, numberOfGaps);
  };
  
  // Shuffle array helper function
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };
  
  useEffect(() => {
    if (!localStorage.getItem('interviewComplete')) {
      toast({
        title: "Interview not completed",
        description: "Please complete the interview process first.",
        variant: "destructive",
      });
      navigate('/interview');
      return;
    }
    
    setTimeout(() => {
      const verificationResults = JSON.parse(localStorage.getItem('verificationResults') || '{"verifiedItems": 4, "totalItems": 5}');
      const assessmentScoreVal = parseInt(localStorage.getItem('assessmentScore') || '75');
      const interviewScoreVal = parseInt(localStorage.getItem('interviewScore') || '0') || Math.floor(60 + Math.random() * 30);
      
      // Get round scores if available or generate them
      let roundScoresVal: number[] = [];
      try {
        roundScoresVal = JSON.parse(localStorage.getItem('interviewRoundScores') || '[]');
      } catch (e) {
        // Generate random round scores if not available
        roundScoresVal = [
          Math.floor(50 + Math.random() * 40),
          Math.floor(50 + Math.random() * 40),
          Math.floor(50 + Math.random() * 40),
          Math.floor(50 + Math.random() * 40)
        ];
      }
      
      // If roundScores is empty, generate them
      if (!roundScoresVal.length) {
        roundScoresVal = [
          Math.floor(50 + Math.random() * 40),
          Math.floor(50 + Math.random() * 40),
          Math.floor(50 + Math.random() * 40),
          Math.floor(50 + Math.random() * 40)
        ];
      }
      
      setRoundScores(roundScoresVal);
      
      const resumeScoreVal = Math.round((verificationResults.verifiedItems / verificationResults.totalItems) * 100);
      
      // Weight the scores based on job level
      const packageWeights = {
        'entry': { resume: 0.3, assessment: 0.3, interview: 0.4 },
        'mid': { resume: 0.25, assessment: 0.35, interview: 0.4 },
        'senior': { resume: 0.2, assessment: 0.4, interview: 0.4 }
      };
      
      const weights = packageWeights[selectedPackage as keyof typeof packageWeights] || packageWeights['mid'];
      
      const overall = Math.round(
        (resumeScoreVal * weights.resume) + 
        (assessmentScoreVal * weights.assessment) + 
        (interviewScoreVal * weights.interview)
      );
      
      // Calculate success probability with more variance for senior roles
      const packageVariance = selectedPackage === 'senior' ? 15 : (selectedPackage === 'mid' ? 10 : 5);
      const successProb = Math.min(95, Math.max(30, overall + (Math.random() * packageVariance - packageVariance/2)));
      
      setResumeScore(resumeScoreVal);
      setAssessmentScore(assessmentScoreVal);
      setInterviewScore(interviewScoreVal);
      setOverallScore(overall);
      setJobSuccess(Math.round(successProb));
      
      // Set application status based on job success probability
      if (successProb >= 70) {
        setApplicationStatus("success");
      } else if (successProb >= 50) {
        setApplicationStatus("review");
      } else {
        setApplicationStatus("rejected");
      }
      
      // Generate custom strengths, weaknesses, and recommendations based on job title and package
      const jobStrengths = generateJobSpecificStrengths(resumeData.jobTitle, selectedPackage);
      const jobWeaknesses = generateJobSpecificWeaknesses(resumeData.jobTitle, selectedPackage);
      
      // Number of strengths and weaknesses is proportional to the score
      const numStrengths = Math.max(2, Math.min(5, Math.floor(overall / 15)));
      const numWeaknesses = Math.max(2, Math.min(5, Math.floor((100 - overall) / 15)));
      
      const selectedStrengths = shuffleArray([...jobStrengths]).slice(0, numStrengths);
      const selectedWeaknesses = shuffleArray([...jobWeaknesses]).slice(0, numWeaknesses);
      
      // Generate recommendations based on weaknesses
      const jobRecommendations = generateJobSpecificRecommendations(
        resumeData.jobTitle, 
        selectedPackage,
        selectedWeaknesses
      );
      
      // Generate skill gaps based on assessment score
      const gaps = generateSkillGaps(resumeData.jobTitle, assessmentScoreVal);
      
      setStrengths(selectedStrengths);
      setWeaknesses(selectedWeaknesses);
      setRecommendations(jobRecommendations);
      setSkillGaps(gaps);
      
      setIsLoading(false);
    }, 2000);
  }, []);
  
  const downloadResults = () => {
    const resultsData = {
      candidateName: "Candidate",
      position: resumeData.jobTitle,
      company: resumeData.company,
      packageLevel: selectedPackage,
      date: new Date().toLocaleDateString(),
      scores: {
        resume: resumeScore,
        assessment: assessmentScore,
        interview: interviewScore,
        interviewRounds: roundScores,
        overall: overallScore,
        jobSuccess: jobSuccess
      },
      feedback: {
        strengths,
        areasForImprovement: weaknesses,
        skillGaps,
        recommendations
      }
    };
    
    const jsonString = JSON.stringify(resultsData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `job-prediction-results-${resumeData.company}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Results downloaded",
      description: "Your detailed results have been downloaded as a JSON file.",
    });
  };
  
  const restartProcess = () => {
    localStorage.removeItem('resumeData');
    localStorage.removeItem('verificationResults');
    localStorage.removeItem('assessmentScore');
    localStorage.removeItem('interviewComplete');
    localStorage.removeItem('interviewScore');
    localStorage.removeItem('interviewResponses');
    localStorage.removeItem('interviewRoundScores');
    localStorage.removeItem('selectedPackage');
    
    navigate('/');
  };

  const sendEmailNotification = () => {
    // Simulate sending email
    setShowEmailSent(true);
    
    toast({
      title: "Thank you for your application",
      description: `We'll contact you soon at ${userEmail || "your email address"} with further information.`,
    });
  };
  
  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center p-6">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Analyzing Your Performance</h3>
          <p className="text-gray-600">
            We're evaluating your resume, assessment, and interview responses...
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-4xl mx-auto p-6"
    >
      <div className="space-y-8">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Your Interview Results</h2>
            <Button variant="outline" onClick={restartProcess}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Start New Application
            </Button>
          </div>
          
          {applicationStatus === "success" && !showEmailSent && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6 shadow-sm"
            >
              <div className="flex items-start">
                <div className="bg-green-100 rounded-full p-2 mr-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-green-800 mb-1">Congratulations!</h3>
                  <p className="text-green-700 mb-4">
                    Based on your excellent performance in the interview process, we believe you would be a great fit for the {resumeData.jobTitle} position at {resumeData.company}. We'd like to discuss next steps with you.
                  </p>
                  <Button onClick={sendEmailNotification} className="bg-green-600 hover:bg-green-700">
                    <Mail className="mr-2 h-4 w-4" /> Get Notified by Email
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
          
          {applicationStatus === "review" && !showEmailSent && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6 shadow-sm"
            >
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-4">
                  <AlertTriangle className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-blue-800 mb-1">Application Under Review</h3>
                  <p className="text-blue-700 mb-4">
                    Thank you for completing the interview process. Your application for the {resumeData.jobTitle} position at {resumeData.company} is currently under review. We'll be in touch soon with an update.
                  </p>
                  <Button onClick={sendEmailNotification} className="bg-blue-600 hover:bg-blue-700">
                    <Mail className="mr-2 h-4 w-4" /> Get Notified by Email
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
          
          {applicationStatus === "rejected" && !showEmailSent && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-6 shadow-sm"
            >
              <div className="flex items-start">
                <div className="bg-orange-100 rounded-full p-2 mr-4">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-orange-800 mb-1">Thank You for Applying</h3>
                  <p className="text-orange-700 mb-4">
                    We appreciate your interest in the {resumeData.jobTitle} position at {resumeData.company}. While your profile has many strengths, we've identified some areas where additional experience would be beneficial. We encourage you to review our recommendations below.
                  </p>
                  <Button onClick={sendEmailNotification} variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">
                    <Mail className="mr-2 h-4 w-4" /> Get Feedback by Email
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
          
          {showEmailSent && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6 shadow-sm"
            >
              <div className="flex items-center">
                <div className="bg-green-100 rounded-full p-2 mr-4">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-green-800 mb-1">Email Notification Sent</h3>
                  <p className="text-green-700">
                    We'll contact you soon at {userEmail || "your email address"} with further information about your application.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Job Success Prediction</h3>
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              
              <div className="relative pt-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-xs font-semibold inline-block uppercase text-gray-600">
                      Probability of Success
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-semibold inline-block ${getScoreColor(jobSuccess)}`}>
                      {getScoreLabel(jobSuccess)}
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                  <div
                    style={{ width: `${jobSuccess}%` }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${getProgressColor(jobSuccess)}`}
                  ></div>
                </div>
                <div className="text-center">
                  <span className={`text-3xl font-bold ${getScoreColor(jobSuccess)}`}>
                    {jobSuccess}%
                  </span>
                  <p className="text-sm text-gray-500 mt-1">Chance of receiving a job offer</p>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-100">
                <h4 className="font-medium mb-2 text-gray-700">Application for:</h4>
                <p className="text-primary font-semibold">{resumeData.jobTitle}</p>
                <p className="text-sm text-gray-500">{resumeData.company}</p>
                <p className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">Package Level:</span>{" "}
                  <span className="capitalize">{selectedPackage}</span>
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Performance Breakdown</h3>
                <BarChart className="h-5 w-5 text-primary" />
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Resume Quality</span>
                    <span className={`text-sm ${getScoreColor(resumeScore)}`}>{resumeScore}%</span>
                  </div>
                  <Progress value={resumeScore} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Technical Assessment</span>
                    <span className={`text-sm ${getScoreColor(assessmentScore)}`}>{assessmentScore}%</span>
                  </div>
                  <Progress value={assessmentScore} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Interview Performance</span>
                    <span className={`text-sm ${getScoreColor(interviewScore)}`}>{interviewScore}%</span>
                  </div>
                  <Progress value={interviewScore} className="h-2" />
                </div>
                
                <div className="pt-2 mt-2 border-t border-gray-100">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-700">Overall Score</span>
                    <span className={`text-sm font-semibold ${getScoreColor(overallScore)}`}>{overallScore}%</span>
                  </div>
                  <Progress value={overallScore} className={`h-3 ${getProgressColor(overallScore)}`} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 mb-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Interview Round Performance</h3>
            <div className="space-y-4">
              {roundScores.map((score, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      Round {index + 1}: 
                      {index === 0 ? " Technical Interview" : 
                       index === 1 ? " Coding Assessment" :
                       index === 2 ? " Domain Knowledge" : " HR Discussion"}
                    </span>
                    <span className={`text-sm ${getScoreColor(score)}`}>{score}%</span>
                  </div>
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-gray-200">
                      <div
                        style={{ width: `${score}%` }}
                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${getProgressColor(score)}`}
                      ></div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    {score >= 80 ? "Outstanding performance in this round." :
                     score >= 70 ? "Very good performance with minor areas for improvement." :
                     score >= 60 ? "Good performance with some areas needing additional focus." :
                     score >= 50 ? "Average performance with several areas needing improvement." :
                     "This area needs significant improvement."}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center text-green-600 mb-4">
              <CheckCircle className="h-5 w-5 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Strengths</h3>
            </div>
            <ul className="space-y-3">
              {strengths.map((strength, index) => (
                <li key={index} className="flex">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span className="text-sm text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center text-red-600 mb-4">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Areas for Improvement</h3>
            </div>
            <ul className="space-y-3">
              {weaknesses.map((weakness, index) => (
                <li key={index} className="flex">
                  <X className="h-5 w-5 text-red-500 mr-2 shrink-0" />
                  <span className="text-sm text-gray-700">{weakness}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center text-blue-600 mb-4">
              <Award className="h-5 w-5 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Recommendations</h3>
            </div>
            <ul className="space-y-3">
              {recommendations.map((recommendation, index) => (
                <li key={index} className="flex">
                  <TrendingUp className="h-5 w-5 text-blue-500 mr-2 shrink-0" />
                  <span className="text-sm text-gray-700">{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-md border border-gray-100 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Assessment Analysis</h3>
            <LineChart className="h-5 w-5 text-primary" />
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2 text-gray-700">Technical Skills Analysis</h4>
              <p className="text-sm text-gray-700 mb-4">
                Based on your technical assessment score of {assessmentScore}%, we've identified the following areas where additional focus could improve your skills:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {skillGaps.map((skill, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <h5 className="text-sm font-medium text-gray-800 mb-1">{skill}</h5>
                    <p className="text-xs text-gray-500">
                      {assessmentScore < 65 ? "Needs significant improvement" : 
                       assessmentScore < 80 ? "Could use additional practice" : 
                       "Consider deepening your expertise"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-100">
              <h4 className="font-medium mb-2 text-gray-700">Next Steps for Growth</h4>
              <p className="text-sm text-gray-700">
                To improve your chances of success in future applications for {resumeData.jobTitle} positions:
              </p>
              <ul className="mt-2 space-y-2">
                <li className="text-sm flex items-start text-gray-700">
                  <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                  Focus on strengthening the skills identified in your assessment results
                </li>
                <li className="text-sm flex items-start text-gray-700">
                  <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                  Address the areas for improvement noted from your interview performance
                </li>
                <li className="text-sm flex items-start text-gray-700">
                  <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                  Update your resume to better highlight your achievements and relevant experience
                </li>
                <li className="text-sm flex items-start text-gray-700">
                  <Check className="h-4 w-4 text-primary mr-2 mt-0.5" />
                  Consider additional training or certification in your field
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center mt-8"
        >
          <Button 
            onClick={downloadResults} 
            size="lg"
            className="button-glow"
          >
            <Download className="mr-2 h-5 w-5" /> Download Detailed Results
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Results;
