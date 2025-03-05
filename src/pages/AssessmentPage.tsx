
import { motion } from "framer-motion";
import OnlineAssessment from "@/components/OnlineAssessment";

const AssessmentPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-20 pb-10 px-4 flex flex-col"
    >
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full bg-white/70 backdrop-blur-sm shadow-lg rounded-xl overflow-hidden">
        <div className="bg-primary p-4 text-white">
          <h2 className="text-xl font-semibold">Technical Assessment</h2>
          <p className="text-sm text-white/80">Complete the assessment to proceed to your interview</p>
        </div>
        <div className="flex-1 flex flex-col">
          <OnlineAssessment />
        </div>
      </div>
    </motion.div>
  );
};

export default AssessmentPage;
