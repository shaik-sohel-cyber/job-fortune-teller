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
  const commonQuestions: Question[] = [
    {
      id: 1,
      question: "Which design pattern is commonly used for creating a single instance of a class?",
      options: ["Factory", "Singleton", "Observer", "Strategy"],
      correctAnswer: 1,
      difficulty: "medium",
    },
    {
      id: 2,
      question: "What is the time complexity of binary search?",
      options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
      correctAnswer: 2,
      difficulty: "medium",
    },
    {
      id: 3,
      question: "Which data structure operates on a FIFO (First In, First Out) principle?",
      options: ["Stack", "Queue", "Heap", "Tree"],
      correctAnswer: 1,
      difficulty: "easy",
    },
    {
      id: 4,
      question: "Which of the following is NOT a RESTful API method?",
      options: ["GET", "POST", "DELETE", "QUERY"],
      correctAnswer: 3,
      difficulty: "easy",
    },
    {
      id: 5,
      question: "What does ACID stand for in database transactions?",
      options: ["Atomicity, Consistency, Isolation, Durability", "Authority, Consistency, Integrity, Delivery", "Authentication, Confidentiality, Isolation, Data", "Atomicity, Coherence, Integrity, Durability"],
      correctAnswer: 0,
      difficulty: "medium",
    }
  ];

  const roleQuestions: {[key: string]: Question[]} = {
    "Software Engineer": [
      {
        id: 101,
        question: "Which of the following is NOT a principle of SOLID?",
        options: ["Single Responsibility", "Open-Closed", "Liskov Substitution", "Duplicate Reduction"],
        correctAnswer: 3,
        difficulty: "medium",
      },
      {
        id: 102,
        question: "What is the main purpose of a virtual function in OOP?",
        options: ["To improve performance", "To enable function overriding", "To reduce memory usage", "To prevent inheritance"],
        correctAnswer: 1,
        difficulty: "medium",
      },
      {
        id: 103,
        question: "Which algorithm is typically used for shortest path finding?",
        options: ["Bubble Sort", "Dijkstra's Algorithm", "Quick Sort", "Binary Search"],
        correctAnswer: 1,
        difficulty: "medium",
      },
      {
        id: 104,
        question: "What is dependency injection?",
        options: ["A design pattern that implements inversion of control", "A method to optimize database queries", "A way to inject code during compilation", "A technique to reduce network latency"],
        correctAnswer: 0,
        difficulty: "hard",
      },
      {
        id: 105,
        question: "What is the difference between process and thread?",
        options: ["Processes share memory, threads don't", "Threads are faster but use more resources", "Processes are isolated, threads share memory within a process", "There is no difference, the terms are interchangeable"],
        correctAnswer: 2,
        difficulty: "hard",
      },
      {
        id: 106,
        question: "Which of the following is not a valid approach to handle concurrency?",
        options: ["Mutexes", "Semaphores", "Thread pausing", "Atomic operations"],
        correctAnswer: 2,
        difficulty: "hard",
      }
    ],
    "Frontend Developer": [
      {
        id: 201,
        question: "Which CSS property is used to create space between inline elements?",
        options: ["margin", "padding", "spacing", "gap"],
        correctAnswer: 0,
        difficulty: "easy",
      },
      {
        id: 202,
        question: "What is the role of the 'key' prop in React lists?",
        options: ["Encryption", "Performance optimization", "Styling", "Animation control"],
        correctAnswer: 1,
        difficulty: "medium",
      },
      {
        id: 203,
        question: "Which hook is used for side effects in React?",
        options: ["useState", "useEffect", "useContext", "useReducer"],
        correctAnswer: 1,
        difficulty: "easy",
      },
      {
        id: 204,
        question: "What is the difference between controlled and uncontrolled components in React?",
        options: ["Controlled components use state, uncontrolled use refs", "Controlled components are faster", "Uncontrolled components are more secure", "There's no difference, the terms are interchangeable"],
        correctAnswer: 0,
        difficulty: "medium",
      },
      {
        id: 205,
        question: "What is code splitting in React?",
        options: ["Writing code in multiple files", "Dividing code into smaller chunks for lazy loading", "Splitting the DOM tree", "Converting JSX to JavaScript"],
        correctAnswer: 1,
        difficulty: "medium",
      },
      {
        id: 206,
        question: "Which of the following is NOT a valid way to optimize React performance?",
        options: ["Using memo", "Using useCallback", "Using pure components", "Using synchronous updates"],
        correctAnswer: 3,
        difficulty: "hard",
      },
      {
        id: 207,
        question: "What is the purpose of React Suspense?",
        options: ["Error handling", "Performance optimization", "State management", "Handling asynchronous operations"],
        correctAnswer: 3,
        difficulty: "hard",
      }
    ],
    "Data Scientist": [
      {
        id: 301,
        question: "What technique is used to prevent overfitting in machine learning models?",
        options: ["Feature Engineering", "Regularization", "Data Augmentation", "All of the above"],
        correctAnswer: 3,
        difficulty: "medium",
      },
      {
        id: 302,
        question: "Which algorithm is NOT a classification algorithm?",
        options: ["Random Forest", "Logistic Regression", "K-means", "Support Vector Machine"],
        correctAnswer: 2,
        difficulty: "medium",
      },
      {
        id: 303,
        question: "What does RMSE stand for in model evaluation?",
        options: ["Random Mean Squared Error", "Root Mean Squared Error", "Relative Mean Squared Estimation", "Recursive Model Squared Evaluation"],
        correctAnswer: 1,
        difficulty: "easy",
      },
      {
        id: 304,
        question: "What is the purpose of cross-validation in machine learning?",
        options: ["To speed up training", "To evaluate model performance", "To visualize data", "To reduce dimensionality"],
        correctAnswer: 1,
        difficulty: "medium",
      },
      {
        id: 305,
        question: "What is the curse of dimensionality?",
        options: ["When a model has too many features", "The problem of data sparsity in high dimensions", "When a model has high variance", "When two variables are highly correlated"],
        correctAnswer: 1,
        difficulty: "hard",
      },
      {
        id: 306,
        question: "Which of the following is NOT a technique for handling missing data?",
        options: ["Mean imputation", "Regression imputation", "Dimensionality expansion", "Multiple imputation"],
        correctAnswer: 2,
        difficulty: "medium",
      },
      {
        id: 307,
        question: "What is the difference between bagging and boosting?",
        options: ["Bagging trains models in sequence, boosting in parallel", "Bagging reduces bias, boosting reduces variance", "Bagging trains models in parallel, boosting in sequence", "There is no difference, the terms are interchangeable"],
        correctAnswer: 2,
        difficulty: "hard",
      }
    ],
    "Product Manager": [
      {
        id: 401,
        question: "What is the purpose of an MRD in product management?",
        options: ["Market Requirements Document", "Minimal Responsive Design", "Market Research Data", "Model Revision Document"],
        correctAnswer: 0,
        difficulty: "medium",
      },
      {
        id: 402,
        question: "Which of the following is typically NOT part of a product roadmap?",
        options: ["Feature timeline", "Resource allocation", "Employee vacation schedule", "Strategic goals"],
        correctAnswer: 2,
        difficulty: "easy",
      },
      {
        id: 403,
        question: "What does MVP stand for in product development?",
        options: ["Most Valuable Product", "Minimum Viable Product", "Multiple Version Production", "Maximum Value Proposition"],
        correctAnswer: 1,
        difficulty: "easy",
      },
      {
        id: 404,
        question: "What is the difference between a Product Manager and a Project Manager?",
        options: ["Product Managers focus on what to build, Project Managers on how to build it", "They are the same role", "Product Managers work only on software, Project Managers on hardware", "Product Managers report to Project Managers"],
        correctAnswer: 0,
        difficulty: "medium",
      },
      {
        id: 405,
        question: "What is the primary purpose of user stories?",
        options: ["Marketing materials", "Technical documentation", "To capture user requirements from their perspective", "To track bugs"],
        correctAnswer: 2,
        difficulty: "medium",
      },
      {
        id: 406,
        question: "What is the RICE prioritization framework?",
        options: ["Requirements, Implementation, Constraints, Evaluation", "Reach, Impact, Confidence, Effort", "Research, Ideation, Creation, Execution", "Revenue, Interest, Cost, Engineering"],
        correctAnswer: 1,
        difficulty: "hard",
      },
      {
        id: 407,
        question: "What is a North Star Metric?",
        options: ["A KPI that reflects your product's core value", "The highest priority feature", "The project's budget target", "The expected release date"],
        correctAnswer: 0,
        difficulty: "medium",
      }
    ]
  };

  const packageQuestions: {[key: string]: Question[]} = {
    "entry": [
      {
        id: 1001,
        question: "What is the purpose of a version control system?",
        options: ["To track and manage changes to code", "To compile code faster", "To automatically fix bugs", "To deploy applications"],
        correctAnswer: 0,
        difficulty: "easy",
      },
      {
        id: 1002,
        question: "What does API stand for?",
        options: ["Application Programming Interface", "Automated Program Integration", "Application Process Interaction", "Advanced Programming Input"],
        correctAnswer: 0,
        difficulty: "easy",
      },
      {
        id: 1003,
        question: "What is the difference between HTTP and HTTPS?",
        options: ["HTTP is faster", "HTTPS is encrypted", "HTTP supports more features", "HTTPS is older"],
        correctAnswer: 1,
        difficulty: "easy",
      }
    ],
    "mid": [
      {
        id: 2001,
        question: "What is the difference between abstract classes and interfaces?",
        options: [
          "Abstract classes can have method implementations, interfaces cannot", 
          "Interfaces can be instantiated, abstract classes cannot", 
          "A class can inherit multiple abstract classes but only one interface", 
          "Interfaces are faster than abstract classes"
        ],
        correctAnswer: 0,
        difficulty: "medium",
      },
      {
        id: 2002,
        question: "What is the purpose of a load balancer in a distributed system?",
        options: [
          "To distribute network traffic across multiple servers", 
          "To reduce code size", 
          "To optimize database queries", 
          "To cache frequently accessed data"
        ],
        correctAnswer: 0,
        difficulty: "medium",
      },
      {
        id: 2003,
        question: "What is the difference between synchronous and asynchronous programming?",
        options: [
          "Synchronous is faster than asynchronous", 
          "Asynchronous operations block execution until complete", 
          "Synchronous operations execute in sequential order, asynchronous don't block execution", 
          "There is no practical difference"
        ],
        correctAnswer: 2,
        difficulty: "medium",
      }
    ],
    "senior": [
      {
        id: 3001,
        question: "Which of the following is NOT a common microservices design pattern?",
        options: [
          "Circuit Breaker", 
          "API Gateway", 
          "Saga", 
          "Monolithic Layering"
        ],
        correctAnswer: 3,
        difficulty: "hard",
      },
      {
        id: 3002,
        question: "In the context of system design, what does CAP theorem state?",
        options: [
          "A distributed system cannot simultaneously provide Consistency, Availability, and Partition tolerance", 
          "Code Analysis and Programming must be balanced", 
          "Complex Applications Perform poorly in distributed systems", 
          "Caching Accelerates Performance in all systems"
        ],
        correctAnswer: 0,
        difficulty: "hard",
      },
      {
        id: 3003,
        question: "What is the purpose of consistent hashing in distributed systems?",
        options: [
          "To improve security", 
          "To minimize redistribution of keys when nodes are added or removed", 
          "To reduce storage requirements", 
          "To ensure all data is encrypted"
        ],
        correctAnswer: 1,
        difficulty: "hard",
      }
    ]
  };

  const specificRoleQuestions = roleQuestions[jobTitle] || roleQuestions["Software Engineer"];
  const levelQuestions = packageQuestions[packageType] || packageQuestions["mid"];
  const allQuestions = [...commonQuestions, ...specificRoleQuestions, ...levelQuestions];
  return shuffleArray(allQuestions).slice(0, 15);
};

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const getCompanyCutoffScore = (company: string, jobTitle: string, packageType: string): number => {
  const baseCutoffs = {
    'entry': 60,
    'mid': 70,
    'senior': 80
  };

  const companyAdjustments: {[key: string]: number} = {
    'Google': 10,
    'Microsoft': 5,
    'Amazon': 5,
    'Facebook': 8,
    'Apple': 8,
    'Netflix': 10,
    'Tesla': 7,
    'IBM': 0,
    'Oracle': 3,
    'Intel': 2
  };

  const roleAdjustments: {[key: string]: number} = {
    'Software Engineer': 0,
    'Frontend Developer': -2,
    'Data Scientist': 5,
    'Product Manager': -5,
    'DevOps Engineer': 3,
    'Security Engineer': 8,
    'Machine Learning Engineer': 7
  };

  const baseCutoff = baseCutoffs[packageType as keyof typeof baseCutoffs] || baseCutoffs['mid'];
  const companyAdjustment = Object.entries(companyAdjustments).find(
    ([key]) => company.toLowerCase().includes(key.toLowerCase())
  )?.[1] || 0;
  const roleAdjustment = Object.entries(roleAdjustments).find(
    ([key]) => jobTitle.toLowerCase().includes(key.toLowerCase())
  )?.[1] || 0;

  return Math.min(95, Math.max(50, baseCutoff + companyAdjustment + roleAdjustment));
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
    } else if (isAssessmentComplete && failureRedirectTimer === 0 && failureRedirectTimer !== -1) {
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
