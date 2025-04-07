
import { motion } from "framer-motion";
import ResumeUpload from "@/components/ResumeUpload";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, ArrowRight, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Upload = () => {
  const { toast } = useToast();
  const [resumeData, setResumeData] = useState<any>(null);
  const [showResumeContent, setShowResumeContent] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    // If user isn't authenticated, they shouldn't be here
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Check for existing resume data
    const storedResumeData = localStorage.getItem('resumeData');
    if (storedResumeData) {
      setResumeData(JSON.parse(storedResumeData));
      toast({
        title: "Resume already uploaded",
        description: "You can continue with your existing resume or upload a new one.",
      });
    }
  }, [toast, isAuthenticated, navigate]);

  // Listen for changes to localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const storedData = localStorage.getItem('resumeData');
      if (storedData) {
        setResumeData(JSON.parse(storedData));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Custom event listener for our app
    const handleResumeUploaded = () => {
      const storedData = localStorage.getItem('resumeData');
      if (storedData) {
        setResumeData(JSON.parse(storedData));
      }
    };
    
    window.addEventListener('resumeUploaded', handleResumeUploaded);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('resumeUploaded', handleResumeUploaded);
    };
  }, []);

  const toggleResumeContent = () => {
    setShowResumeContent(!showResumeContent);
  };

  const handleContinue = () => {
    if (resumeData) {
      // Clear any previous assessment or interview data to ensure proper sequence
      localStorage.removeItem('verificationResults');
      localStorage.removeItem('assessmentScore');
      localStorage.removeItem('assessmentPassed');
      localStorage.removeItem('interviewComplete');
      localStorage.removeItem('interviewResults');
      
      navigate('/verification');
    } else {
      toast({
        title: "No resume uploaded",
        description: "Please upload your resume before continuing.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-20 pb-10 px-4 flex flex-col items-center justify-center bg-gradient-to-b from-black to-slate-900 text-white"
    >
      <div className="w-full max-w-3xl mb-8">
        <Card className="bg-slate-800/90 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center mb-6 text-primary">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h2 className="text-2xl font-bold">Resume Upload</h2>
            </div>
            
            <div className="space-y-1 mb-6">
              <p className="text-slate-300">Please upload your resume to apply for jobs.</p>
              <p className="text-sm text-slate-400">Supported formats: PDF, DOCX, DOC, TXT</p>
            </div>
            
            <div className="bg-slate-700/40 p-4 rounded-lg mb-6 flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
              <div className="text-sm text-slate-300">
                <p className="font-medium text-yellow-500 mb-1">Important</p>
                <p>You must complete each step in order. After uploading your resume, you'll proceed to:</p>
                <ol className="list-decimal pl-5 space-y-1 mt-2">
                  <li>Verification of your resume details</li>
                  <li>Technical assessment specific to your role</li>
                  <li>Virtual interview process</li>
                  <li>Results and feedback</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <ResumeUpload onResumeUploaded={(data) => setResumeData(data)} />
      
      {resumeData && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl mt-8"
        >
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Resume Uploaded Successfully</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-slate-400">File name:</p>
                    <p className="font-medium">{resumeData.fileName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Job Title:</p>
                    <p className="font-medium">{resumeData.jobTitle}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Company:</p>
                    <p className="font-medium">{resumeData.company}</p>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={toggleResumeContent}
                  className="w-full"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  {showResumeContent ? "Hide Resume Content" : "View Resume Content"}
                </Button>
                
                {showResumeContent && (
                  <div className="mt-4 p-4 bg-white text-black rounded-md max-h-96 overflow-auto">
                    <pre className="whitespace-pre-wrap font-mono text-xs">
                      {resumeData.fileContent}
                    </pre>
                  </div>
                )}
              </div>
              
              <Button 
                className="w-full mt-6" 
                onClick={handleContinue}
              >
                Continue to Verification <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Upload;
