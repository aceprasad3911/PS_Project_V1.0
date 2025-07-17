import type { Express, RequestHandler } from "express";
import session from "express-session";
import { storage } from "./storage";

// Simple development authentication bypass
export function setupDevAuth(app: Express) {
  // Session configuration for development
  app.use(session({
    secret: process.env.SESSION_SECRET || "dev-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Allow HTTP in development
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }));

  // Development login route - automatically logs in as demo user
  app.get("/api/login", async (req, res) => {
    try {
      // Create or get demo user
      const demoUser = await storage.upsertUser({
        id: "demo-user-123",
        email: "demo@publicissapient.com",
        firstName: "Demo",
        lastName: "User",
        profileImageUrl: "https://via.placeholder.com/150/dc2626/ffffff?text=PS",
      });

      // Set session
      (req.session as any).user = {
        claims: {
          sub: demoUser.id,
          email: demoUser.email,
          first_name: demoUser.firstName,
          last_name: demoUser.lastName,
          profile_image_url: demoUser.profileImageUrl,
        },
        expires_at: Math.floor(Date.now() / 1000) + 86400, // 24 hours from now
      };

      res.redirect("/");
    } catch (error) {
      console.error("Development login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Development logout route
  app.get("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
      }
      res.redirect("/");
    });
  });

  // Get current user
  app.get("/api/auth/user", async (req, res) => {
    try {
      const sessionUser = (req.session as any).user;
      if (!sessionUser) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await storage.getUser(sessionUser.claims.sub);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });
}

// Development authentication middleware
export const isAuthenticated: RequestHandler = (req, res, next) => {
  const sessionUser = (req.session as any).user;
  
  if (!sessionUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Check if token is expired
  const now = Math.floor(Date.now() / 1000);
  if (sessionUser.expires_at && now > sessionUser.expires_at) {
    return res.status(401).json({ message: "Session expired" });
  }

  // Add user to request for route handlers
  (req as any).user = sessionUser;
  next();
};