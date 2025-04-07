
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const MainNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/upload", label: "Upload Resume" },
    { path: "/interview", label: "Interview" },
    { path: "/about", label: "About Us" },
    { path: "/contact", label: "Contact" },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {navItems.map((item) => (
          <NavigationMenuItem key={item.path}>
            <Button
              variant="ghost"
              className={cn(
                "text-base font-medium",
                isActive(item.path) ? "text-accent" : "text-foreground"
              )}
              onClick={() => handleNavigation(item.path)}
              data-active={isActive(item.path)}
            >
              {item.label}
            </Button>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MainNavigation;
