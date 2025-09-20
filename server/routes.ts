import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSessionSchema, insertSwipeSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Seed purpose cards on startup
  await storage.seedPurposeCards();
  
  // Get all purpose cards
  app.get("/api/cards", async (req, res) => {
    try {
      const cards = await storage.getPurposeCards();
      res.json(cards);
    } catch (error) {
      console.error("Error fetching cards:", error);
      res.status(500).json({ error: "Failed to fetch cards" });
    }
  });

  // Create new session
  app.post("/api/sessions", async (req, res) => {
    try {
      const validatedData = insertSessionSchema.parse(req.body);
      const session = await storage.createSession(validatedData);
      res.json(session);
    } catch (error) {
      console.error("Error creating session:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid session data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create session" });
      }
    }
  });

  // Get session by ID
  app.get("/api/sessions/:id", async (req, res) => {
    try {
      const session = await storage.getSession(req.params.id);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      console.error("Error fetching session:", error);
      res.status(500).json({ error: "Failed to fetch session" });
    }
  });

  // Complete session
  app.patch("/api/sessions/:id/complete", async (req, res) => {
    try {
      const session = await storage.completeSession(req.params.id);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      console.error("Error completing session:", error);
      res.status(500).json({ error: "Failed to complete session" });
    }
  });

  // Record a swipe
  app.post("/api/swipes", async (req, res) => {
    try {
      const validatedData = insertSwipeSchema.parse(req.body);
      const swipe = await storage.recordSwipe(validatedData);
      res.json(swipe);
    } catch (error) {
      console.error("Error recording swipe:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid swipe data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to record swipe" });
      }
    }
  });

  // Get session results
  app.get("/api/sessions/:id/results", async (req, res) => {
    try {
      const results = await storage.getSwipeResults(req.params.id);
      res.json(results);
    } catch (error) {
      console.error("Error fetching session results:", error);
      res.status(500).json({ error: "Failed to fetch session results" });
    }
  });

  // Get session swipes
  app.get("/api/sessions/:id/swipes", async (req, res) => {
    try {
      const swipes = await storage.getSessionSwipes(req.params.id);
      res.json(swipes);
    } catch (error) {
      console.error("Error fetching session swipes:", error);
      res.status(500).json({ error: "Failed to fetch session swipes" });
    }
  });

  // Get user sessions (by sessionData)
  app.post("/api/sessions/history", async (req, res) => {
    try {
      const { sessionData } = req.body;
      if (!sessionData) {
        return res.status(400).json({ error: "sessionData is required" });
      }
      const sessions = await storage.getUserSessions(sessionData);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching user sessions:", error);
      res.status(500).json({ error: "Failed to fetch user sessions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}