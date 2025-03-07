
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign up or log in to access this feature.",
        variant: "destructive",
      });
    }
  }, [isAuthenticated, toast]);

  return isAuthenticated ? <Outlet /> : <Navigate to="/signup" state={{ from: location }} replace />;
};

export default ProtectedRoute;
