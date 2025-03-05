
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

// Sample technical assessment questions
const technicalQuestions: Question[] = [
  {
    id: 1,
    question: "Which data structure uses LIFO (Last In First Out)?",
    options: ["Queue", "Stack", "Linked List", "Tree"],
    correctAnswer: 1,
  },
  {
    id: 2,
    question: "What is the time complexity of binary search?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
    correctAnswer: 2,
  },
  {
    id: 3,
    question: "Which of the following is not a JavaScript framework?",
    options: ["React", "Angular", "Django", "Vue"],
    correctAnswer: 2,
  },
  {
    id: 4, 
    question: "What does CSS stand for?",
    options: [
      "Computer Style Sheets", 
      "Creative Style System", 
      "Cascading Style Sheets", 
      "Colorful Style Sheets"
    ],
    correctAnswer: 2,
  },
  {
    id: 5,
    question: "Which of these is not a valid HTTP method?",
    options: ["GET", "POST", "DELETE", "FETCH"],
    correctAnswer: 3,
  }
];

const OnlineAssessment = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [isAssessmentComplete, setIsAssessmentComplete] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Resume data from localStorage
  const resumeData = JSON.parse(localStorage.getItem('resumeData') || '{"jobTitle": "Software Developer", "company": "Tech Company"}');
  
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
      {!isAssessmentComplete ? (
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
      ) : (
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
      )}
    </motion.div>
  );
};

export default OnlineAssessment;
