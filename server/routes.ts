import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertProjectSchema, insertMessageSchema, insertAiAgentSchema } from "@shared/schema";
import { z } from "zod";

interface AuthenticatedRequest extends Request {
  user?: any;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.claims.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Project routes
  app.get('/api/projects', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.claims.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const projects = await storage.getProjects(userId);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.post('/api/projects', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.claims.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const validatedData = insertProjectSchema.parse({
        ...req.body,
        ownerId: userId,
      });
      
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.put('/api/projects/:id', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const projectId = parseInt(req.params.id);
      const validatedData = insertProjectSchema.partial().parse(req.body);
      
      const project = await storage.updateProject(projectId, validatedData);
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      console.error("Error updating project:", error);
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete('/api/projects/:id', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const projectId = parseInt(req.params.id);
      await storage.deleteProject(projectId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Message routes
  app.get('/api/messages', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.claims.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const projectId = req.query.projectId ? parseInt(req.query.projectId as string) : undefined;
      const messages = await storage.getMessages(userId, projectId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post('/api/messages', isAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.claims.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const validatedData = insertMessageSchema.parse({
        ...req.body,
        userId,
      });
      
      const message = await storage.createMessage(validatedData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      console.error("Error creating message:", error);
      res.status(500).json({ message: "Failed to create message" });
    }
  });

  // AI Agent routes
  app.get('/api/ai-agents', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const projectId = req.query.projectId ? parseInt(req.query.projectId as string) : undefined;
      const agents = await storage.getAiAgents(projectId);
      res.json(agents);
    } catch (error) {
      console.error("Error fetching AI agents:", error);
      res.status(500).json({ message: "Failed to fetch AI agents" });
    }
  });

  app.post('/api/ai-agents', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const validatedData = insertAiAgentSchema.parse(req.body);
      const agent = await storage.createAiAgent(validatedData);
      res.status(201).json(agent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid AI agent data", errors: error.errors });
      }
      console.error("Error creating AI agent:", error);
      res.status(500).json({ message: "Failed to create AI agent" });
    }
  });

  app.put('/api/ai-agents/:id', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const agentId = parseInt(req.params.id);
      const validatedData = insertAiAgentSchema.partial().parse(req.body);
      
      const agent = await storage.updateAiAgent(agentId, validatedData);
      res.json(agent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid AI agent data", errors: error.errors });
      }
      console.error("Error updating AI agent:", error);
      res.status(500).json({ message: "Failed to update AI agent" });
    }
  });

  // Slingshot AI integration endpoints
  app.post('/api/slingshot/generate-code', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { prompt, projectId } = req.body;
      
      // Placeholder for Slingshot AI integration
      // In production, this would integrate with the actual Slingshot AI API
      const response = {
        code: `// Generated code based on: ${prompt}\n// This would be actual AI-generated code`,
        language: 'javascript',
        confidence: 0.95,
        projectId,
      };
      
      res.json(response);
    } catch (error) {
      console.error("Error generating code:", error);
      res.status(500).json({ message: "Failed to generate code" });
    }
  });

  app.post('/api/slingshot/modernize', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { legacyCode, targetFramework } = req.body;
      
      // Placeholder for Slingshot AI modernization
      const response = {
        modernizedCode: `// Modernized code for ${targetFramework}\n// This would be actual AI-modernized code`,
        framework: targetFramework,
        improvements: ['Updated syntax', 'Added TypeScript support', 'Improved performance'],
      };
      
      res.json(response);
    } catch (error) {
      console.error("Error modernizing code:", error);
      res.status(500).json({ message: "Failed to modernize code" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time chat
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected to WebSocket');

    ws.on('message', async (message: Buffer) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'chat_message') {
          // Broadcast message to all connected clients
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'chat_message',
                content: data.content,
                role: data.role,
                timestamp: new Date().toISOString(),
              }));
            }
          });
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });
  });

  return httpServer;
}
