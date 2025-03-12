
import { Brain } from "lucide-react";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link 
      to="/" 
      className="flex items-center space-x-2 text-mindease-primary hover:opacity-90 transition-opacity"
    >
      <Brain className="w-8 h-8" />
      <span className="font-bold text-xl">MindEASE</span>
    </Link>
  );
};

export default Logo;
