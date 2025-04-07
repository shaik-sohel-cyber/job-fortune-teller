
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, MessageSquare, LineChart } from "lucide-react";

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

      {/* Footer */}
      <footer className="py-12 px-6 bg-secondary/50 mt-auto">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">© 2023 Job Fortune. All rights reserved.</p>
          <p className="text-sm text-muted-foreground mt-2">
            A project created for hackathon demonstration purposes.
          </p>
        </div>
      </footer>
    </motion.div>
  );
};

export default Home;
