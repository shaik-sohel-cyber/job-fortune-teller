
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mic, MicOff, Send, User, ArrowRight, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Enhanced interview questions based on job role, resume keywords, and package level
const getInterviewQuestions = (jobTitle: string, packageLevel: string) => {
  // Common questions for all roles and packages
  const commonQuestions = [
    "Tell me about yourself and your background.",
    "What made you interested in applying for this position?",
    "Where do you see yourself professionally in 5 years?",
    "Tell me about a time when you had to learn a new skill quickly for a project.",
    "How do you handle feedback or criticism?"
  ];

  // Package-level specific behavioral questions
  const packageBehavioralQuestions: {[key: string]: string[]} = {
    "entry": [
      "Tell me about a time you faced a challenge in school or early career.",
      "How do you prioritize your tasks when you have multiple assignments?",
      "What is your approach to learning new technologies?",
      "How do you collaborate with others in a team setting?",
      "Tell me about a project you worked on that you're proud of."
    ],
    "mid": [
      "Describe a situation where you had to resolve a conflict within your team.",
      "Tell me about a time you had to meet a tight deadline. How did you manage it?",
      "How have you handled a situation where requirements changed mid-project?",
      "Tell me about a time you had to take initiative without being asked.",
      "Describe how you've mentored junior team members."
    ],
    "senior": [
      "Tell me about a strategic decision you made that impacted your team or organization.",
      "How have you influenced technical decisions in your previous roles?",
      "Describe a situation where you had to navigate organizational politics to achieve a goal.",
      "Tell me about a time you had to manage up to get buy-in for an important initiative.",
      "How have you built and led high-performing teams?"
    ]
  };

  // Technical questions based on job title and package level
  const technicalQuestions: {[key: string]: {[key: string]: string[]}} = {
    "Software Engineer": {
      "entry": [
        "What programming languages are you most comfortable with?",
        "Can you describe your approach to debugging code?",
        "What do you understand about version control systems?",
        "Explain the difference between arrays and linked lists."
      ],
      "mid": [
        "How do you ensure your code is maintainable and scalable?",
        "Describe your experience with microservices architecture.",
        "How do you approach optimizing application performance?",
        "What design patterns have you used in your projects?"
      ],
      "senior": [
        "How do you make architectural decisions when designing a new system?",
        "Describe your approach to implementing security best practices in application development.",
        "How do you guide technology choices in a rapid-growth environment?",
        "Explain how you would design a system to handle millions of concurrent users."
      ]
    },
    "Frontend Developer": {
      "entry": [
        "What frameworks and libraries have you worked with?",
        "How do you approach responsive design?",
        "Explain the concept of the DOM and how JavaScript interacts with it.",
        "What are CSS preprocessors and have you used any?"
      ],
      "mid": [
        "How do you manage state in complex frontend applications?",
        "Describe your experience with performance optimization for web applications.",
        "How do you approach testing frontend code?",
        "Explain your strategies for ensuring accessibility in your applications."
      ],
      "senior": [
        "How do you architect large-scale frontend applications?",
        "Describe your approach to creating and maintaining component libraries.",
        "How do you stay current with rapidly evolving frontend technologies?",
        "What strategies do you use for client-side performance monitoring and improvement?"
      ]
    },
    "Data Scientist": {
      "entry": [
        "What statistical methods are you familiar with?",
        "Describe your experience with Python or R for data analysis.",
        "How do you approach data cleaning and preprocessing?",
        "What visualization tools have you used?"
      ],
      "mid": [
        "Explain how you would handle a dataset with missing values.",
        "What machine learning algorithms have you implemented in real projects?",
        "How do you evaluate the performance of your models?",
        "Describe your experience with feature engineering."
      ],
      "senior": [
        "How do you design an end-to-end machine learning pipeline?",
        "Describe how you've deployed models to production environments.",
        "How do you approach model monitoring and maintenance over time?",
        "Tell me about a complex data science problem you solved that had significant business impact."
      ]
    },
    "Product Manager": {
      "entry": [
        "How do you gather and prioritize user requirements?",
        "What tools do you use for project tracking?",
        "How do you communicate product features to different stakeholders?",
        "Describe your approach to user research."
      ],
      "mid": [
        "How do you balance technical constraints with business goals?",
        "Describe how you've made data-driven product decisions.",
        "How do you collaborate with engineering teams on implementation?",
        "Tell me about a product launch you managed. What went well and what would you improve?"
      ],
      "senior": [
        "How do you develop product strategy that aligns with company objectives?",
        "Describe how you've built and managed product roadmaps for multiple product lines.",
        "How do you measure product success beyond traditional metrics?",
        "Tell me about a product pivot you led. What was the rationale and what were the outcomes?"
      ]
    }
  };

  // Get role-specific questions or default to Software Engineer if role not found
  const roleKey = Object.keys(technicalQuestions).find(key => 
    jobTitle.toLowerCase().includes(key.toLowerCase())
  ) || "Software Engineer";
  
  const roleQuestions = technicalQuestions[roleKey][packageLevel] || technicalQuestions[roleKey]["mid"];
  const behavioralQuestions = packageBehavioralQuestions[packageLevel] || packageBehavioralQuestions["mid"];
  
  // Combine and shuffle questions for uniqueness
  return shuffleArray([
    ...commonQuestions.slice(0, 2),
    ...behavioralQuestions.slice(0, 3),
    ...roleQuestions,
    ...commonQuestions.slice(2, 4),
    ...behavioralQuestions.slice(3),
    commonQuestions[4]
  ]);
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
  const selectedPackage = localStorage.getItem('selectedPackage') || 'entry';

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

    if (!localStorage.getItem('selectedPackage')) {
      toast({
        title: "Package not selected",
        description: "Please select a package first.",
        variant: "destructive",
      });
      navigate('/package-selection');
      return;
    }
    
    // Get job-specific interview questions based on package level
    const questions = getInterviewQuestions(resumeData.jobTitle, selectedPackage);
    setInterviewQuestions(questions);
    
    // Initialize interview scores array
    setInterviewScore(new Array(questions.length).fill(0));
    
    // Personalized welcome message with package details
    const packageNames = {
      'entry': 'Entry Level',
      'mid': 'Mid Level',
      'senior': 'Senior Level'
    };
    
    const packageName = packageNames[selectedPackage as keyof typeof packageNames] || 'Entry Level';
    
    const welcomeMessage: Message = {
      id: "welcome",
      role: "assistant",
      content: `Welcome to your virtual interview for the ${resumeData.jobTitle} position at ${resumeData.company}. I'll be asking you a series of questions to evaluate your fit for this ${packageName} role. Based on your resume verification and technical assessment score of ${assessmentScore}%, we're looking forward to learning more about your experience and skills. Please answer thoroughly and provide specific examples when possible.`,
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
          content: "Thank you for completing the interview. I appreciate your thoughtful responses and examples. Based on your interview, technical assessment, and resume, I'll now provide a comprehensive evaluation of your candidacy for the selected package level. Click the 'View Results' button when you're ready to see your personalized feedback and job success prediction.",
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
    
    // Analyze answer (simulated AI scoring with more variance based on package level)
    // Senior level has higher expectations
    const baseScore = 5;
    const packageMultiplier = selectedPackage === 'senior' ? 0.5 : (selectedPackage === 'mid' ? 0.7 : 0.9);
    const answerLength = input.length;
    const randomFactor = Math.random() * 2;
    
    // Score calculation - longer answers generally score better, with package-based scaling
    const lengthScore = Math.min(5, Math.floor(answerLength / 100));
    const answerScore = Math.floor(baseScore + lengthScore * packageMultiplier + randomFactor);
    
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

  const generateRealisticResponse = () => {
    // Generate more realistic and personalized responses based on job title and package
    const jobSpecificContent = [
      `Based on my experience with ${resumeData.company}, I've developed strong skills in problem-solving and teamwork. I've successfully led projects with tight deadlines by focusing on clear communication and prioritization.`,
      `In my previous role, I implemented an automated testing framework that reduced our QA time by 40%. This required collaborating closely with both development and business teams to ensure all requirements were met.`,
      `I believe my background in ${resumeData.jobTitle.toLowerCase().includes("data") ? "data analysis and machine learning" : resumeData.jobTitle.toLowerCase().includes("front") ? "UI/UX design and frontend frameworks" : "software architecture and system design"} makes me particularly well-suited for this position.`
    ];
    
    const packageSpecificContent = {
      'entry': "I'm eager to grow my skills and take on new challenges in this role. I'm a quick learner and thrive in collaborative environments.",
      'mid': "Having worked in similar roles for several years, I've developed a strong technical foundation and now I'm looking to expand my impact and take on more responsibility.",
      'senior': "Throughout my career, I've led multiple teams and high-impact projects. I focus on mentoring junior team members while also driving technical excellence and innovation."
    };
    
    return `${jobSpecificContent[Math.floor(Math.random() * jobSpecificContent.length)]} ${packageSpecificContent[selectedPackage as keyof typeof packageSpecificContent]}`;
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      toast({
        title: "Voice recording stopped",
        description: "Your speech has been processed.",
      });
      
      // Simulate speech-to-text conversion with more detailed personalized response
      setInput(generateRealisticResponse());
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
