import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Check, X, AlertTriangle, CheckCircle, Award, TrendingUp, BarChart, LineChart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Results = () => {
  const [resumeScore, setResumeScore] = useState(0);
  const [assessmentScore, setAssessmentScore] = useState(0);
  const [interviewScore, setInterviewScore] = useState(0);
  const [overallScore, setOverallScore] = useState(0);
  const [jobSuccess, setJobSuccess] = useState(0);
  const [strengths, setStrengths] = useState<string[]>([]);
  const [weaknesses, setWeaknesses] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const resumeData = JSON.parse(localStorage.getItem('resumeData') || '{"jobTitle": "Software Developer", "company": "Tech Company"}');
  
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
      
      const resumeScoreVal = Math.round((verificationResults.verifiedItems / verificationResults.totalItems) * 100);
      
      const overall = Math.round((resumeScoreVal * 0.3) + (assessmentScoreVal * 0.3) + (interviewScoreVal * 0.4));
      
      const successProb = Math.min(95, Math.max(30, overall + (Math.random() * 10 - 5)));
      
      setResumeScore(resumeScoreVal);
      setAssessmentScore(assessmentScoreVal);
      setInterviewScore(interviewScoreVal);
      setOverallScore(overall);
      setJobSuccess(Math.round(successProb));
      
      const potentialStrengths = [
        "Strong technical knowledge demonstrated in assessment",
        "Clear and effective communication during interview",
        "Excellent problem-solving approach",
        "Well-structured resume with relevant experience",
        "Demonstrated leadership and teamwork abilities",
        "Ability to work under pressure and meet deadlines",
        "Strong analytical thinking skills",
        "Innovative approach to technical challenges",
        "Adaptability and willingness to learn"
      ];
      
      const potentialWeaknesses = [
        "Technical knowledge gaps in some areas",
        "Communication could be more concise and structured",
        "Problem-solving approach needs more depth",
        "Resume lacks some key relevant experiences",
        "Limited examples of leadership or initiative",
        "Time management during assessment could improve",
        "Answers lacked specific examples in some cases",
        "Limited experience with required technologies",
        "Could demonstrate more enthusiasm for the role"
      ];
      
      const potentialRecommendations = [
        "Focus on strengthening technical skills in areas identified during assessment",
        "Practice structured interview responses using the STAR method",
        "Highlight more specific achievements and metrics on your resume",
        "Consider obtaining certifications in relevant technologies",
        "Develop more in-depth examples of problem-solving experiences",
        "Work on communicating technical concepts more clearly",
        "Gain more experience with industry-standard tools and frameworks",
        "Prepare more specific questions about the company and role",
        "Demonstrate more initiative and leadership in your examples"
      ];
      
      const numStrengths = Math.max(1, Math.floor(overall / 20));
      const numWeaknesses = Math.max(1, Math.floor((100 - overall) / 20));
      
      const shuffleArray = (array: string[]) => array.sort(() => Math.random() - 0.5);
      
      setStrengths(shuffleArray([...potentialStrengths]).slice(0, numStrengths));
      setWeaknesses(shuffleArray([...potentialWeaknesses]).slice(0, numWeaknesses));
      setRecommendations(shuffleArray([...potentialRecommendations]).slice(0, 3));
      
      setIsLoading(false);
    }, 2000);
  }, []);
  
  const downloadResults = () => {
    const resultsData = {
      candidateName: "Candidate",
      position: resumeData.jobTitle,
      company: resumeData.company,
      date: new Date().toLocaleDateString(),
      scores: {
        resume: resumeScore,
        assessment: assessmentScore,
        interview: interviewScore,
        overall: overallScore,
        jobSuccess: jobSuccess
      },
      feedback: {
        strengths,
        areasForImprovement: weaknesses,
        recommendations
      }
    };
    
    const jsonString = JSON.stringify(resultsData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `job-prediction-results-${new Date().toISOString().split('T')[0]}.json`;
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
    
    navigate('/');
  };
  
  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center p-6">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
          <h3 className="text-xl font-semibold mb-2">Analyzing Your Performance</h3>
          <p className="text-muted-foreground">
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
            <h2 className="text-3xl font-bold">Your Interview Results</h2>
            <Button variant="outline" onClick={restartProcess}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Start New Application
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Job Success Prediction</h3>
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              
              <div className="relative pt-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-xs font-semibold inline-block uppercase">
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
              
              <div className="mt-6 pt-4 border-t">
                <h4 className="font-medium mb-2">Application for:</h4>
                <p className="text-primary font-semibold">{resumeData.jobTitle}</p>
                <p className="text-sm text-gray-500">{resumeData.company}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Performance Breakdown</h3>
                <BarChart className="h-5 w-5 text-primary" />
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Resume Quality</span>
                    <span className={`text-sm ${getScoreColor(resumeScore)}`}>{resumeScore}%</span>
                  </div>
                  <Progress value={resumeScore} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Technical Assessment</span>
                    <span className={`text-sm ${getScoreColor(assessmentScore)}`}>{assessmentScore}%</span>
                  </div>
                  <Progress value={assessmentScore} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Interview Performance</span>
                    <span className={`text-sm ${getScoreColor(interviewScore)}`}>{interviewScore}%</span>
                  </div>
                  <Progress value={interviewScore} className="h-2" />
                </div>
                
                <div className="pt-2 mt-2 border-t">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-semibold">Overall Score</span>
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
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center text-green-600 mb-4">
              <CheckCircle className="h-5 w-5 mr-2" />
              <h3 className="text-lg font-semibold">Strengths</h3>
            </div>
            <ul className="space-y-3">
              {strengths.map((strength, index) => (
                <li key={index} className="flex">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span className="text-sm">{strength}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center text-red-600 mb-4">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <h3 className="text-lg font-semibold">Areas for Improvement</h3>
            </div>
            <ul className="space-y-3">
              {weaknesses.map((weakness, index) => (
                <li key={index} className="flex">
                  <X className="h-5 w-5 text-red-500 mr-2 shrink-0" />
                  <span className="text-sm">{weakness}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center text-blue-600 mb-4">
              <Award className="h-5 w-5 mr-2" />
              <h3 className="text-lg font-semibold">Recommendations</h3>
            </div>
            <ul className="space-y-3">
              {recommendations.map((recommendation, index) => (
                <li key={index} className="flex">
                  <TrendingUp className="h-5 w-5 text-blue-500 mr-2 shrink-0" />
                  <span className="text-sm">{recommendation}</span>
                </li>
              ))}
            </ul>
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
