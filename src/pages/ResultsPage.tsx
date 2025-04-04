
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Results from "@/components/Results";
import { Loader2 } from "lucide-react";

const ResultsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    // Validate that the user has completed the entire process in order
    const checkAccess = () => {
      try {
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

        if (!localStorage.getItem('assessmentScore')) {
          toast({
            title: "Assessment not completed",
            description: "Please complete the technical assessment first.",
            variant: "destructive",
          });
          navigate('/assessment');
          return false;
        }

        if (!localStorage.getItem('interviewComplete')) {
          toast({
            title: "Interview not completed",
            description: "Please complete the interview process first.",
            variant: "destructive",
          });
          navigate('/interview');
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

    // Add a small delay for loading animation to prevent flashing of content
    const timer = setTimeout(() => {
      const allowed = checkAccess();
      setIsAllowed(allowed);
      setIsLoading(false);
    }, 1000);

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
        <p className="text-lg text-slate-300">Generating your results...</p>
        <p className="text-sm text-slate-400 mt-2">Analyzing performance data</p>
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
      {isAllowed && (
        <div className="max-w-6xl mx-auto">
          <div className="bg-slate-800/80 backdrop-blur-sm p-4 rounded-lg mb-6">
            <h1 className="text-2xl font-bold">Your Assessment & Interview Results</h1>
            <p className="text-slate-300">
              Company: {JSON.parse(localStorage.getItem('resumeData') || '{}').company || 'Tech Company'}
            </p>
          </div>
          <Results />
        </div>
      )}
    </motion.div>
  );
};

export default ResultsPage;
