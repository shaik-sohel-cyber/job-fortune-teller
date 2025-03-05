
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import VirtualInterview from "@/components/VirtualInterview";

const Interview = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user has completed earlier steps
    if (!localStorage.getItem('resumeData')) {
      toast({
        title: "Resume not uploaded",
        description: "Please upload your resume first.",
        variant: "destructive",
      });
      navigate('/upload');
      return;
    }

    if (!localStorage.getItem('verificationResults')) {
      toast({
        title: "Resume not verified",
        description: "Please complete the verification process first.",
        variant: "destructive",
      });
      navigate('/verification');
      return;
    }

    if (!localStorage.getItem('assessmentScore')) {
      toast({
        title: "Assessment not completed",
        description: "Please complete the technical assessment first.",
        variant: "destructive",
      });
      navigate('/assessment');
      return;
    }

    if (!localStorage.getItem('selectedPackage')) {
      toast({
        title: "Package not selected",
        description: "Please select a package first.",
        variant: "destructive",
      });
      navigate('/package-selection');
      return;
    }
  }, [navigate, toast]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-20 pb-10 px-4 flex flex-col"
    >
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full bg-white/70 backdrop-blur-sm shadow-lg rounded-xl overflow-hidden">
        <div className="bg-primary p-4 text-white">
          <h2 className="text-xl font-semibold">Virtual Interview</h2>
          <p className="text-sm text-white/80">Answer the questions as you would in a real interview</p>
        </div>
        <div className="flex-1 flex flex-col">
          <VirtualInterview />
        </div>
      </div>
    </motion.div>
  );
};

export default Interview;
