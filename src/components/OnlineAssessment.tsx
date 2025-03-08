import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Clock, CheckCircle2, AlertTriangle, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Question, getRelevantQuestions } from "@/utils/questionBank";

const getCompanyCutoffScore = (company: string, jobTitle: string, packageType: string): number => {
  const companyScores: { [key: string]: number } = {
    "Tech Company": 75,
    "Innovation Inc.": 80,
    "Global Solutions": 70,
    "Pioneer Corp": 85,
  };

  let baseScore = companyScores[company] || 70;

  if (packageType === "mid") {
    baseScore += 5;
  } else if (packageType === "premium") {
    baseScore += 10;
  }

  if (jobTitle.toLowerCase().includes("engineer")) {
    baseScore += 5;
  }

  return baseScore;
};

const OnlineAssessment = () => {
  const [technicalQuestions, setTechnicalQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600);
  const [isAssessmentComplete, setIsAssessmentComplete] = useState(false);
  const [cutoffScore, setCutoffScore] = useState(70);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [failureRedirectTimer, setFailureRedirectTimer] = useState(0);
  const [suggestedTopics, setSuggestedTopics] = useState<string[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const resumeData = JSON.parse(localStorage.getItem('resumeData') || '{"jobTitle": "Software Developer", "company": "Tech Company"}');
  const selectedPackage = localStorage.getItem('selectedPackage') || 'entry';

  useEffect(() => {
    const questions = getRelevantQuestions(resumeData.jobTitle, selectedPackage, 5);
    
    const previousQuestions = JSON.parse(sessionStorage.getItem('previousQuestions') || '[]');
    
    const filteredQuestions = questions.filter(q => 
      !previousQuestions.includes(q.id)
    );
    
    let finalQuestions = filteredQuestions;
    if (filteredQuestions.length < 5) {
      const questionsNeeded = 5 - filteredQuestions.length;
      const additionalQuestions = getRelevantQuestions(resumeData.jobTitle, selectedPackage, questionsNeeded * 2)
        .filter(q => !filteredQuestions.map(fq => fq.id).includes(q.id))
        .slice(0, questionsNeeded);
      
      finalQuestions = [...filteredQuestions, ...additionalQuestions];
    }
    
    sessionStorage.setItem(
      'previousQuestions', 
      JSON.stringify([...previousQuestions, ...finalQuestions.map(q => q.id)])
    );
    
    setTechnicalQuestions(finalQuestions);

    const companyCutoff = getCompanyCutoffScore(resumeData.company, resumeData.jobTitle, selectedPackage);
    setCutoffScore(companyCutoff);

    if (!localStorage.getItem('resumeData')) {
      toast({
        title: "Resume not uploaded",
        description: "Please upload your resume first.",
        variant: "destructive",
      });
      navigate('/upload');
      return;
    }

    if (!localStorage.getItem('selectedPackage')) {
      toast({
        title: "Package not selected",
        description: "Please select a package first.",
        variant: "destructive",
      });
      navigate('/package-selection');
      return;
    }
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  useEffect(() => {
    if (timeLeft > 0 && !isAssessmentComplete) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAssessmentComplete) {
      completeAssessment();
    }
  }, [timeLeft, isAssessmentComplete]);

  useEffect(() => {
    if (isAssessmentComplete && failureRedirectTimer > 0) {
      const timer = setTimeout(() => setFailureRedirectTimer(failureRedirectTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isAssessmentComplete && failureRedirectTimer === 0 && failureRedirectTimer !== null) {
      navigate('/');
    }
  }, [failureRedirectTimer, isAssessmentComplete, navigate]);

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const handleNextQuestion = () => {
    setAnsweredQuestions([...answeredQuestions, currentQuestion]);

    if (selectedOption === technicalQuestions[currentQuestion].correctAnswer) {
      const difficultyPoints = 
        technicalQuestions[currentQuestion].difficulty === "easy" ? 1 :
        technicalQuestions[currentQuestion].difficulty === "medium" ? 2 : 3;
      
      setScore(score + difficultyPoints);
    } else {
      const negativePoints = 
        technicalQuestions[currentQuestion].difficulty === "easy" ? 0.25 :
        technicalQuestions[currentQuestion].difficulty === "medium" ? 0.5 : 1;
      
      setScore(Math.max(0, score - negativePoints));
      setIncorrectAnswers(incorrectAnswers + 1);
    }

    if (currentQuestion < technicalQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      completeAssessment();
    }
  };

  const completeAssessment = () => {
    if (!isAssessmentComplete && selectedOption !== null && !answeredQuestions.includes(currentQuestion)) {
      if (selectedOption === technicalQuestions[currentQuestion].correctAnswer) {
        const difficultyPoints = 
          technicalQuestions[currentQuestion].difficulty === "easy" ? 1 :
          technicalQuestions[currentQuestion].difficulty === "medium" ? 2 : 3;
        
        setScore(score + difficultyPoints);
      } else {
        const negativePoints = 
          technicalQuestions[currentQuestion].difficulty === "easy" ? 0.25 :
          technicalQuestions[currentQuestion].difficulty === "medium" ? 0.5 : 1;
        
        setScore(Math.max(0, score - negativePoints));
        setIncorrectAnswers(incorrectAnswers + 1);
      }
    }

    setIsAssessmentComplete(true);

    const maxPossibleScore = technicalQuestions.reduce((total, q) => {
      return total + (q.difficulty === "easy" ? 1 : q.difficulty === "medium" ? 2 : 3);
    }, 0);

    const percentageScore = Math.round((score / maxPossibleScore) * 100);
    const isPassed = percentageScore >= cutoffScore;

    if (!isPassed) {
      setSuggestedTopics(generateImprovementTopics());
      setFailureRedirectTimer(60);

      const failedCompanies = JSON.parse(localStorage.getItem('failedCompanies') || '{}');
      const company = resumeData.company;

      const cooldownDate = new Date();
      cooldownDate.setDate(cooldownDate.getDate() + 14);

      failedCompanies[company] = {
        timestamp: new Date().toISOString(),
        cooldownUntil: cooldownDate.toISOString(),
        score: percentageScore,
        cutoff: cutoffScore,
        topics: generateImprovementTopics()
      };

      localStorage.setItem('failedCompanies', JSON.stringify(failedCompanies));
    }

    localStorage.setItem('assessmentScore', percentageScore.toString());
    localStorage.setItem('assessmentCutoff', cutoffScore.toString());
    localStorage.setItem('assessmentPassed', isPassed.toString());
    localStorage.setItem('incorrectAnswers', incorrectAnswers.toString());

    if (isPassed) {
      toast({
        title: "Assessment Complete",
        description: `Congratulations! You scored ${percentageScore}%, which meets the ${cutoffScore}% cutoff for ${resumeData.company}.`,
      });
    } else {
      toast({
        title: "Assessment Not Passed",
        description: `You scored ${percentageScore}%, which is below the ${cutoffScore}% cutoff for ${resumeData.company}.`,
        variant: "destructive",
      });
    }
  };

  const continueToInterview = () => {
    navigate('/interview');
  };

  const getCurrentQuestionDifficulty = () => {
    if (technicalQuestions.length === 0) return "medium";
    return technicalQuestions[currentQuestion].difficulty;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-green-600 bg-green-100";
      case "medium": return "text-orange-600 bg-orange-100";
      case "hard": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const generateImprovementTopics = () => {
    const incorrectCategories = new Set<string>();
    
    technicalQuestions.forEach((q, index) => {
      if (answeredQuestions.includes(index) && selectedOption !== q.correctAnswer) {
        incorrectCategories.add(q.category);
      }
    });
    
    const categoryToTopics: {[key: string]: string[]} = {
      "algorithms": ["Data Structures", "Algorithm Complexity", "Sorting Algorithms", "Search Algorithms"],
      "programming": ["Programming Fundamentals", "Object-Oriented Design", "Functional Programming", "Clean Code Practices"],
      "frontend": ["JavaScript Fundamentals", "React/Framework Concepts", "DOM Manipulation", "Web Performance"],
      "backend": ["API Design", "Server Architecture", "Authentication/Authorization", "Database Integration"],
      "system-design": ["System Architecture", "Scalability Patterns", "High Availability Design", "Distributed Systems"],
      "database": ["Database Design", "SQL Optimization", "NoSQL Concepts", "Data Modeling"],
      "security": ["Web Security", "Authentication Systems", "Secure Coding", "Vulnerability Management"],
      "devops": ["CI/CD Pipelines", "Infrastructure as Code", "Containerization", "Cloud Services"],
      "data-science": ["Statistical Methods", "Machine Learning Algorithms", "Data Cleaning", "Feature Engineering"],
      "mobile": ["Mobile UI/UX", "Native API Integration", "Cross-Platform Development", "Mobile Performance"],
      "product": ["User Stories", "Requirements Gathering", "Product Roadmapping", "User Experience Design"]
    };
    
    let suggestedTopics: string[] = [];
    
    incorrectCategories.forEach(category => {
      if (categoryToTopics[category]) {
        suggestedTopics = [...suggestedTopics, ...categoryToTopics[category]];
      }
    });
    
    if (suggestedTopics.length < 4) {
      const defaultTopics: {[key: string]: string[]} = {
        "Software Engineer": ["Data Structures", "Algorithms", "System Design", "SOLID Principles"],
        "Frontend Developer": ["JavaScript", "React Fundamentals", "CSS Layouts", "Web Performance"],
        "Data Scientist": ["Statistical Methods", "Machine Learning Algorithms", "Data Cleaning", "Feature Engineering"],
        "Product Manager": ["Product Requirements", "User Research", "Agile Methodologies", "Prioritization Frameworks"]
      };
      
      const additionalTopics = defaultTopics[resumeData.jobTitle] || defaultTopics["Software Engineer"];
      suggestedTopics = [...new Set([...suggestedTopics, ...additionalTopics])];
    }
    
    return suggestedTopics.slice(0, 4);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full flex flex-col"
    >
      {!isAssessmentComplete && technicalQuestions.length > 0 ? (
        <div className="flex-1 flex flex-col p-6">
          <div className="mb-6 flex justify-between items-center">
            <div className="text-sm font-medium">
              Question {currentQuestion + 1} of {technicalQuestions.length}
            </div>
            <div className="flex items-center gap-3">
              <div className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor(getCurrentQuestionDifficulty())}`}>
                {getCurrentQuestionDifficulty().charAt(0).toUpperCase() + getCurrentQuestionDifficulty().slice(1)}
              </div>
              <div className="flex items-center text-sm font-medium bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
                <Clock className="h-4 w-4 mr-1" />
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>
          
          <Progress 
            value={(currentQuestion / technicalQuestions.length) * 100} 
            className="mb-6 h-2"
          />
          
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 flex-1">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              {technicalQuestions[currentQuestion].question}
            </h3>
            
            <div className="space-y-3 mt-6">
              {technicalQuestions[currentQuestion].options.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedOption === index
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-800"
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`h-5 w-5 mr-3 rounded-full flex items-center justify-center ${
                      selectedOption === index
                        ? "bg-primary text-white"
                        : "border border-gray-300"
                    }`}>
                      {selectedOption === index && <CheckCircle2 className="h-4 w-4" />}
                    </div>
                    <span>{option}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 border-t pt-4 text-sm text-gray-500">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />
                <span>
                  Note: This assessment has negative marking. 
                  {getCurrentQuestionDifficulty() === "easy" ? " -0.25 points for incorrect answers." : 
                   getCurrentQuestionDifficulty() === "medium" ? " -0.5 points for incorrect answers." : 
                   " -1 point for incorrect answers."}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm">
              <span className="font-medium">Cutoff score: </span>
              <span className="text-orange-600">{cutoffScore}%</span>
              <span className="mx-2">|</span>
              <span className="font-medium">Company: </span>
              <span className="text-primary">{resumeData.company}</span>
            </div>
            <Button
              onClick={handleNextQuestion}
              disabled={selectedOption === null}
              className="button-glow"
            >
              {currentQuestion < technicalQuestions.length - 1 ? (
                <>Next Question <ArrowRight className="ml-2 h-5 w-5" /></>
              ) : (
                <>Finish Assessment <ArrowRight className="ml-2 h-5 w-5" /></>
              )}
            </Button>
          </div>
        </div>
      ) : isAssessmentComplete ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center"
          >
            {(() => {
              const maxPossibleScore = technicalQuestions.reduce((total, q) => {
                return total + (q.difficulty === "easy" ? 1 : q.difficulty === "medium" ? 2 : 3);
              }, 0);

              const percentageScore = Math.round((score / maxPossibleScore) * 100);
              const isPassed = percentageScore >= cutoffScore;

              if (isPassed) {
                return (
                  <>
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="h-10 w-10 text-green-600" />
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-2">Assessment Complete!</h2>
                    <p className="text-gray-600 mb-2">
                      You scored {percentageScore}% on the technical assessment
                    </p>
                    
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span>Company cutoff: {cutoffScore}%</span>
                      <span className="text-green-600">PASSED</span>
                    </div>
                    
                    <div className="h-4 bg-gray-100 rounded-full mb-6 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                        style={{ width: `${percentageScore}%` }}
                      ></div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                      <h4 className="font-medium mb-2">Assessment Summary:</h4>
                      <ul className="space-y-1 text-sm">
                        <li>Total questions: {technicalQuestions.length}</li>
                        <li>Correct answers: {technicalQuestions.length - incorrectAnswers}</li>
                        <li>Incorrect answers: {incorrectAnswers}</li>
                        <li>Points earned: {score.toFixed(1)} / {maxPossibleScore}</li>
                        <li className="font-medium mt-2">
                          Result: <span className="text-green-600">
                            You met the company's requirements!
                          </span>
                        </li>
                      </ul>
                    </div>
                    
                    <Button onClick={continueToInterview} className="button-glow w-full">
                      Continue to Interview <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </>
                );
              } else {
                return (
                  <>
                    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <AlertTriangle className="h-10 w-10 text-orange-600" />
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-2">Assessment Not Passed</h2>
                    <p className="text-gray-600 mb-2">
                      You scored {percentageScore}% on the technical assessment
                    </p>
                    
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span>Company cutoff: {cutoffScore}%</span>
                      <span className="text-red-600">NOT PASSED</span>
                    </div>
                    
                    <div className="h-4 bg-gray-100 rounded-full mb-6 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                        style={{ width: `${percentageScore}%` }}
                      ></div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                      <h4 className="font-medium mb-2">Assessment Summary:</h4>
                      <ul className="space-y-1 text-sm">
                        <li>Total questions: {technicalQuestions.length}</li>
                        <li>Correct answers: {technicalQuestions.length - incorrectAnswers}</li>
                        <li>Incorrect answers: {incorrectAnswers}</li>
                        <li>Points earned: {score.toFixed(1)} / {maxPossibleScore}</li>
                        <li className="font-medium mt-2">
                          Result: <span className="text-red-600">
                            You didn't meet the company's requirements
                          </span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="border-t pt-4 mt-4">
                      <h3 className="font-semibold text-lg mb-3 text-left flex items-center">
                        <BookOpen className="h-5 w-5 mr-2 text-primary" />
                        Suggested Areas for Improvement:
                      </h3>
                      <ul className="text-left space-y-2 mb-4">
                        {suggestedTopics.map((topic, index) => (
                          <li key={index} className="flex items-start">
                            <span className="inline-block h-5 w-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center mr-2 mt-0.5">
                              {index + 1}
                            </span>
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <div className="bg-primary/10 p-3 rounded-lg text-sm mb-4 text-left">
                        <p className="font-medium text-primary mb-1">Note:</p>
                        <p>You can reapply to {resumeData.company} after 14 days. Use this time to improve your skills in the areas mentioned above.</p>
                      </div>
                      
                      <div className="text-center text-sm text-gray-600 mb-4">
                        Redirecting to home page in {failureRedirectTimer} seconds
                      </div>
                      
                      <Button 
                        onClick={() => navigate('/')} 
                        variant="outline" 
                        className="w-full"
                      >
                        Return Home
                      </Button>
                    </div>
                  </>
                );
              }
            })()}
          </motion.div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-6">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading assessment questions...</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default OnlineAssessment;
