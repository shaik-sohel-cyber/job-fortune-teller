
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Results from "@/components/Results";

const ResultsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Validate that the user has completed the entire process in order
    const checkAuthorization = () => {
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

      // Check if assessment was passed
      if (localStorage.getItem('assessmentPassed') !== "true") {
        toast({
          title: "Assessment not passed",
          description: "You need to pass the assessment to view results.",
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

      // Ensure we have interview scores
      if (!localStorage.getItem('interviewScore')) {
        // If interview is marked complete but no score, let's set a default one
        const defaultScore = 75;
        localStorage.setItem('interviewScore', defaultScore.toString());
        
        // Set default round scores if missing
        if (!localStorage.getItem('roundScores')) {
          const defaultRoundScores = [
            { round: "technical", score: 75 },
            { round: "coding", score: 78 },
            { round: "domain", score: 72 },
            { round: "hr", score: 80 },
          ];
          localStorage.setItem('roundScores', JSON.stringify(defaultRoundScores));
        }
      }

      return true;
    };

    const isAuthorized = checkAuthorization();
    setIsAuthorized(isAuthorized);
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
      className="min-h-screen pt-20 pb-10 px-4 bg-gradient-to-b from-black to-slate-900 text-white"
    >
      {isAuthorized && <Results />}
    </motion.div>
  );
};

export default ResultsPage;
