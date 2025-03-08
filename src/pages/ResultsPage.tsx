
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Results from "@/components/Results";

const ResultsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Validate that the user has completed the required steps
    if (!localStorage.getItem('interviewComplete')) {
      toast({
        title: "Interview not completed",
        description: "Please complete the interview process first.",
        variant: "destructive",
      });
      navigate('/interview');
    }
  }, [navigate, toast]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-20 pb-10 px-4"
    >
      <Results />
    </motion.div>
  );
};

export default ResultsPage;
