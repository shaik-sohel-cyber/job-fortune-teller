
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mic, MicOff, Send, User, ArrowRight, Clock, Code, BriefcaseBusiness, Laptop, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Define interview rounds
type InterviewRound = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  currentQuestionIndex: number;
  messages: Message[];
  questions: string[];
  scores: number[];
};

// Enhanced interview questions based on job role, resume keywords, and package level
const getInterviewQuestions = (jobTitle: string, packageLevel: string, round: string) => {
  // Define round-specific questions
  const roundQuestions: {[key: string]: string[]} = {
    "technical": [
      "Tell me about your technical background and the technologies you're most comfortable with.",
      "What was the most challenging technical problem you've solved and how did you approach it?",
      "How do you stay updated with the latest technologies and trends in your field?",
      "Describe your approach to debugging a complex issue in production.",
      "How would you explain a complex technical concept to a non-technical stakeholder?",
      "What's your approach to technical documentation?",
      "Describe your experience with version control systems like Git.",
      "How do you ensure the code you write is maintainable and scalable?"
    ],
    "coding": [
      "Write a function that checks if a string is a palindrome.",
      "How would you implement a function to find the nth Fibonacci number?",
      "Write a function to reverse a linked list.",
      "Explain how you would design a system for a real-time chat application.",
      "How would you optimize a slow database query?",
      "Describe your approach to implementing a caching system.",
      "Write a function that finds duplicate values in an array.",
      "How would you handle race conditions in a distributed system?"
    ],
    "domain": [
      `Based on your experience with ${jobTitle}, what domain-specific challenges have you faced?`,
      "How have you applied your domain knowledge to solve business problems?",
      "Describe a situation where your industry expertise was crucial for a project's success.",
      "How do you keep up with industry-specific trends and developments?",
      "What domain-specific tools or methodologies have you used in your previous roles?",
      "How would you explain a domain-specific concept to a new team member?",
      "What industry standards or best practices do you follow in your work?",
      "How have you bridged the gap between business requirements and technical implementation?"
    ],
    "hr": [
      "What motivates you in your professional life?",
      "Describe a situation where you had to work with a difficult team member.",
      "How do you handle feedback, both positive and constructive?",
      "Where do you see yourself professionally in 5 years?",
      "Why are you interested in joining our company specifically?",
      "Tell me about a time when you demonstrated leadership skills.",
      "How do you maintain a work-life balance?",
      "What are your salary expectations for this role?"
    ]
  };
  
  // Get role-specific questions for the coding round
  if (round === "coding") {
    const roleSpecificCoding: {[key: string]: string[]} = {
      "Frontend Developer": [
        "Write a function that throttles event handlers (e.g., for scroll events).",
        "How would you implement a responsive image gallery with lazy loading?",
        "Write a function to deep clone a JavaScript object.",
        "How would you implement a custom hook in React for handling form state?",
        "Describe how you would optimize the performance of a React application."
      ],
      "Backend Developer": [
        "Write a function that implements pagination for a large dataset.",
        "How would you design a rate limiting middleware?",
        "Write a function to traverse a tree structure recursively.",
        "Describe how you would handle database migrations in a production environment.",
        "How would you implement a job queue system?"
      ],
      "Data Scientist": [
        "Write a function to normalize a dataset.",
        "How would you handle missing values in a dataset?",
        "Write code to perform a basic statistical analysis on a dataset.",
        "Describe how you would implement a simple recommendation system.",
        "How would you evaluate the performance of a machine learning model?"
      ],
      "DevOps Engineer": [
        "Write a shell script to automate deployment.",
        "How would you implement continuous integration for a microservices architecture?",
        "Write code to monitor system resources.",
        "Describe how you would set up infrastructure as code.",
        "How would you implement a blue-green deployment strategy?"
      ]
    };
    
    // Find the closest matching role
    const roleKey = Object.keys(roleSpecificCoding).find(key => 
      jobTitle.toLowerCase().includes(key.toLowerCase())
    );
    
    if (roleKey && roleSpecificCoding[roleKey]) {
      // Add role-specific coding questions
      return [...roundQuestions[round], ...roleSpecificCoding[roleKey]];
    }
  }
  
  // Add package-level difficulty
  if (packageLevel === "senior") {
    // Add more challenging questions for senior roles
    const seniorQuestions: {[key: string]: string[]} = {
      "technical": [
        "Describe a time when you had to make a critical architectural decision. What factors did you consider?",
        "How do you approach technical mentoring of junior team members?",
        "Describe your experience with scaling systems to handle significant growth."
      ],
      "coding": [
        "How would you design a system that needs to process millions of events per second?",
        "Explain how you would implement a distributed locking mechanism.",
        "Describe your approach to handling eventual consistency in distributed systems."
      ],
      "domain": [
        "How have you influenced strategic decisions in your domain?",
        "Describe a situation where you had to balance technical debt against business needs."
      ],
      "hr": [
        "Describe your leadership philosophy.",
        "How do you approach mentoring and growing team members?",
        "Tell me about a time when you had to make an unpopular decision."
      ]
    };
    
    if (seniorQuestions[round]) {
      return [...roundQuestions[round], ...seniorQuestions[round]];
    }
  }
  
  return roundQuestions[round] || [];
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
  const [activeRound, setActiveRound] = useState("technical");
  const [interviewRounds, setInterviewRounds] = useState<InterviewRound[]>([]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);
  const [interviewTimer, setInterviewTimer] = useState(3600); // 60 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  
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
    
    // Initialize interview rounds
    const rounds: InterviewRound[] = [
      {
        id: "technical",
        name: "Technical Round",
        description: "Assessment of technical knowledge and experience",
        icon: <Laptop className="h-5 w-5" />,
        completed: false,
        currentQuestionIndex: 0,
        messages: [],
        questions: shuffleArray(getInterviewQuestions(resumeData.jobTitle, selectedPackage, "technical")).slice(0, 5),
        scores: []
      },
      {
        id: "coding",
        name: "Coding Round",
        description: "Practical coding skills and problem solving",
        icon: <Code className="h-5 w-5" />,
        completed: false,
        currentQuestionIndex: 0,
        messages: [],
        questions: shuffleArray(getInterviewQuestions(resumeData.jobTitle, selectedPackage, "coding")).slice(0, 5),
        scores: []
      },
      {
        id: "domain",
        name: "Domain Round",
        description: "Specific knowledge in your area of expertise",
        icon: <BriefcaseBusiness className="h-5 w-5" />,
        completed: false,
        currentQuestionIndex: 0,
        messages: [],
        questions: shuffleArray(getInterviewQuestions(resumeData.jobTitle, selectedPackage, "domain")).slice(0, 5),
        scores: []
      },
      {
        id: "hr",
        name: "HR Round",
        description: "Cultural fit and soft skills assessment",
        icon: <GraduationCap className="h-5 w-5" />,
        completed: false,
        currentQuestionIndex: 0,
        messages: [],
        questions: shuffleArray(getInterviewQuestions(resumeData.jobTitle, selectedPackage, "hr")).slice(0, 5),
        scores: []
      }
    ];
    
    // Personalized welcome messages for each round
    const welcomeMessages: {[key: string]: string} = {
      technical: `Welcome to the Technical Round of your interview for the ${resumeData.jobTitle} position at ${resumeData.company}. In this round, we'll assess your technical knowledge and experience. Please answer the questions thoroughly and provide specific examples where possible.`,
      coding: `Welcome to the Coding Round. Here, we'll evaluate your practical programming skills and problem-solving ability. For coding questions, please explain your approach and thought process along with your solution.`,
      domain: `Welcome to the Domain Expertise Round. This round focuses on your specific knowledge and experience in ${resumeData.jobTitle.toLowerCase().includes("data") ? "data science and analytics" : resumeData.jobTitle.toLowerCase().includes("front") ? "frontend development" : "software development"}. We want to understand how you've applied your expertise in real-world scenarios.`,
      hr: `Welcome to the HR Round, the final stage of our interview process. We'll discuss your career goals, cultural fit with our organization, and soft skills. This helps us understand you better as a potential team member at ${resumeData.company}.`
    };
    
    // Add welcome messages to each round
    const updatedRounds = rounds.map(round => {
      const welcomeMessage: Message = {
        id: `welcome-${round.id}`,
        role: "assistant",
        content: welcomeMessages[round.id],
        timestamp: new Date()
      };
      return {
        ...round,
        messages: [welcomeMessage]
      };
    });
    
    setInterviewRounds(updatedRounds);
    
    // Send first question after a delay for the first round
    setTimeout(() => {
      sendNextQuestion("technical");
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
      
      setInterviewRounds(prev => {
        const updated = [...prev];
        const currentRound = updated.find(r => r.id === activeRound);
        if (currentRound) {
          currentRound.messages = [...currentRound.messages, timeoutMessage];
          currentRound.completed = true;
        }
        return updated;
      });
      
      setTimeout(() => {
        setIsInterviewComplete(true);
      }, 2000);
    }
  }, [interviewTimer, isTimerRunning, isInterviewComplete]);
  
  useEffect(() => {
    scrollToBottom();
  }, [interviewRounds, activeRound]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendNextQuestion = (roundId: string) => {
    setInterviewRounds(prev => {
      const updated = [...prev];
      const roundIndex = updated.findIndex(r => r.id === roundId);
      
      if (roundIndex === -1) return prev;
      
      const round = updated[roundIndex];
      
      if (round.currentQuestionIndex < round.questions.length) {
        setIsThinking(true);
        
        // Will add the question after a delay (simulating thinking)
        setTimeout(() => {
          setInterviewRounds(current => {
            const updatedRounds = [...current];
            const currentRound = updatedRounds[roundIndex];
            
            const newMessage: Message = {
              id: `question-${currentRound.id}-${currentRound.currentQuestionIndex}`,
              role: "assistant",
              content: currentRound.questions[currentRound.currentQuestionIndex],
              timestamp: new Date(),
            };
            
            currentRound.messages = [...currentRound.messages, newMessage];
            currentRound.currentQuestionIndex += 1;
            
            setIsThinking(false);
            return updatedRounds;
          });
        }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
      } else if (!round.completed) {
        // Round complete
        setIsThinking(true);
        
        setTimeout(() => {
          setInterviewRounds(current => {
            const updatedRounds = [...current];
            const currentRound = updatedRounds[roundIndex];
            
            const finalMessage: Message = {
              id: `complete-${currentRound.id}`,
              role: "assistant",
              content: `Thank you for completing the ${currentRound.name}. ${roundIndex < 3 ? "Let's proceed to the next round." : "You've now completed all interview rounds. We'll analyze your responses and provide feedback."}`,
              timestamp: new Date(),
            };
            
            currentRound.messages = [...currentRound.messages, finalMessage];
            currentRound.completed = true;
            
            setIsThinking(false);
            
            // If this is not the last round, move to next round
            if (roundIndex < 3) {
              const nextRoundId = updatedRounds[roundIndex + 1].id;
              setTimeout(() => {
                setActiveRound(nextRoundId);
                setCurrentRoundIndex(roundIndex + 1);
                // Send first question in next round
                setTimeout(() => {
                  sendNextQuestion(nextRoundId);
                }, 1000);
              }, 2000);
            } else {
              // All rounds complete
              setTimeout(() => {
                setIsInterviewComplete(true);
                setIsTimerRunning(false);
                
                // Calculate average interview score
                let totalScore = 0;
                let totalQuestions = 0;
                
                updatedRounds.forEach(round => {
                  if (round.scores.length > 0) {
                    totalScore += round.scores.reduce((sum, score) => sum + score, 0);
                    totalQuestions += round.scores.length;
                  }
                });
                
                const averageScore = totalQuestions > 0 ? Math.round(totalScore / totalQuestions) : 0;
                
                // Store interview data in localStorage
                localStorage.setItem('interviewComplete', 'true');
                localStorage.setItem('interviewScore', averageScore.toString());
                
                // Store interview answers for analysis
                const userResponses = updatedRounds.flatMap(round => 
                  round.messages.filter(m => m.role === "user").map(m => m.content)
                );
                localStorage.setItem('interviewResponses', JSON.stringify(userResponses));
                
                // Store round scores
                const roundScores = updatedRounds.map(round => {
                  const avgRoundScore = round.scores.length > 0 
                    ? Math.round(round.scores.reduce((sum, score) => sum + score, 0) / round.scores.length)
                    : 0;
                  return { round: round.id, score: avgRoundScore };
                });
                localStorage.setItem('roundScores', JSON.stringify(roundScores));
              }, 2000);
            }
            
            return updatedRounds;
          });
        }, 1500);
      }
      
      return updated;
    });
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    setInterviewRounds(prev => {
      const updated = [...prev];
      const roundIndex = updated.findIndex(r => r.id === activeRound);
      
      if (roundIndex === -1) return prev;
      
      const round = updated[roundIndex];
      
      const newMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: input,
        timestamp: new Date(),
      };
      
      round.messages = [...round.messages, newMessage];
      
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
      round.scores = [...round.scores, answerScore];
      
      return updated;
    });
    
    setInput("");
    
    // Send next question after a delay
    setTimeout(() => {
      sendNextQuestion(activeRound);
    }, 500);
  };

  const generateRealisticResponse = () => {
    // Generate more realistic and personalized responses based on job title, active round, and package
    const roundSpecificResponses: {[key: string]: string[]} = {
      "technical": [
        `In my experience as a ${resumeData.jobTitle}, I've worked extensively with technologies like React, Node.js, and AWS. I've implemented CI/CD pipelines and microservices architectures that improved deployment times by 40%.`,
        `Throughout my career, I've specialized in ${resumeData.jobTitle.toLowerCase().includes("data") ? "data processing pipelines and machine learning models" : resumeData.jobTitle.toLowerCase().includes("front") ? "responsive UI frameworks and state management" : "scalable backend services and database optimization"}. For instance, I optimized database queries that reduced response times by 60%.`,
        `I approach debugging methodically by isolating components, using logging, and leveraging monitoring tools. In my previous role, I identified and fixed a memory leak that was causing periodic system crashes.`
      ],
      "coding": [
        `To solve this problem, I would use a ${selectedPackage === 'senior' ? 'dynamic programming approach' : 'iterative solution'}. First, I would initialize variables to track the state. Then I would iterate through the data structure, applying the necessary transformations...`,
        `Here's how I would implement this function:\n\nfunction solution(input) {\n  // Check edge cases\n  if (!input) return null;\n  \n  // Process the input\n  const result = input.map(item => process(item));\n  \n  // Return the result\n  return result.filter(Boolean);\n}\n\nThis handles all edge cases while maintaining O(n) time complexity.`,
        `For this system design, I would use a microservices architecture with the following components: 1) API Gateway for request routing, 2) Authentication service, 3) Core business logic services, 4) Database layer with proper caching, and 5) Asynchronous messaging for event-driven operations.`
      ],
      "domain": [
        `In the ${resumeData.jobTitle.toLowerCase().includes("data") ? "data science" : resumeData.jobTitle.toLowerCase().includes("front") ? "frontend development" : "software engineering"} domain, I've found that ${selectedPackage === 'senior' ? 'leading cross-functional teams requires both technical expertise and strong communication skills' : 'collaboration between developers and stakeholders is crucial for project success'}. For example, I implemented a domain-specific solution that increased business efficiency by 35%.`,
        `My domain expertise in ${resumeData.jobTitle} has been particularly valuable when ${selectedPackage === 'senior' ? 'architecting solutions that balance technical requirements with business needs' : 'implementing industry-specific features that meet customer expectations'}. I stay current with industry trends through professional associations and continuing education.`,
        `I've applied my domain knowledge to develop specialized solutions for ${resumeData.company}-like environments, focusing on ${resumeData.jobTitle.toLowerCase().includes("data") ? "predictive analytics and data visualization" : resumeData.jobTitle.toLowerCase().includes("front") ? "user experience and accessibility" : "system reliability and performance optimization"}.`
      ],
      "hr": [
        `I'm motivated by solving complex problems and seeing the direct impact of my work. At my previous company, I led a project that automated reporting processes, saving the team 15 hours per week and improving data accuracy significantly.`,
        `My approach to work-life balance involves clear boundaries, effective time management, and regular self-assessment. I believe that maintaining balance makes me more productive and creative when I am working.`,
        `I'm particularly interested in joining ${resumeData.company} because of your innovative approach to ${resumeData.jobTitle.toLowerCase().includes("data") ? "data-driven decision making" : resumeData.jobTitle.toLowerCase().includes("front") ? "user experience design" : "software development"} and your strong company culture that emphasizes both technical excellence and professional growth.`
      ]
    };
    
    const responses = roundSpecificResponses[activeRound] || roundSpecificResponses["technical"];
    return responses[Math.floor(Math.random() * responses.length)];
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
    // Navigate to results page
    navigate('/results');
  };
  
  // Find current round data
  const currentRound = interviewRounds.find(round => round.id === activeRound);
  const messages = currentRound?.messages || [];
  
  // Calculate progress
  const completedRounds = interviewRounds.filter(round => round.completed).length;
  const totalRounds = interviewRounds.length;
  const progressPercentage = Math.round((completedRounds / totalRounds) * 100);
  
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
      
      {isInterviewComplete ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center flex-1 p-8 text-center"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-4">Interview Completed</h2>
          <p className="text-gray-600 mb-6 max-w-2xl">
            Thank you for completing all rounds of the interview process. We appreciate your time and thoughtful responses. 
            Our team will carefully review your performance across all rounds and assess your fit for the {resumeData.jobTitle} role at {resumeData.company}.
          </p>
          <p className="text-gray-800 font-medium mb-8 max-w-2xl">
            Based on your performance, we will get back to you soon through an email with further details about the next steps in the hiring process.
          </p>
          <Button
            onClick={viewResults}
            className="button-glow"
            size="lg"
          >
            View Results <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      ) : (
        <Tabs 
          value={activeRound} 
          className="flex-1 flex flex-col"
          onValueChange={isInterviewComplete ? undefined : (value) => {
            // Only allow changing to completed rounds or the current active round
            const targetRound = interviewRounds.find(r => r.id === value);
            const currentRoundIndex = interviewRounds.findIndex(r => r.id === activeRound);
            const targetRoundIndex = interviewRounds.findIndex(r => r.id === value);
            
            if (targetRound && (targetRound.completed || targetRoundIndex === currentRoundIndex)) {
              setActiveRound(value);
            } else {
              toast({
                title: "Round locked",
                description: "You need to complete the current round first.",
                variant: "destructive",
              });
            }
          }}
        >
          <div className="p-4 bg-slate-100/30">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
              <h2 className="text-xl font-bold mb-2 sm:mb-0">Interview Process</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">{progressPercentage}% Complete</span>
                <div className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-500 ease-in-out" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2">
              {interviewRounds.map((round, index) => (
                <TabsTrigger 
                  key={round.id}
                  value={round.id}
                  disabled={!round.completed && index > currentRoundIndex}
                  className={`flex items-center ${round.completed ? 'bg-green-100' : (index === currentRoundIndex ? 'bg-blue-100' : '')}`}
                >
                  <div className="mr-2">{round.icon}</div>
                  <span className="hidden sm:inline">{round.name}</span>
                  <span className="sm:hidden">{round.id.charAt(0).toUpperCase()}</span>
                  {round.completed && (
                    <svg className="ml-2 h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {interviewRounds.map((round) => (
            <TabsContent key={round.id} value={round.id} className="flex-1 flex flex-col mt-0">
              <Card className="flex-1 flex flex-col border-0 rounded-none">
                <CardHeader className="pb-2">
                  <CardTitle>{round.name}</CardTitle>
                  <CardDescription>{round.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  <AnimatePresence initial={false}>
                    {round.messages.map((message) => (
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
                  
                  {activeRound === round.id && isThinking && (
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
                </CardContent>
              </Card>
              
              {activeRound === round.id && !round.completed && (
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
            </TabsContent>
          ))}
        </Tabs>
      )}
    </motion.div>
  );
};

export default VirtualInterview;
