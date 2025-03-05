
import { motion } from "framer-motion";
import ResumeVerification from "@/components/ResumeVerification";

const VerificationPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-20 pb-10 px-4 flex flex-col items-center justify-center"
    >
      <ResumeVerification />
    </motion.div>
  );
};

export default VerificationPage;
