import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, Code, Bot, Zap, Shield, Users } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ps-black to-gray-900 text-white">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-ps-red rounded-lg flex items-center justify-center mx-auto mb-6">
            <Rocket className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-4">Sapient Slingshot</h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            AI-Powered Development Platform that delivers results from day one. 
            Automate and accelerate complex software processes with industry expertise.
          </p>
          <Button 
            size="lg" 
            className="bg-ps-red hover:bg-red-700 text-white px-8 py-4 text-lg"
            onClick={() => window.location.href = '/api/login'}
          >
            Get Started
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white/10 border-gray-700 text-white">
            <CardHeader>
              <Code className="w-10 h-10 text-ps-red mb-4" />
              <CardTitle>AI Code Generation</CardTitle>
              <CardDescription className="text-gray-300">
                Generate high-quality code with 99% accuracy using advanced AI models
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• React components and TypeScript</li>
                <li>• Backend APIs and databases</li>
                <li>• Test automation and documentation</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-gray-700 text-white">
            <CardHeader>
              <Zap className="w-10 h-10 text-ps-red mb-4" />
              <CardTitle>Legacy Modernization</CardTitle>
              <CardDescription className="text-gray-300">
                Transform legacy systems with seamless automated migration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Mainframe to cloud migration</li>
                <li>• Framework upgrades</li>
                <li>• Database modernization</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-gray-700 text-white">
            <CardHeader>
              <Bot className="w-10 h-10 text-ps-red mb-4" />
              <CardTitle>AI Agent Orchestration</CardTitle>
              <CardDescription className="text-gray-300">
                Intelligent agents manage tasks and collaborate autonomously
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Automated testing and deployment</li>
                <li>• Code reviews and optimization</li>
                <li>• Project management assistance</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-gray-700 text-white">
            <CardHeader>
              <Shield className="w-10 h-10 text-ps-red mb-4" />
              <CardTitle>Enterprise Security</CardTitle>
              <CardDescription className="text-gray-300">
                Built-in security and compliance for enterprise environments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• SOC 2 Type II compliant</li>
                <li>• Role-based access control</li>
                <li>• Audit trails and monitoring</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-gray-700 text-white">
            <CardHeader>
              <Users className="w-10 h-10 text-ps-red mb-4" />
              <CardTitle>Team Collaboration</CardTitle>
              <CardDescription className="text-gray-300">
                Real-time collaboration with integrated chat and project management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Real-time chat with AI assistant</li>
                <li>• Project tracking and analytics</li>
                <li>• Knowledge sharing and documentation</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-gray-700 text-white">
            <CardHeader>
              <Rocket className="w-10 h-10 text-ps-red mb-4" />
              <CardTitle>Faster Time to Market</CardTitle>
              <CardDescription className="text-gray-300">
                Accelerate development cycles with intelligent automation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Screen development in days</li>
                <li>• Automated testing and deployment</li>
                <li>• Continuous integration and delivery</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Development?</h2>
          <p className="text-lg text-gray-300 mb-8">
            Join thousands of developers using Sapient Slingshot to build better software faster.
          </p>
          <Button 
            size="lg" 
            className="bg-ps-red hover:bg-red-700 text-white px-8 py-4 text-lg"
            onClick={() => window.location.href = '/api/login'}
          >
            Start Your Journey
          </Button>
        </div>
      </div>
    </div>
  );
}
