
import { ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  return (
    <div className="relative min-h-screen bg-background">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/5 rounded-full filter blur-3xl animate-float" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent/5 rounded-full filter blur-3xl animate-float" style={{ animationDelay: "-2s" }} />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl animate-float" style={{ animationDelay: "-4s" }} />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-accent/5 rounded-full filter blur-3xl animate-float" style={{ animationDelay: "-6s" }} />
      </div>
      
      <Header />
      
      <AnimatePresence mode="wait">
        <div key={location.pathname}>{children}</div>
      </AnimatePresence>
    </div>
  );
};

export default Layout;
