
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

const FeatureCard = ({ icon: Icon, title, description, className }: FeatureCardProps) => {
  return (
    <div className={cn(
      "p-6 rounded-xl bg-white/50 backdrop-blur-sm border shadow-sm hover:shadow-md transition-all",
      "transform hover:-translate-y-1 duration-300",
      className
    )}>
      <div className="w-12 h-12 bg-mindease-primary/10 rounded-lg flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-mindease-primary" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default FeatureCard;
