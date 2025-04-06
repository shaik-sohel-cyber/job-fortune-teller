
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
    // Store verification results
    const verificationResults = {
      verifiedItems: verificationItems.filter(item => item.status === 'verified').length,
      totalItems: verificationItems.length,
      passedVerification: verificationItems.filter(item => item.status === 'verified').length >= 3,
      timestamp: new Date().toISOString(),
    };
    
    localStorage.setItem('verificationResults', JSON.stringify(verificationResults));
    
    // Navigate to assessment
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
          <h2 className="text-3xl font-bold">Resume Verification</h2>
          <p className="text-muted-foreground">
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
                  ? 'border-green-200 bg-green-50' 
                  : item.status === 'failed'
                    ? 'border-red-200 bg-red-50'
                    : item.status === 'verifying'
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-gray-200'
              }`}
            >
              <span className="font-medium">{item.label}</span>
              <div>
                {item.status === 'pending' && (
                  <div className="h-6 w-6 rounded-full border-2 border-gray-300"></div>
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
            <div className="p-4 rounded-lg border text-center my-6">
              <h3 className="text-xl font-medium mb-2">Verification Complete</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {verificationItems.filter(item => item.status === 'verified').length} out of {verificationItems.length} items verified successfully.
              </p>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-4">
                <div 
                  className={`h-full ${getProgressColor()}`}
                  style={{ width: `${(verificationItems.filter(item => item.status === 'verified').length / verificationItems.length) * 100}%` }}
                ></div>
              </div>
              <Button onClick={handleContinue} className="button-glow w-full">
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
