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
import { Progress } from "@/components/ui/progress";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Project, AiAgent } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import {
  FolderOpen,
  Plus,
  Play,
  Pause,
  Settings,
  Calendar,
  User,
  Target,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  GitBranch,
  Code,
  Bot
} from "lucide-react";
import { format } from "date-fns";

const statusColors = {
  active: "bg-green-500",
  completed: "bg-blue-500",
  paused: "bg-yellow-500",
  archived: "bg-gray-500",
};

const statusLabels = {
  active: "Active",
  completed: "Completed",
  paused: "Paused",
  archived: "Archived",
};

export default function ProjectsPage() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    status: "active" as const,
    progress: 0,
  });

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    enabled: isAuthenticated,
  });

  const { data: agents = [] } = useQuery<AiAgent[]>({
    queryKey: ["/api/ai-agents"],
    enabled: isAuthenticated,
  });

  const createProjectMutation = useMutation({
    mutationFn: (project: typeof newProject) => 
      apiRequest("POST", "/api/projects", project),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setIsCreateDialogOpen(false);
      setNewProject({ name: "", description: "", status: "active", progress: 0 });
      toast({ title: "Project created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create project", variant: "destructive" });
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Project> }) =>
      apiRequest("PATCH", `/api/projects/${id}`, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Project updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update project", variant: "destructive" });
    },
  });

  if (!isAuthenticated) return null;

  const getProjectAgents = (projectId: number) => {
    return agents.filter(agent => agent.projectId === projectId);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Activity className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'paused': return <Pause className="w-4 h-4" />;
      case 'archived': return <AlertCircle className="w-4 h-4" />;
      default: return <FolderOpen className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen flex bg-ps-gray">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-ps-black">Projects</h1>
              <p className="text-ps-accent mt-2">
                Manage and track your development projects
              </p>
            </div>
            
            <div className="flex space-x-3">
              <div className="flex border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 text-sm ${
                    viewMode === "grid" 
                      ? "bg-ps-red text-white" 
                      : "bg-white text-ps-black hover:bg-gray-50"
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 text-sm ${
                    viewMode === "list" 
                      ? "bg-ps-red text-white" 
                      : "bg-white text-ps-black hover:bg-gray-50"
                  }`}
                >
                  List
                </button>
              </div>
              
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-ps-red hover:bg-red-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    New Project
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                    <DialogDescription>
                      Set up a new development project with AI assistance
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Project Name</Label>
                      <Input
                        id="name"
                        value={newProject.name}
                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                        placeholder="e.g., E-commerce Platform"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                        placeholder="Describe your project goals and requirements..."
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="status">Initial Status</Label>
                      <Select
                        value={newProject.status}
                        onValueChange={(value: any) => setNewProject({ ...newProject, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(statusLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button
                      onClick={() => createProjectMutation.mutate(newProject)}
                      disabled={!newProject.name || createProjectMutation.isPending}
                      className="w-full bg-ps-red hover:bg-red-700"
                    >
                      {createProjectMutation.isPending ? "Creating..." : "Create Project"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-l-4 border-l-ps-red">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-ps-accent">Total Projects</p>
                    <p className="text-2xl font-bold text-ps-black">{projects.length}</p>
                  </div>
                  <FolderOpen className="w-8 h-8 text-ps-red" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-ps-accent">Active</p>
                    <p className="text-2xl font-bold text-ps-black">
                      {projects.filter(p => p.status === 'active').length}
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
                    <p className="text-sm text-ps-accent">Completed</p>
                    <p className="text-2xl font-bold text-ps-black">
                      {projects.filter(p => p.status === 'completed').length}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-yellow-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-ps-accent">Avg Progress</p>
                    <p className="text-2xl font-bold text-ps-black">
                      {projects.length > 0 
                        ? Math.round(projects.reduce((acc, p) => acc + (p.progress || 0), 0) / projects.length)
                        : 0}%
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Projects Display */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => {
                const projectAgents = getProjectAgents(project.id);
                
                return (
                  <Card key={project.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-ps-red rounded-lg flex items-center justify-center">
                            <FolderOpen className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg text-ps-black">{project.name}</CardTitle>
                            <CardDescription className="flex items-center space-x-2">
                              {getStatusIcon(project.status)}
                              <span>{statusLabels[project.status as keyof typeof statusLabels]}</span>
                            </CardDescription>
                          </div>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={`${statusColors[project.status as keyof typeof statusColors]} text-white`}
                        >
                          {project.progress || 0}%
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-sm text-ps-accent mb-4 line-clamp-2">
                        {project.description || "No description provided"}
                      </p>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-ps-accent">Progress</span>
                            <span className="text-ps-black font-medium">{project.progress || 0}%</span>
                          </div>
                          <Progress value={project.progress || 0} className="h-2" />
                        </div>
                        
                        {projectAgents.length > 0 && (
                          <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                            <Bot className="w-4 h-4 text-ps-accent" />
                            <span className="text-sm text-ps-black">
                              {projectAgents.length} AI Agent{projectAgents.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-2 text-xs text-ps-accent">
                          <Calendar className="w-3 h-3" />
                          <span>
                            Created {project.createdAt ? format(new Date(project.createdAt), 'MMM dd, yyyy') : 'Unknown'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 mt-4">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-ps-black">All Projects</CardTitle>
                <CardDescription>Manage your projects in list view</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.map((project) => {
                    const projectAgents = getProjectAgents(project.id);
                    
                    return (
                      <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-ps-red rounded-lg flex items-center justify-center">
                            <FolderOpen className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h3 className="font-medium text-ps-black">{project.name}</h3>
                            <p className="text-sm text-ps-accent">{project.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(project.status)}
                              <span className="text-sm font-medium text-ps-black">
                                {statusLabels[project.status as keyof typeof statusLabels]}
                              </span>
                            </div>
                            <p className="text-xs text-ps-accent">
                              {projectAgents.length} AI Agent{projectAgents.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                          
                          <div className="w-24">
                            <div className="text-xs text-ps-accent mb-1">{project.progress || 0}%</div>
                            <Progress value={project.progress || 0} className="h-2" />
                          </div>
                          
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {projects.length === 0 && (
            <div className="text-center py-12">
              <FolderOpen className="w-12 h-12 text-ps-accent mx-auto mb-4" />
              <h3 className="text-lg font-medium text-ps-black mb-2">No Projects Yet</h3>
              <p className="text-ps-accent mb-4">
                Create your first project to start building with AI assistance
              </p>
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-ps-red hover:bg-red-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Project
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}