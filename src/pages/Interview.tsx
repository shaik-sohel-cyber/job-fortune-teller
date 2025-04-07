
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import VirtualInterview from "@/components/VirtualInterview";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Interview = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAccessAllowed, setIsAccessAllowed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const checkAccess = () => {
      try {
        // Check if user has completed the required steps in order
        if (!localStorage.getItem('resumeData')) {
          toast({
            title: "Resume not uploaded",
            description: "Please upload your resume first.",
            variant: "destructive",
          });
          navigate('/upload');
          return false;
        }

        if (!localStorage.getItem('verificationResults')) {
          toast({
            title: "Resume not verified",
            description: "Please complete the verification process first.",
            variant: "destructive",
          });
          navigate('/verification');
          return false;
        }

        if (!localStorage.getItem('selectedPackage')) {
          toast({
            title: "Package not selected",
            description: "Please select a package first.",
            variant: "destructive",
          });
          navigate('/package-selection');
          return false;
        }

        // Check if assessment was completed and passed
        const assessmentPassed = localStorage.getItem('assessmentPassed');
        const assessmentScore = localStorage.getItem('assessmentScore');
        
        if (!assessmentScore) {
          toast({
            title: "Assessment not completed",
            description: "Please complete the assessment first.",
            variant: "destructive",
          });
          navigate('/assessment');
          return false;
        }

        // Get company and role for display
        const resumeData = JSON.parse(localStorage.getItem('resumeData') || '{}');
        setCompany(resumeData.company || 'Tech Company');
        setRole(resumeData.jobTitle || 'Software Developer');

        // Only allow access if assessment was passed with required score
        if (assessmentPassed !== "true") {
          toast({
            title: "Assessment not passed",
            description: "You need to pass the assessment to proceed to the interview.",
            variant: "destructive",
          });
          navigate('/assessment');
          return false;
        }

        return true;
      } catch (error) {
        console.error("Error checking access:", error);
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
        return false;
      }
    };

    // Simulate loading with a minimum delay for better UX
    const timer = setTimeout(() => {
      const allowed = checkAccess();
      setIsAccessAllowed(allowed);
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen pt-20 flex flex-col items-center justify-center bg-gradient-to-b from-black to-slate-900"
      >
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-lg text-slate-300">Preparing your interview...</p>
        <p className="text-sm text-slate-400 mt-2">This may take a moment</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-20 pb-10 px-4 bg-gradient-to-b from-black to-slate-900 text-white"
    >
      {isAccessAllowed ? (
        <div className="max-w-6xl mx-auto">
          <div className="bg-slate-800/80 backdrop-blur-sm p-4 rounded-lg mb-6">
            <h1 className="text-2xl font-bold">Virtual Interview: {company}</h1>
            <p className="text-slate-300">Position: {role}</p>
          </div>
          <VirtualInterview />
        </div>
      ) : (
        <div className="max-w-4xl mx-auto w-full bg-slate-800/90 backdrop-blur-sm shadow-lg rounded-xl overflow-hidden p-8 text-center">
          <div className="w-16 h-16 bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-white">Access Restricted</h2>
          <p className="text-slate-300 mb-6">
            You need to pass the technical assessment before proceeding to the interview.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate('/assessment')} className="button-glow">
              Take Assessment
            </Button>
            <Button onClick={() => navigate('/dashboard')} variant="outline" className="border-slate-600 hover:bg-slate-700">
              Go to Dashboard
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Interview;
