
import { motion } from "framer-motion";
import Dashboard from "@/components/Dashboard";

const DashboardPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-20 pb-10 px-4 bg-gradient-to-b from-black to-slate-900 text-white"
    >
      <Dashboard />
    </motion.div>
  );
};

export default DashboardPage;
