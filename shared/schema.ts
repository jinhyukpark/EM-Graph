import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const organizations = pgTable("organizations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  createdById: varchar("created_by_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertOrganizationSchema = createInsertSchema(organizations).omit({
  id: true,
  createdAt: true,
});

export type InsertOrganization = z.infer<typeof insertOrganizationSchema>;
export type Organization = typeof organizations.$inferSelect;

export const organizationMembers = pgTable("organization_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationId: varchar("organization_id").notNull().references(() => organizations.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  role: text("role").notNull().default("member"),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
});

export const insertOrganizationMemberSchema = createInsertSchema(organizationMembers).omit({
  id: true,
  joinedAt: true,
});

export type InsertOrganizationMember = z.infer<typeof insertOrganizationMemberSchema>;
export type OrganizationMember = typeof organizationMembers.$inferSelect;

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  organizationId: varchar("organization_id").notNull().references(() => organizations.id),
  createdById: varchar("created_by_id").notNull().references(() => users.id),
  ontology: text("ontology"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export const dataTables = pgTable("data_tables", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  projectId: varchar("project_id").notNull().references(() => projects.id),
  type: text("type").notNull(),
  schema: jsonb("schema").notNull(),
  rowCount: integer("row_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertDataTableSchema = createInsertSchema(dataTables).omit({
  id: true,
  createdAt: true,
});

export type InsertDataTable = z.infer<typeof insertDataTableSchema>;
export type DataTable = typeof dataTables.$inferSelect;

export const graphs = pgTable("graphs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  projectId: varchar("project_id").notNull().references(() => projects.id),
  config: jsonb("config").notNull(),
  createdById: varchar("created_by_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertGraphSchema = createInsertSchema(graphs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertGraph = z.infer<typeof insertGraphSchema>;
export type Graph = typeof graphs.$inferSelect;

export const knowledgeGardenFolders = pgTable("knowledge_garden_folders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  parentId: varchar("parent_id"),
  organizationId: varchar("organization_id").notNull().references(() => organizations.id),
  createdById: varchar("created_by_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertKnowledgeGardenFolderSchema = createInsertSchema(knowledgeGardenFolders).omit({
  id: true,
  createdAt: true,
});

export type InsertKnowledgeGardenFolder = z.infer<typeof insertKnowledgeGardenFolderSchema>;
export type KnowledgeGardenFolder = typeof knowledgeGardenFolders.$inferSelect;

export const knowledgeGardenDocuments = pgTable("knowledge_garden_documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  folderId: varchar("folder_id").references(() => knowledgeGardenFolders.id),
  organizationId: varchar("organization_id").notNull().references(() => organizations.id),
  createdById: varchar("created_by_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertKnowledgeGardenDocumentSchema = createInsertSchema(knowledgeGardenDocuments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertKnowledgeGardenDocument = z.infer<typeof insertKnowledgeGardenDocumentSchema>;
export type KnowledgeGardenDocument = typeof knowledgeGardenDocuments.$inferSelect;
