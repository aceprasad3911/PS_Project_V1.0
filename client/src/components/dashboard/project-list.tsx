import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Project } from "@shared/schema";
import { FolderOpen, Smartphone, BarChart3 } from "lucide-react";

interface ProjectListProps {
  projects: Project[];
}

export function ProjectList({ projects }: ProjectListProps) {
  const getProjectIcon = (name: string) => {
    if (name.toLowerCase().includes('mobile')) {
      return <Smartphone className="w-5 h-5 text-white" />;
    }
    if (name.toLowerCase().includes('analytics') || name.toLowerCase().includes('dashboard')) {
      return <BarChart3 className="w-5 h-5 text-white" />;
    }
    return <FolderOpen className="w-5 h-5 text-white" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'active':
        return 'bg-ps-red';
      case 'paused':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'active':
        return 'In Progress';
      case 'paused':
        return 'Paused';
      default:
        return 'Unknown';
    }
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-ps-black">Recent Projects</CardTitle>
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <div className="text-center py-8">
            <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No projects yet</p>
            <p className="text-sm text-gray-400">Create your first project to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.slice(0, 5).map((project) => (
              <div key={project.id} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(project.status)}`}>
                    {getProjectIcon(project.name)}
                  </div>
                  <div>
                    <h4 className="font-medium text-ps-black">{project.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {getStatusLabel(project.status)}
                      </Badge>
                      {project.description && (
                        <p className="text-xs text-ps-accent truncate max-w-48">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-ps-black">{project.progress || 0}%</p>
                  <p className="text-xs text-ps-accent">
                    {new Date(project.updatedAt || project.createdAt || '').toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
