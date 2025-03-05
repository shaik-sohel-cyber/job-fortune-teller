
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import {
  Check,
  X,
  ArrowLeft,
  Download,
  ChevronDown,
  ChevronUp,
  LineChart,
  Lightbulb,
  AlertTriangle,
} from "lucide-react";

const Results = () => {
  const [progress, setProgress] = useState(0);
  const [showDetail, setShowDetail] = useState<string | null>(null);
  const [isPredicting, setIsPredicting] = useState(true);
  const [jobScore, setJobScore] = useState(0);
  const navigate = useNavigate();
  
  // Fetch resume data from localStorage
  const resumeData = JSON.parse(localStorage.getItem('resumeData') || '{"jobTitle": "Software Developer", "company": "Tech Company"}');

  useEffect(() => {
    // Simulate loading progress
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 10;
        if (newProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsPredicting(false);
            setJobScore(78); // This would be the AI prediction in a real app
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 400);

    return () => {
      clearInterval(timer);
    };
  }, []);
  
  const toggleDetail = (id: string) => {
    if (showDetail === id) {
      setShowDetail(null);
    } else {
      setShowDetail(id);
    }
  };

  const scoreColor = () => {
    if (jobScore > 80) return "text-green-500";
    if (jobScore > 60) return "text-amber-500";
    return "text-red-500";
  };

  const progressColor = () => {
    if (jobScore > 80) return "bg-green-500";
    if (jobScore > 60) return "bg-amber-500";
    return "bg-red-500";
  };

  // Sample strengths and areas for improvement
  const strengths = [
    "Strong technical skills that match job requirements",
    "Previous relevant experience in similar roles",
    "Clear communication skills demonstrated during interview",
    "Problem-solving approach shows depth and creativity"
  ];

  const improvements = [
    "Limited experience with specific technologies mentioned in job description",
    "Could provide more concrete examples of leadership experience",
    "Consider elaborating more on project outcomes and metrics",
    "Responses could better highlight alignment with company culture"
  ];

  // Sample evaluation categories
  const evaluationCategories = [
    {
      id: "technical",
      name: "Technical Skills",
      score: 82,
      description: "Your technical knowledge is strong, particularly in core technologies required for this role. You demonstrated good understanding of key concepts and practical application."
    },
    {
      id: "communication",
      name: "Communication Skills",
      score: 75,
      description: "You articulated your thoughts clearly but could improve in structuring responses more concisely. Your ability to explain complex concepts was evident."
    },
    {
      id: "experience",
      name: "Relevant Experience",
      score: 68,
      description: "While you have experience in related areas, there are some gaps in specific experience this role requires. Your transferable skills partially compensate for this."
    },
    {
      id: "cultural",
      name: "Cultural Fit",
      score: 85,
      description: "Your values and work approach appear well-aligned with the company culture. Your responses showed enthusiasm and understanding of the company's mission."
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-4xl mx-auto p-6"
    >
      {isPredicting ? (
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="glass-card rounded-xl p-8 text-center"
        >
          <h2 className="text-2xl font-bold mb-6">Analyzing Your Interview Responses</h2>
          <div className="max-w-md mx-auto">
            <Progress value={progress} className="h-2 mb-6" />
            <p className="text-muted-foreground">
              Our AI is evaluating your responses against job requirements and industry standards...
            </p>
          </div>
          
          <div className="mt-8 flex justify-center">
            <div className="relative h-32 w-32">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin-slow" />
              <div className="absolute inset-0 flex items-center justify-center">
                <LineChart className="h-12 w-12 text-primary/70" />
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card rounded-xl p-8"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">Interview Results</h2>
                <p className="text-muted-foreground">
                  For {resumeData.jobTitle} at {resumeData.company}
                </p>
              </div>
              
              <div className="text-center">
                <div className="relative inline-block">
                  <svg className="w-32 h-32">
                    <circle
                      className="text-muted stroke-current"
                      strokeWidth="6"
                      stroke="currentColor"
                      fill="transparent"
                      r="58"
                      cx="64"
                      cy="64"
                    />
                    <circle
                      className={`${progressColor()} stroke-current`}
                      strokeWidth="6"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="58"
                      cx="64"
                      cy="64"
                      strokeDasharray="364.425"
                      strokeDashoffset={364.425 * (1 - jobScore / 100)}
                    />
                  </svg>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className={`text-4xl font-bold ${scoreColor()}`}>{jobScore}%</span>
                  </div>
                </div>
                <p className="font-semibold mt-2">Success Prediction</p>
              </div>
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  Key Strengths
                </h3>
                <ul className="space-y-2">
                  {strengths.map((strength, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start"
                    >
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                      <span>{strength}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center">
                  <Lightbulb className="h-5 w-5 text-amber-500 mr-2" />
                  Areas for Improvement
                </h3>
                <ul className="space-y-2">
                  {improvements.map((improvement, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                      className="flex items-start"
                    >
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 shrink-0" />
                      <span>{improvement}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card rounded-xl overflow-hidden"
          >
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold">Detailed Evaluation</h3>
            </div>
            
            <div className="divide-y">
              {evaluationCategories.map((category) => (
                <div key={category.id} className="p-6">
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleDetail(category.id)}
                  >
                    <div className="flex items-center">
                      <h4 className="font-semibold">{category.name}</h4>
                      <div className={`ml-4 px-2 py-1 rounded-full text-xs font-medium ${
                        category.score > 80 
                          ? "bg-green-100 text-green-800" 
                          : category.score > 60 
                            ? "bg-amber-100 text-amber-800" 
                            : "bg-red-100 text-red-800"
                      }`}>
                        {category.score}%
                      </div>
                    </div>
                    {showDetail === category.id ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  
                  {showDetail === category.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 text-muted-foreground"
                    >
                      <p>{category.description}</p>
                      <Progress value={category.score} className="h-1.5 mt-2" />
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-between"
          >
            <Button 
              variant="outline"
              onClick={() => navigate("/interview")}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Interview
            </Button>
            
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
              
              <Button
                onClick={() => navigate("/")}
                className="button-glow"
              >
                Start New Assessment
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Results;
