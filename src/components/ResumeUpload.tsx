
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Upload, Check, FileText, X, File, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

// Mock resume parsing result
interface ResumeData {
  name: string;
  email: string;
  phone: string;
  skills: string[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  experience: {
    role: string;
    company: string;
    duration: string;
    description: string;
  }[];
}

const JOB_TITLE_SUGGESTIONS = [
  "Software Engineer",
  "Frontend Developer", 
  "Backend Developer",
  "Full Stack Developer",
  "UX Designer",
  "Product Manager",
  "Data Scientist",
  "DevOps Engineer",
  "Machine Learning Engineer",
  "Mobile Developer",
  "QA Engineer",
  "Technical Writer"
];

const COMPANY_SUGGESTIONS = [
  "Google",
  "Microsoft",
  "Amazon",
  "Apple",
  "Meta",
  "Netflix",
  "Adobe",
  "IBM",
  "Oracle",
  "Salesforce",
  "Twitter",
  "Uber",
  "Airbnb",
  "Spotify",
  "LinkedIn"
];

const ResumeUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResumeReview, setShowResumeReview] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  const [jobTitleSuggestions, setJobTitleSuggestions] = useState<string[]>([]);
  const [companySuggestions, setCompanySuggestions] = useState<string[]>([]);
  const [showJobTitleSuggestions, setShowJobTitleSuggestions] = useState(false);
  const [showCompanySuggestions, setShowCompanySuggestions] = useState(false);
  
  const jobTitleRef = useRef<HTMLDivElement>(null);
  const companyRef = useRef<HTMLDivElement>(null);

  const filterJobTitleSuggestions = (input: string) => {
    const filtered = JOB_TITLE_SUGGESTIONS.filter(item => 
      item.toLowerCase().includes(input.toLowerCase())
    );
    setJobTitleSuggestions(filtered);
    setShowJobTitleSuggestions(input.length > 0 && filtered.length > 0);
  };

  const filterCompanySuggestions = (input: string) => {
    const filtered = COMPANY_SUGGESTIONS.filter(item => 
      item.toLowerCase().includes(input.toLowerCase())
    );
    setCompanySuggestions(filtered);
    setShowCompanySuggestions(input.length > 0 && filtered.length > 0);
  };

  const handleJobTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setJobTitle(value);
    filterJobTitleSuggestions(value);
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCompany(value);
    filterCompanySuggestions(value);
  };

  const selectJobTitleSuggestion = (suggestion: string) => {
    setJobTitle(suggestion);
    setShowJobTitleSuggestions(false);
  };

  const selectCompanySuggestion = (suggestion: string) => {
    setCompany(suggestion);
    setShowCompanySuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (jobTitleRef.current && !jobTitleRef.current.contains(event.target as Node)) {
        setShowJobTitleSuggestions(false);
      }
      if (companyRef.current && !companyRef.current.contains(event.target as Node)) {
        setShowCompanySuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  // Function to check if file is a valid resume
  const isResumeFile = (file: File): boolean => {
    // Check for valid file types
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      return false;
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return false;
    }

    return true;
  };

  // Parse resume content (simulated function)
  const parseResumeContent = (file: File): Promise<ResumeData | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real implementation, this would use a resume parsing API or library
        // For now, we'll create some mock data based on the file name
        
        // Simulated resume parsing (in a real app, this would use actual file content)
        const firstName = file.name.split('.')[0].split('_')[0] || 'John';
        const lastName = file.name.split('.')[0].split('_')[1] || 'Doe';
        const fullName = `${firstName} ${lastName}`;
        
        // Generate random skills based on the job title
        const allSkills = [
          "JavaScript", "TypeScript", "React", "Angular", "Vue", "Node.js", 
          "Python", "Java", "C#", "PHP", "Ruby", "Go", "SQL", "MongoDB",
          "AWS", "Docker", "Kubernetes", "CI/CD", "Git", "Agile", "Scrum"
        ];
        
        // Shuffle array to get random skills
        const shuffled = [...allSkills].sort(() => 0.5 - Math.random());
        const randomSkills = shuffled.slice(0, 5 + Math.floor(Math.random() * 5));
        
        const parsedData: ResumeData = {
          name: fullName,
          email: `${firstName.toLowerCase()}${lastName.toLowerCase()}@example.com`,
          phone: `+1 ${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
          skills: randomSkills,
          education: [
            {
              degree: "Bachelor of Science in Computer Science",
              institution: "University of Technology",
              year: `${2010 + Math.floor(Math.random() * 10)}`
            }
          ],
          experience: [
            {
              role: "Software Developer",
              company: "Tech Solutions Inc.",
              duration: "2018-2021",
              description: "Developed and maintained web applications using modern JavaScript frameworks."
            },
            {
              role: "Junior Developer",
              company: "Digital Innovations",
              duration: "2016-2018",
              description: "Worked on frontend development and responsive design implementations."
            }
          ]
        };
        
        resolve(parsedData);
      }, 1500); // Simulate parsing delay
    });
  };

  const handleFile = async (file: File) => {
    setResumeError(null);
    
    if (!isResumeFile(file)) {
      setResumeError("Invalid file format. Please upload a PDF or DOCX resume file (max 5MB).");
      toast({
        title: "Invalid file format",
        description: "Please upload a PDF or DOCX resume file (max 5MB).",
        variant: "destructive",
      });
      return;
    }
    
    setUploadedFile({
      name: file.name,
      size: file.size,
      type: file.type,
    });

    toast({
      title: "File uploaded successfully",
      description: `${file.name} has been uploaded. Analyzing content...`,
    });
    
    setIsLoading(true);
    
    try {
      // Parse resume content
      const parsed = await parseResumeContent(file);
      setResumeData(parsed);
      setIsLoading(false);
      setShowResumeReview(true);
      
      toast({
        title: "Resume analyzed",
        description: "Please review the extracted information for accuracy.",
      });
    } catch (error) {
      setIsLoading(false);
      setResumeError("Failed to analyze resume content. Please try a different file.");
      toast({
        title: "Resume analysis failed",
        description: "Could not extract information from the uploaded file.",
        variant: "destructive",
      });
    }
  };

  const onButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setResumeData(null);
    setShowResumeReview(false);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const confirmResumeData = () => {
    setShowResumeReview(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadedFile) {
      toast({
        title: "No resume uploaded",
        description: "Please upload your resume before continuing.",
        variant: "destructive",
      });
      return;
    }

    if (!jobTitle || !company) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields before continuing.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      
      const resumeDataToStore = {
        fileName: uploadedFile.name,
        jobTitle,
        company,
        candidateInfo: resumeData
      };
      
      localStorage.setItem('resumeData', JSON.stringify(resumeDataToStore));
      localStorage.setItem('userEmail', resumeData?.email || '');
      
      toast({
        title: "Resume processed successfully",
        description: "Proceeding to resume verification.",
      });
      
      navigate('/verification');
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto p-6"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">Upload Your Resume</h2>
          <p className="text-muted-foreground">
            Upload your resume and provide job details to get started with your virtual interview.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {showResumeReview && resumeData ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-slate-800 rounded-xl p-6 border border-slate-700 text-white shadow-lg"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Resume Information Review</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowResumeReview(false)}
                  className="text-white hover:bg-slate-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-slate-400">Personal Information</h4>
                  <p className="text-lg font-medium mt-1">{resumeData.name}</p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="text-sm text-slate-300">
                      <span className="text-slate-400">Email:</span> {resumeData.email}
                    </div>
                    <div className="text-sm text-slate-300">
                      <span className="text-slate-400">Phone:</span> {resumeData.phone}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-slate-400">Skills</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {resumeData.skills.map((skill, index) => (
                      <span 
                        key={index} 
                        className="bg-slate-700 text-white px-2 py-1 rounded text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-slate-400">Education</h4>
                  <div className="space-y-2 mt-2">
                    {resumeData.education.map((edu, index) => (
                      <div key={index} className="bg-slate-700/50 p-2 rounded">
                        <p className="font-medium">{edu.degree}</p>
                        <p className="text-sm text-slate-300">{edu.institution}, {edu.year}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-slate-400">Experience</h4>
                  <div className="space-y-2 mt-2">
                    {resumeData.experience.map((exp, index) => (
                      <div key={index} className="bg-slate-700/50 p-2 rounded">
                        <p className="font-medium">{exp.role}</p>
                        <p className="text-sm text-slate-300">{exp.company}, {exp.duration}</p>
                        <p className="text-xs text-slate-400 mt-1">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <Button 
                  variant="outline" 
                  className="mr-2 text-white border-slate-600 hover:bg-slate-700"
                  onClick={removeFile}
                >
                  Upload Different Resume
                </Button>
                <Button 
                  onClick={confirmResumeData}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Confirm Information
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="space-y-2" ref={jobTitleRef}>
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  placeholder="e.g. Frontend Developer"
                  value={jobTitle}
                  onChange={handleJobTitleChange}
                  onFocus={() => jobTitle && filterJobTitleSuggestions(jobTitle)}
                  className="transition-all duration-300 focus:ring-2 focus:ring-primary/50"
                  required
                />
                <AnimatePresence>
                  {showJobTitleSuggestions && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md bg-slate-800 shadow-lg ring-1 ring-black ring-opacity-5"
                    >
                      <ul className="py-1 text-base">
                        {jobTitleSuggestions.map((suggestion, index) => (
                          <li
                            key={index}
                            onClick={() => selectJobTitleSuggestion(suggestion)}
                            className="px-4 py-2 cursor-pointer hover:bg-slate-700 text-white"
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-2" ref={companyRef}>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  placeholder="e.g. Tech Innovations Inc."
                  value={company}
                  onChange={handleCompanyChange}
                  onFocus={() => company && filterCompanySuggestions(company)}
                  className="transition-all duration-300 focus:ring-2 focus:ring-primary/50"
                  required
                />
                <AnimatePresence>
                  {showCompanySuggestions && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md bg-slate-800 shadow-lg ring-1 ring-black ring-opacity-5"
                    >
                      <ul className="py-1 text-base">
                        {companySuggestions.map((suggestion, index) => (
                          <li
                            key={index}
                            onClick={() => selectCompanySuggestion(suggestion)}
                            className="px-4 py-2 cursor-pointer hover:bg-slate-700 text-white"
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-2">
                <Label>Resume</Label>
                
                <div
                  className={`relative border-2 border-dashed rounded-lg p-8 transition-all duration-300 ${
                    dragActive 
                      ? "border-primary bg-primary/5" 
                      : uploadedFile 
                        ? "border-green-500 bg-green-50 text-gray-900" 
                        : "border-border hover:border-primary/50 hover:bg-secondary/50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    onChange={handleChange}
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  />

                  <AnimatePresence mode="wait">
                    {!uploadedFile ? (
                      <motion.div
                        key="upload-prompt"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center text-center"
                      >
                        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                          <Upload className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">
                          Drag and drop your resume here
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Supports PDF, DOCX (Max 5MB)
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={onButtonClick}
                          className="hover:bg-primary/10"
                        >
                          Browse Files
                        </Button>
                        
                        {resumeError && (
                          <div className="mt-4 text-sm text-red-500 flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            {resumeError}
                          </div>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="file-details"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-start space-x-4"
                      >
                        <div className="p-3 rounded-md bg-green-100">
                          <FileText className="h-8 w-8 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium truncate max-w-[250px] text-gray-900">
                              {uploadedFile.name}
                            </h3>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={removeFile}
                              className="hover:bg-destructive/10 hover:text-destructive ml-2"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-gray-700">
                            {formatFileSize(uploadedFile.size)}
                          </p>
                          {isLoading ? (
                            <div className="flex items-center mt-2 text-blue-600 text-sm">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                              Analyzing resume content...
                            </div>
                          ) : (
                            <div className="flex items-center mt-2 text-green-600 text-sm">
                              <Check className="h-4 w-4 mr-1" />
                              File uploaded successfully
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          type="submit"
          disabled={isLoading || !uploadedFile}
          className="w-full button-glow transition-all duration-300"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            <div className="flex items-center">
              Continue to Interview <ArrowRight className="ml-2" />
            </div>
          )}
        </Button>
      </form>
    </motion.div>
  );
};

export default ResumeUpload;
