
import { Button } from "@/components/ui/button";
import Logo from "./Logo";
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm z-50 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Logo />
        <div className="flex items-center space-x-4">
          <Link to="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/register">
            <Button className="bg-mindease-primary hover:bg-mindease-primary/90">Register</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
