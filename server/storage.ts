import { eq, desc } from "drizzle-orm";
import { db } from "./db";
import {
  users, projects, notes, comments, graphConfigs,
  type User, type InsertUser,
  type Project, type InsertProject,
  type Note, type InsertNote,
  type Comment, type InsertComment,
  type GraphConfig, type InsertGraphConfig
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, data: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;

  getNotesByProject(projectId: string): Promise<Note[]>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: string, data: Partial<InsertNote>): Promise<Note | undefined>;
  deleteNote(id: string): Promise<boolean>;

  getCommentsByNote(noteId: string): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  deleteComment(id: string): Promise<boolean>;

  getGraphConfig(projectId: string): Promise<GraphConfig | undefined>;
  upsertGraphConfig(config: InsertGraphConfig): Promise<GraphConfig>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getProjects(): Promise<Project[]> {
    return db.select().from(projects).orderBy(desc(projects.updatedAt));
  }

  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [created] = await db.insert(projects).values(project).returning();
    return created;
  }

  async updateProject(id: string, data: Partial<InsertProject>): Promise<Project | undefined> {
    const [updated] = await db
      .update(projects)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return updated;
  }

  async deleteProject(id: string): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id)).returning();
    return result.length > 0;
  }

  async getNotesByProject(projectId: string): Promise<Note[]> {
    return db.select().from(notes).where(eq(notes.projectId, projectId)).orderBy(desc(notes.createdAt));
  }

  async createNote(note: InsertNote): Promise<Note> {
    const [created] = await db.insert(notes).values(note).returning();
    return created;
  }

  async updateNote(id: string, data: Partial<InsertNote>): Promise<Note | undefined> {
    const [updated] = await db
      .update(notes)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(notes.id, id))
      .returning();
    return updated;
  }

  async deleteNote(id: string): Promise<boolean> {
    await db.delete(comments).where(eq(comments.noteId, id));
    const result = await db.delete(notes).where(eq(notes.id, id)).returning();
    return result.length > 0;
  }

  async getCommentsByNote(noteId: string): Promise<Comment[]> {
    return db.select().from(comments).where(eq(comments.noteId, noteId)).orderBy(desc(comments.createdAt));
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const [created] = await db.insert(comments).values(comment).returning();
    return created;
  }

  async deleteComment(id: string): Promise<boolean> {
    const result = await db.delete(comments).where(eq(comments.id, id)).returning();
    return result.length > 0;
  }

  async getGraphConfig(projectId: string): Promise<GraphConfig | undefined> {
    const [config] = await db.select().from(graphConfigs).where(eq(graphConfigs.projectId, projectId));
    return config;
  }

  async upsertGraphConfig(config: InsertGraphConfig): Promise<GraphConfig> {
    const existing = config.projectId ? await this.getGraphConfig(config.projectId) : undefined;
    if (existing) {
      const [updated] = await db
        .update(graphConfigs)
        .set({ ...config, updatedAt: new Date() })
        .where(eq(graphConfigs.id, existing.id))
        .returning();
      return updated;
    }
    const [created] = await db.insert(graphConfigs).values(config).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
