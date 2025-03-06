
import { motion } from "framer-motion";
import { Info, BookOpen, Users, GraduationCap, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const AboutUs = () => {
  const [feedback, setFeedback] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this data to a server
    toast({
      title: "Feedback Submitted",
      description: "Thank you for your feedback!",
    });
    setFeedback("");
    setName("");
    setEmail("");
  };

  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      title: "Resume Analysis",
      description: "Advanced AI-powered resume scanning to match your skills with job requirements."
    },
    {
      icon: <GraduationCap className="h-8 w-8 text-primary" />,
      title: "Technical Assessment",
      description: "Customized technical assessments to evaluate your skills with industry-standard questions."
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Virtual Interviews",
      description: "Practice interviews with AI that simulates real-world scenarios and provides instant feedback."
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-primary" />,
      title: "Personalized Recommendations",
      description: "Get tailored recommendations to improve your resume and technical skills based on your performance."
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-20 pb-10 px-4"
    >
      <div className="max-w-5xl mx-auto">
        <div className="mb-16 text-center">
          <motion.h1 
            className="text-4xl font-bold tracking-tight text-foreground mb-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            About Job Fortune
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Empowering job seekers with AI-powered interview preparation and skills assessment
          </motion.p>
        </div>

        <motion.div 
          className="mb-16"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center mb-6">
            <Info className="h-6 w-6 text-primary mr-2" />
            <h2 className="text-2xl font-bold">Our Mission</h2>
          </div>
          <p className="text-lg text-muted-foreground mb-6">
            At Job Fortune, we're dedicated to revolutionizing the job application process. Our platform uses advanced AI technologies to help job seekers prepare for interviews, assess their technical skills, and improve their chances of landing their dream jobs.
          </p>
          <p className="text-lg text-muted-foreground">
            We believe that everyone deserves a fair chance at employment opportunities, which is why we've developed a comprehensive solution that provides realistic interview practice, personalized feedback, and actionable recommendations.
          </p>
        </motion.div>

        <motion.div 
          className="mb-16"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-8">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="transition-all hover:shadow-md">
                <CardHeader className="flex flex-row items-center gap-4">
                  {feature.icon}
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6">Share Your Feedback</h2>
          <Card>
            <CardHeader>
              <CardTitle>We Value Your Opinion</CardTitle>
              <CardDescription>
                Help us improve Job Fortune by sharing your experience and suggestions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name" 
                      placeholder="Your name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Your email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="feedback">Feedback</Label>
                  <Textarea 
                    id="feedback" 
                    placeholder="Share your thoughts, suggestions, or experience with Job Fortune" 
                    value={feedback} 
                    onChange={(e) => setFeedback(e.target.value)}
                    className="min-h-[120px]"
                    required
                  />
                </div>
                <Button type="submit" className="w-full sm:w-auto">Submit Feedback</Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AboutUs;
