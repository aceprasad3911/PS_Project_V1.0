import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Project, AiAgent, Message } from "@shared/schema";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  Bot,
  Code,
  MessageSquare,
  Calendar,
  BarChart3,
  Target,
  Zap
} from "lucide-react";
import { format, subDays, startOfDay } from "date-fns";
import { useState } from "react";

const COLORS = {
  primary: "hsl(354, 77%, 53%)",
  secondary: "hsl(210, 6%, 46%)",
  success: "hsl(142, 76%, 36%)",
  warning: "hsl(38, 92%, 50%)",
  info: "hsl(217, 91%, 60%)",
};

export default function AnalyticsPage() {
  const { isAuthenticated } = useAuth();
  const [timeRange, setTimeRange] = useState("7d");

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    enabled: isAuthenticated,
  });

  const { data: agents = [] } = useQuery<AiAgent[]>({
    queryKey: ["/api/ai-agents"],
    enabled: isAuthenticated,
  });

  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) return null;

  // Calculate analytics data
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const averageProgress = projects.length > 0 
    ? Math.round(projects.reduce((acc, p) => acc + (p.progress || 0), 0) / projects.length)
    : 0;

  const totalAgents = agents.length;
  const activeAgents = agents.filter(a => a.status === 'active').length;
  const runningAgents = agents.filter(a => a.status === 'running').length;

  // Project status distribution for pie chart
  const projectStatusData = [
    { name: 'Active', value: activeProjects, color: COLORS.info },
    { name: 'Completed', value: completedProjects, color: COLORS.success },
    { name: 'Paused', value: projects.filter(p => p.status === 'paused').length, color: COLORS.warning },
  ].filter(item => item.value > 0);

  // Agent type distribution
  const agentTypeData = [
    { name: 'Code Generator', value: agents.filter(a => a.type === 'code_generator').length },
    { name: 'Test Automation', value: agents.filter(a => a.type === 'test_automation').length },
    { name: 'Code Review', value: agents.filter(a => a.type === 'code_review').length },
    { name: 'Documentation', value: agents.filter(a => a.type === 'documentation').length },
  ].filter(item => item.value > 0);

  // Generate activity data for the past 7 days
  const activityData = Array.from({ length: 7 }, (_, i) => {
    const date = startOfDay(subDays(new Date(), 6 - i));
    const dateStr = format(date, 'MMM dd');
    
    return {
      date: dateStr,
      projects: Math.floor(Math.random() * 5) + 1, // Mock data for demo
      messages: Math.floor(Math.random() * 20) + 5,
      agents: Math.floor(Math.random() * 3) + 1,
    };
  });

  // Progress trend data
  const progressData = projects.map(project => ({
    name: project.name.length > 15 ? project.name.substring(0, 15) + '...' : project.name,
    progress: project.progress || 0,
    status: project.status,
  }));

  return (
    <div className="min-h-screen flex bg-ps-gray">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-ps-black">Analytics</h1>
              <p className="text-ps-accent mt-2">
                Insights and metrics for your development workflow
              </p>
            </div>
            
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-l-4 border-l-ps-red">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-ps-accent">Total Projects</p>
                    <p className="text-2xl font-bold text-ps-black">{totalProjects}</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-500">+12% from last month</span>
                    </div>
                  </div>
                  <Target className="w-8 h-8 text-ps-red" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-ps-accent">Active Agents</p>
                    <p className="text-2xl font-bold text-ps-black">{activeAgents}</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-500">+5 this week</span>
                    </div>
                  </div>
                  <Bot className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-ps-accent">Avg Progress</p>
                    <p className="text-2xl font-bold text-ps-black">{averageProgress}%</p>
                    <div className="flex items-center mt-2">
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                      <span className="text-sm text-red-500">-3% from last week</span>
                    </div>
                  </div>
                  <BarChart3 className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-yellow-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-ps-accent">Messages Today</p>
                    <p className="text-2xl font-bold text-ps-black">{messages.length}</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-500">+18% from yesterday</span>
                    </div>
                  </div>
                  <MessageSquare className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Activity Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-ps-black">
                  <Activity className="w-5 h-5 mr-2 text-ps-red" />
                  Development Activity
                </CardTitle>
                <CardDescription>Daily activity across your projects</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="projects" 
                      stroke={COLORS.primary} 
                      strokeWidth={2}
                      name="Projects"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="messages" 
                      stroke={COLORS.info} 
                      strokeWidth={2}
                      name="Messages"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Project Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-ps-black">
                  <Target className="w-5 h-5 mr-2 text-ps-red" />
                  Project Status
                </CardTitle>
                <CardDescription>Distribution of project statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={projectStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {projectStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Project Progress and Agent Types */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-ps-black">
                  <BarChart3 className="w-5 h-5 mr-2 text-ps-red" />
                  Project Progress
                </CardTitle>
                <CardDescription>Current progress across all projects</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="progress" fill={COLORS.primary} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Agent Types */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-ps-black">
                  <Bot className="w-5 h-5 mr-2 text-ps-red" />
                  AI Agent Types
                </CardTitle>
                <CardDescription>Distribution of AI agent types</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={agentTypeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill={COLORS.info} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Performance Insights */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center text-ps-black">
                <Zap className="w-5 h-5 mr-2 text-ps-red" />
                Performance Insights
              </CardTitle>
              <CardDescription>Key recommendations to improve your workflow</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-l-blue-500">
                  <h4 className="font-semibold text-blue-900 mb-2">Productivity Boost</h4>
                  <p className="text-sm text-blue-700">
                    Your active agents have increased productivity by 15% this week. 
                    Consider adding more code generation agents.
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-l-green-500">
                  <h4 className="font-semibold text-green-900 mb-2">Quality Improvement</h4>
                  <p className="text-sm text-green-700">
                    Code review agents have caught 23 potential issues this month. 
                    Great job maintaining code quality!
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-l-yellow-500">
                  <h4 className="font-semibold text-yellow-900 mb-2">Optimization Opportunity</h4>
                  <p className="text-sm text-yellow-700">
                    Some projects have stagnant progress. Consider allocating 
                    more AI agents to these projects.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}