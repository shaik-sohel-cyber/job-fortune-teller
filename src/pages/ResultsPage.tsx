
import { motion } from "framer-motion";
import Results from "@/components/Results";

const ResultsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-20 pb-10 px-4"
    >
      <Results />
    </motion.div>
  );
};

export default ResultsPage;
