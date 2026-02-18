import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema, insertNoteSchema, insertCommentSchema, insertGraphConfigSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // === Projects ===

  app.get("/api/projects", async (_req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.get("/api/projects/:id", async (req, res) => {
    const project = await storage.getProject(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  });

  app.post("/api/projects", async (req, res) => {
    const parsed = insertProjectSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid project data", errors: parsed.error.flatten() });
    const project = await storage.createProject(parsed.data);
    res.status(201).json(project);
  });

  app.patch("/api/projects/:id", async (req, res) => {
    const updated = await storage.updateProject(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Project not found" });
    res.json(updated);
  });

  app.delete("/api/projects/:id", async (req, res) => {
    const deleted = await storage.deleteProject(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Project not found" });
    res.json({ success: true });
  });

  // === Notes ===

  app.get("/api/projects/:projectId/notes", async (req, res) => {
    const notes = await storage.getNotesByProject(req.params.projectId);
    res.json(notes);
  });

  app.post("/api/projects/:projectId/notes", async (req, res) => {
    const data = { ...req.body, projectId: req.params.projectId };
    const parsed = insertNoteSchema.safeParse(data);
    if (!parsed.success) return res.status(400).json({ message: "Invalid note data", errors: parsed.error.flatten() });
    const note = await storage.createNote(parsed.data);
    res.status(201).json(note);
  });

  app.patch("/api/notes/:id", async (req, res) => {
    const updated = await storage.updateNote(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Note not found" });
    res.json(updated);
  });

  app.delete("/api/notes/:id", async (req, res) => {
    const deleted = await storage.deleteNote(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Note not found" });
    res.json({ success: true });
  });

  // === Comments ===

  app.get("/api/notes/:noteId/comments", async (req, res) => {
    const comments = await storage.getCommentsByNote(req.params.noteId);
    res.json(comments);
  });

  app.post("/api/notes/:noteId/comments", async (req, res) => {
    const data = { ...req.body, noteId: req.params.noteId };
    const parsed = insertCommentSchema.safeParse(data);
    if (!parsed.success) return res.status(400).json({ message: "Invalid comment data", errors: parsed.error.flatten() });
    const comment = await storage.createComment(parsed.data);
    res.status(201).json(comment);
  });

  app.delete("/api/comments/:id", async (req, res) => {
    const deleted = await storage.deleteComment(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Comment not found" });
    res.json({ success: true });
  });

  // === Graph Config ===

  app.get("/api/projects/:projectId/graph-config", async (req, res) => {
    const config = await storage.getGraphConfig(req.params.projectId);
    if (!config) return res.json(null);
    res.json(config);
  });

  app.put("/api/projects/:projectId/graph-config", async (req, res) => {
    const data = { ...req.body, projectId: req.params.projectId };
    const config = await storage.upsertGraphConfig(data);
    res.json(config);
  });

  return httpServer;
}
