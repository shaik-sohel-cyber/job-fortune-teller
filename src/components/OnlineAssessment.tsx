import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Clock, CheckCircle2, AlertTriangle, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: "easy" | "medium" | "hard";
}

const generateTechnicalQuestions = (jobTitle: string, packageType: string): Question[] => {
  const questionsBase: Question[] = [
    {
      id: 1,
      question: "What is the time complexity of accessing an element in an array by its index?",
      options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
      correctAnswer: 0,
      difficulty: "easy",
    },
    {
      id: 2,
      question: "Which of the following is NOT a principle of Object-Oriented Programming?",
      options: ["Inheritance", "Polymorphism", "Encapsulation", "Compilation"],
      correctAnswer: 3,
      difficulty: "easy",
    },
    {
      id: 3,
      question: "What is the purpose of the 'useEffect' hook in React?",
      options: [
        "To manage state variables",
        "To perform side effects in functional components",
        "To define the component's template",
        "To handle events",
      ],
      correctAnswer: 1,
      difficulty: "easy",
    },
    {
      id: 4,
      question: "What is the difference between '==' and '===' in JavaScript?",
      options: [
        "'==' compares values, '===' compares values and types",
        "'==' compares values and types, '===' compares values",
        "There is no difference",
        "'===' is used for strings, '==' is used for numbers",
      ],
      correctAnswer: 0,
      difficulty: "medium",
    },
    {
      id: 5,
      question: "Explain the concept of 'closures' in JavaScript.",
      options: [
        "Functions that are defined inside other functions",
        "Functions that have access to variables from their outer scope even after the outer function has finished executing",
        "Functions that are used to close the program",
        "Functions that are automatically executed",
      ],
      correctAnswer: 1,
      difficulty: "medium",
    },
    {
      id: 6,
      question: "What is the purpose of the 'try...catch' statement in programming?",
      options: [
        "To define a loop",
        "To handle exceptions and errors",
        "To declare variables",
        "To optimize code",
      ],
      correctAnswer: 1,
      difficulty: "medium",
    },
    {
      id: 7,
      question: "Describe the difference between 'stack' and 'queue' data structures.",
      options: [
        "Stack is LIFO, queue is FIFO",
        "Stack is FIFO, queue is LIFO",
        "Stack and queue are the same",
        "Stack is used for numbers, queue is used for strings",
      ],
      correctAnswer: 0,
      difficulty: "medium",
    },
    {
      id: 8,
      question: "What is the role of the 'Virtual DOM' in React?",
      options: [
        "To replace the actual DOM",
        "To optimize DOM updates by minimizing direct manipulations",
        "To handle user events",
        "To manage component state",
      ],
      correctAnswer: 1,
      difficulty: "medium",
    },
    {
      id: 9,
      question: "Explain the concept of 'memoization' and how it can improve performance.",
      options: [
        "A technique to reduce memory usage",
        "A technique to cache the results of expensive function calls and return the cached result when the same inputs occur again",
        "A technique to compress code",
        "A technique to improve code readability",
      ],
      correctAnswer: 1,
      difficulty: "hard",
    },
    {
      id: 10,
      question: "What is the difference between 'asynchronous' and 'synchronous' execution?",
      options: [
        "Asynchronous execution blocks the program, synchronous execution does not",
        "Asynchronous execution does not block the program, synchronous execution blocks the program",
        "There is no difference",
        "Asynchronous is faster than synchronous",
      ],
      correctAnswer: 1,
      difficulty: "hard",
    },
    {
      id: 11,
      question: "Describe the SOLID principles of Object-Oriented Design.",
      options: [
        "Single responsibility, open-closed, Liskov substitution, interface segregation, dependency inversion",
        "Simple, organized, layered, integrated, detailed",
        "Structured, optimized, linked, interactive, dynamic",
        "Stable, observable, logical, intuitive, descriptive",
      ],
      correctAnswer: 0,
      difficulty: "hard",
    },
    {
      id: 12,
      question: "Explain the concept of 'microservices' and their advantages.",
      options: [
        "A software development approach where an application is structured as a collection of small, autonomous services, modeled around a business domain",
        "A technique to write very small pieces of code",
        "A way to reduce the size of the application",
        "A method to improve code readability",
      ],
      correctAnswer: 0,
      difficulty: "hard",
    },
  ];

  // Filter questions based on job title
  let relevantQuestions: Question[] = [...questionsBase];

  if (jobTitle.toLowerCase().includes("frontend")) {
    relevantQuestions = questionsBase.filter((q) =>
      [3, 4, 5, 8].includes(q.id)
    );
  } else if (jobTitle.toLowerCase().includes("data scientist")) {
    relevantQuestions = questionsBase.filter((q) =>
      [6, 9, 10].includes(q.id)
    );
  } else if (jobTitle.toLowerCase().includes("product manager")) {
    relevantQuestions = questionsBase.filter((q) =>
      [2, 7, 11].includes(q.id)
    );
  }

  // Adjust difficulty based on package type
  let adjustedQuestions: Question[] = relevantQuestions.map((q) => {
    if (packageType === "entry") {
      return { ...q, difficulty: "easy" };
    } else if (packageType === "mid") {
      return q.difficulty === "easy" ? q : { ...q, difficulty: "medium" };
    } else {
      return q;
    }
  });

  // Shuffle and limit the number of questions
  const shuffledQuestions = shuffleArray(adjustedQuestions).slice(0, 5);

  return shuffledQuestions; // Adding this return statement to fix the error
};

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray; // Adding this return statement to fix the error
};

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

  return baseScore; // Adding this return statement to fix the error
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
    const questions = generateTechnicalQuestions(resumeData.jobTitle, selectedPackage);
    setTechnicalQuestions(questions);

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
    const defaultTopics: {[key: string]: string[]} = {
      "Software Engineer": ["Data Structures", "Algorithms", "System Design", "SOLID Principles"],
      "Frontend Developer": ["JavaScript", "React Fundamentals", "CSS Layouts", "Web Performance"],
      "Data Scientist": ["Statistical Methods", "Machine Learning Algorithms", "Data Cleaning", "Feature Engineering"],
      "Product Manager": ["Product Requirements", "User Research", "Agile Methodologies", "Prioritization Frameworks"]
    };

    return defaultTopics[resumeData.jobTitle] || defaultTopics["Software Engineer"];
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
            <h3 className="text-xl font-semibold mb-4">
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
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
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
