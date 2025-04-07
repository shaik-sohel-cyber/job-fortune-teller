
import { motion } from "framer-motion";
import ResumeUpload from "@/components/ResumeUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Upload = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-20 pb-10 px-4 flex flex-col items-center justify-center"
    >
      <Card className="w-full max-w-3xl bg-white/70 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Upload Your Resume</CardTitle>
        </CardHeader>
        <CardContent>
          <ResumeUpload />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Upload;
