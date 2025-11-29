import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { mlAnalyzer } from "./ml-analyzer";
import { analyzeRequestSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Analyze news article
  app.post("/api/analyze", async (req, res) => {
    try {
      const { text } = analyzeRequestSchema.parse(req.body);
      
      // Use ML analyzer to get predictions
      const result = mlAnalyzer.analyze(text);
      
      // Store analysis in history
      await storage.createAnalysis({
        articleText: text.substring(0, 500), // Store first 500 chars
        verdict: result.verdict,
        confidence: result.confidence,
        modelPredictions: JSON.stringify(result.models),
      });
      
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ 
        message: error.message || "Invalid request" 
      });
    }
  });

  // Get analysis statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getAnalysisStats();
      
      // Calculate percentages
      const total = stats.totalScans || 1; // Avoid division by zero
      const fakePercentage = Math.round((stats.fakeCount / total) * 100);
      const realPercentage = Math.round((stats.realCount / total) * 100);
      
      res.json({
        totalScans: stats.totalScans,
        fakeCount: stats.fakeCount,
        realCount: stats.realCount,
        fakePercentage,
        realPercentage,
      });
    } catch (error: any) {
      res.status(500).json({ 
        message: error.message || "Failed to fetch stats" 
      });
    }
  });

  return httpServer;
}
