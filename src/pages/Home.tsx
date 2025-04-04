
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, MessageSquare, LineChart, BarChart, Award, Users, TrendingUp } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const features = [
    {
      icon: <FileText className="h-10 w-10 text-primary" />,
      title: "Resume Analysis",
      description: "Our AI algorithms analyze your resume against job requirements to identify strengths and gaps.",
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-primary" />,
      title: "Virtual Interviews",
      description: "Practice with AI-powered interviews tailored to your target roles and industry standards.",
    },
    {
      icon: <LineChart className="h-10 w-10 text-primary" />,
      title: "Success Prediction",
      description: "Get data-driven insights about your chances of landing the job with actionable improvement tips.",
    },
  ];

  const stats = [
    { value: "94%", label: "Accuracy Rate", icon: <TrendingUp className="h-6 w-6 text-green-500" /> },
    { value: "10k+", label: "Mock Interviews", icon: <MessageSquare className="h-6 w-6 text-blue-500" /> },
    { value: "73%", label: "Success Rate", icon: <Award className="h-6 w-6 text-yellow-500" /> },
    { value: "250+", label: "Companies", icon: <Users className="h-6 w-6 text-purple-500" /> }
  ];

  return (
    <motion.div
      className="min-h-screen pt-20 flex flex-col"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-6 py-24 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl animate-float" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent/10 rounded-full filter blur-3xl animate-float" style={{ animationDelay: "-2s" }} />
        </motion.div>

        <motion.h1
          className="text-5xl md:text-6xl lg:text-7xl font-bold text-center max-w-4xl mb-8"
          variants={itemVariants}
        >
          Land Your <span className="text-gradient">Dream Job</span> with AI-Powered Interview Prep
        </motion.h1>

        <motion.p
          className="text-xl text-center text-muted-foreground max-w-2xl mb-12"
          variants={itemVariants}
        >
          Upload your resume, practice with our virtual interviewer, and get real-time feedback on your job prospects.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
          <Button
            size="lg"
            className="text-lg px-8 button-glow"
            onClick={() => navigate("/upload")}
          >
            Try It Now <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-lg px-8 border-slate-600 text-white hover:bg-slate-800"
            onClick={() => navigate("/dashboard")}
          >
            View Dashboard
          </Button>
        </motion.div>
        
        {/* Stats Bar */}
        <motion.div 
          variants={itemVariants}
          className="mt-20 w-full max-w-4xl bg-slate-800/60 backdrop-blur-sm rounded-xl p-4"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2">
                  {stat.icon}
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-slate-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-secondary/50">
        <div className="container mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-16"
            variants={itemVariants}
          >
            How Job Fortune <span className="text-gradient">Works</span>
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="glass-card rounded-xl p-8 flex flex-col items-center text-center transform transition-all duration-300 hover:translate-y-[-5px]"
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
              >
                <div className="mb-6 p-4 rounded-full bg-secondary/70">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-16"
            variants={itemVariants}
          >
            <span className="text-gradient">Three Simple Steps</span> to Success
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                number: "01",
                title: "Upload Your Resume",
                description: "Submit your resume and select target job positions to begin the analysis process.",
              },
              {
                number: "02",
                title: "Take Virtual Interview",
                description: "Answer AI-generated questions that simulate real interview experiences for your desired role.",
              },
              {
                number: "03",
                title: "Get Your Results",
                description: "Receive immediate feedback and a predictive analysis of your job application success.",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="relative"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <div className="text-6xl font-bold text-primary/10 absolute -top-8 left-0">{step.number}</div>
                <div className="pt-8 pl-6">
                  <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="mt-20 text-center"
            variants={itemVariants}
          >
            <Button
              size="lg"
              className="text-lg px-8 button-glow"
              onClick={() => navigate("/upload")}
            >
              Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-24 px-6 bg-gradient-to-b from-slate-900 to-black">
        <div className="container mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-4"
            variants={itemVariants}
          >
            Success <span className="text-gradient">Stories</span>
          </motion.h2>
          
          <motion.p 
            className="text-center text-slate-400 max-w-2xl mx-auto mb-16"
            variants={itemVariants}
          >
            Hear from candidates who prepared with our platform and landed their dream jobs
          </motion.p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Software Engineer at Google",
                image: "https://randomuser.me/api/portraits/women/44.jpg",
                quote: "The technical assessment and mock interviews were so similar to what I experienced in my actual Google interviews. I felt completely prepared!"
              },
              {
                name: "David Chen",
                role: "Product Manager at Amazon",
                image: "https://randomuser.me/api/portraits/men/32.jpg",
                quote: "The AI feedback helped me refine my answers to behavioral questions. I was able to tell compelling stories about my past experiences."
              },
              {
                name: "Priya Patel",
                role: "Data Scientist at Microsoft",
                image: "https://randomuser.me/api/portraits/women/68.jpg",
                quote: "The technical assessments identified gaps in my knowledge that I didn't realize I had. After studying those areas, I aced my interview."
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-14 h-14 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-primary">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-slate-300">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-900 mt-auto">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold">Job<span className="text-primary">Fortune</span></h3>
              <p className="text-sm text-slate-400 mt-2">Your AI-powered interview preparation platform</p>
            </div>
            
            <div className="flex gap-8 mb-6 md:mb-0">
              <a href="#" className="text-slate-300 hover:text-primary transition-colors">About</a>
              <a href="#" className="text-slate-300 hover:text-primary transition-colors">Blog</a>
              <a href="#" className="text-slate-300 hover:text-primary transition-colors">FAQ</a>
              <a href="#" className="text-slate-300 hover:text-primary transition-colors">Contact</a>
            </div>
            
            <div className="flex gap-4">
              <a href="#" className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-primary hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                </svg>
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-primary hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                </svg>
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-primary hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 text-center">
            <p className="text-slate-400 text-sm">© 2023 Job Fortune. All rights reserved.</p>
            <p className="text-xs text-slate-500 mt-2">
              A project created for demonstration purposes.
            </p>
          </div>
        </div>
      </footer>
    </motion.div>
  );
};

export default Home;
