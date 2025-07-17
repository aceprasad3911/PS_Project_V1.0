import { Card, CardContent } from "@/components/ui/card";
import { FolderOpen, Code, Bot, TrendingUp } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: string;
}

export function StatsCard({ title, value, change, icon }: StatsCardProps) {
  const getIcon = () => {
    switch (icon) {
      case "project-diagram":
        return <FolderOpen className="w-6 h-6 text-ps-red" />;
      case "code":
        return <Code className="w-6 h-6 text-ps-red" />;
      case "robot":
        return <Bot className="w-6 h-6 text-ps-red" />;
      default:
        return <TrendingUp className="w-6 h-6 text-ps-red" />;
    }
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-ps-black">{title}</h3>
          {getIcon()}
        </div>
        <div className="text-3xl font-bold text-ps-black mb-2">{value}</div>
        <div className="text-sm text-green-600">{change}</div>
      </CardContent>
    </Card>
  );
}
