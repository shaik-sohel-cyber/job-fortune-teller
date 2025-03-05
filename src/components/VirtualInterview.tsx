
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mic, MicOff, Send, User, CornerDownRight, ArrowRight, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Enhanced interview questions based on job role and resume keywords
const getInterviewQuestions = (jobTitle: string) => {
  const commonQuestions = [
    "Tell me about yourself and your background.",
    "What made you interested in applying for this position?",
    "How would you handle a situation where a project deadline is at risk?",
    "What do you consider your greatest professional achievement?",
    "How do you stay updated with the latest trends in your field?",
    "Tell me about a time when you had to learn a new skill quickly for a project.",
    "How do you handle feedback or criticism?",
    "Where do you see yourself professionally in 5 years?",
    "What makes you the right candidate for this position?",
    "Do you have any questions for me about the role or company?"
  ];

  // Technical questions based on job title
  const technicalQuestions: {[key: string]: string[]} = {
    "Software Engineer": [
      "Can you explain your approach to writing clean and maintainable code?",
      "Describe a complex technical problem you solved and how you approached it.",
      "How do you test your code to ensure it's working correctly?",
      "What version control systems are you familiar with, and what's your workflow?",
      "How do you handle technical debt in your projects?"
    ],
    "Frontend Developer": [
      "What frontend frameworks have you worked with and which do you prefer?",
      "How do you optimize website performance?",
      "Explain your approach to responsive design.",
      "How do you ensure accessibility in your web applications?",
      "What strategies do you use for state management in complex applications?"
    ],
    "Data Scientist": [
      "What machine learning models have you implemented in real projects?",
      "How do you handle imbalanced datasets?",
      "Explain your approach to feature engineering.",
      "How do you evaluate the performance of your models?",
      "How do you communicate technical results to non-technical stakeholders?"
    ]
  };

  // Get role-specific questions or default to Software Engineer if role not found
  const roleQuestions = technicalQuestions[jobTitle] || technicalQuestions["Software Engineer"];
  
  // Combine common and role-specific questions
  return [...commonQuestions.slice(0, 5), ...roleQuestions, ...commonQuestions.slice(5)];
};

