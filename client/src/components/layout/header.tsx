import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Search, Plus } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ps-black">Dashboard</h1>
          <p className="text-ps-accent">Welcome back, manage your AI development workflow</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Search projects, agents..."
              className="pl-10 w-64"
            />
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="text-ps-accent hover:text-ps-black"
          >
            <Bell className="w-5 h-5" />
          </Button>
          
          <Button className="bg-ps-red hover:bg-red-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>
    </header>
  );
}
