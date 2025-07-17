import {
  users,
  projects,
  messages,
  aiAgents,
  type User,
  type UpsertUser,
  type Project,
  type InsertProject,
  type Message,
  type InsertMessage,
  type AiAgent,
  type InsertAiAgent,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Project operations
  getProjects(userId: string): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: number): Promise<void>;
  
  // Message operations
  getMessages(userId: string, projectId?: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  deleteMessage(id: number): Promise<void>;
  
  // AI Agent operations
  getAiAgents(projectId?: number): Promise<AiAgent[]>;
  createAiAgent(agent: InsertAiAgent): Promise<AiAgent>;
  updateAiAgent(id: number, agent: Partial<InsertAiAgent>): Promise<AiAgent>;
  deleteAiAgent(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Project operations
  async getProjects(userId: string): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.ownerId, userId))
      .orderBy(desc(projects.updatedAt));
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db
      .insert(projects)
      .values(project)
      .returning();
    return newProject;
  }

  async updateProject(id: number, project: Partial<InsertProject>): Promise<Project> {
    const [updatedProject] = await db
      .update(projects)
      .set({ ...project, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return updatedProject;
  }

  async deleteProject(id: number): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  // Message operations
  async getMessages(userId: string, projectId?: number): Promise<Message[]> {
    const conditions = [eq(messages.userId, userId)];
    if (projectId) {
      conditions.push(eq(messages.projectId, projectId));
    }
    
    return await db
      .select()
      .from(messages)
      .where(and(...conditions))
      .orderBy(desc(messages.createdAt));
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db
      .insert(messages)
      .values(message)
      .returning();
    return newMessage;
  }

  async deleteMessage(id: number): Promise<void> {
    await db.delete(messages).where(eq(messages.id, id));
  }

  // AI Agent operations
  async getAiAgents(projectId?: number): Promise<AiAgent[]> {
    const query = db.select().from(aiAgents);
    
    if (projectId) {
      return await query.where(eq(aiAgents.projectId, projectId));
    }
    
    return await query.orderBy(desc(aiAgents.updatedAt));
  }

  async createAiAgent(agent: InsertAiAgent): Promise<AiAgent> {
    const [newAgent] = await db
      .insert(aiAgents)
      .values(agent)
      .returning();
    return newAgent;
  }

  async updateAiAgent(id: number, agent: Partial<InsertAiAgent>): Promise<AiAgent> {
    const [updatedAgent] = await db
      .update(aiAgents)
      .set({ ...agent, updatedAt: new Date() })
      .where(eq(aiAgents.id, id))
      .returning();
    return updatedAgent;
  }

  async deleteAiAgent(id: number): Promise<void> {
    await db.delete(aiAgents).where(eq(aiAgents.id, id));
  }
}

// Memory storage for development mode
export class MemoryStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private projects: Map<number, Project> = new Map();
  private messages: Map<number, Message> = new Map();
  private aiAgents: Map<number, AiAgent> = new Map();
  private nextProjectId = 1;
  private nextMessageId = 1;
  private nextAgentId = 1;

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const user: User = {
      id: userData.id,
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(userData.id, user);
    return user;
  }

  // Project operations
  async getProjects(userId: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(p => p.ownerId === userId);
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(project: InsertProject): Promise<Project> {
    const newProject: Project = {
      id: this.nextProjectId++,
      name: project.name,
      description: project.description || null,
      status: project.status || 'draft',
      ownerId: project.ownerId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projects.set(newProject.id, newProject);
    return newProject;
  }

  async updateProject(id: number, project: Partial<InsertProject>): Promise<Project> {
    const existing = this.projects.get(id);
    if (!existing) throw new Error('Project not found');
    
    const updated: Project = {
      ...existing,
      ...project,
      updatedAt: new Date(),
    };
    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: number): Promise<void> {
    this.projects.delete(id);
  }

  // Message operations
  async getMessages(userId: string, projectId?: number): Promise<Message[]> {
    const userMessages = Array.from(this.messages.values()).filter(m => m.userId === userId);
    if (projectId) {
      return userMessages.filter(m => m.projectId === projectId);
    }
    return userMessages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const newMessage: Message = {
      id: this.nextMessageId++,
      content: message.content,
      sender: message.sender,
      userId: message.userId,
      projectId: message.projectId || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.messages.set(newMessage.id, newMessage);
    return newMessage;
  }

  async deleteMessage(id: number): Promise<void> {
    this.messages.delete(id);
  }

  // AI Agent operations
  async getAiAgents(projectId?: number): Promise<AiAgent[]> {
    const agents = Array.from(this.aiAgents.values());
    if (projectId) {
      return agents.filter(a => a.projectId === projectId);
    }
    return agents.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async createAiAgent(agent: InsertAiAgent): Promise<AiAgent> {
    const newAgent: AiAgent = {
      id: this.nextAgentId++,
      name: agent.name,
      type: agent.type,
      status: agent.status || 'idle',
      configuration: agent.configuration || {},
      projectId: agent.projectId || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.aiAgents.set(newAgent.id, newAgent);
    return newAgent;
  }

  async updateAiAgent(id: number, agent: Partial<InsertAiAgent>): Promise<AiAgent> {
    const existing = this.aiAgents.get(id);
    if (!existing) throw new Error('AI Agent not found');
    
    const updated: AiAgent = {
      ...existing,
      ...agent,
      updatedAt: new Date(),
    };
    this.aiAgents.set(id, updated);
    return updated;
  }

  async deleteAiAgent(id: number): Promise<void> {
    this.aiAgents.delete(id);
  }
}

// Export storage instance based on environment
export const storage = (process.env.NODE_ENV === 'development' && process.env.REPL_ID === 'development-repl-id') 
  ? new MemoryStorage() 
  : new DatabaseStorage();
