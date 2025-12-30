import { db } from "./db";
import { eq, and } from "drizzle-orm";
import {
  type User,
  type InsertUser,
  type Organization,
  type InsertOrganization,
  type OrganizationMember,
  type InsertOrganizationMember,
  type Project,
  type InsertProject,
  type DataTable,
  type InsertDataTable,
  type Graph,
  type InsertGraph,
  type KnowledgeGardenFolder,
  type InsertKnowledgeGardenFolder,
  type KnowledgeGardenDocument,
  type InsertKnowledgeGardenDocument,
  users,
  organizations,
  organizationMembers,
  projects,
  dataTables,
  graphs,
  knowledgeGardenFolders,
  knowledgeGardenDocuments,
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Organization operations
  getOrganization(id: string): Promise<Organization | undefined>;
  getOrganizationsByUser(userId: string): Promise<Organization[]>;
  createOrganization(org: InsertOrganization): Promise<Organization>;
  
  // Organization member operations
  addOrganizationMember(member: InsertOrganizationMember): Promise<OrganizationMember>;
  getOrganizationMembers(organizationId: string): Promise<OrganizationMember[]>;
  
  // Project operations
  getProject(id: string): Promise<Project | undefined>;
  getProjectsByOrganization(organizationId: string): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, updates: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<void>;
  
  // Data table operations
  getDataTable(id: string): Promise<DataTable | undefined>;
  getDataTablesByProject(projectId: string): Promise<DataTable[]>;
  createDataTable(table: InsertDataTable): Promise<DataTable>;
  
  // Graph operations
  getGraph(id: string): Promise<Graph | undefined>;
  getGraphsByProject(projectId: string): Promise<Graph[]>;
  createGraph(graph: InsertGraph): Promise<Graph>;
  updateGraph(id: string, updates: Partial<InsertGraph>): Promise<Graph | undefined>;
  deleteGraph(id: string): Promise<void>;
  
  // Knowledge Garden operations
  getKnowledgeGardenFolder(id: string): Promise<KnowledgeGardenFolder | undefined>;
  getKnowledgeGardenFoldersByOrganization(organizationId: string): Promise<KnowledgeGardenFolder[]>;
  createKnowledgeGardenFolder(folder: InsertKnowledgeGardenFolder): Promise<KnowledgeGardenFolder>;
  
  getKnowledgeGardenDocument(id: string): Promise<KnowledgeGardenDocument | undefined>;
  getKnowledgeGardenDocumentsByOrganization(organizationId: string): Promise<KnowledgeGardenDocument[]>;
  getKnowledgeGardenDocumentsByFolder(folderId: string): Promise<KnowledgeGardenDocument[]>;
  createKnowledgeGardenDocument(doc: InsertKnowledgeGardenDocument): Promise<KnowledgeGardenDocument>;
  updateKnowledgeGardenDocument(id: string, updates: Partial<InsertKnowledgeGardenDocument>): Promise<KnowledgeGardenDocument | undefined>;
  deleteKnowledgeGardenDocument(id: string): Promise<void>;
}

