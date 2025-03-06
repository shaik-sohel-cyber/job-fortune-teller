
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container mx-auto flex items-center justify-between">
        <motion.div 
          className="text-2xl font-bold"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          onClick={() => navigate("/")}
        >
          <span className="text-gradient cursor-pointer">Job Fortune</span>
        </motion.div>
        
        <nav className="hidden md:flex items-center space-x-8">
          {[
            { path: "/", label: "Home" },
            { path: "/upload", label: "Upload Resume" },
            { path: "/interview", label: "Interview" },
            { path: "/about", label: "About Us" },
            { path: "/contact", label: "Contact" },
          ].map((item) => (
            <div key={item.path} className="relative">
              <Button
                variant="ghost"
                className={`text-base font-medium ${isActive(item.path) ? "text-primary" : "text-foreground"}`}
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </Button>
              
              {isActive(item.path) && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  layoutId="activeNavIndicator"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </div>
          ))}
        </nav>
        
        <Button 
          className="button-glow"
          onClick={() => navigate("/upload")}
        >
          Get Started
        </Button>
      </div>
    </motion.header>
  );
};

export default Header;
