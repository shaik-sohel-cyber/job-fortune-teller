import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Upload, Check, FileText, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UploadedFile {
  name: string;
  size: number;
  type: string;
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

  const handleFile = (file: File) => {
    if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
      toast({
        title: "Invalid file format",
        description: "Please upload a PDF or DOCX file.",
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
      description: `${file.name} has been uploaded.`,
    });
  };

  const onButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
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
      
      localStorage.setItem('resumeData', JSON.stringify({
        fileName: uploadedFile.name,
        jobTitle,
        company,
      }));
      
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

        <div className="space-y-6">
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
                  className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-slate-800"
                >
                  <ul className="py-1 text-base">
                    {jobTitleSuggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onClick={() => selectJobTitleSuggestion(suggestion)}
                        className="px-4 py-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
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
                  className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-slate-800"
                >
                  <ul className="py-1 text-base">
                    {companySuggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onClick={() => selectCompanySuggestion(suggestion)}
                        className="px-4 py-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
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
                    ? "border-green-500 bg-green-50" 
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
                        <h3 className="font-medium truncate max-w-[250px]">
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
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(uploadedFile.size)}
                      </p>
                      <div className="flex items-center mt-2 text-green-600 text-sm">
                        <Check className="h-4 w-4 mr-1" />
                        File uploaded successfully
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
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
