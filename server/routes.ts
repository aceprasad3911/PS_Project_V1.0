import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { setupDevAuth, isAuthenticated as isDevAuthenticated } from "./devAuth";
import { insertProjectSchema, insertMessageSchema, insertAiAgentSchema } from "@shared/schema";
import { z } from "zod";

interface AuthenticatedRequest extends Request {
  user?: any;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware - use development auth in local development
  if (process.env.NODE_ENV === 'development' && process.env.REPL_ID === 'development-repl-id') {
    console.log("[DEV] Using development authentication");
    setupDevAuth(app);
  } else {
    console.log("[PROD] Using Replit authentication");
    await setupAuth(app);
  }

  // Choose authentication middleware based on environment
  const authMiddleware = (process.env.NODE_ENV === 'development' && process.env.REPL_ID === 'development-repl-id') 
    ? isDevAuthenticated 
    : isAuthenticated;

  // Auth routes
  app.get('/api/auth/user', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
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
  app.get('/api/projects', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
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

  app.post('/api/projects', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
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

  app.put('/api/projects/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
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

  app.delete('/api/projects/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
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
  app.get('/api/messages', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
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

  app.post('/api/messages', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
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
  app.get('/api/ai-agents', authMiddleware, async (req: Request, res: Response) => {
    try {
      const projectId = req.query.projectId ? parseInt(req.query.projectId as string) : undefined;
      const agents = await storage.getAiAgents(projectId);
      res.json(agents);
    } catch (error) {
      console.error("Error fetching AI agents:", error);
      res.status(500).json({ message: "Failed to fetch AI agents" });
    }
  });

  app.post('/api/ai-agents', authMiddleware, async (req: Request, res: Response) => {
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

  app.put('/api/ai-agents/:id', authMiddleware, async (req: Request, res: Response) => {
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
  app.post('/api/slingshot/generate-code', authMiddleware, async (req: Request, res: Response) => {
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

  app.post('/api/slingshot/modernize', authMiddleware, async (req: Request, res: Response) => {
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

  // Slingshot AI chat models endpoint
  app.get('/api/chat/models', (req: Request, res: Response) => {
    res.type('application/json').json({
      data: [
        {
          id: "gpt35turbo",
          name: "GPT 3.5 Turbo",
          group: "Standard",
          enabled: true,
          tokencontextlength: 4097,
        },
        {
          name: "modelid2",
          group: "groupname",
          enabled: true,
          tokencontextlength: 4097,
        },
      ],
    });
  });

  // Slingshot AI chat model contexts endpoint
  app.get('/api/chat/models/:modelid/contexts', (req: Request, res: Response) => {
    const { modelid } = req.params;
    // You can later customize the response based on modelid if needed
    res.type('application/json').json({
      data: [
        {
          id: "data_coe_f3b54921_db1d_48b4_ad77_f43b126a4e4c",
          name: "Data CoE Confluence content",
          description: "Use this tool for any information about Data CoE Community Center of Excellence, Partnerships with companies, Competencies for Data Analytics, Engineering and Data Science, Sudhan Sudharsan",
          enabled: true
        }
      ]
    });
  });

  // Slingshot AI chat commands endpoint
  app.get('/api/chat/commands', (req: Request, res: Response) => {
    res.type('application/json').json({
      data: [
        // Add your command objects here
        // Example:
        // {
        //   id: "command1",
        //   name: "Sample Command",
        //   description: "This is a sample command for Slingshot AI chat.",
        //   enabled: true
        // }
      ]
    });
  });

  // Slingshot AI chat history endpoint
  app.get('/api/chat/history', async (req: Request, res: Response) => {
    try {
      // Use storage.getMessages for chat history
      // You can filter by type if needed
      const offset = parseInt(req.query.offset as string) || 0;
      const limit = parseInt(req.query.limit as string) || 10;
      const type = req.query.type as string || "";
      // For now, just get all messages (no type filter)
      // Use dummy userId and projectId for demo
      const messages = await storage.getMessages("demo-user", undefined);
      // Simulate pagination
      const paged = messages.slice(offset, offset + limit);
      res.type('application/json').json({ data: paged, offset, limit, type });
    } catch (error: any) {
      res.status(500).type('application/json').json({ error: 'Failed to fetch chat history', details: error.message });
    }
  });

  // Slingshot AI chat get by id endpoint
  app.get('/api/chat/:id', async (req: Request, res: Response) => {
    try {
      // Use storage.getMessages and find by id
      const messages = await storage.getMessages("demo-user", undefined);
      const chat = messages.find((m: any) => String(m.id) === req.params.id);
      if (!chat) return res.status(404).type('application/json').json({ error: 'Chat message not found' });
      res.type('application/json').json({ data: chat });
    } catch (error: any) {
      res.status(500).type('application/json').json({ error: 'Failed to fetch chat message', details: error.message });
    }
  });

  // Slingshot AI chat delete by id endpoint
  app.delete('/api/chat/:id', async (req: Request, res: Response) => {
    try {
      // Use storage.deleteMessage (expects number id)
      const idNum = parseInt(req.params.id);
      if (isNaN(idNum)) return res.status(400).type('application/json').json({ error: 'Invalid id' });
      await storage.deleteMessage(idNum);
      res.type('application/json').json({ message: `Chat message with id ${req.params.id} deleted successfully.`, id: req.params.id });
    } catch (error: any) {
      res.status(500).type('application/json').json({ error: 'Failed to delete chat message', details: error.message });
    }
  });

  // Slingshot AI chat create endpoint
  app.post('/api/chat', async (req: Request, res: Response) => {
    try {
      // Extract user message
      const { message, name, type, messageid, async, options } = req.body;
      // Simulate AI response (replace with real AI integration)
      const aiResponse = {
        content: `AI response to: ${message}`,
        role: "assistant",
        userId: "demo-user", // Replace with real userId if available
        projectId: undefined,
        createdAt: new Date().toISOString(),
      };
      // Only return the AI response, do NOT store the user message
      res.status(200).type('application/json').json({ data: aiResponse });
    } catch (error: any) {
      res.status(500).type('application/json').json({ error: 'Failed to generate AI response', details: error.message });
    }
  });

  // Slingshot AI chat process file endpoint (stubbed)
  app.post('/api/chat/processfile', async (req: Request, res: Response) => {
    const n = req.query.n as string;
    if (!n || typeof n !== 'string') {
      return res.status(400).type('application/json').json({ error: 'Missing or invalid query parameter: n' });
    }
    // Stub response: not implemented
    res.status(501).type('application/json').json({ error: 'File processing not implemented', n });
  });

  // Slingshot AI chat upload endpoint (stubbed)
  app.post('/api/chat/upload', async (req: Request, res: Response) => {
    // Stub response: not implemented
    res.status(501).type('application/json').json({ error: 'File upload not implemented' });
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
