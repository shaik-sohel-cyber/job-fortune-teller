
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Results from "@/components/Results";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ResultsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Validate that the user has completed the required steps
    if (!localStorage.getItem('interviewComplete')) {
      toast({
        title: "Interview not completed",
        description: "Please complete the interview process first.",
        variant: "destructive",
      });
      navigate('/interview');
    } else {
      setIsLoading(false);
    }
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-20 pb-10 px-4"
    >
      <Card className="w-full max-w-6xl mx-auto bg-white/70 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Your Interview Results</CardTitle>
        </CardHeader>
        <CardContent>
          <Results />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ResultsPage;
