
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import ResumeVerification from "@/components/ResumeVerification";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const VerificationPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Check if resume is uploaded before verification
    if (!localStorage.getItem('resumeData')) {
      toast({
        title: "Resume not uploaded",
        description: "Please upload your resume first.",
        variant: "destructive",
      });
      navigate('/upload');
      return;
    }
    
    // Small delay for loading animation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [navigate, toast, isAuthenticated]);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen pt-20 flex flex-col items-center justify-center bg-gradient-to-b from-black to-slate-900"
      >
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-lg text-slate-300">Preparing resume verification...</p>
        <p className="text-sm text-slate-400 mt-2">Analyzing your resume details</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-20 pb-10 px-4 flex flex-col items-center justify-center bg-gradient-to-b from-black to-slate-900 text-white"
    >
      <div className="w-full max-w-3xl mb-8">
        <div className="bg-slate-800/90 border-slate-700 p-6 rounded-lg">
          <div className="flex items-center mb-6 text-primary">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-4">
              <span className="text-xl font-bold">2</span>
            </div>
            <h2 className="text-2xl font-bold">Resume Verification</h2>
          </div>
          
          <div className="space-y-1 mb-6">
            <p className="text-slate-300">Please verify your resume information before proceeding to the assessment.</p>
            <p className="text-sm text-slate-400">This helps ensure we have accurate information about your skills and experience.</p>
          </div>
        </div>
      </div>
      
      <ResumeVerification />
    </motion.div>
  );
};

export default VerificationPage;
