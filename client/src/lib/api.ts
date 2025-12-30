import { type InsertUser, type InsertOrganization, type InsertProject } from "@shared/schema";

const API_BASE = "/api";

class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "APIError";
  }
}

async function fetchAPI(url: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new APIError(response.status, error.error || "Request failed");
  }

  return response.json();
}

export const auth = {
  signup: (data: InsertUser) => fetchAPI("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  login: (username: string, password: string) => fetchAPI("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  }),
  logout: () => fetchAPI("/auth/logout", { method: "POST" }),
  me: () => fetchAPI("/auth/me"),
};

export const organizations = {
  list: () => fetchAPI("/organizations"),
  get: (id: string) => fetchAPI(`/organizations/${id}`),
  create: (data: Omit<InsertOrganization, "createdById">) => fetchAPI("/organizations", {
    method: "POST",
    body: JSON.stringify(data),
  }),
};

export const projects = {
  list: (organizationId: string) => fetchAPI(`/projects?organizationId=${organizationId}`),
  get: (id: string) => fetchAPI(`/projects/${id}`),
  create: (data: Omit<InsertProject, "createdById">) => fetchAPI("/projects", {
    method: "POST",
    body: JSON.stringify(data),
  }),
};

export { APIError };
