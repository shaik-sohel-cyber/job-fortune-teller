
import { motion } from "framer-motion";
import ResumeUpload from "@/components/ResumeUpload";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const Upload = () => {
  const { toast } = useToast();

  useEffect(() => {
    // If user already has a resume, show toast but let them continue
    // (they might want to update their resume)
    if (localStorage.getItem('resumeData')) {
      toast({
        title: "Resume already uploaded",
        description: "You can continue with your existing resume or upload a new one.",
      });
    }
  }, [toast]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-20 pb-10 px-4 flex flex-col items-center justify-center bg-gradient-to-b from-black to-slate-900 text-white"
    >
      <ResumeUpload />
    </motion.div>
  );
};

export default Upload;
