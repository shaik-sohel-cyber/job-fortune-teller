
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import OnlineAssessment from "@/components/OnlineAssessment";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CalendarClock } from "lucide-react";

const AssessmentPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockedInfo, setBlockedInfo] = useState<{
    company: string;
    cooldownUntil: string;
    remainingMinutes: number;
  } | null>(null);

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

    if (!localStorage.getItem('selectedPackage')) {
      toast({
        title: "Package not selected",
        description: "Please select a package first.",
        variant: "destructive",
      });
      navigate('/package-selection');
      return;
    }

    // Check if company is in cooldown period
    const resumeData = JSON.parse(localStorage.getItem('resumeData') || '{}');
    const company = resumeData.company || '';
    const failedCompanies = JSON.parse(localStorage.getItem('failedCompanies') || '{}');
    
    if (failedCompanies[company]) {
      const cooldownUntil = new Date(failedCompanies[company].cooldownUntil);
      const currentDate = new Date();
      
      if (cooldownUntil > currentDate) {
        // Calculate remaining minutes
        const diffTime = cooldownUntil.getTime() - currentDate.getTime();
        const diffMinutes = Math.ceil(diffTime / (1000 * 60));
        
        setIsBlocked(true);
        setBlockedInfo({
          company,
          cooldownUntil: cooldownUntil.toLocaleTimeString(),
          remainingMinutes: diffMinutes
        });
        
        toast({
          title: "Assessment Blocked",
          description: `You can retry this assessment after ${diffMinutes} minutes.`,
          variant: "destructive",
        });
      }
    }
  }, [navigate, toast]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-20 pb-10 px-4 flex flex-col bg-black"
    >
      {isBlocked && blockedInfo ? (
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-800 text-white shadow-lg rounded-xl overflow-hidden p-8 flex flex-col items-center"
          >
            <div className="w-20 h-20 bg-red-900/50 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="h-10 w-10 text-red-500" />
            </div>
            
            <h2 className="text-2xl font-bold mb-2">Assessment Access Blocked</h2>
            
            <div className="w-full max-w-md bg-red-900/30 border border-red-800 rounded-lg p-4 my-6 text-center">
              <p className="text-white">
                You recently attempted an assessment for <span className="font-semibold">{blockedInfo.company}</span> but did not meet the required score.
              </p>
              
              <div className="flex items-center justify-center gap-2 my-4">
                <CalendarClock className="h-5 w-5 text-primary" />
                <span className="font-medium text-primary">
                  Cooldown Period: {blockedInfo.remainingMinutes} minutes remaining
                </span>
              </div>
              
              <p className="text-sm text-slate-300">
                You can retry after {blockedInfo.cooldownUntil}
              </p>
            </div>
            
            <div className="bg-slate-700 p-4 rounded-lg mb-6 text-left w-full max-w-md">
              <h4 className="font-medium mb-2">What should you do now?</h4>
              <ul className="space-y-2 text-sm pl-2 text-slate-300">
                <li>• Review the suggested improvement topics from your previous attempt</li>
                <li>• Practice relevant technical skills</li>
                <li>• Return after the cooldown period with improved knowledge</li>
                <li>• Try applying to other companies in the meantime</li>
              </ul>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={() => navigate('/')} 
                variant="outline" 
                className="text-white border-slate-600 hover:bg-slate-700"
              >
                Return Home
              </Button>
              <Button 
                onClick={() => navigate('/upload')} 
                className="button-glow"
              >
                Try Different Company
              </Button>
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full bg-slate-800 shadow-lg rounded-xl overflow-hidden">
          <div className="bg-primary p-4 text-white">
            <h2 className="text-xl font-semibold">Technical Assessment</h2>
            <p className="text-sm text-white/80">Complete the assessment to proceed to your interview</p>
          </div>
          <div className="flex-1 flex flex-col">
            <OnlineAssessment />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AssessmentPage;
