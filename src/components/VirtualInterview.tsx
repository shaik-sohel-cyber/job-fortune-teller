
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mic, MicOff, Send, User, ArrowRight, Clock, Code, BriefcaseBusiness, Users, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Define interview rounds
const interviewRounds = [
  {
    id: "technical",
    name: "Technical Interview",
    icon: <Code className="h-5 w-5 mr-2" />,
    description: "This round evaluates your technical knowledge and problem-solving abilities.",
  },
  {
    id: "coding",
    name: "Coding Assessment",
    icon: <Brain className="h-5 w-5 mr-2" />,
    description: "In this round, you'll solve coding problems to demonstrate your programming skills.",
  },
  {
    id: "domain",
    name: "Domain Knowledge",
    icon: <BriefcaseBusiness className="h-5 w-5 mr-2" />,
    description: "We'll assess your domain expertise and industry knowledge in this round.",
  },
  {
    id: "hr",
    name: "HR Discussion",
    icon: <Users className="h-5 w-5 mr-2" />,
    description: "The final round covers cultural fit, career goals, and expectations.",
  }
];

// Enhanced interview questions generator
const getInterviewQuestions = (jobTitle: string, packageLevel: string, round: string) => {
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

  // Technical interview questions by job role and level
  const technicalQuestions: {[key: string]: {[key: string]: string[]}} = {
    "Software Engineer": {
      "entry": [
        "What programming languages are you most comfortable with?",
        "Can you describe your approach to debugging code?",
        "What do you understand about version control systems?",
        "Explain the difference between arrays and linked lists.",
        "How would you optimize a slow-performing application?"
      ],
      "mid": [
        "How do you ensure your code is maintainable and scalable?",
        "Describe your experience with microservices architecture.",
        "How do you approach optimizing application performance?",
        "What design patterns have you used in your projects?",
        "How do you handle dependency management in your projects?"
      ],
      "senior": [
        "How do you make architectural decisions when designing a new system?",
        "Describe your approach to implementing security best practices in application development.",
        "How do you guide technology choices in a rapid-growth environment?",
        "Explain how you would design a system to handle millions of concurrent users.",
        "How do you approach technical debt in your projects?"
      ]
    },
    "Frontend Developer": {
      "entry": [
        "What frameworks and libraries have you worked with?",
        "How do you approach responsive design?",
        "Explain the concept of the DOM and how JavaScript interacts with it.",
        "What are CSS preprocessors and have you used any?",
        "How do you optimize web performance?"
      ],
      "mid": [
        "How do you manage state in complex frontend applications?",
        "Describe your experience with performance optimization for web applications.",
        "How do you approach testing frontend code?",
        "Explain your strategies for ensuring accessibility in your applications.",
        "How do you handle browser compatibility issues?"
      ],
      "senior": [
        "How do you architect large-scale frontend applications?",
        "Describe your approach to creating and maintaining component libraries.",
        "How do you stay current with rapidly evolving frontend technologies?",
        "What strategies do you use for client-side performance monitoring and improvement?",
        "How do you balance user experience with technical constraints?"
      ]
    },
    "Data Scientist": {
      "entry": [
        "What statistical methods are you familiar with?",
        "Describe your experience with Python or R for data analysis.",
        "How do you approach data cleaning and preprocessing?",
        "What visualization tools have you used?",
        "Explain the difference between supervised and unsupervised learning."
      ],
      "mid": [
        "Explain how you would handle a dataset with missing values.",
        "What machine learning algorithms have you implemented in real projects?",
        "How do you evaluate the performance of your models?",
        "Describe your experience with feature engineering.",
        "How do you communicate technical findings to non-technical stakeholders?"
      ],
      "senior": [
        "How do you design an end-to-end machine learning pipeline?",
        "Describe how you've deployed models to production environments.",
        "How do you approach model monitoring and maintenance over time?",
        "Tell me about a complex data science problem you solved that had significant business impact.",
        "How do you balance model complexity with interpretability?"
      ]
    }
  };

  // Coding challenge questions
  const codingQuestions: {[key: string]: {[key: string]: string[]}} = {
    "Software Engineer": {
      "entry": [
        "Write a function to check if a string is a palindrome.",
        "Implement a function to find the first non-repeated character in a string.",
        "Write code to reverse a linked list.",
        "Implement a function to check if two strings are anagrams of each other.",
        "Write a function to find the maximum element in a binary tree."
      ],
      "mid": [
        "Implement a function to detect a cycle in a linked list.",
        "Write code to find all permutations of a string.",
        "Implement a queue using two stacks.",
        "Write a function to check if a binary tree is balanced.",
        "Implement an LRU cache with get and put operations in O(1) time."
      ],
      "senior": [
        "Design and implement a rate limiter for an API service.",
        "Write code to solve the N-Queens problem.",
        "Implement a thread-safe singleton pattern.",
        "Design a distributed key-value store with consistency guarantees.",
        "Implement an algorithm to find the shortest path in a graph with weighted edges."
      ]
    },
    "Frontend Developer": {
      "entry": [
        "Write a function to toggle a class on a DOM element when clicked.",
        "Implement a simple counter component in React.",
        "Write CSS to create a responsive navigation menu.",
        "Implement a form validation function for email and password fields.",
        "Write a function to fetch data from an API and display it on a page."
      ],
      "mid": [
        "Implement a debounce function for API calls.",
        "Write a custom React hook for form validation.",
        "Create a responsive image carousel without using a library.",
        "Implement a drag and drop interface for reordering items.",
        "Write a function to deep clone a JavaScript object."
      ],
      "senior": [
        "Implement a virtual scrolling component for large datasets.",
        "Create a custom state management solution similar to Redux.",
        "Write code to implement an efficient autocomplete component.",
        "Implement a worker thread solution for heavy computations in the browser.",
        "Create a responsive data visualization component that updates in real-time."
      ]
    },
    "Data Scientist": {
      "entry": [
        "Write a function to calculate mean, median, and mode of a dataset.",
        "Implement a simple linear regression algorithm from scratch.",
        "Write code to clean and preprocess a dataset with missing values.",
        "Implement a k-means clustering algorithm.",
        "Create a visualization to show the correlation between different features."
      ],
      "mid": [
        "Implement a decision tree algorithm from scratch.",
        "Write code to perform cross-validation on a machine learning model.",
        "Implement a recommendation system using collaborative filtering.",
        "Create a function to detect and handle outliers in a dataset.",
        "Write code to implement a neural network for image classification."
      ],
      "senior": [
        "Implement a custom loss function for a deep learning model.",
        "Write code to deploy a machine learning model as a REST API.",
        "Create a distributed data processing pipeline for large datasets.",
        "Implement an algorithm for anomaly detection in time series data.",
        "Write code to optimize hyperparameters for a complex machine learning model."
      ]
    }
  };

  // Domain knowledge questions
  const domainQuestions: {[key: string]: {[key: string]: string[]}} = {
    "Software Engineer": {
      "entry": [
        "Explain the concept of object-oriented programming and its principles.",
        "What is the difference between HTTP and HTTPS?",
        "Explain the concept of a RESTful API.",
        "What is the purpose of a database index?",
        "How does memory management work in your preferred programming language?"
      ],
      "mid": [
        "Explain the CAP theorem and its implications for distributed systems.",
        "What are the SOLID principles of object-oriented design?",
        "How would you approach database schema design for a complex application?",
        "What is the difference between synchronous and asynchronous programming?",
        "Explain the concept of eventual consistency in distributed systems."
      ],
      "senior": [
        "How would you design a system to handle high availability and disaster recovery?",
        "Explain the trade-offs between different database technologies (SQL vs. NoSQL).",
        "What strategies would you employ for managing technical debt in a large codebase?",
        "How would you approach building a scalable microservices architecture?",
        "What considerations are important when designing globally distributed systems?"
      ]
    },
    "Frontend Developer": {
      "entry": [
        "Explain the box model in CSS.",
        "What is the difference between localStorage and sessionStorage?",
        "How does the event loop work in JavaScript?",
        "What is the difference between == and === in JavaScript?",
        "Explain the concept of responsive web design."
      ],
      "mid": [
        "What are Web Components and how do they work?",
        "Explain the Virtual DOM concept and its benefits.",
        "What are the different rendering patterns in web applications?",
        "How does browser caching work?",
        "What are Web Workers and when would you use them?"
      ],
      "senior": [
        "How would you implement a design system for a large organization?",
        "Explain the concept of micro-frontends and their benefits/challenges.",
        "What strategies would you employ to optimize loading performance in a web application?",
        "How would you approach authentication and authorization in a modern web application?",
        "What considerations are important when designing for accessibility?"
      ]
    },
    "Data Scientist": {
      "entry": [
        "What is the difference between supervised and unsupervised learning?",
        "Explain the concept of overfitting and how to prevent it.",
        "What is the curse of dimensionality?",
        "Explain the difference between classification and regression.",
        "What is the purpose of feature scaling in machine learning?"
      ],
      "mid": [
        "Explain the bias-variance tradeoff in machine learning.",
        "What is the difference between bagging and boosting?",
        "How do you handle imbalanced datasets?",
        "Explain the concept of regularization in machine learning models.",
        "What is the difference between precision and recall?"
      ],
      "senior": [
        "How would you approach building a recommendation system for a large e-commerce platform?",
        "Explain the challenges in deploying machine learning models to production.",
        "What considerations are important when designing A/B tests?",
        "How would you handle concept drift in a deployed model?",
        "What ethical considerations are important in data science projects?"
      ]
    }
  };

  // HR discussion questions
  const hrQuestions: {[key: string]: string[]} = {
    "entry": [
      "What are your salary expectations for this role?",
      "How do you handle stress and pressure?",
      "Are you comfortable with our company's work hours and flexibility policies?",
      "What do you know about our company culture and values?",
      "What are your thoughts on remote work versus in-office collaboration?"
    ],
    "mid": [
      "What management style do you work best with?",
      "How do you pursue professional development?",
      "What are your expectations for growth within our company?",
      "How do you balance work and personal life?",
      "What aspects of our company culture appeal to you the most?"
    ],
    "senior": [
      "What leadership qualities do you bring to the team?",
      "How do you approach mentoring junior team members?",
      "What are your long-term career goals?",
      "How would you contribute to our company culture?",
      "What do you look for in an employer to ensure a good fit?"
    ]
  };

  // Determine job category
  const roleKey = Object.keys(technicalQuestions).find(key => 
    jobTitle.toLowerCase().includes(key.toLowerCase())
  ) || "Software Engineer";
  
  // Get questions based on the interview round
  let questions: string[] = [];
  
  switch(round) {
    case "technical":
      questions = technicalQuestions[roleKey][packageLevel] || technicalQuestions[roleKey]["mid"];
      break;
    case "coding":
      questions = codingQuestions[roleKey][packageLevel] || codingQuestions[roleKey]["mid"];
      break;
    case "domain":
      questions = domainQuestions[roleKey][packageLevel] || domainQuestions[roleKey]["mid"];
      break;
    case "hr":
      questions = hrQuestions[packageLevel] || hrQuestions["mid"];
      // Add some common questions to HR round
      questions = [...questions, ...commonQuestions.slice(0, 2)];
      break;
    default:
      questions = commonQuestions;
  }
  
  // Shuffle questions for uniqueness
  return shuffleArray(questions).slice(0, 5); // Limit to 5 questions per round
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
  const [currentRound, setCurrentRound] = useState(0);
  const [roundScores, setRoundScores] = useState<number[]>([0, 0, 0, 0]);
  const [showRoundIntro, setShowRoundIntro] = useState(true);
  
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
  const userEmail = localStorage.getItem('userEmail') || '';

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
    
    // Start with the technical round introduction
    startRound(0);
  }, []);

  // Start a new interview round
  const startRound = (roundIndex: number) => {
    if (roundIndex >= interviewRounds.length) {
      completeInterview();
      return;
    }
    
    setCurrentRound(roundIndex);
    setShowRoundIntro(true);
    
    // Set up the round
    const round = interviewRounds[roundIndex];
    
    // Welcome message for the round
    const welcomeMessage: Message = {
      id: `round-${roundIndex}-welcome`,
      role: "assistant",
      content: `Welcome to Round ${roundIndex + 1}: ${round.name}. ${round.description}`,
      timestamp: new Date(),
    };
    
    setMessages([welcomeMessage]);
    
    // Get job-specific interview questions based on the round
    const questions = getInterviewQuestions(
      resumeData.jobTitle, 
      selectedPackage, 
      round.id
    );
    
    setInterviewQuestions(questions);
    setCurrentQuestion(0);
    
    // Initialize interview scores array
    setInterviewScore(new Array(questions.length).fill(0));
    
    // Reset the timer for each round
    setInterviewTimer(600); // 10 minutes per round
    setIsTimerRunning(false);
  };

  // Start the questions for the current round
  const startRoundQuestions = () => {
    setShowRoundIntro(false);
    setIsTimerRunning(true);
    sendNextQuestion();
  };

  // Complete the entire interview process
  const completeInterview = () => {
    // Calculate overall interview score
    const overallScore = roundScores.reduce((sum, score) => sum + score, 0) / roundScores.length;
    
    // Final message
    const finalMessage: Message = {
      id: "interview-complete",
      role: "assistant",
      content: "Thank you for completing all rounds of the interview process. We appreciate your time and thoughtful responses. Our team will carefully review your performance across all rounds and provide you with feedback. If your profile matches our requirements, we'll contact you soon via email.",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, finalMessage]);
    setIsInterviewComplete(true);
    setIsTimerRunning(false);
    
    // Store interview data in localStorage
    localStorage.setItem('interviewComplete', 'true');
    localStorage.setItem('interviewScore', Math.round(overallScore).toString());
    
    // Store round scores
    localStorage.setItem('interviewRoundScores', JSON.stringify(roundScores));
    
    // Store interview answers for analysis
    const userResponses = messages.filter(m => m.role === "user").map(m => m.content);
    localStorage.setItem('interviewResponses', JSON.stringify(userResponses));
  };

  // Countdown timer for interview
  useEffect(() => {
    if (interviewTimer > 0 && isTimerRunning && !isInterviewComplete) {
      const timer = setTimeout(() => setInterviewTimer(interviewTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (interviewTimer === 0 && !isInterviewComplete) {
      // Auto-complete current round if time runs out
      const timeoutMessage: Message = {
        id: `timeout-${Date.now()}`,
        role: "assistant",
        content: "I notice that our time for this round is up. Let's move on to the next part of the interview process.",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, timeoutMessage]);
      
      // Calculate score for current round and move to next round
      completeCurrentRound();
    }
  }, [interviewTimer, isTimerRunning, isInterviewComplete]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Complete the current round and move to the next
  const completeCurrentRound = () => {
    // Calculate average score for the current round
    const roundAvgScore = interviewScore.reduce((sum, score) => sum + score, 0) / 
                         Math.max(1, interviewScore.length);
    
    // Update round scores
    setRoundScores(prev => {
      const newScores = [...prev];
      newScores[currentRound] = roundAvgScore;
      return newScores;
    });
    
    // Delay before starting next round
    setTimeout(() => {
      startRound(currentRound + 1);
    }, 1500);
  };

  const sendNextQuestion = () => {
    if (currentQuestion < interviewQuestions.length) {
      setIsThinking(true);
      
      // Simulate AI thinking delay
      setTimeout(() => {
        const newMessage: Message = {
          id: `question-${currentRound}-${currentQuestion}`,
          role: "assistant",
          content: interviewQuestions[currentQuestion],
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, newMessage]);
        setIsThinking(false);
        setCurrentQuestion(prev => prev + 1);
      }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
    } else {
      // Round complete
      setIsThinking(true);
      
      setTimeout(() => {
        const roundCompleteMessage: Message = {
          id: `round-${currentRound}-complete`,
          role: "assistant",
          content: `Thank you for completing Round ${currentRound + 1}: ${interviewRounds[currentRound].name}. Let's move on to the next round.`,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, roundCompleteMessage]);
        setIsThinking(false);
        
        // Complete current round and move to next
        completeCurrentRound();
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
    
    // Analyze answer (simulated AI scoring with more variance based on package level and round)
    // Senior level has higher expectations
    const baseScore = 5;
    const packageMultiplier = selectedPackage === 'senior' ? 0.5 : (selectedPackage === 'mid' ? 0.7 : 0.9);
    const roundDifficulty = [0.9, 0.7, 0.8, 1.0]; // Difficulty multiplier by round
    const answerLength = input.length;
    const randomFactor = Math.random() * 2;
    
    // Score calculation - longer answers generally score better, with package-based scaling
    const lengthScore = Math.min(5, Math.floor(answerLength / 100));
    const answerScore = Math.floor(
      baseScore + 
      lengthScore * packageMultiplier * roundDifficulty[currentRound] + 
      randomFactor
    );
    
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
    // Generate more realistic and personalized responses based on job title, package and round
    const roundResponses = {
      0: [ // Technical round
        `I have extensive experience with ${resumeData.jobTitle.toLowerCase().includes("front") ? "JavaScript, React, and modern frontend frameworks" : resumeData.jobTitle.toLowerCase().includes("data") ? "Python, R, and data analysis libraries" : "Java, C++, and backend technologies"}. I've implemented several solutions that improved system performance by 30%.`,
        `My approach to problem-solving involves breaking down complex issues into manageable components, identifying patterns, and applying appropriate algorithms or design patterns.`,
        `I've worked with various version control systems, primarily Git, following branching strategies like GitFlow for collaborative development.`
      ],
      1: [ // Coding round
        `To solve this problem, I would first validate the input and handle edge cases. Then I would implement a solution with O(n) time complexity using a hash map to track frequencies.`,
        `I would approach this by using a two-pointer technique to optimize space complexity. The solution would have O(n) time complexity and O(1) space complexity.`,
        `For this algorithm, I'd use dynamic programming to avoid recalculating subproblems, starting with the base case and building up to the complete solution.`
      ],
      2: [ // Domain round
        `In my experience with ${resumeData.company}, I've implemented ${resumeData.jobTitle.toLowerCase().includes("front") ? "responsive design principles using media queries and CSS Grid" : resumeData.jobTitle.toLowerCase().includes("data") ? "statistical models that improved prediction accuracy by 25%" : "microservices architectures that improved system scalability"}. This approach has consistently delivered positive business outcomes.`,
        `I believe the key challenge in ${resumeData.jobTitle} roles is balancing technical excellence with business requirements. I've addressed this by maintaining clear communication channels with stakeholders and setting realistic expectations.`,
        `When working on distributed systems, ensuring data consistency while maintaining high availability requires careful consideration of the CAP theorem trade-offs. In my projects, I've typically prioritized consistency for financial applications and availability for content delivery systems.`
      ],
      3: [ // HR round
        `My salary expectations align with industry standards for ${resumeData.jobTitle} roles at the ${selectedPackage} level, considering my experience and the value I can bring to ${resumeData.company}.`,
        `I manage work-life balance by setting clear boundaries and practicing effective time management. I believe maintaining this balance improves overall productivity and creativity.`,
        `What attracts me most to ${resumeData.company} is your commitment to innovation and collaborative culture. I'm particularly impressed by your recent projects in ${resumeData.jobTitle.toLowerCase().includes("front") ? "user experience design" : resumeData.jobTitle.toLowerCase().includes("data") ? "predictive analytics" : "cloud infrastructure"}.`
      ]
    };
    
    // Get responses for current round
    const currentRoundResponses = roundResponses[currentRound as keyof typeof roundResponses] || roundResponses[0];
    
    return currentRoundResponses[Math.floor(Math.random() * currentRoundResponses.length)];
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
  
  // Render the round introduction screen
  const renderRoundIntro = () => {
    const round = interviewRounds[currentRound];
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg max-w-2xl mx-auto"
      >
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mr-4">
            {round.icon}
          </div>
          <div>
            <h3 className="text-2xl font-bold">Round {currentRound + 1}: {round.name}</h3>
            <p className="text-gray-600">{round.description}</p>
          </div>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">What to expect:</h4>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>5 questions focused on {round.name.toLowerCase()}</li>
              <li>10 minutes to complete this round</li>
              <li>Your answers will be evaluated for depth and relevance</li>
            </ul>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">Tips for success:</h4>
            <ul className="list-disc list-inside space-y-1 text-green-700">
              <li>Be specific and provide examples from your experience</li>
              <li>Structure your answers clearly</li>
              <li>Stay focused on the question being asked</li>
            </ul>
          </div>
        </div>
        
        <div className="text-center">
          <Button 
            onClick={startRoundQuestions}
            size="lg"
            className="button-glow"
          >
            Begin Round {currentRound + 1} <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </motion.div>
    );
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full flex flex-col"
    >
      {showRoundIntro ? (
        renderRoundIntro()
      ) : (
        <>
          <div className="bg-white/80 shadow-sm p-2 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium">Round {currentRound + 1}: {interviewRounds[currentRound].name}</span>
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
        </>
      )}
    </motion.div>
  );
};

export default VirtualInterview;
