
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Check, Package, Diamond, Trophy } from "lucide-react";

interface PackageOption {
  id: string;
  name: string;
  level: string;
  description: string;
  benefits: string[];
  icon: JSX.Element;
  color: string;
}

const PackageSelection = () => {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const resumeData = JSON.parse(localStorage.getItem('resumeData') || '{"jobTitle": "Software Developer", "company": "Tech Company"}');
  
  // Package options based on job title
  const getPackageOptions = (): PackageOption[] => {
    const commonOptions: PackageOption[] = [
      {
        id: "entry",
        name: "Entry Level",
        level: "Associate",
        description: "Perfect for those starting their career path",
        benefits: ["Basic health insurance", "Annual bonus", "Flexible work schedule"],
        icon: <Package className="h-10 w-10" />,
        color: "bg-blue-100 text-blue-600"
      },
      {
        id: "mid",
        name: "Mid Level",
        level: "Senior Associate",
        description: "For professionals with proven expertise",
        benefits: ["Comprehensive health coverage", "Quarterly bonuses", "Remote work options", "Education stipend"],
        icon: <Diamond className="h-10 w-10" />,
        color: "bg-purple-100 text-purple-600"
      },
      {
        id: "senior",
        name: "Senior Level",
        level: "Principal",
        description: "For experienced professionals seeking leadership roles",
        benefits: ["Premium health package", "Bi-annual performance bonuses", "Stock options", "Leadership training program", "Global mobility options"],
        icon: <Trophy className="h-10 w-10" />,
        color: "bg-amber-100 text-amber-600"
      }
    ];

    // Customize some details based on job title
    const jobSpecificOptions = commonOptions.map(option => {
      const newOption = {...option};
      
      if (resumeData.jobTitle.toLowerCase().includes("developer") || 
          resumeData.jobTitle.toLowerCase().includes("engineer")) {
        if (option.id === "entry") {
          newOption.benefits.push("Yearly tech conference attendance");
        } else if (option.id === "mid") {
          newOption.benefits.push("Advanced technical training programs");
        } else if (option.id === "senior") {
          newOption.benefits.push("Technology leadership development");
        }
      } else if (resumeData.jobTitle.toLowerCase().includes("data") || 
                resumeData.jobTitle.toLowerCase().includes("analyst")) {
        if (option.id === "entry") {
          newOption.benefits.push("Data science certification support");
        } else if (option.id === "mid") {
          newOption.benefits.push("Advanced analytics tools training");
        } else if (option.id === "senior") {
          newOption.benefits.push("Research publication opportunities");
        }
      }
      
      return newOption;
    });
    
    return jobSpecificOptions;
  };
  
  const packageOptions = getPackageOptions();
  
  useEffect(() => {
    // Check if user has completed earlier steps
    if (!localStorage.getItem('resumeData')) {
      toast({
        title: "Resume not uploaded",
        description: "Please upload your resume first",
        variant: "destructive",
      });
      navigate('/upload');
    }
    
    // Pre-select a package based on resume data (experience level, etc.)
    // This is a simulated logic based on verification results
    const verificationResults = JSON.parse(localStorage.getItem('verificationResults') || 'null');
    if (verificationResults) {
      const yearsOfExperience = verificationResults.experienceYears || 0;
      
      if (yearsOfExperience > 7) {
        setSelectedPackage("senior");
      } else if (yearsOfExperience > 3) {
        setSelectedPackage("mid");
      } else {
        setSelectedPackage("entry");
      }
    }
  }, []);
  
  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId);
    
    // Store selected package in localStorage
    localStorage.setItem('selectedPackage', packageId);
    
    toast({
      title: "Package Selected",
      description: `You've selected the ${packageOptions.find(p => p.id === packageId)?.name} package.`,
    });
  };
  
  const continueToAssessment = () => {
    if (!selectedPackage) {
      toast({
        title: "Package Required",
        description: "Please select a package to continue",
        variant: "destructive",
      });
      return;
    }
    
    navigate('/assessment');
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden"
    >
      <div className="bg-primary p-6 text-white">
        <h2 className="text-2xl font-semibold">Select Your Package</h2>
        <p className="text-sm text-white/80 mt-1">
          Based on your resume and experience, please select a compensation package that aligns with your career goals
        </p>
      </div>
      
      <div className="p-6">
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {packageOptions.map((pkg) => (
            <Card
              key={pkg.id}
              className={`cursor-pointer transition-all duration-300 overflow-hidden ${
                selectedPackage === pkg.id 
                  ? "ring-2 ring-primary ring-offset-2" 
                  : "hover:shadow-md"
              }`}
              onClick={() => handlePackageSelect(pkg.id)}
            >
              <div className={`p-4 ${pkg.color}`}>
                <div className="flex justify-between items-center">
                  {pkg.icon}
                  {selectedPackage === pkg.id && (
                    <div className="h-6 w-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
                <h3 className="mt-2 text-lg font-medium">{pkg.name}</h3>
                <Badge variant="outline" className="mt-1">
                  {pkg.level}
                </Badge>
              </div>
              
              <div className="p-4 space-y-3">
                <p className="text-sm text-gray-600">{pkg.description}</p>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Benefits:</h4>
                  <ul className="space-y-1">
                    {pkg.benefits.map((benefit, index) => (
                      <li key={index} className="text-sm flex items-start">
                        <Check className="h-4 w-4 mr-2 text-green-500 shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={continueToAssessment}
            disabled={!selectedPackage}
            className="button-glow"
          >
            Continue to Assessment
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default PackageSelection;
