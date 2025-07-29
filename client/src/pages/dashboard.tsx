import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { ProjectList } from "@/components/dashboard/project-list";
import { AiAgentStatus } from "@/components/dashboard/ai-agent-status";

import { ChatPanel } from "@/components/chat/chat-panel";
import { useQuery } from "@tanstack/react-query";
import { Project, AiAgent } from "@shared/schema";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    enabled: isAuthenticated,
  });

  const { data: aiAgents = [] } = useQuery<AiAgent[]>({
    queryKey: ["/api/ai-agents"],
    enabled: isAuthenticated,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ps-red"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const activeProjects = projects.filter(p => p.status === 'active').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const averageProgress = projects.length > 0 
    ? Math.round(projects.reduce((acc, p) => acc + (p.progress || 0), 0) / projects.length)
    : 0;

  return (
    <div className="h-screen flex bg-ps-gray">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-h-0">
        <Header />
        
        <main className="flex-1 p-6 overflow-y-auto min-h-0">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <StatsCard
              title="Active Projects"
              value={activeProjects}
              change={`${completedProjects} completed`}
              icon="project-diagram"
            />
            <StatsCard
              title="Average Progress"
              value={`${averageProgress}%`}
              change="Across all projects"
              icon="code"
            />
            <StatsCard
              title="AI Agents"
              value={aiAgents.length}
              change={`${aiAgents.filter(a => a.status === 'active').length} active`}
              icon="robot"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProjectList projects={projects} />
            <AiAgentStatus agents={aiAgents} />
          </div>
        </main>
      </div>

      <ChatPanel />
    </div>
  );
}
