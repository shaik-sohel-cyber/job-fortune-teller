
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
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
    },
    {
      id: 2,
      question: "What is the time complexity of binary search?",
      options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
      correctAnswer: 2,
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
      },
      {
        id: 102,
        question: "What is the main purpose of a virtual function in OOP?",
        options: ["To improve performance", "To enable function overriding", "To reduce memory usage", "To prevent inheritance"],
        correctAnswer: 1,
      },
      {
        id: 103,
        question: "Which algorithm is typically used for shortest path finding?",
        options: ["Bubble Sort", "Dijkstra's Algorithm", "Quick Sort", "Binary Search"],
        correctAnswer: 1,
      }
    ],
    "Frontend Developer": [
      {
        id: 201,
        question: "Which CSS property is used to create space between inline elements?",
        options: ["margin", "padding", "spacing", "gap"],
        correctAnswer: 0,
      },
      {
        id: 202,
        question: "What is the role of the 'key' prop in React lists?",
        options: ["Encryption", "Performance optimization", "Styling", "Animation control"],
        correctAnswer: 1,
      },
      {
        id: 203,
        question: "Which hook is used for side effects in React?",
        options: ["useState", "useEffect", "useContext", "useReducer"],
        correctAnswer: 1,
      }
    ],
    "Data Scientist": [
      {
        id: 301,
        question: "What technique is used to prevent overfitting in machine learning models?",
        options: ["Feature Engineering", "Regularization", "Data Augmentation", "All of the above"],
        correctAnswer: 3,
      },
      {
        id: 302,
        question: "Which algorithm is NOT a classification algorithm?",
        options: ["Random Forest", "Logistic Regression", "K-means", "Support Vector Machine"],
        correctAnswer: 2,
      },
      {
        id: 303,
        question: "What does RMSE stand for in model evaluation?",
        options: ["Random Mean Squared Error", "Root Mean Squared Error", "Relative Mean Squared Estimation", "Recursive Model Squared Evaluation"],
        correctAnswer: 1,
      }
    ],
    "Product Manager": [
      {
        id: 401,
        question: "What is the purpose of an MRD in product management?",
        options: ["Market Requirements Document", "Minimal Responsive Design", "Market Research Data", "Model Revision Document"],
        correctAnswer: 0,
      },
      {
        id: 402,
        question: "Which of the following is typically NOT part of a product roadmap?",
        options: ["Feature timeline", "Resource allocation", "Employee vacation schedule", "Strategic goals"],
        correctAnswer: 2,
      },
      {
        id: 403,
        question: "What does MVP stand for in product development?",
        options: ["Most Valuable Product", "Minimum Viable Product", "Multiple Version Production", "Maximum Value Proposition"],
        correctAnswer: 1,
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
      },
      {
        id: 1002,
        question: "What does API stand for?",
        options: ["Application Programming Interface", "Automated Program Integration", "Application Process Interaction", "Advanced Programming Input"],
        correctAnswer: 0,
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
  return shuffleArray(allQuestions).slice(0, 5);
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

const OnlineAssessment = () => {
  const [technicalQuestions, setTechnicalQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [isAssessmentComplete, setIsAssessmentComplete] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Resume data from localStorage
  const resumeData = JSON.parse(localStorage.getItem('resumeData') || '{"jobTitle": "Software Developer", "company": "Tech Company"}');
  const selectedPackage = localStorage.getItem('selectedPackage') || 'entry';
  
  // Initialize questions
  useEffect(() => {
    // Generate questions based on job title and package
    const questions = generateTechnicalQuestions(resumeData.jobTitle, selectedPackage);
    setTechnicalQuestions(questions);
    
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
    // Score the current question
    if (selectedOption === technicalQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
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
    if (!isAssessmentComplete && selectedOption !== null) {
      if (selectedOption === technicalQuestions[currentQuestion].correctAnswer) {
        setScore(score + 1);
      }
    }
    
    setIsAssessmentComplete(true);
    
    // Save assessment result to localStorage
    const percentageScore = Math.round((score / technicalQuestions.length) * 100);
    localStorage.setItem('assessmentScore', percentageScore.toString());
    
    toast({
      title: "Assessment Complete",
      description: `You've completed the technical assessment with a score of ${percentageScore}%.`,
    });
  };
  
  const continueToInterview = () => {
    navigate('/interview');
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
            <div className="flex items-center text-sm font-medium bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
              <Clock className="h-4 w-4 mr-1" />
              {formatTime(timeLeft)}
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
          </div>
          
          <div className="flex justify-end">
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
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold mb-2">Assessment Complete!</h2>
            <p className="text-gray-600 mb-6">
              You scored {Math.round((score / technicalQuestions.length) * 100)}% on the technical assessment
            </p>
            
            <div className="h-4 bg-gray-100 rounded-full mb-6 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-blue-500" 
                style={{ width: `${(score / technicalQuestions.length) * 100}%` }}
              ></div>
            </div>
            
            <Button onClick={continueToInterview} className="button-glow w-full">
              Continue to Interview <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
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
