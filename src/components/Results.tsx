
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { CircleCheck, CircleX, Clock, AlertTriangle, Award, Send, DownloadCloud, Laptop, Code, BriefcaseBusiness, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RoundScore {
  round: string;
  score: number;
}

const Results = () => {
  const navigate = useNavigate();
  const [resumeData, setResumeData] = useState<any>(null);
  const [assessmentScore, setAssessmentScore] = useState<number>(0);
  const [interviewScore, setInterviewScore] = useState<number>(0);
  const [roundScores, setRoundScores] = useState<RoundScore[]>([]);
  const [isEmailSent, setIsEmailSent] = useState(false);
  
  useEffect(() => {
    // Load data from localStorage
    const resumeDataStr = localStorage.getItem('resumeData');
    const assessmentScoreStr = localStorage.getItem('assessmentScore');
    const interviewScoreStr = localStorage.getItem('interviewScore');
    const roundScoresStr = localStorage.getItem('roundScores');
    
    if (resumeDataStr) {
      setResumeData(JSON.parse(resumeDataStr));
    }
    
    if (assessmentScoreStr) {
      setAssessmentScore(parseInt(assessmentScoreStr, 10));
    }
    
    if (interviewScoreStr) {
      setInterviewScore(parseInt(interviewScoreStr, 10));
    }
    
    if (roundScoresStr) {
      setRoundScores(JSON.parse(roundScoresStr));
    } else {
      // Default round scores if not available
      setRoundScores([
        { round: "technical", score: interviewScoreStr ? parseInt(interviewScoreStr, 10) : 0 },
        { round: "coding", score: interviewScoreStr ? parseInt(interviewScoreStr, 10) : 0 },
        { round: "domain", score: interviewScoreStr ? parseInt(interviewScoreStr, 10) : 0 },
        { round: "hr", score: interviewScoreStr ? parseInt(interviewScoreStr, 10) : 0 },
      ]);
    }
  }, []);
  
  const getFeedback = (score: number) => {
    if (score >= 90) {
      return "Excellent";
    } else if (score >= 75) {
      return "Very Good";
    } else if (score >= 60) {
      return "Good";
    } else if (score >= 50) {
      return "Fair";
    } else {
      return "Needs Improvement";
    }
  };
  
  const getTechnicalFeedback = (score: number) => {
    if (score >= 90) {
      return "Demonstrated exceptional technical knowledge with clear, comprehensive explanations and relevant examples.";
    } else if (score >= 75) {
      return "Showed strong technical understanding with good examples, though there might be room for deeper insights.";
    } else if (score >= 60) {
      return "Displayed adequate technical knowledge but could provide more specific examples and clearer explanations.";
    } else if (score >= 50) {
      return "Demonstrated basic technical understanding but lacks depth in critical areas. More specific examples needed.";
    } else {
      return "Technical knowledge appears limited. Consider strengthening fundamental concepts and preparing specific examples.";
    }
  };
  
  const getCodingFeedback = (score: number) => {
    if (score >= 90) {
      return "Exceptional problem-solving skills with optimal solutions. Code is clean, efficient, and well-explained.";
    } else if (score >= 75) {
      return "Strong coding abilities with good solutions. Some optimizations could be made, but overall approach is solid.";
    } else if (score >= 60) {
      return "Adequate problem-solving with functional solutions, though efficiency and clarity could be improved.";
    } else if (score >= 50) {
      return "Basic coding skills demonstrated. Solutions work but lack optimization and clear explanation of approach.";
    } else {
      return "Coding skills need significant improvement. Review algorithms, data structures, and coding best practices.";
    }
  };
  
  const getDomainFeedback = (score: number) => {
    if (score >= 90) {
      return "Exceptional domain expertise with deep understanding of industry-specific concepts and practices.";
    } else if (score >= 75) {
      return "Strong domain knowledge with good real-world examples. Some areas could be explored in more depth.";
    } else if (score >= 60) {
      return "Adequate domain understanding but could demonstrate more specialized knowledge and specific applications.";
    } else if (score >= 50) {
      return "Basic domain knowledge demonstrated. Consider developing deeper expertise in key areas.";
    } else {
      return "Domain knowledge appears limited. Focus on building industry-specific knowledge and practical applications.";
    }
  };
  
  const getHrFeedback = (score: number) => {
    if (score >= 90) {
      return "Exceptional communication skills and cultural fit. Values align perfectly with our organization.";
    } else if (score >= 75) {
      return "Strong interpersonal skills and good alignment with our organizational values and culture.";
    } else if (score >= 60) {
      return "Adequate soft skills demonstrated. Some areas for growth in communication or alignment with our values.";
    } else if (score >= 50) {
      return "Basic soft skills displayed. Consider developing more effective communication and interpersonal abilities.";
    } else {
      return "Interpersonal skills need significant improvement. Focus on developing communication and professional presence.";
    }
  };
  
  const getOverallFeedback = () => {
    const totalScore = assessmentScore * 0.3 + interviewScore * 0.7;
    
    if (totalScore >= 85) {
      return "Congratulations! Your performance in both the technical assessment and interview rounds was exceptional. You've demonstrated excellent technical skills, problem-solving abilities, and cultural fit for our organization. We will contact you soon via email to discuss the next steps in our hiring process.";
    } else if (totalScore >= 70) {
      return "Well done! You've performed strongly across our assessment process. Your technical skills and interview responses show promising potential for the role. We will review your application alongside other candidates and contact you soon via email about next steps.";
    } else if (totalScore >= 60) {
      return "Thank you for completing our assessment process. You've shown good potential in several areas, though there may be some aspects where further development would be beneficial. We will consider your application and contact you via email about the outcome.";
    } else {
      return "Thank you for participating in our recruitment process. While we appreciate your interest, we believe there may be areas where more experience or skill development would be beneficial before joining our team. We encourage you to continue building your skills and consider applying again in the future.";
    }
  };
  
  const calculateFinalResult = () => {
    const totalScore = assessmentScore * 0.3 + interviewScore * 0.7;
    return totalScore >= 60 ? "Passed" : "Not Selected";
  };
  
  const handleSendEmail = () => {
    // Simulate sending email
    setTimeout(() => {
      setIsEmailSent(true);
      // Store in localStorage to remember the email was sent
      localStorage.setItem('resultEmailSent', 'true');
    }, 1500);
  };
  
  const renderRoundIcon = (roundId: string) => {
    switch (roundId) {
      case 'technical':
        return <Laptop className="h-5 w-5" />;
      case 'coding':
        return <Code className="h-5 w-5" />;
      case 'domain':
        return <BriefcaseBusiness className="h-5 w-5" />;
      case 'hr':
        return <GraduationCap className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };
  
  const getRoundName = (roundId: string) => {
    switch (roundId) {
      case 'technical':
        return 'Technical Round';
      case 'coding':
        return 'Coding Round';
      case 'domain':
        return 'Domain Round';
      case 'hr':
        return 'HR Round';
      default:
        return roundId;
    }
  };
  
  const getRoundFeedback = (roundId: string, score: number) => {
    switch (roundId) {
      case 'technical':
        return getTechnicalFeedback(score);
      case 'coding':
        return getCodingFeedback(score);
      case 'domain':
        return getDomainFeedback(score);
      case 'hr':
        return getHrFeedback(score);
      default:
        return '';
    }
  };
  
  if (!resumeData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  const finalResult = calculateFinalResult();
  
  return (
    <div className="container mx-auto max-w-5xl px-4 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">Your Assessment Results</h1>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto">
          Thank you for completing the assessment and interview process for the {resumeData.jobTitle} position at {resumeData.company}.
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Technical Assessment</CardTitle>
              <CardDescription>Your performance on the online assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 mb-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold">{assessmentScore}%</span>
                  </div>
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#eee"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={assessmentScore >= 60 ? "#4caf50" : "#ff5252"}
                      strokeWidth="3"
                      strokeDasharray={`${assessmentScore}, 100`}
                    />
                  </svg>
                </div>
                <p className="text-center text-sm">{getFeedback(assessmentScore)}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Interview Performance</CardTitle>
              <CardDescription>Your overall interview score</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 mb-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold">{interviewScore}%</span>
                  </div>
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#eee"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={interviewScore >= 60 ? "#4caf50" : "#ff5252"}
                      strokeWidth="3"
                      strokeDasharray={`${interviewScore}, 100`}
                    />
                  </svg>
                </div>
                <p className="text-center text-sm">{getFeedback(interviewScore)}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Final Result</CardTitle>
              <CardDescription>Overall assessment outcome</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 flex items-center justify-center mb-4">
                  {finalResult === "Passed" ? (
                    <CircleCheck className="h-20 w-20 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-20 w-20 text-amber-500" />
                  )}
                </div>
                <p className="text-center text-lg font-semibold">{finalResult}</p>
                {finalResult === "Passed" && (
                  <p className="text-center text-sm text-muted-foreground mt-2">
                    Congratulations! We'll contact you soon via email.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-8"
      >
        <Card>
          <CardHeader>
            <CardTitle>Interview Rounds Performance</CardTitle>
            <CardDescription>Detailed breakdown of your performance in each interview round</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                {roundScores.map((round) => (
                  <TabsTrigger key={round.round} value={round.round}>
                    {getRoundName(round.round)}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value="overview">
                <div className="space-y-4">
                  {roundScores.map((round) => (
                    <div key={round.round} className="flex items-center space-x-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        {renderRoundIcon(round.round)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">{getRoundName(round.round)}</span>
                          <span className="text-sm">{round.score}%</span>
                        </div>
                        <Progress value={round.score} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              {roundScores.map((round) => (
                <TabsContent key={round.round} value={round.round}>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className={`p-4 rounded-full ${round.score >= 70 ? 'bg-green-100' : round.score >= 50 ? 'bg-amber-100' : 'bg-red-100'}`}>
                        {renderRoundIcon(round.round)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{getRoundName(round.round)}</h3>
                        <p className="text-sm text-muted-foreground">Score: {round.score}%</p>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-slate-50">
                      <h4 className="font-medium mb-2">Feedback</h4>
                      <p>{getRoundFeedback(round.round, round.score)}</p>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-slate-50">
                      <h4 className="font-medium mb-2">Areas of Strength</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        {round.score >= 70 && (
                          <>
                            <li>Clear and comprehensive responses</li>
                            <li>Demonstrated in-depth knowledge</li>
                            <li>Provided relevant examples</li>
                          </>
                        )}
                        {round.score >= 50 && round.score < 70 && (
                          <>
                            <li>Adequate understanding of concepts</li>
                            <li>Provided some practical examples</li>
                            <li>Showed problem-solving potential</li>
                          </>
                        )}
                        {round.score < 50 && (
                          <>
                            <li>Showed enthusiasm and effort</li>
                            <li>Attempted to address all questions</li>
                            <li>Demonstrated some basic knowledge</li>
                          </>
                        )}
                      </ul>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-slate-50">
                      <h4 className="font-medium mb-2">Areas for Improvement</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        {round.score >= 70 && (
                          <>
                            <li>Could provide more concise responses</li>
                            <li>Consider exploring more diverse examples</li>
                            <li>Further develop specific technical skills</li>
                          </>
                        )}
                        {round.score >= 50 && round.score < 70 && (
                          <>
                            <li>Work on providing more detailed responses</li>
                            <li>Develop deeper understanding of core concepts</li>
                            <li>Practice explaining technical concepts clearly</li>
                          </>
                        )}
                        {round.score < 50 && (
                          <>
                            <li>Develop stronger fundamental knowledge</li>
                            <li>Practice structured problem-solving</li>
                            <li>Work on providing specific examples</li>
                            <li>Consider additional training or certifications</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Overall Feedback</CardTitle>
            <CardDescription>Summary of your performance and next steps</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-6">{getOverallFeedback()}</p>
            
            <div className="bg-slate-50 p-4 rounded-lg flex items-start space-x-4 mb-6">
              <div className="bg-blue-100 p-2 rounded-full shrink-0">
                <Award className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Key Takeaways</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Focus on continuous learning and skill development</li>
                  <li>Practice technical interviews with concrete examples</li>
                  <li>Build a portfolio showcasing your projects and abilities</li>
                  <li>Network with professionals in your field</li>
                </ul>
              </div>
            </div>
            
            {finalResult === "Passed" && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <h4 className="font-medium text-green-800 flex items-center mb-2">
                  <CircleCheck className="h-5 w-5 mr-2" />
                  Next Steps
                </h4>
                <p className="text-green-700 mb-4">
                  Congratulations on passing our assessment process! Our team will review your complete profile and results, and we will contact you soon via email with further details about the next steps in our hiring process.
                </p>
                
                <Button
                  onClick={handleSendEmail}
                  disabled={isEmailSent}
                  className="w-full sm:w-auto"
                >
                  {isEmailSent ? (
                    <>
                      Email Sent <CircleCheck className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Send Results to My Email <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            )}
            
            {finalResult !== "Passed" && (
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                <h4 className="font-medium text-amber-800 flex items-center mb-2">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Recommendations
                </h4>
                <p className="text-amber-700 mb-4">
                  While we appreciate your interest and effort, we believe there are areas where more experience or skill development would benefit you. We encourage you to continue building your skills and consider applying again in the future.
                </p>
                
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" className="flex items-center" onClick={() => navigate('/')}>
                    <DownloadCloud className="mr-2 h-4 w-4" /> Download Resources
                  </Button>
                  <Button
                    onClick={handleSendEmail}
                    disabled={isEmailSent}
                    variant="secondary"
                  >
                    {isEmailSent ? (
                      <>
                        Email Sent <CircleCheck className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Send Results to My Email <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => navigate('/')} className="w-full">
              Return to Home
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Results;
