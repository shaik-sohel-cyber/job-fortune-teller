
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: "easy" | "medium" | "hard";
}

// Generate technical assessment questions based on job title and package
const generateTechnicalQuestions = (jobTitle: string, packageType: string): Question[] => {
  // Common questions across all roles
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
  
  // Role-specific questions
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
        options: ["Requirements, Implementation, Constraints, Evaluation", "Reach, Impact, Confidence, Effort", "Revenue, Interest, Cost, Engineering", "Research, Ideation, Creation, Execution"],
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
  
  // Package-specific questions (increasing difficulty based on package level)
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
  
  // Get role-specific questions or default to Software Engineer
  const specificRoleQuestions = roleQuestions[jobTitle] || roleQuestions["Software Engineer"];
  
  // Get package level questions
  const levelQuestions = packageQuestions[packageType] || packageQuestions["mid"];
  
  // Combine all questions and return a subset
  const allQuestions = [...commonQuestions, ...specificRoleQuestions, ...levelQuestions];
  
  // Shuffle and select questions to ensure uniqueness
  // Increased from 5 to 15 questions
  return shuffleArray(allQuestions).slice(0, 15);
};

// Helper function to shuffle array
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Get company-specific cutoff score based on job title and package
const getCompanyCutoffScore = (company: string, jobTitle: string, packageType: string): number => {
  // Base cutoff percentages by package level
  const baseCutoffs = {
    'entry': 60,  // 60% for entry level
    'mid': 70,    // 70% for mid level
    'senior': 80   // 80% for senior level
  };
  
  // Company-specific adjustments (could be expanded with more companies)
  const companyAdjustments: {[key: string]: number} = {
    'Google': 10,     // Google has higher standards (+10%)
    'Microsoft': 5,   // Microsoft has slightly higher standards (+5%)
    'Amazon': 5,      // Amazon has slightly higher standards (+5%)
    'Facebook': 8,    // Facebook has higher standards (+8%)
    'Apple': 8,       // Apple has higher standards (+8%)
    'Netflix': 10,    // Netflix has higher standards (+10%)
    'Tesla': 7,       // Tesla has higher standards (+7%)
    'IBM': 0,         // IBM has standard cutoffs (+0%)
    'Oracle': 3,      // Oracle has slightly higher standards (+3%)
    'Intel': 2        // Intel has slightly higher standards (+2%)
  };
  
  // Role-specific adjustments
  const roleAdjustments: {[key: string]: number} = {
    'Software Engineer': 0,       // Baseline
    'Frontend Developer': -2,     // Slightly lower for frontend (-2%)
    'Data Scientist': 5,          // Higher for data science roles (+5%)
    'Product Manager': -5,        // Lower for non-technical roles (-5%)
    'DevOps Engineer': 3,         // Higher for infrastructure roles (+3%)
    'Security Engineer': 8,       // Higher for security roles (+8%)
    'Machine Learning Engineer': 7 // Higher for ML roles (+7%)
  };
  
  // Get base cutoff for package level
  const baseCutoff = baseCutoffs[packageType as keyof typeof baseCutoffs] || baseCutoffs['mid'];
  
  // Get company adjustment (if any)
  const companyAdjustment = Object.entries(companyAdjustments).find(
    ([key]) => company.toLowerCase().includes(key.toLowerCase())
  )?.[1] || 0;
  
  // Get role adjustment (if any)
  const roleAdjustment = Object.entries(roleAdjustments).find(
    ([key]) => jobTitle.toLowerCase().includes(key.toLowerCase())
  )?.[1] || 0;
  
  // Calculate and return final cutoff (ensure it's between 50-95%)
  return Math.min(95, Math.max(50, baseCutoff + companyAdjustment + roleAdjustment));
};

