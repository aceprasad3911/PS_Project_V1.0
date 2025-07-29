import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Code,
  Play,
  Copy,
  Download,
  FileText,
  Zap,
  Settings,
  History,
  Sparkles,
  Terminal,
  Globe,
  Smartphone,
  Database,
  Brain
} from "lucide-react";

const frameworks = [
  { value: "react", label: "React", icon: Globe },
  { value: "vue", label: "Vue.js", icon: Globe },
  { value: "angular", label: "Angular", icon: Globe },
  { value: "nodejs", label: "Node.js", icon: Terminal },
  { value: "python", label: "Python", icon: Terminal },
  { value: "nextjs", label: "Next.js", icon: Smartphone },
  { value: "express", label: "Express", icon: Database },
];

const templates = [
  {
    id: "react-component",
    name: "React Component",
    description: "Generate a functional React component with props and styling",
    prompt: "Create a React component that",
    category: "Frontend"
  },
  {
    id: "api-endpoint",
    name: "API Endpoint",
    description: "Generate a REST API endpoint with validation and error handling",
    prompt: "Create an API endpoint that",
    category: "Backend"
  },
  {
    id: "database-schema",
    name: "Database Schema",
    description: "Generate database schema and migration files",
    prompt: "Create a database schema for",
    category: "Database"
  },
  {
    id: "utility-function",
    name: "Utility Function",
    description: "Generate a utility function with TypeScript types",
    prompt: "Create a utility function that",
    category: "Utils"
  },
  {
    id: "test-suite",
    name: "Test Suite",
    description: "Generate comprehensive test cases with Jest/Vitest",
    prompt: "Create tests for",
    category: "Testing"
  },
  {
    id: "custom",
    name: "Custom Code",
    description: "Generate any custom code based on your specific requirements",
    prompt: "",
    category: "Custom"
  }
];

const recentGenerations = [
  {
    id: 1,
    title: "User Authentication Hook",
    framework: "React",
    timestamp: "2 hours ago",
    preview: "const useAuth = () => { const [user, setUser] = useState(null)..."
  },
  {
    id: 2,
    title: "Database Connection Pool",
    framework: "Node.js",
    timestamp: "1 day ago",
    preview: "import { Pool } from 'pg'; const pool = new Pool({..."
  },
  {
    id: 3,
    title: "Payment Processing API",
    framework: "Express",
    timestamp: "2 days ago",
    preview: "app.post('/api/payments', async (req, res) => {..."
  }
];

export default function CodeGeneratorPage() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [selectedFramework, setSelectedFramework] = useState("react");
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isAuthenticated) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Missing prompt",
        description: "Please provide a description of what you want to generate",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI code generation
    setTimeout(() => {
      const mockCode = generateMockCode(selectedTemplate, selectedFramework, prompt);
      setGeneratedCode(mockCode);
      setIsGenerating(false);
      toast({
        title: "Code generated successfully",
        description: "Your code has been generated and is ready to use"
      });
    }, 2000);
  };

  const generateMockCode = (template: typeof templates[0], framework: string, userPrompt: string) => {
    // Mock code generation based on template and framework
    if (template.id === "react-component") {
      return `import React from 'react';

interface ${userPrompt.replace(/[^a-zA-Z]/g, '')}Props {
  // Add your props here
}

export const ${userPrompt.replace(/[^a-zA-Z]/g, '')}: React.FC<${userPrompt.replace(/[^a-zA-Z]/g, '')}Props> = (props) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">${userPrompt}</h2>
      {/* Your component logic here */}
    </div>
  );
};

export default ${userPrompt.replace(/[^a-zA-Z]/g, '')};`;
    }
    
    return `// Generated code for: ${userPrompt}
// Framework: ${framework}
// Template: ${template.name}

// TODO: Implement ${userPrompt}
console.log("Generated code for ${userPrompt}");`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    toast({ title: "Code copied to clipboard" });
  };

  const downloadCode = () => {
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `generated-code-${Date.now()}.${selectedFramework === 'react' ? 'tsx' : 'js'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "Code downloaded successfully" });
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
              <h1 className="text-3xl font-bold text-ps-black">Code Generator</h1>
              <p className="text-ps-accent mt-2">
                Generate high-quality code using AI-powered Slingshot technology
              </p>
            </div>
            
            <div className="flex space-x-3">
              <Button variant="outline" className="border-ps-red text-ps-red hover:bg-ps-red hover:text-white">
                <History className="w-4 h-4 mr-2" />
                History
              </Button>
              <Button variant="outline" className="border-ps-red text-ps-red hover:bg-ps-red hover:text-white">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Configuration Panel */}
            <div className="lg:col-span-1 space-y-6">
              {/* Template Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-ps-black">
                    <Sparkles className="w-5 h-5 mr-2 text-ps-red" />
                    Templates
                  </CardTitle>
                  <CardDescription>Choose a code generation template</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => setSelectedTemplate(template)}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedTemplate.id === template.id
                          ? 'border-ps-red bg-red-50'
                          : 'border-gray-200 hover:border-ps-red hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-ps-black">{template.name}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {template.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-ps-accent">{template.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Framework Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-ps-black">
                    <Code className="w-5 h-5 mr-2 text-ps-red" />
                    Framework
                  </CardTitle>
                  <CardDescription>Select your target framework</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select value={selectedFramework} onValueChange={setSelectedFramework}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {frameworks.map((framework) => (
                        <SelectItem key={framework.value} value={framework.value}>
                          {framework.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Recent Generations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-ps-black">
                    <History className="w-5 h-5 mr-2 text-ps-red" />
                    Recent
                  </CardTitle>
                  <CardDescription>Your recent code generations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentGenerations.map((generation) => (
                    <div
                      key={generation.id}
                      className="p-3 rounded-lg border border-gray-200 hover:border-ps-red cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm text-ps-black">{generation.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {generation.framework}
                        </Badge>
                      </div>
                      <p className="text-xs text-ps-accent mb-2">{generation.timestamp}</p>
                      <p className="text-xs text-gray-600 font-mono truncate">
                        {generation.preview}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Main Generation Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Input Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-ps-black">
                    <Brain className="w-5 h-5 mr-2 text-ps-red" />
                    Describe Your Code
                  </CardTitle>
                  <CardDescription>
                    Tell us what you want to generate in natural language
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="prompt">Code Description</Label>
                    <Textarea
                      id="prompt"
                      placeholder={selectedTemplate.prompt || "Describe what you want to generate..."}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      rows={4}
                      className="resize-none"
                    />
                  </div>
                  
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    className="w-full bg-ps-red hover:bg-red-700 text-white"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Generate Code
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Output Section */}
              {generatedCode && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center text-ps-black">
                          <FileText className="w-5 h-5 mr-2 text-ps-red" />
                          Generated Code
                        </CardTitle>
                        <CardDescription>
                          Your AI-generated code is ready to use
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={copyToClipboard}>
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </Button>
                        <Button size="sm" variant="outline" onClick={downloadCode}>
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                        <code>{generatedCode}</code>
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Tips Card */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-900">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Pro Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li>• Be specific about your requirements for better results</li>
                    <li>• Include context like component props, API parameters, or data structures</li>
                    <li>• Mention styling preferences (CSS modules, Tailwind, styled-components)</li>
                    <li>• Specify error handling or validation requirements</li>
                    <li>• Include accessibility considerations when relevant</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
