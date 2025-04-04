
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Results from "@/components/Results";
import { Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define types for resume data
interface Education {
  degree: string;
  institution: string;
  year: string;
}

interface Experience {
  role: string;
  company: string;
  duration: string;
  description: string;
}

interface CandidateInfo {
  name: string;
  email: string;
  phone: string;
  skills: string[];
  education: Education[];
  experience: Experience[];
}

interface ResumeData {
  fileName: string;
  jobTitle: string;
  company: string;
  candidateInfo: CandidateInfo;
}

const ResultsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);

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

    // Load resume data
    const loadResumeData = () => {
      try {
        const resumeDataStr = localStorage.getItem('resumeData');
        if (resumeDataStr) {
          const parsedData = JSON.parse(resumeDataStr);
          setResumeData(parsedData);
        }
      } catch (error) {
        console.error("Error loading resume data:", error);
      }
    };

    // Add a small delay for loading animation to prevent flashing of content
    const timer = setTimeout(() => {
      const allowed = checkAccess();
      if (allowed) {
        loadResumeData();
      }
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

  if (!isAllowed) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen pt-20 flex flex-col items-center justify-center bg-gradient-to-b from-black to-slate-900"
      >
        <div className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-lg text-center max-w-md">
          <h2 className="text-xl font-bold mb-4">Access Denied</h2>
          <p className="text-slate-300 mb-4">You need to complete all previous steps before accessing your results.</p>
          <Button onClick={() => navigate('/dashboard')} className="button-glow">
            Go to Dashboard
          </Button>
        </div>
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
      <div className="max-w-6xl mx-auto">
        <div className="bg-slate-800/80 backdrop-blur-sm p-4 rounded-lg mb-6">
          <h1 className="text-2xl font-bold">Your Assessment & Interview Results</h1>
          <p className="text-slate-300">
            Company: {resumeData?.company || 'Tech Company'}
          </p>
          <p className="text-slate-300">
            Position: {resumeData?.jobTitle || 'Software Developer'}
          </p>
        </div>
        
        {resumeData?.candidateInfo && (
          <div className="bg-slate-800/80 backdrop-blur-sm p-4 rounded-lg mb-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-primary/20 rounded-full">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Resume Summary</h2>
                <p className="text-slate-400 text-sm">Based on your uploaded document</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold border-b border-slate-700 pb-2 mb-2">Personal Information</h3>
                  <p className="text-slate-300"><span className="text-slate-400">Name:</span> {resumeData.candidateInfo.name}</p>
                  <p className="text-slate-300"><span className="text-slate-400">Email:</span> {resumeData.candidateInfo.email}</p>
                  <p className="text-slate-300"><span className="text-slate-400">Phone:</span> {resumeData.candidateInfo.phone}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold border-b border-slate-700 pb-2 mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.candidateInfo.skills.map((skill, index) => (
                      <span key={index} className="bg-slate-700 px-2 py-1 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold border-b border-slate-700 pb-2 mb-2">Education</h3>
                  <div className="space-y-3">
                    {resumeData.candidateInfo.education.map((edu, index) => (
                      <div key={index} className="bg-slate-700/30 p-2 rounded">
                        <p className="font-medium">{edu.degree}</p>
                        <p className="text-sm text-slate-300">{edu.institution}, {edu.year}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold border-b border-slate-700 pb-2 mb-2">Experience</h3>
                  <div className="space-y-3">
                    {resumeData.candidateInfo.experience.map((exp, index) => (
                      <div key={index} className="bg-slate-700/30 p-2 rounded">
                        <p className="font-medium">{exp.role}</p>
                        <p className="text-sm text-slate-300">{exp.company}, {exp.duration}</p>
                        <p className="text-xs text-slate-400 mt-1">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <Results />
      </div>
    </motion.div>
  );
};

export default ResultsPage;
