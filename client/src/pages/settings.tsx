import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Code,
  Bot,
  Globe,
  Database,
  Key,
  Save,
  RefreshCw,
  LogOut,
  Trash2,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

export default function SettingsPage() {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  
  // Profile settings
  const [profile, setProfile] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    jobTitle: user?.jobTitle || "",
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    agentUpdates: true,
    projectUpdates: true,
    weeklyDigest: false,
    systemAlerts: true,
  });

  // AI preferences
  const [aiPreferences, setAiPreferences] = useState({
    defaultFramework: "react",
    codeStyle: "typescript",
    testingFramework: "jest",
    aiAssistanceLevel: "moderate",
    autoGenerate: false,
    explainCode: true,
  });

  // Appearance settings
  const [appearance, setAppearance] = useState({
    theme: "light",
    sidebarCollapsed: false,
    codeTheme: "vs-dark",
    fontSize: "medium",
  });

  if (!isAuthenticated) return null;

  const handleSaveProfile = () => {
    // TODO: Implement profile update
    toast({ title: "Profile updated successfully" });
  };

  const handleSaveNotifications = () => {
    // TODO: Implement notification preferences update
    toast({ title: "Notification preferences updated" });
  };

  const handleSaveAIPreferences = () => {
    // TODO: Implement AI preferences update
    toast({ title: "AI preferences updated" });
  };

  const handleSaveAppearance = () => {
    // TODO: Implement appearance settings update
    toast({ title: "Appearance settings updated" });
  };

  const handleResetSettings = () => {
    // TODO: Implement settings reset
    toast({ title: "Settings reset to defaults" });
  };

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion with confirmation
    toast({ 
      title: "Account deletion requested", 
      description: "This action cannot be undone",
      variant: "destructive" 
    });
  };

  return (
    <div className="h-screen flex bg-ps-gray">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-h-0">
        <Header />
        
        <main className="flex-1 p-6 overflow-y-auto min-h-0">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-ps-black">Settings</h1>
              <p className="text-ps-accent mt-2">
                Manage your account, preferences, and AI assistant configuration
              </p>
            </div>
            
            <div className="flex space-x-3">
              <Button variant="outline" onClick={handleResetSettings}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset to Defaults
              </Button>
            </div>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="profile" className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center space-x-2">
                <Bell className="w-4 h-4" />
                <span>Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex items-center space-x-2">
                <Bot className="w-4 h-4" />
                <span>AI Preferences</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center space-x-2">
                <Palette className="w-4 h-4" />
                <span>Appearance</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Security</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Settings */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-ps-black">
                    <User className="w-5 h-5 mr-2 text-ps-red" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Manage your personal information and account details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profile.firstName}
                        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profile.lastName}
                        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input
                      id="jobTitle"
                      value={profile.jobTitle}
                      onChange={(e) => setProfile({ ...profile, jobTitle: e.target.value })}
                      placeholder="e.g., Senior Developer, Product Manager"
                    />
                  </div>
                  
                  <Button onClick={handleSaveProfile} className="bg-ps-red hover:bg-red-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save Profile
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-ps-black">
                    <Bell className="w-5 h-5 mr-2 text-ps-red" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Choose how and when you want to receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="emailNotifications">Email Notifications</Label>
                        <p className="text-sm text-ps-accent">Receive notifications via email</p>
                      </div>
                      <Switch
                        id="emailNotifications"
                        checked={notifications.emailNotifications}
                        onCheckedChange={(checked) => 
                          setNotifications({ ...notifications, emailNotifications: checked })
                        }
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="pushNotifications">Push Notifications</Label>
                        <p className="text-sm text-ps-accent">Receive browser push notifications</p>
                      </div>
                      <Switch
                        id="pushNotifications"
                        checked={notifications.pushNotifications}
                        onCheckedChange={(checked) => 
                          setNotifications({ ...notifications, pushNotifications: checked })
                        }
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="agentUpdates">AI Agent Updates</Label>
                        <p className="text-sm text-ps-accent">Get notified when AI agents complete tasks</p>
                      </div>
                      <Switch
                        id="agentUpdates"
                        checked={notifications.agentUpdates}
                        onCheckedChange={(checked) => 
                          setNotifications({ ...notifications, agentUpdates: checked })
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="projectUpdates">Project Updates</Label>
                        <p className="text-sm text-ps-accent">Notifications for project milestones and changes</p>
                      </div>
                      <Switch
                        id="projectUpdates"
                        checked={notifications.projectUpdates}
                        onCheckedChange={(checked) => 
                          setNotifications({ ...notifications, projectUpdates: checked })
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="weeklyDigest">Weekly Digest</Label>
                        <p className="text-sm text-ps-accent">Weekly summary of your activity and insights</p>
                      </div>
                      <Switch
                        id="weeklyDigest"
                        checked={notifications.weeklyDigest}
                        onCheckedChange={(checked) => 
                          setNotifications({ ...notifications, weeklyDigest: checked })
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="systemAlerts">System Alerts</Label>
                        <p className="text-sm text-ps-accent">Important system maintenance and security updates</p>
                      </div>
                      <Switch
                        id="systemAlerts"
                        checked={notifications.systemAlerts}
                        onCheckedChange={(checked) => 
                          setNotifications({ ...notifications, systemAlerts: checked })
                        }
                      />
                    </div>
                  </div>
                  
                  <Button onClick={handleSaveNotifications} className="bg-ps-red hover:bg-red-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save Notification Preferences
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* AI Preferences */}
            <TabsContent value="ai">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-ps-black">
                    <Bot className="w-5 h-5 mr-2 text-ps-red" />
                    AI Assistant Preferences
                  </CardTitle>
                  <CardDescription>
                    Configure how AI agents behave and assist you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="defaultFramework">Default Framework</Label>
                      <Select
                        value={aiPreferences.defaultFramework}
                        onValueChange={(value) => 
                          setAiPreferences({ ...aiPreferences, defaultFramework: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="react">React</SelectItem>
                          <SelectItem value="vue">Vue.js</SelectItem>
                          <SelectItem value="angular">Angular</SelectItem>
                          <SelectItem value="svelte">Svelte</SelectItem>
                          <SelectItem value="nodejs">Node.js</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="codeStyle">Code Style</Label>
                      <Select
                        value={aiPreferences.codeStyle}
                        onValueChange={(value) => 
                          setAiPreferences({ ...aiPreferences, codeStyle: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="typescript">TypeScript</SelectItem>
                          <SelectItem value="javascript">JavaScript</SelectItem>
                          <SelectItem value="python">Python</SelectItem>
                          <SelectItem value="java">Java</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="testingFramework">Testing Framework</Label>
                      <Select
                        value={aiPreferences.testingFramework}
                        onValueChange={(value) => 
                          setAiPreferences({ ...aiPreferences, testingFramework: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="jest">Jest</SelectItem>
                          <SelectItem value="vitest">Vitest</SelectItem>
                          <SelectItem value="cypress">Cypress</SelectItem>
                          <SelectItem value="playwright">Playwright</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="aiAssistanceLevel">AI Assistance Level</Label>
                      <Select
                        value={aiPreferences.aiAssistanceLevel}
                        onValueChange={(value) => 
                          setAiPreferences({ ...aiPreferences, aiAssistanceLevel: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minimal">Minimal</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="aggressive">Aggressive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="autoGenerate">Auto-generate Code</Label>
                        <p className="text-sm text-ps-accent">Automatically generate code snippets during development</p>
                      </div>
                      <Switch
                        id="autoGenerate"
                        checked={aiPreferences.autoGenerate}
                        onCheckedChange={(checked) => 
                          setAiPreferences({ ...aiPreferences, autoGenerate: checked })
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="explainCode">Explain Generated Code</Label>
                        <p className="text-sm text-ps-accent">Include explanations with generated code</p>
                      </div>
                      <Switch
                        id="explainCode"
                        checked={aiPreferences.explainCode}
                        onCheckedChange={(checked) => 
                          setAiPreferences({ ...aiPreferences, explainCode: checked })
                        }
                      />
                    </div>
                  </div>
                  
                  <Button onClick={handleSaveAIPreferences} className="bg-ps-red hover:bg-red-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save AI Preferences
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance Settings */}
            <TabsContent value="appearance">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-ps-black">
                    <Palette className="w-5 h-5 mr-2 text-ps-red" />
                    Appearance & Interface
                  </CardTitle>
                  <CardDescription>
                    Customize the look and feel of your workspace
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="theme">Theme</Label>
                      <Select
                        value={appearance.theme}
                        onValueChange={(value) => 
                          setAppearance({ ...appearance, theme: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="auto">Auto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="fontSize">Font Size</Label>
                      <Select
                        value={appearance.fontSize}
                        onValueChange={(value) => 
                          setAppearance({ ...appearance, fontSize: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="codeTheme">Code Editor Theme</Label>
                    <Select
                      value={appearance.codeTheme}
                      onValueChange={(value) => 
                        setAppearance({ ...appearance, codeTheme: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vs-dark">VS Code Dark</SelectItem>
                        <SelectItem value="vs-light">VS Code Light</SelectItem>
                        <SelectItem value="github-dark">GitHub Dark</SelectItem>
                        <SelectItem value="monokai">Monokai</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sidebarCollapsed">Collapsed Sidebar</Label>
                      <p className="text-sm text-ps-accent">Start with sidebar collapsed by default</p>
                    </div>
                    <Switch
                      id="sidebarCollapsed"
                      checked={appearance.sidebarCollapsed}
                      onCheckedChange={(checked) => 
                        setAppearance({ ...appearance, sidebarCollapsed: checked })
                      }
                    />
                  </div>
                  
                  <Button onClick={handleSaveAppearance} className="bg-ps-red hover:bg-red-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save Appearance Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-ps-black">
                      <Shield className="w-5 h-5 mr-2 text-ps-red" />
                      Security & Privacy
                    </CardTitle>
                    <CardDescription>
                      Manage your account security and privacy settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <div>
                          <h4 className="font-medium text-ps-black">Replit Authentication</h4>
                          <p className="text-sm text-ps-accent">Signed in via Replit OAuth</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium text-ps-black mb-2">API Keys</h4>
                      <p className="text-sm text-ps-accent mb-4">
                        Manage API keys for external integrations
                      </p>
                      <Button variant="outline">
                        <Key className="w-4 h-4 mr-2" />
                        Manage API Keys
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium text-ps-black mb-2">Data Export</h4>
                      <p className="text-sm text-ps-accent mb-4">
                        Download a copy of your data including projects, messages, and settings
                      </p>
                      <Button variant="outline">
                        <Database className="w-4 h-4 mr-2" />
                        Export Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-red-200 bg-red-50">
                  <CardHeader>
                    <CardTitle className="flex items-center text-red-900">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Danger Zone
                    </CardTitle>
                    <CardDescription className="text-red-700">
                      Irreversible actions that will permanently affect your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-red-900">Sign Out Everywhere</h4>
                        <p className="text-sm text-red-700">Sign out of all devices and sessions</p>
                      </div>
                      <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out All
                      </Button>
                    </div>
                    
                    <Separator className="bg-red-200" />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-red-900">Delete Account</h4>
                        <p className="text-sm text-red-700">
                          Permanently delete your account and all associated data
                        </p>
                      </div>
                      <Button 
                        variant="destructive" 
                        onClick={handleDeleteAccount}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}