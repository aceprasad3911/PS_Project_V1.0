import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, RefreshCw, Bot, Zap } from "lucide-react";

export function SlingshotIntegration() {
  const integrations = [
    {
      title: "Code Generation",
      description: "AI-powered code creation with 99% accuracy",
      icon: <Code className="w-6 h-6 text-white" />,
      bgColor: "bg-ps-red",
      buttonColor: "bg-ps-red hover:bg-red-700",
      buttonText: "Configure"
    },
    {
      title: "Legacy Modernization",
      description: "Transform legacy systems seamlessly",
      icon: <RefreshCw className="w-6 h-6 text-white" />,
      bgColor: "bg-blue-500",
      buttonColor: "bg-blue-500 hover:bg-blue-600",
      buttonText: "Start Migration"
    },
    {
      title: "Workflow Automation",
      description: "Intelligent agent orchestration",
      icon: <Bot className="w-6 h-6 text-white" />,
      bgColor: "bg-green-500",
      buttonColor: "bg-green-500 hover:bg-green-600",
      buttonText: "Deploy Agents"
    }
  ];

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-ps-black flex items-center">
          <Zap className="w-5 h-5 text-ps-red mr-2" />
          Slingshot AI Integration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {integrations.map((integration, index) => (
            <div key={index} className="text-center p-6 border border-gray-200 rounded-lg">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 ${integration.bgColor}`}>
                {integration.icon}
              </div>
              <h4 className="font-medium text-ps-black mb-2">{integration.title}</h4>
              <p className="text-sm text-ps-accent mb-4">{integration.description}</p>
              <Button 
                className={`${integration.buttonColor} text-white transition-colors text-sm`}
                size="sm"
              >
                {integration.buttonText}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