const OnlineAssessment = () => {
  const [technicalQuestions, setTechnicalQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds (increased from 5 minutes)
  const [isAssessmentComplete, setIsAssessmentComplete] = useState(false);
  const [cutoffScore, setCutoffScore] = useState(70); // Default cutoff, will be updated based on company/job/package
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Resume data from localStorage
  const resumeData = JSON.parse(localStorage.getItem('resumeData') || '{"jobTitle": "Software Developer", "company": "Tech Company"}');
  const selectedPackage = localStorage.getItem('selectedPackage') || 'entry';
  
  // Initialize questions and company-specific cutoff score
  useEffect(() => {
    // Generate questions based on job title and package
    const questions = generateTechnicalQuestions(resumeData.jobTitle, selectedPackage);
    setTechnicalQuestions(questions);
    
    // Set company-specific cutoff score
    const companyCutoff = getCompanyCutoffScore(resumeData.company, resumeData.jobTitle, selectedPackage);
    setCutoffScore(companyCutoff);
    
    // Check if user has completed earlier steps
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
  
  // Time formatting
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !isAssessmentComplete) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAssessmentComplete) {
      completeAssessment();
    }
  }, [timeLeft, isAssessmentComplete]);
  
  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };
  
  const handleNextQuestion = () => {
    // Mark this question as answered
    setAnsweredQuestions([...answeredQuestions, currentQuestion]);
    
    // Score the current question with negative marking
    if (selectedOption === technicalQuestions[currentQuestion].correctAnswer) {
      // Calculate points based on difficulty
      const difficultyPoints = 
        technicalQuestions[currentQuestion].difficulty === "easy" ? 1 :
        technicalQuestions[currentQuestion].difficulty === "medium" ? 2 : 3;
      
      setScore(score + difficultyPoints);
    } else {
      // Negative marking: -0.25 for easy, -0.5 for medium, -1 for hard questions
      const negativePoints = 
        technicalQuestions[currentQuestion].difficulty === "easy" ? 0.25 :
        technicalQuestions[currentQuestion].difficulty === "medium" ? 0.5 : 1;
      
      setScore(Math.max(0, score - negativePoints)); // Ensure score doesn't go below 0
      setIncorrectAnswers(incorrectAnswers + 1);
    }
    
    // Move to next question or finish
    if (currentQuestion < technicalQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      completeAssessment();
    }
  };
  
  const completeAssessment = () => {
    // Calculate final score if not already done
    if (!isAssessmentComplete && selectedOption !== null && !answeredQuestions.includes(currentQuestion)) {
      // Score the last question
      if (selectedOption === technicalQuestions[currentQuestion].correctAnswer) {
        // Calculate points based on difficulty
        const difficultyPoints = 
          technicalQuestions[currentQuestion].difficulty === "easy" ? 1 :
          technicalQuestions[currentQuestion].difficulty === "medium" ? 2 : 3;
        
        setScore(score + difficultyPoints);
      } else {
        // Negative marking: -0.25 for easy, -0.5 for medium, -1 for hard questions
        const negativePoints = 
          technicalQuestions[currentQuestion].difficulty === "easy" ? 0.25 :
          technicalQuestions[currentQuestion].difficulty === "medium" ? 0.5 : 1;
        
        setScore(Math.max(0, score - negativePoints)); // Ensure score doesn't go below 0
        setIncorrectAnswers(incorrectAnswers + 1);
      }
    }
    
    setIsAssessmentComplete(true);
    
    // Calculate max possible score based on question difficulties
    const maxPossibleScore = technicalQuestions.reduce((total, q) => {
      return total + (q.difficulty === "easy" ? 1 : q.difficulty === "medium" ? 2 : 3);
    }, 0);
    
    // Calculate percentage score
    const percentageScore = Math.round((score / maxPossibleScore) * 100);
    
    // Save assessment data to localStorage
    localStorage.setItem('assessmentScore', percentageScore.toString());
    localStorage.setItem('assessmentCutoff', cutoffScore.toString());
    localStorage.setItem('assessmentPassed', (percentageScore >= cutoffScore).toString());
    localStorage.setItem('incorrectAnswers', incorrectAnswers.toString());
    
    // Provide different messages based on whether the cutoff was met
    if (percentageScore >= cutoffScore) {
      toast({
        title: "Assessment Complete",
        description: `Congratulations! You scored ${percentageScore}%, which meets the ${cutoffScore}% cutoff for ${resumeData.company}.`,
      });
    } else {
      toast({
        title: "Assessment Complete",
        description: `You scored ${percentageScore}%, which is below the ${cutoffScore}% cutoff for ${resumeData.company}.`,
        variant: "destructive",
      });
    }
  };
  
  const continueToInterview = () => {
    navigate('/interview');
  };
  
  // Calculate the current question's difficulty level for display
  const getCurrentQuestionDifficulty = () => {
    if (technicalQuestions.length === 0) return "medium";
    return technicalQuestions[currentQuestion].difficulty;
  };
  
  // Get difficulty level color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-green-600 bg-green-100";
      case "medium": return "text-orange-600 bg-orange-100";
      case "hard": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
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
            {/* Calculate max possible score based on question difficulties */}
            {(() => {
              const maxPossibleScore = technicalQuestions.reduce((total, q) => {
                return total + (q.difficulty === "easy" ? 1 : q.difficulty === "medium" ? 2 : 3);
              }, 0);
              
              // Calculate percentage score
              const percentageScore = Math.round((score / maxPossibleScore) * 100);
              const isPassed = percentageScore >= cutoffScore;
              
              return (
                <>
                  <div className={`w-20 h-20 ${isPassed ? 'bg-green-100' : 'bg-orange-100'} rounded-full flex items-center justify-center mx-auto mb-6`}>
                    <CheckCircle2 className={`h-10 w-10 ${isPassed ? 'text-green-600' : 'text-orange-600'}`} />
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-2">Assessment Complete!</h2>
                  <p className="text-gray-600 mb-2">
                    You scored {percentageScore}% on the technical assessment
                  </p>
                  
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span>Company cutoff: {cutoffScore}%</span>
                    <span className={isPassed ? "text-green-600" : "text-red-600"}>
                      {isPassed ? "PASSED" : "NOT PASSED"}
                    </span>
                  </div>
                  
                  <div className="h-4 bg-gray-100 rounded-full mb-6 overflow-hidden">
                    <div 
                      className={`h-full ${isPassed ? 'bg-gradient-to-r from-green-500 to-blue-500' : 'bg-gradient-to-r from-orange-500 to-red-500'}`}
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
                        Result: <span className={isPassed ? "text-green-600" : "text-red-600"}>
                          {isPassed ? "You met the company's requirements!" : "You didn't meet the company's requirements"}
                        </span>
                      </li>
                    </ul>
                  </div>
                  
                  <Button onClick={continueToInterview} className="button-glow w-full">
                    Continue to Interview <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </>
              );
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
