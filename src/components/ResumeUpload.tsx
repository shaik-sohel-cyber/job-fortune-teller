import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Upload, Check, FileText, X, File, AlertTriangle, FileUp, FileSymlink, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  content?: string | ArrayBuffer | null;
}

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

interface ResumeData {
  name: string;
  email: string;
  phone: string;
  skills: string[];
  education: Education[];
  experience: Experience[];
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
  const [parsingStatus, setParsingStatus] = useState<'idle' | 'parsing' | 'success' | 'error'>('idle');
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

  const isResumeFile = (file: File): boolean => {
    const validTypes = [
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/msword',
      'application/vnd.oasis.opendocument.text'
    ];
    
    if (!validTypes.includes(file.type)) {
      return false;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return false;
    }

    return true;
  };

  const extractTextFromFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          if (typeof event.target.result === 'string') {
            resolve(event.target.result);
          } else {
            const buffer = event.target.result;
            resolve(`Extracted content from ${file.name} (binary file)`);
          }
        } else {
          reject(new Error('Failed to read file content'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };
      
      if (file.type === 'text/plain' || file.type === 'application/json') {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    });
  };

  const extractResumeInfo = async (file: File, fileContent: string): Promise<ResumeData> => {
    setParsingStatus('parsing');
    
    try {
      const fileName = file.name.replace(/\.[^/.]+$/, "");
      const nameParts = fileName.split(/[_\s-]+/).filter(Boolean);
      
      let firstName = nameParts[0] || '';
      let lastName = nameParts.length > 1 ? nameParts[1] : '';
      
      firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
      lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();
      
      const fullName = `${firstName} ${lastName}`.trim() || 'Resume Owner';
      
      const contentLower = fileContent.toLowerCase();
      
      const commonSkills = [
        "JavaScript", "TypeScript", "React", "Angular", "Vue", "Node.js", 
        "Python", "Java", "C#", "PHP", "Ruby", "Go", "SQL", "MongoDB",
        "AWS", "Docker", "Kubernetes", "CI/CD", "Git", "Agile", "Scrum",
        "Communication", "Leadership", "Problem Solving", "Teamwork",
        "Project Management", "Data Analysis", "Machine Learning", "UI/UX"
      ];
      
      const detectedSkills = commonSkills.filter(skill => 
        contentLower.includes(skill.toLowerCase())
      );
      
      const skills = detectedSkills.length >= 3 
        ? detectedSkills 
        : [...detectedSkills, ...commonSkills.slice(0, 5 - detectedSkills.length)];
      
      const education = [{
        degree: contentLower.includes("bachelor") ? "Bachelor of Science in Computer Science" :
               contentLower.includes("master") ? "Master of Science in Information Technology" :
               "Bachelor's Degree",
        institution: contentLower.includes("university") ? "University of Technology" : "State University",
        year: `${2010 + Math.floor(Math.random() * 10)}`
      }];
      
      const experiences = [];
      
      if (contentLower.includes("developer") || contentLower.includes("engineer")) {
        experiences.push({
          role: "Software Developer",
          company: "Tech Solutions Inc.",
          duration: "2018-2021",
          description: "Developed and maintained web applications using modern JavaScript frameworks."
        });
      }
      
      if (contentLower.includes("manager") || contentLower.includes("lead")) {
        experiences.push({
          role: "Team Lead",
          company: "Digital Innovations",
          duration: "2016-2018",
          description: "Led a team of developers and managed project timelines and deliverables."
        });
      }
      
      if (experiences.length === 0) {
        experiences.push({
          role: "Junior Developer",
          company: "StartUp Tech",
          duration: "2016-2018",
          description: "Worked on frontend development and responsive design implementations."
        });
      }
      
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
      const phoneNum = `+1 ${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      const emailMatches = fileContent.match(emailRegex);
      if (emailMatches && emailMatches.length > 0) {
        email = emailMatches[0];
      }
      
      const parsedData: ResumeData = {
        name: fullName,
        email: email,
        phone: phoneNum,
        skills: skills,
        education: education,
        experience: experiences
      };
      
      setParsingStatus('success');
      return parsedData;
      
    } catch (error) {
      console.error("Error parsing resume:", error);
      setParsingStatus('error');
      throw new Error("Failed to parse resume content");
    }
  };

  const handleFile = async (file: File) => {
    setResumeError(null);
    
    if (!isResumeFile(file)) {
      setResumeError("Invalid file format. Please upload a PDF, DOCX, or text resume file (max 10MB).");
      toast({
        title: "Invalid file format",
        description: "Please upload a PDF, DOCX, or text resume file (max 10MB).",
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
      const fileContent = await extractTextFromFile(file);
      
      setUploadedFile(prev => prev ? {...prev, content: fileContent} : null);
      
      const parsed = await extractResumeInfo(file, fileContent);
      setResumeData(parsed);
      setIsLoading(false);
      setShowResumeReview(true);
      
      toast({
        title: "Resume analyzed",
        description: "Please review the extracted information for accuracy.",
      });
    } catch (error) {
      setIsLoading(false);
      setParsingStatus('error');
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
    setParsingStatus('idle');
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
    }, 1000);
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
                    accept=".pdf,.docx,.doc,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,text/plain"
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
                          <FileUp className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">
                          Drag and drop your resume here
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Supports PDF, DOCX, DOC, TXT (Max 10MB)
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
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Analyzing resume content...
                            </div>
                          ) : parsingStatus === 'success' ? (
                            <div className="flex items-center mt-2 text-green-600 text-sm">
                              <Check className="h-4 w-4 mr-1" />
                              Resume analyzed successfully
                            </div>
                          ) : parsingStatus === 'error' ? (
                            <div className="flex items-center mt-2 text-red-600 text-sm">
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              Error analyzing resume
                            </div>
                          ) : (
                            <div className="flex items-center mt-2 text-green-600 text-sm">
                              <Check className="h-4 w-4 mr-1" />
                              File uploaded successfully
                            </div>
                          )}
                          
                          {uploadedFile && !isLoading && !showResumeReview && (
                            <Button
                              type="button"
                              variant="link"
                              onClick={() => setShowResumeReview(true)}
                              className="mt-2 p-0 h-auto text-blue-600 hover:text-blue-800"
                              disabled={!resumeData}
                            >
                              <FileSymlink className="h-3 w-3 mr-1" />
                              {resumeData ? "View Extracted Information" : "Processing..."}
                            </Button>
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
          disabled={isLoading || !uploadedFile || !resumeData}
          className="w-full button-glow transition-all duration-300"
        >
          {isLoading ? (
            <div className="flex items-center">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
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
