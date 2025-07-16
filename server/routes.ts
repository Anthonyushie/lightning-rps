import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGameRecordSchema, insertUserStatsSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Game Statistics Routes
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const leaderboard = await storage.getLeaderboard(limit);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  });

  // Record a game result
  app.post("/api/game/record", async (req, res) => {
    try {
      const gameData = insertGameRecordSchema.parse(req.body);
      const gameRecord = await storage.recordGame(gameData);
      res.json(gameRecord);
    } catch (error) {
      console.error("Error recording game:", error);
      res.status(500).json({ error: "Failed to record game" });
    }
  });

  // Update user statistics
  app.post("/api/user/stats", async (req, res) => {
    try {
      const statsData = insertUserStatsSchema.parse(req.body);
      const userStats = await storage.updateUserStats(statsData);
      res.json(userStats);
    } catch (error) {
      console.error("Error updating user stats:", error);
      res.status(500).json({ error: "Failed to update user stats" });
    }
  });

  // Get user statistics
  app.get("/api/user/:userId/stats", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const userStats = await storage.getUserStats(userId);
      
      if (!userStats) {
        return res.status(404).json({ error: "User stats not found" });
      }
      
      res.json(userStats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ error: "Failed to fetch user stats" });
    }
  });

  // Get user game history
  app.get("/api/user/:userId/history", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const limit = parseInt(req.query.limit as string) || 20;
      const history = await storage.getGameHistory(userId, limit);
      res.json(history);
    } catch (error) {
      console.error("Error fetching game history:", error);
      res.status(500).json({ error: "Failed to fetch game history" });
    }
  });

  // Get global game statistics
  app.get("/api/stats/global", async (req, res) => {
    try {
      const leaderboard = await storage.getLeaderboard(100);
      
      const globalStats = {
        totalPlayers: leaderboard.length,
        totalGames: leaderboard.reduce((sum, player) => sum + player.totalGuesses, 0),
        totalCorrect: leaderboard.reduce((sum, player) => sum + player.correctGuesses, 0),
        topStreak: leaderboard.length > 0 ? leaderboard[0].bestStreak : 0,
        averageAccuracy: leaderboard.length > 0 
          ? Math.round((leaderboard.reduce((sum, player) => sum + (player.correctGuesses / (player.totalGuesses || 1)), 0) / leaderboard.length) * 100)
          : 0
      };
      
      res.json(globalStats);
    } catch (error) {
      console.error("Error fetching global stats:", error);
      res.status(500).json({ error: "Failed to fetch global stats" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