export class DrizzleStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Organization operations
  async getOrganization(id: string): Promise<Organization | undefined> {
    const [org] = await db.select().from(organizations).where(eq(organizations.id, id));
    return org;
  }

  async getOrganizationsByUser(userId: string): Promise<Organization[]> {
    const orgs = await db
      .select({
        id: organizations.id,
        name: organizations.name,
        description: organizations.description,
        createdById: organizations.createdById,
        createdAt: organizations.createdAt,
      })
      .from(organizations)
      .innerJoin(organizationMembers, eq(organizations.id, organizationMembers.organizationId))
      .where(eq(organizationMembers.userId, userId));
    return orgs;
  }

  async createOrganization(insertOrg: InsertOrganization): Promise<Organization> {
    const [org] = await db.insert(organizations).values(insertOrg).returning();
    return org;
  }

  // Organization member operations
  async addOrganizationMember(insertMember: InsertOrganizationMember): Promise<OrganizationMember> {
    const [member] = await db.insert(organizationMembers).values(insertMember).returning();
    return member;
  }

  async getOrganizationMembers(organizationId: string): Promise<OrganizationMember[]> {
    return await db.select().from(organizationMembers).where(eq(organizationMembers.organizationId, organizationId));
  }

  // Project operations
  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async getProjectsByOrganization(organizationId: string): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.organizationId, organizationId));
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db.insert(projects).values(insertProject).returning();
    return project;
  }

  async updateProject(id: string, updates: Partial<InsertProject>): Promise<Project | undefined> {
    const [project] = await db
      .update(projects)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return project;
  }

  async deleteProject(id: string): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  // Data table operations
  async getDataTable(id: string): Promise<DataTable | undefined> {
    const [table] = await db.select().from(dataTables).where(eq(dataTables.id, id));
    return table;
  }

  async getDataTablesByProject(projectId: string): Promise<DataTable[]> {
    return await db.select().from(dataTables).where(eq(dataTables.projectId, projectId));
  }

  async createDataTable(insertTable: InsertDataTable): Promise<DataTable> {
    const [table] = await db.insert(dataTables).values(insertTable).returning();
    return table;
  }

  // Graph operations
  async getGraph(id: string): Promise<Graph | undefined> {
    const [graph] = await db.select().from(graphs).where(eq(graphs.id, id));
    return graph;
  }

  async getGraphsByProject(projectId: string): Promise<Graph[]> {
    return await db.select().from(graphs).where(eq(graphs.projectId, projectId));
  }

  async createGraph(insertGraph: InsertGraph): Promise<Graph> {
    const [graph] = await db.insert(graphs).values(insertGraph).returning();
    return graph;
  }

  async updateGraph(id: string, updates: Partial<InsertGraph>): Promise<Graph | undefined> {
    const [graph] = await db
      .update(graphs)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(graphs.id, id))
      .returning();
    return graph;
  }

  async deleteGraph(id: string): Promise<void> {
    await db.delete(graphs).where(eq(graphs.id, id));
  }

  // Knowledge Garden operations
  async getKnowledgeGardenFolder(id: string): Promise<KnowledgeGardenFolder | undefined> {
    const [folder] = await db.select().from(knowledgeGardenFolders).where(eq(knowledgeGardenFolders.id, id));
    return folder;
  }

  async getKnowledgeGardenFoldersByOrganization(organizationId: string): Promise<KnowledgeGardenFolder[]> {
    return await db.select().from(knowledgeGardenFolders).where(eq(knowledgeGardenFolders.organizationId, organizationId));
  }

  async createKnowledgeGardenFolder(insertFolder: InsertKnowledgeGardenFolder): Promise<KnowledgeGardenFolder> {
    const [folder] = await db.insert(knowledgeGardenFolders).values(insertFolder).returning();
    return folder;
  }

  async getKnowledgeGardenDocument(id: string): Promise<KnowledgeGardenDocument | undefined> {
    const [doc] = await db.select().from(knowledgeGardenDocuments).where(eq(knowledgeGardenDocuments.id, id));
    return doc;
  }

  async getKnowledgeGardenDocumentsByOrganization(organizationId: string): Promise<KnowledgeGardenDocument[]> {
    return await db.select().from(knowledgeGardenDocuments).where(eq(knowledgeGardenDocuments.organizationId, organizationId));
  }

  async getKnowledgeGardenDocumentsByFolder(folderId: string): Promise<KnowledgeGardenDocument[]> {
    return await db.select().from(knowledgeGardenDocuments).where(eq(knowledgeGardenDocuments.folderId, folderId));
  }

  async createKnowledgeGardenDocument(insertDoc: InsertKnowledgeGardenDocument): Promise<KnowledgeGardenDocument> {
    const [doc] = await db.insert(knowledgeGardenDocuments).values(insertDoc).returning();
    return doc;
  }

  async updateKnowledgeGardenDocument(id: string, updates: Partial<InsertKnowledgeGardenDocument>): Promise<KnowledgeGardenDocument | undefined> {
    const [doc] = await db
      .update(knowledgeGardenDocuments)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(knowledgeGardenDocuments.id, id))
      .returning();
    return doc;
  }

  async deleteKnowledgeGardenDocument(id: string): Promise<void> {
    await db.delete(knowledgeGardenDocuments).where(eq(knowledgeGardenDocuments.id, id));
  }
}

export const storage = new DrizzleStorage();
