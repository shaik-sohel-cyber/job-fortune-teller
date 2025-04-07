
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import VirtualInterview from "@/components/VirtualInterview";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Interview = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAccessAllowed, setIsAccessAllowed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAccess = () => {
      // Check if user has completed the required steps
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
      if (!assessmentPassed) {
        toast({
          title: "Assessment not completed",
          description: "Please complete the assessment first.",
          variant: "destructive",
        });
        navigate('/assessment');
        return false;
      }

      // Only allow access if assessment was passed
      if (assessmentPassed === "false") {
        toast({
          title: "Assessment not passed",
          description: "You need to pass the assessment to proceed to the interview.",
          variant: "destructive",
        });
        navigate('/assessment');
        return false;
      }

      return true;
    };

    const allowed = checkAccess();
    setIsAccessAllowed(allowed);
    setIsLoading(false);
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-b from-black to-slate-900">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-20 pb-10 px-4 bg-gradient-to-b from-black to-slate-900"
    >
      {isAccessAllowed ? (
        <VirtualInterview />
      ) : (
        <div className="max-w-4xl mx-auto w-full bg-white/70 backdrop-blur-sm shadow-lg rounded-xl overflow-hidden p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Access Restricted</h2>
          <p className="text-gray-600 mb-6">
            You need to pass the technical assessment before proceeding to the interview.
          </p>
          <Button onClick={() => navigate('/assessment')} className="button-glow">
            Take Assessment
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default Interview;
