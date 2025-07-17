import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AiAgent } from "@shared/schema";
import { Bot } from "lucide-react";

interface AiAgentStatusProps {
  agents: AiAgent[];
}

export function AiAgentStatus({ agents }: AiAgentStatusProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 border-green-200';
      case 'running':
        return 'bg-blue-50 border-blue-200';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200';
      case 'idle':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'running':
        return 'bg-blue-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'idle':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'running':
        return 'Running';
      case 'pending':
        return 'Pending';
      case 'idle':
        return 'Idle';
      default:
        return 'Unknown';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600';
      case 'running':
        return 'text-blue-600';
      case 'pending':
        return 'text-yellow-600';
      case 'idle':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-ps-black">AI Agent Status</CardTitle>
      </CardHeader>
      <CardContent>
        {agents.length === 0 ? (
          <div className="text-center py-8">
            <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No AI agents configured</p>
            <p className="text-sm text-gray-400">Deploy your first agent to automate tasks</p>
          </div>
        ) : (
          <div className="space-y-4">
            {agents.map((agent) => (
              <div key={agent.id} className={`flex items-center justify-between p-4 rounded-lg border ${getStatusColor(agent.status)}`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusDot(agent.status)}`}></div>
                  <div>
                    <p className="font-medium text-ps-black">{agent.name}</p>
                    <p className="text-sm text-ps-accent">
                      {agent.description || `${agent.type.replace('_', ' ')} agent`}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className={getStatusTextColor(agent.status)}>
                  {getStatusLabel(agent.status)}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
