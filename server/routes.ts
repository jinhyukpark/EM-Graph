import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import createMemoryStore from "memorystore";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { insertUserSchema, insertOrganizationSchema, insertProjectSchema } from "@shared/schema";
import { z } from "zod";
import { fromError } from "zod-validation-error";

const scryptAsync = promisify(scrypt);
const crypto = {
  hash: async (password: string) => {
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
  },
  compare: async (suppliedPassword: string, storedPassword: string) => {
    const [hashedPassword, salt] = storedPassword.split(".");
    const hashedPasswordBuf = Buffer.from(hashedPassword, "hex");
    const suppliedPasswordBuf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;
    return timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf);
  },
};

declare global {
  namespace Express {
    interface User {
      id: string;
      username: string;
      email: string;
      name: string;
    }
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Session setup
  const MemoryStore = createMemoryStore(session);
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "em-graph-secret-key-change-in-production",
      resave: false,
      saveUninitialized: false,
      store: new MemoryStore({
        checkPeriod: 86400000, // 24 hours
      }),
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        sameSite: 'lax',
      },
    })
  );

  // Passport setup
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !(await crypto.compare(password, user.password))) {
          return done(null, false, { message: "Incorrect username or password" });
        }
        return done(null, {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
        });
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(null, false);
      }
      done(null, {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
      });
    } catch (err) {
      done(err);
    }
  });

  // Auth middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    next();
  };

  // Auth routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const result = insertUserSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: fromError(result.error).toString() 
        });
      }

      const existingUser = await storage.getUserByUsername(result.data.username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }

      const existingEmail = await storage.getUserByEmail(result.data.email);
      if (existingEmail) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const hashedPassword = await crypto.hash(result.data.password);
      const user = await storage.createUser({
        ...result.data,
        password: hashedPassword,
      });

      req.login({ 
        id: user.id, 
        username: user.username, 
        email: user.email, 
        name: user.name 
      }, (err) => {
        if (err) {
          return res.status(500).json({ error: "Login failed after signup" });
        }
        res.json({ 
          id: user.id, 
          username: user.username, 
          email: user.email, 
          name: user.name 
        });
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: Express.User | false, info: any) => {
      if (err) {
        return res.status(500).json({ error: "Internal server error" });
      }
      if (!user) {
        return res.status(401).json({ error: info?.message || "Invalid credentials" });
      }
      req.login(user, (loginErr) => {
        if (loginErr) {
          return res.status(500).json({ error: "Login failed" });
        }
        res.json(user);
      });
    })(req, res, next);
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", requireAuth, (req, res) => {
    res.json(req.user);
  });

  // Organization routes
  app.get("/api/organizations", requireAuth, async (req, res) => {
    try {
      const orgs = await storage.getOrganizationsByUser(req.user!.id);
      res.json(orgs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch organizations" });
    }
  });

  app.post("/api/organizations", requireAuth, async (req, res) => {
    try {
      const result = insertOrganizationSchema.safeParse({
        ...req.body,
        createdById: req.user!.id,
      });

      if (!result.success) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: fromError(result.error).toString() 
        });
      }

      const org = await storage.createOrganization(result.data);
      
      // Add creator as admin
      await storage.addOrganizationMember({
        organizationId: org.id,
        userId: req.user!.id,
        role: "admin",
      });

      res.json(org);
    } catch (error) {
      res.status(500).json({ error: "Failed to create organization" });
    }
  });

  app.get("/api/organizations/:id", requireAuth, async (req, res) => {
    try {
      const org = await storage.getOrganization(req.params.id);
      if (!org) {
        return res.status(404).json({ error: "Organization not found" });
      }

      // Check if user is member
      const members = await storage.getOrganizationMembers(org.id);
      const isMember = members.some(m => m.userId === req.user!.id);
      
      if (!isMember) {
        return res.status(403).json({ error: "Access denied" });
      }

      res.json(org);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch organization" });
    }
  });

  // Project routes
  app.get("/api/projects", requireAuth, async (req, res) => {
    try {
      const organizationId = req.query.organizationId as string;
      if (!organizationId) {
        return res.status(400).json({ error: "organizationId is required" });
      }

      // Check if user is member
      const members = await storage.getOrganizationMembers(organizationId);
      const isMember = members.some(m => m.userId === req.user!.id);
      
      if (!isMember) {
        return res.status(403).json({ error: "Access denied" });
      }

      const projects = await storage.getProjectsByOrganization(organizationId);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.post("/api/projects", requireAuth, async (req, res) => {
    try {
      const result = insertProjectSchema.safeParse({
        ...req.body,
        createdById: req.user!.id,
      });

      if (!result.success) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: fromError(result.error).toString() 
        });
      }

      // Check if user is member of organization
      const members = await storage.getOrganizationMembers(result.data.organizationId);
      const isMember = members.some(m => m.userId === req.user!.id);
      
      if (!isMember) {
        return res.status(403).json({ error: "Access denied" });
      }

      const project = await storage.createProject(result.data);
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  app.get("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      // Check if user is member of organization
      const members = await storage.getOrganizationMembers(project.organizationId);
      const isMember = members.some(m => m.userId === req.user!.id);
      
      if (!isMember) {
        return res.status(403).json({ error: "Access denied" });
      }

      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  return httpServer;
}
