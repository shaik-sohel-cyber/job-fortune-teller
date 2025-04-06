
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, X, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface VerificationItem {
  id: string;
  label: string;
  status: "pending" | "verifying" | "verified" | "failed";
}

const ResumeVerification = () => {
  const [verificationItems, setVerificationItems] = useState<VerificationItem[]>([
    { id: 'personal', label: 'Personal Information', status: 'pending' },
    { id: 'education', label: 'Education History', status: 'pending' },
    { id: 'experience', label: 'Work Experience', status: 'pending' },
    { id: 'skills', label: 'Technical Skills', status: 'pending' },
    { id: 'projects', label: 'Projects', status: 'pending' },
  ]);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if verification has already been completed
    const verificationResults = localStorage.getItem('verificationResults');
    if (verificationResults) {
      try {
        const parsedResults = JSON.parse(verificationResults);
        // If verification was already done and passed, skip to assessment
        if (parsedResults.passedVerification) {
          console.log("Verification already completed successfully");
          setIsComplete(true);
          setProgress(100);
          
          // Set all items as verified
          setVerificationItems(prev => 
            prev.map(item => ({ ...item, status: 'verified' }))
          );
          
          return;
        }
      } catch (error) {
        console.error("Error parsing verification results", error);
      }
    }
    
    const resumeData = localStorage.getItem('resumeData');
    
    if (!resumeData) {
      toast({
        title: "No resume data found",
        description: "Please upload your resume first.",
        variant: "destructive",
      });
      navigate('/upload');
      return;
    }
    
    // Start verification process
    startVerification();
  }, []);
  
  const startVerification = () => {
    // Simulate verification process with timed status changes
    const verifyWithDelay = (index: number) => {
      if (index >= verificationItems.length) {
        // All items verified
        setIsComplete(true);
        return;
      }
      
      // Update current item to verifying
      setVerificationItems(prev => 
        prev.map((item, i) => 
          i === index ? { ...item, status: 'verifying' } : item
        )
      );
      
      // Update progress
      setProgress((index / verificationItems.length) * 100);
      
      // Random verification time between 1-3 seconds
      const verificationTime = 1000 + Math.random() * 2000;
      
      setTimeout(() => {
        // Generate random success/failure (90% success rate)
        const isSuccess = Math.random() < 0.9;
        
        // Update current item status
        setVerificationItems(prev => 
          prev.map((item, i) => 
            i === index ? { ...item, status: isSuccess ? 'verified' : 'failed' } : item
          )
        );
        
        // Show toast for failures
        if (!isSuccess) {
          toast({
            title: `Verification issue with ${verificationItems[index].label}`,
            description: "This may affect your interview process.",
            variant: "destructive",
          });
        }
        
        // Move to next item
        setCurrentStep(index + 1);
        
        // Verify next item after a short delay
        setTimeout(() => verifyWithDelay(index + 1), 500);
      }, verificationTime);
    };
    
    // Start with first item
    verifyWithDelay(0);
  };
  
  const handleContinue = () => {
    // Count verified items
    const verifiedCount = verificationItems.filter(item => item.status === 'verified').length;
    const totalItems = verificationItems.length;
    
    // Determine if verification passed (need at least 3 verified items)
    const passedVerification = verifiedCount >= 3;
    
    // Store verification results
    const verificationResults = {
      verifiedItems: verifiedCount,
      totalItems: totalItems,
      passedVerification: passedVerification,
      timestamp: new Date().toISOString(),
    };
    
    // Store results in localStorage
    localStorage.setItem('verificationResults', JSON.stringify(verificationResults));
    
    if (!passedVerification) {
      toast({
        title: "Verification Failed",
        description: "Not enough items were successfully verified. You need at least 3 verified items to proceed.",
        variant: "destructive",
      });
      return;
    }
    
    // If passed, navigate to assessment
    navigate('/assessment');
  };
  
  const getProgressColor = () => {
    const verifiedCount = verificationItems.filter(item => item.status === 'verified').length;
    const percentage = (verifiedCount / verificationItems.length) * 100;
    
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-2xl mx-auto p-6"
    >
      <div className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white">Resume Verification</h2>
          <p className="text-slate-300">
            We're verifying the information on your resume for accuracy and completeness.
          </p>
        </div>
        
        <div className="mb-4">
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="space-y-4">
          {verificationItems.map((item) => (
            <div 
              key={item.id}
              className={`p-4 border rounded-lg flex items-center justify-between transition-all ${
                item.status === 'verified' 
                  ? 'border-green-500 bg-green-900/30 text-white' 
                  : item.status === 'failed'
                    ? 'border-red-500 bg-red-900/30 text-white'
                    : item.status === 'verifying'
                      ? 'border-blue-500 bg-blue-900/30 text-white'
                      : 'border-slate-600 bg-slate-800/30 text-white'
              }`}
            >
              <span className="font-medium">{item.label}</span>
              <div>
                {item.status === 'pending' && (
                  <div className="h-6 w-6 rounded-full border-2 border-slate-500"></div>
                )}
                {item.status === 'verifying' && (
                  <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
                )}
                {item.status === 'verified' && (
                  <Check className="h-6 w-6 text-green-500" />
                )}
                {item.status === 'failed' && (
                  <X className="h-6 w-6 text-red-500" />
                )}
              </div>
            </div>
          ))}
        </div>
        
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="p-4 rounded-lg border border-slate-700 bg-slate-800 text-white text-center my-6">
              <h3 className="text-xl font-medium mb-2">Verification Complete</h3>
              <p className="text-sm text-slate-300 mb-4">
                {verificationItems.filter(item => item.status === 'verified').length} out of {verificationItems.length} items verified successfully.
              </p>
              <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden mb-4">
                <div 
                  className={`h-full ${getProgressColor()}`}
                  style={{ width: `${(verificationItems.filter(item => item.status === 'verified').length / verificationItems.length) * 100}%` }}
                ></div>
              </div>
              <Button onClick={handleContinue} className="button-glow w-full text-white">
                Continue to Technical Assessment <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ResumeVerification;
