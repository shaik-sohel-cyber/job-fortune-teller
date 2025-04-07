
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import OnlineAssessment from "@/components/OnlineAssessment";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CalendarClock, CheckCircle, ArrowRight, Loader2 } from "lucide-react";

const AssessmentPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockedInfo, setBlockedInfo] = useState<{
    company: string;
    cooldownUntil: string;
    remainingMinutes: number;
  } | null>(null);
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  const [assessmentPassed, setAssessmentPassed] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const checkAccess = () => {
      try {
        // Check if user has completed earlier steps
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

        return true;
      } catch (error) {
        console.error("Error checking access:", error);
        toast({
          title: "Error checking access",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
        return false;
      }
    };

    // Check if assessment was already completed and passed
    const checkAssessmentStatus = () => {
      try {
        const assessmentPassedLS = localStorage.getItem('assessmentPassed');
        if (assessmentPassedLS === 'true') {
          setAssessmentCompleted(true);
          setAssessmentPassed(true);
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
      } catch (error) {
        console.error("Error checking assessment status:", error);
      }
    };

    // Add a small delay for loading animation
    const timer = setTimeout(() => {
      const allowed = checkAccess();
      setIsAllowed(allowed);
      
      if (allowed) {
        checkAssessmentStatus();
      }
      
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate, toast]);

  // Listen for assessment completion
  useEffect(() => {
    const handleAssessmentComplete = (event: Event) => {
      const customEvent = event as CustomEvent<{score: number, passed: boolean}>;
      const { score, passed } = customEvent.detail;
      
      // Store assessment results
      localStorage.setItem('assessmentScore', score.toString());
      localStorage.setItem('assessmentPassed', passed.toString());
      
      setAssessmentCompleted(true);
      setAssessmentPassed(passed);
      
      if (passed) {
        toast({
          title: "Assessment Passed",
          description: "Congratulations! You can now proceed to the interview.",
        });
      } else {
        // Handle failed assessment
        toast({
          title: "Assessment Not Passed",
          description: "Sorry, you didn't meet the required score. Please try again later.",
          variant: "destructive",
        });
        
        // Set cooldown period for this company
        const resumeData = JSON.parse(localStorage.getItem('resumeData') || '{}');
        const company = resumeData.company || '';
        
        if (company) {
          const failedCompanies = JSON.parse(localStorage.getItem('failedCompanies') || '{}');
          const cooldownUntil = new Date();
          cooldownUntil.setMinutes(cooldownUntil.getMinutes() + 30); // 30 minute cooldown
          
          failedCompanies[company] = {
            lastAttempt: new Date().toISOString(),
            cooldownUntil: cooldownUntil.toISOString()
          };
          
          localStorage.setItem('failedCompanies', JSON.stringify(failedCompanies));
        }
      }
    };

    // Add event listener for assessment completion
    window.addEventListener('assessmentComplete', handleAssessmentComplete);
    
    return () => {
      window.removeEventListener('assessmentComplete', handleAssessmentComplete);
    };
  }, [navigate, toast]);

  const handleProceedToInterview = () => {
    navigate('/interview');
  };

  const handleTryDifferentCompany = () => {
    navigate('/upload');
  };

  const handleViewDashboard = () => {
    navigate('/dashboard');
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen pt-20 flex flex-col items-center justify-center bg-gradient-to-b from-black to-slate-900"
      >
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-lg text-slate-300">Preparing your assessment...</p>
        <p className="text-sm text-slate-400 mt-2">Loading questions for your job role</p>
      </motion.div>
    );
  }

  if (!isAllowed) {
    return null; // Redirect is handled in useEffect
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-20 pb-10 px-4 flex flex-col bg-gradient-to-b from-black to-slate-900 text-white"
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
                onClick={handleViewDashboard} 
                variant="outline" 
                className="text-white border-slate-600 hover:bg-slate-700"
              >
                View Dashboard
              </Button>
              <Button 
                onClick={handleTryDifferentCompany} 
                className="button-glow"
              >
                Try Different Company
              </Button>
            </div>
          </motion.div>
        </div>
      ) : assessmentCompleted && assessmentPassed ? (
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-800 text-white shadow-lg rounded-xl overflow-hidden p-8 flex flex-col items-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold mb-2">Assessment Completed Successfully!</h2>
            
            <div className="w-full max-w-md bg-green-900/30 border border-green-800 rounded-lg p-4 my-6 text-center">
              <p className="text-white">
                Congratulations! You've passed the assessment for <span className="font-semibold">
                  {JSON.parse(localStorage.getItem('resumeData') || '{}').company || 'this company'}
                </span>.
              </p>
              
              <div className="flex items-center justify-center gap-2 my-4">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium text-green-400">
                  Score: {localStorage.getItem('assessmentScore') || '0'}%
                </span>
              </div>
              
              <p className="text-sm text-slate-300">
                You are now eligible to proceed to the interview round
              </p>
            </div>
            
            <div className="bg-slate-700 p-4 rounded-lg mb-6 text-left w-full max-w-md">
              <h4 className="font-medium mb-2">What happens next?</h4>
              <ul className="space-y-2 text-sm pl-2 text-slate-300">
                <li>• You'll participate in a multi-round interview process</li>
                <li>• The interview includes technical, coding, domain-specific, and HR rounds</li>
                <li>• Prepare to answer questions relevant to your job role</li>
                <li>• Your performance will be evaluated against company requirements</li>
              </ul>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={handleViewDashboard} 
                variant="outline" 
                className="text-white border-slate-600 hover:bg-slate-700"
              >
                View Dashboard
              </Button>
              <Button 
                onClick={handleProceedToInterview} 
                className="button-glow"
              >
                Proceed to Interview <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
          <div className="bg-slate-800 text-white shadow-lg rounded-xl overflow-hidden mb-6">
            <div className="bg-primary p-4 text-white">
              <h2 className="text-xl font-semibold">Technical Assessment</h2>
              <p className="text-sm text-white/80">Complete the assessment to proceed to your interview</p>
            </div>
            <div className="p-4 bg-slate-700/50">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Company:</span> {JSON.parse(localStorage.getItem('resumeData') || '{}').company || 'Tech Company'}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Role:</span> {JSON.parse(localStorage.getItem('resumeData') || '{}').jobTitle || 'Software Developer'}
                  </p>
                </div>
                <div className="flex items-center bg-slate-800 px-3 py-1.5 rounded-lg text-sm gap-2">
                  <CalendarClock className="h-4 w-4 text-yellow-500" />
                  <span>Time Limit: 10 minutes</span>
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col">
              <OnlineAssessment />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AssessmentPage;
