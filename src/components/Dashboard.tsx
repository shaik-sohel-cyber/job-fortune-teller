
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Clock, AlertTriangle, Sparkles, Award, BookOpen, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    progress: number;
    completedSteps: string[];
    appliedJobs: number;
    assessmentsPassed: number;
    interviewsScheduled: number;
    interviewsCompleted: number;
    suggestedSkills: string[];
    nextStep: string;
    nextStepUrl: string;
  } | null>(null);

  useEffect(() => {
    // Load user data from localStorage
    const loadUserData = () => {
      try {
        // Get basic info from localStorage
        const resumeData = JSON.parse(localStorage.getItem('resumeData') || '{}');
        const name = resumeData.name || 'User';
        const email = localStorage.getItem('userEmail') || resumeData.email || 'user@example.com';
        
        // Determine completed steps
        const completedSteps = [];
        if (localStorage.getItem('resumeData')) completedSteps.push('resume');
        if (localStorage.getItem('verificationResults')) completedSteps.push('verification');
        if (localStorage.getItem('selectedPackage')) completedSteps.push('package');
        if (localStorage.getItem('assessmentScore')) completedSteps.push('assessment');
        if (localStorage.getItem('interviewComplete')) completedSteps.push('interview');
        
        // Calculate progress percentage
        const totalSteps = 5; // resume, verification, package, assessment, interview
        const progress = Math.round((completedSteps.length / totalSteps) * 100);
        
        // Determine next step
        let nextStep = 'Upload Resume';
        let nextStepUrl = '/upload';
        
        if (completedSteps.includes('resume') && !completedSteps.includes('verification')) {
          nextStep = 'Verify Resume';
          nextStepUrl = '/verification';
        } else if (completedSteps.includes('verification') && !completedSteps.includes('package')) {
          nextStep = 'Select Package';
          nextStepUrl = '/package-selection';
        } else if (completedSteps.includes('package') && !completedSteps.includes('assessment')) {
          nextStep = 'Take Assessment';
          nextStepUrl = '/assessment';
        } else if (completedSteps.includes('assessment') && !completedSteps.includes('interview')) {
          nextStep = 'Complete Interview';
          nextStepUrl = '/interview';
        } else if (completedSteps.includes('interview')) {
          nextStep = 'View Results';
          nextStepUrl = '/results';
        }
        
        // Get applied jobs and other statistics
        const appliedJobs = resumeData.company ? 1 : 0;
        
        // Get assessment data
        const assessmentsPassed = localStorage.getItem('assessmentPassed') === 'true' ? 1 : 0;
        
        // Get interview data
        const interviewsCompleted = localStorage.getItem('interviewComplete') === 'true' ? 1 : 0;
        const interviewsScheduled = interviewsCompleted > 0 ? 1 : 0;
        
        // Generate suggested skills based on job title
        const jobTitle = resumeData.jobTitle || '';
        const suggestedSkills = generateSuggestedSkills(jobTitle);
        
        setUserData({
          name,
          email,
          progress,
          completedSteps,
          appliedJobs,
          assessmentsPassed,
          interviewsScheduled,
          interviewsCompleted,
          suggestedSkills,
          nextStep,
          nextStepUrl
        });
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading user data:", error);
        toast({
          title: "Error loading dashboard",
          description: "Please try again later.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [toast]);
  
  const generateSuggestedSkills = (jobTitle: string): string[] => {
    const skillsByRole: {[key: string]: string[]} = {
      'Software Engineer': ['Data Structures', 'Algorithms', 'System Design', 'Git', 'Cloud Computing'],
      'Frontend Developer': ['React', 'JavaScript', 'CSS', 'UI/UX', 'Performance Optimization'],
      'Backend Developer': ['API Design', 'Database Management', 'Authentication', 'Microservices', 'Caching'],
      'Data Scientist': ['Statistics', 'Machine Learning', 'Python', 'SQL', 'Data Visualization'],
      'Product Manager': ['User Research', 'Roadmapping', 'Agile', 'Stakeholder Management', 'Analytics'],
      'UX Designer': ['User Research', 'Wireframing', 'Prototyping', 'Usability Testing', 'Design Systems'],
      'DevOps Engineer': ['CI/CD', 'Containerization', 'Infrastructure as Code', 'Monitoring', 'Security'],
    };
    
    // Default skills for any role
    const defaultSkills = ['Communication', 'Problem Solving', 'Teamwork', 'Time Management', 'Adaptability'];
    
    // Find matching role or use default
    for (const role in skillsByRole) {
      if (jobTitle.toLowerCase().includes(role.toLowerCase())) {
        return skillsByRole[role];
      }
    }
    
    return defaultSkills;
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (!userData) {
    return (
      <div className="p-6 text-center">
        <AlertTriangle className="h-12 w-12 text-warning mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Data Not Available</h3>
        <p className="text-muted-foreground mb-4">We couldn't load your dashboard data.</p>
        <Button onClick={() => navigate('/')}>Return Home</Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-4 space-y-6"
    >
      {/* Welcome Card */}
      <Card className="bg-gradient-to-r from-slate-800 to-slate-900 text-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl">Welcome back, {userData.name.split(' ')[0]}</h2>
              <CardDescription className="text-slate-300 mt-1">{userData.email}</CardDescription>
            </div>
            <Sparkles className="h-6 w-6 text-yellow-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Application Progress</span>
                <span>{userData.progress}% Complete</span>
              </div>
              <Progress value={userData.progress} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              <div className="bg-slate-700/50 p-3 rounded-lg text-center">
                <p className="text-2xl font-bold text-white">{userData.appliedJobs}</p>
                <p className="text-xs text-slate-300">Jobs Applied</p>
              </div>
              <div className="bg-slate-700/50 p-3 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-400">{userData.assessmentsPassed}</p>
                <p className="text-xs text-slate-300">Assessments Passed</p>
              </div>
              <div className="bg-slate-700/50 p-3 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-400">{userData.interviewsScheduled}</p>
                <p className="text-xs text-slate-300">Interviews Scheduled</p>
              </div>
              <div className="bg-slate-700/50 p-3 rounded-lg text-center">
                <p className="text-2xl font-bold text-purple-400">{userData.interviewsCompleted}</p>
                <p className="text-xs text-slate-300">Interviews Completed</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={() => navigate(userData.nextStepUrl)} 
            className="w-full button-glow"
          >
            {userData.nextStep} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
      
      {/* Progress Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-slate-800 text-white border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Application Steps
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  userData.completedSteps.includes('resume') 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-slate-700 text-slate-300'
                }`}>
                  {userData.completedSteps.includes('resume') ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span>1</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className={userData.completedSteps.includes('resume') ? 'text-green-400' : ''}>
                    Resume Upload
                  </p>
                  <p className="text-xs text-slate-400">
                    {userData.completedSteps.includes('resume') ? 'Completed' : 'Upload your resume to begin'}
                  </p>
                </div>
                {!userData.completedSteps.includes('resume') && (
                  <Button size="sm" onClick={() => navigate('/upload')} variant="outline">
                    Start
                  </Button>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  userData.completedSteps.includes('verification') 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-slate-700 text-slate-300'
                }`}>
                  {userData.completedSteps.includes('verification') ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span>2</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className={userData.completedSteps.includes('verification') ? 'text-green-400' : ''}>
                    Resume Verification
                  </p>
                  <p className="text-xs text-slate-400">
                    {userData.completedSteps.includes('verification') 
                      ? 'Completed' 
                      : 'Verify your resume information'}
                  </p>
                </div>
                {userData.completedSteps.includes('resume') && 
                 !userData.completedSteps.includes('verification') && (
                  <Button size="sm" onClick={() => navigate('/verification')} variant="outline">
                    Verify
                  </Button>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  userData.completedSteps.includes('package') 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-slate-700 text-slate-300'
                }`}>
                  {userData.completedSteps.includes('package') ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span>3</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className={userData.completedSteps.includes('package') ? 'text-green-400' : ''}>
                    Package Selection
                  </p>
                  <p className="text-xs text-slate-400">
                    {userData.completedSteps.includes('package') 
                      ? 'Completed' 
                      : 'Select your interview preparation package'}
                  </p>
                </div>
                {userData.completedSteps.includes('verification') && 
                 !userData.completedSteps.includes('package') && (
                  <Button size="sm" onClick={() => navigate('/package-selection')} variant="outline">
                    Select
                  </Button>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  userData.completedSteps.includes('assessment') 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-slate-700 text-slate-300'
                }`}>
                  {userData.completedSteps.includes('assessment') ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span>4</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className={userData.completedSteps.includes('assessment') ? 'text-green-400' : ''}>
                    Technical Assessment
                  </p>
                  <p className="text-xs text-slate-400">
                    {userData.completedSteps.includes('assessment') 
                      ? `Score: ${localStorage.getItem('assessmentScore') || 0}%` 
                      : 'Take the technical assessment'}
                  </p>
                </div>
                {userData.completedSteps.includes('package') && 
                 !userData.completedSteps.includes('assessment') && (
                  <Button size="sm" onClick={() => navigate('/assessment')} variant="outline">
                    Start
                  </Button>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  userData.completedSteps.includes('interview') 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-slate-700 text-slate-300'
                }`}>
                  {userData.completedSteps.includes('interview') ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span>5</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className={userData.completedSteps.includes('interview') ? 'text-green-400' : ''}>
                    Virtual Interview
                  </p>
                  <p className="text-xs text-slate-400">
                    {userData.completedSteps.includes('interview') 
                      ? 'Completed' 
                      : 'Complete your virtual interview'}
                  </p>
                </div>
                {userData.completedSteps.includes('assessment') && 
                 !userData.completedSteps.includes('interview') && (
                  <Button size="sm" onClick={() => navigate('/interview')} variant="outline">
                    Start
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 text-white border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              Skill Development
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h4 className="font-medium flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Recommended Skills
                </h4>
                <p className="text-xs text-slate-400 mb-3">
                  Based on your job profile and industry demands
                </p>
                <div className="space-y-2">
                  {userData.suggestedSkills.map((skill, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{skill}</span>
                      <div className="w-32 h-2 bg-slate-600 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-blue-500"
                          style={{ width: `${Math.random() * 50 + 50}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  Personalized Recommendations
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="inline-block mt-0.5 h-4 w-4 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center text-xs">•</span>
                    <span>Focus on technical skills relevant to {JSON.parse(localStorage.getItem('resumeData') || '{}').company || 'your target company'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="inline-block mt-0.5 h-4 w-4 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center text-xs">•</span>
                    <span>Practice behavioral questions for your next interview</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="inline-block mt-0.5 h-4 w-4 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center text-xs">•</span>
                    <span>Add portfolio projects showcasing your abilities</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full text-white border-slate-600 hover:bg-slate-700"
              onClick={() => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')}
            >
              View Learning Resources
            </Button>
          </CardFooter>
        </Card>
      </div>
    </motion.div>
  );
};

export default Dashboard;
