
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mic, MicOff, Send, User, CornerDownRight, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Sample interview questions
const interviewQuestions = [
  "Tell me about your experience with this specific technology mentioned in your resume.",
  "How would you handle a situation where a project deadline is at risk?",
  "Describe a challenging project you worked on and how you overcame obstacles.",
  "What do you consider your greatest professional achievement?",
  "How do you stay updated with the latest trends in your field?",
  "Tell me about a time when you had to learn a new skill quickly for a project.",
  "How do you handle feedback or criticism?",
  "Where do you see yourself professionally in 5 years?",
  "What makes you the right candidate for this position?",
  "Do you have any questions for me about the role or company?"
];

const VirtualInterview = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Fetch resume data from localStorage
  const resumeData = JSON.parse(localStorage.getItem('resumeData') || '{"jobTitle": "Software Developer", "company": "Tech Company"}');

  useEffect(() => {
    // Welcome message
    const welcomeMessage: Message = {
      id: "welcome",
      role: "assistant",
      content: `Welcome to your virtual interview for the ${resumeData.jobTitle} position at ${resumeData.company}. I'll be asking you a series of questions to evaluate your fit for this role. Please answer honestly and thoroughly.`,
      timestamp: new Date(),
    };
    
    setMessages([welcomeMessage]);
    
    // Send first question after a delay
    setTimeout(() => {
      sendNextQuestion();
    }, 1000);
  }, []);

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
      }, 1000);
    } else {
      // Interview complete
      setIsThinking(true);
      
      setTimeout(() => {
        const finalMessage: Message = {
          id: "interview-complete",
          role: "assistant",
          content: "Thank you for completing the interview. I'll now analyze your responses and provide a job success prediction. Click the 'View Results' button when you're ready.",
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, finalMessage]);
        setIsThinking(false);
        setIsInterviewComplete(true);
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
      
      // Simulate speech-to-text conversion
      setInput("This is a simulated response based on voice input for the interview question.");
    } else {
      setIsRecording(true);
      toast({
        title: "Voice recording started",
        description: "Speak clearly to record your answer.",
      });
    }
  };

  const viewResults = () => {
    // Store interview data in localStorage
    localStorage.setItem('interviewComplete', 'true');
    
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
