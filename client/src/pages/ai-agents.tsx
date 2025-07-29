import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AiAgent, Project } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { 
  Bot, 
  Plus, 
  Play, 
  Pause, 
  Settings, 
  Code, 
  FileText, 
  TestTube, 
  GitPullRequest,
  Activity,
  Calendar,
  User
} from "lucide-react";

const agentTypeIcons = {
  code_generator: Code,
  test_automation: TestTube,
  code_review: GitPullRequest,
  documentation: FileText,
};

const agentTypeLabels = {
  code_generator: "Code Generator",
  test_automation: "Test Automation",
  code_review: "Code Review",
  documentation: "Documentation",
};

const statusColors = {
  active: "bg-green-500",
  running: "bg-blue-500",
  pending: "bg-yellow-500",
  idle: "bg-gray-500",
};

export default function AiAgentsPage() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newAgent, setNewAgent] = useState({
    name: "",
    type: "code_generator" as const,
    description: "",
    projectId: null as number | null,
  });

  const { data: agents = [] } = useQuery<AiAgent[]>({
    queryKey: ["/api/ai-agents"],
    enabled: isAuthenticated,
  });

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    enabled: isAuthenticated,
  });

  const createAgentMutation = useMutation({
    mutationFn: (agent: typeof newAgent) => 
      apiRequest("POST", "/api/ai-agents", agent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ai-agents"] });
      setIsCreateDialogOpen(false);
      setNewAgent({ name: "", type: "code_generator", description: "", projectId: null });
      toast({ title: "AI Agent created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create AI Agent", variant: "destructive" });
    },
  });

  const updateAgentStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      apiRequest("PATCH", `/api/ai-agents/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ai-agents"] });
      toast({ title: "Agent status updated" });
    },
    onError: () => {
      toast({ title: "Failed to update agent status", variant: "destructive" });
    },
  });

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen flex bg-ps-gray">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-ps-black">AI Agents</h1>
              <p className="text-ps-accent mt-2">
                Manage and monitor your intelligent development assistants
              </p>
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-ps-red hover:bg-red-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Agent
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New AI Agent</DialogTitle>
                  <DialogDescription>
                    Configure a new AI agent to assist with your development tasks
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Agent Name</Label>
                    <Input
                      id="name"
                      value={newAgent.name}
                      onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                      placeholder="e.g., React Code Assistant"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="type">Agent Type</Label>
                    <Select
                      value={newAgent.type}
                      onValueChange={(value: any) => setNewAgent({ ...newAgent, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(agentTypeLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="project">Project (Optional)</Label>
                    <Select
                      value={newAgent.projectId?.toString() || ""}
                      onValueChange={(value) => 
                        setNewAgent({ ...newAgent, projectId: value ? Number(value) : null })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No Project</SelectItem>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id.toString()}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newAgent.description}
                      onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
                      placeholder="Describe what this agent will do..."
                    />
                  </div>
                  
                  <Button
                    onClick={() => createAgentMutation.mutate(newAgent)}
                    disabled={!newAgent.name || createAgentMutation.isPending}
                    className="w-full bg-ps-red hover:bg-red-700"
                  >
                    {createAgentMutation.isPending ? "Creating..." : "Create Agent"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-l-4 border-l-ps-red">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-ps-accent">Total Agents</p>
                    <p className="text-2xl font-bold text-ps-black">{agents.length}</p>
                  </div>
                  <Bot className="w-8 h-8 text-ps-red" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-ps-accent">Active</p>
                    <p className="text-2xl font-bold text-ps-black">
                      {agents.filter(a => a.status === 'active').length}
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-ps-accent">Running</p>
                    <p className="text-2xl font-bold text-ps-black">
                      {agents.filter(a => a.status === 'running').length}
                    </p>
                  </div>
                  <Play className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-yellow-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-ps-accent">Pending</p>
                    <p className="text-2xl font-bold text-ps-black">
                      {agents.filter(a => a.status === 'pending').length}
                    </p>
                  </div>
                  <Calendar className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Agents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => {
              const IconComponent = agentTypeIcons[agent.type as keyof typeof agentTypeIcons] || Bot;
              const associatedProject = projects.find(p => p.id === agent.projectId);
              
              return (
                <Card key={agent.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-ps-red rounded-lg flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-ps-black">{agent.name}</CardTitle>
                          <CardDescription>
                            {agentTypeLabels[agent.type as keyof typeof agentTypeLabels]}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={`${statusColors[agent.status as keyof typeof statusColors]} text-white`}
                      >
                        {agent.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm text-ps-accent mb-4">
                      {agent.description || "No description provided"}
                    </p>
                    
                    {associatedProject && (
                      <div className="flex items-center space-x-2 mb-4 p-2 bg-gray-50 rounded">
                        <User className="w-4 h-4 text-ps-accent" />
                        <span className="text-sm text-ps-black font-medium">
                          {associatedProject.name}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant={agent.status === 'active' ? 'destructive' : 'default'}
                        onClick={() => updateAgentStatusMutation.mutate({
                          id: agent.id,
                          status: agent.status === 'active' ? 'idle' : 'active'
                        })}
                        disabled={updateAgentStatusMutation.isPending}
                        className={agent.status === 'active' ? '' : 'bg-ps-red hover:bg-red-700 text-white'}
                      >
                        {agent.status === 'active' ? (
                          <><Pause className="w-4 h-4 mr-1" /> Stop</>
                        ) : (
                          <><Play className="w-4 h-4 mr-1" /> Start</>
                        )}
                      </Button>
                      
                      <Button size="sm" variant="outline">
                        <Settings className="w-4 h-4 mr-1" />
                        Configure
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {agents.length === 0 && (
            <div className="text-center py-12">
              <Bot className="w-12 h-12 text-ps-accent mx-auto mb-4" />
              <h3 className="text-lg font-medium text-ps-black mb-2">No AI Agents Yet</h3>
              <p className="text-ps-accent mb-4">
                Create your first AI agent to start automating your development workflow
              </p>
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-ps-red hover:bg-red-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Agent
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