const VirtualInterview = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);
  const [interviewTimer, setInterviewTimer] = useState(1800); // 30 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [interviewQuestions, setInterviewQuestions] = useState<string[]>([]);
  const [interviewScore, setInterviewScore] = useState<number[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Fetch resume data and verification results from localStorage
  const resumeData = JSON.parse(localStorage.getItem('resumeData') || '{"jobTitle": "Software Developer", "company": "Tech Company"}');
  const verificationResults = JSON.parse(localStorage.getItem('verificationResults') || 'null');
  const assessmentScore = parseInt(localStorage.getItem('assessmentScore') || '0');

  useEffect(() => {
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

    if (!localStorage.getItem('verificationResults')) {
      toast({
        title: "Resume not verified",
        description: "Please complete the verification process first.",
        variant: "destructive",
      });
      navigate('/verification');
      return;
    }

    if (!localStorage.getItem('assessmentScore')) {
      toast({
        title: "Assessment not completed",
        description: "Please complete the technical assessment first.",
        variant: "destructive",
      });
      navigate('/assessment');
      return;
    }
    
    // Get job-specific interview questions
    const questions = getInterviewQuestions(resumeData.jobTitle);
    setInterviewQuestions(questions);
    
    // Initialize interview scores array
    setInterviewScore(new Array(questions.length).fill(0));
    
    // Welcome message with personalized details
    const welcomeMessage: Message = {
      id: "welcome",
      role: "assistant",
      content: `Welcome to your virtual interview for the ${resumeData.jobTitle} position at ${resumeData.company}. I'll be asking you a series of questions to evaluate your fit for this role. Based on your resume verification and technical assessment, we're looking forward to learning more about your experience and skills. Please answer thoroughly and provide specific examples when possible.`,
      timestamp: new Date(),
    };
    
    setMessages([welcomeMessage]);
    
    // Send first question after a delay
    setTimeout(() => {
      sendNextQuestion();
      setIsTimerRunning(true);
    }, 1500);
  }, []);

  // Countdown timer for interview
  useEffect(() => {
    if (interviewTimer > 0 && isTimerRunning && !isInterviewComplete) {
      const timer = setTimeout(() => setInterviewTimer(interviewTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (interviewTimer === 0 && !isInterviewComplete) {
      // Auto-complete interview if time runs out
      const timeoutMessage: Message = {
        id: `timeout-${Date.now()}`,
        role: "assistant",
        content: "I notice that our interview time is up. Let's wrap up here. Thank you for your responses. We'll now analyze your performance and provide you with feedback.",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, timeoutMessage]);
      setTimeout(() => {
        setIsInterviewComplete(true);
      }, 2000);
    }
  }, [interviewTimer, isTimerRunning, isInterviewComplete]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendNextQuestion = () => {
    if (currentQuestion < interviewQuestions.length) {
      setIsThinking(true);
      
      // Simulate AI thinking delay
      setTimeout(() => {
        const newMessage: Message = {
          id: `question-${currentQuestion}`,
          role: "assistant",
          content: interviewQuestions[currentQuestion],
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, newMessage]);
        setIsThinking(false);
        setCurrentQuestion(prev => prev + 1);
      }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
    } else {
      // Interview complete
      setIsThinking(true);
      
      setTimeout(() => {
        const finalMessage: Message = {
          id: "interview-complete",
          role: "assistant",
          content: "Thank you for completing the interview. I appreciate your thoughtful responses and examples. Based on your interview, technical assessment, and resume, I'll now provide a comprehensive evaluation of your candidacy. Click the 'View Results' button when you're ready to see your personalized feedback and job success prediction.",
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, finalMessage]);
        setIsThinking(false);
        setIsInterviewComplete(true);
        setIsTimerRunning(false);
      }, 1500);
    }
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    const newMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Analyze answer (simulated AI scoring)
    const answerScore = Math.floor(5 + Math.random() * 6); // Random score between 5-10
    
    // Update score for current question
    setInterviewScore(prev => {
      const newScores = [...prev];
      newScores[currentQuestion - 1] = answerScore;
      return newScores;
    });
    
    setInput("");
    
    // Send next question after a delay
    setTimeout(() => {
      sendNextQuestion();
    }, 500);
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      toast({
        title: "Voice recording stopped",
        description: "Your speech has been processed.",
      });
      
      // Simulate speech-to-text conversion with more detailed response
      setInput("Based on my previous experience at " + resumeData.company + ", I've developed strong skills in problem-solving and teamwork. I've successfully led projects with tight deadlines by focusing on clear communication and prioritization. One example was when our team had to deliver a critical feature update within a week. I organized daily stand-ups and helped break down the work into manageable tasks, which allowed us to deliver on time while maintaining code quality.");
    } else {
      setIsRecording(true);
      toast({
        title: "Voice recording started",
        description: "Speak clearly to record your answer.",
      });
    }
  };

  const viewResults = () => {
    // Calculate average interview score
    const averageScore = interviewScore.reduce((sum, score) => sum + score, 0) / interviewScore.length;
    
    // Store interview data in localStorage
    localStorage.setItem('interviewComplete', 'true');
    localStorage.setItem('interviewScore', averageScore.toString());
    
    // Store interview answers for analysis
    const userResponses = messages.filter(m => m.role === "user").map(m => m.content);
    localStorage.setItem('interviewResponses', JSON.stringify(userResponses));
    
    // Navigate to results page
    navigate('/results');
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full flex flex-col"
    >
      <div className="bg-white/80 shadow-sm p-2 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <span className="text-sm font-medium">Interview in progress</span>
        </div>
        <div className="flex items-center text-sm font-medium bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
          <Clock className="h-4 w-4 mr-1" />
          {formatTime(interviewTimer)}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`flex max-w-[80%] ${
                  message.role === "assistant"
                    ? "items-start"
                    : "items-start flex-row-reverse"
                }`}
              >
                <div
                  className={`flex items-center justify-center h-10 w-10 rounded-full shrink-0 ${
                    message.role === "assistant"
                      ? "bg-primary/10 text-primary mr-3"
                      : "bg-secondary ml-3"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <User className="h-5 w-5" />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </div>
                <div
                  className={`p-4 rounded-2xl ${
                    message.role === "assistant"
                      ? "bg-secondary text-foreground"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <div
                    className={`text-xs mt-1 ${
                      message.role === "assistant"
                        ? "text-muted-foreground"
                        : "text-primary-foreground/70"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isThinking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex items-start max-w-[80%]">
              <div className="flex items-center justify-center h-10 w-10 rounded-full shrink-0 bg-primary/10 text-primary mr-3">
                <User className="h-5 w-5" />
              </div>
              <div className="p-4 rounded-2xl bg-secondary text-foreground">
                <div className="flex space-x-2">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {isInterviewComplete ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-4 flex justify-center"
        >
          <Button
            onClick={viewResults}
            className="button-glow"
            size="lg"
          >
            View Results <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 border-t"
        >
          <div className="flex items-end space-x-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your answer..."
              className="min-h-[80px] resize-none rounded-xl focus:ring-2 focus:ring-primary/50 transition-all duration-300"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <div className="flex flex-col space-y-2">
              <Button
                type="button"
                size="icon"
                variant={isRecording ? "destructive" : "outline"}
                onClick={toggleRecording}
                className="rounded-full h-10 w-10 transition-all duration-300"
              >
                {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
              
              <Button
                type="button"
                size="icon"
                onClick={handleSendMessage}
                className="rounded-full h-10 w-10 bg-primary hover:bg-primary/90 transition-all duration-300"
                disabled={!input.trim()}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default VirtualInterview;
