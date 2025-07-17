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

export const storage = new DatabaseStorage();
