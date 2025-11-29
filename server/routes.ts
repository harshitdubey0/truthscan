import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { mlAnalyzer } from "./ml-analyzer";
import { analyzeRequestSchema } from "@shared/schema";

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Check ML service status
  app.get("/api/ml/status", async (req, res) => {
    try {
      const response = await fetch(`${ML_SERVICE_URL}/api/ml/status`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.json({ trained: false, models_count: 0, fallback: true });
    }
  });

  // Analyze news article
  app.post("/api/analyze", async (req, res) => {
    try {
      const { text } = analyzeRequestSchema.parse(req.body);
      
      let result;
      
      // Try Python ML service first
      try {
        const mlResponse = await fetch(`${ML_SERVICE_URL}/api/ml/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        });
        
        if (mlResponse.ok) {
          result = await mlResponse.json();
        } else {
          // Fallback to JS analyzer
          result = mlAnalyzer.analyze(text);
        }
      } catch (mlError) {
        // Fallback to JS analyzer if Python service is unavailable
        result = mlAnalyzer.analyze(text);
      }
      
      // Store analysis in history
      await storage.createAnalysis({
        articleText: text.substring(0, 500),
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
      const total = stats.totalScans || 1;
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
