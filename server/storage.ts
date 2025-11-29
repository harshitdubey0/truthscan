import { type Analysis, type InsertAnalysis } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createAnalysis(analysis: InsertAnalysis): Promise<Analysis>;
  getRecentAnalyses(limit: number): Promise<Analysis[]>;
  getAnalysisStats(): Promise<{ totalScans: number; fakeCount: number; realCount: number }>;
}

export class MemStorage implements IStorage {
  private analyses: Map<string, Analysis>;

  constructor() {
    this.analyses = new Map();
  }

  async createAnalysis(insertAnalysis: InsertAnalysis): Promise<Analysis> {
    const id = randomUUID();
    const analysis: Analysis = {
      ...insertAnalysis,
      id,
      createdAt: new Date(),
    };
    this.analyses.set(id, analysis);
    return analysis;
  }

  async getRecentAnalyses(limit: number): Promise<Analysis[]> {
    const allAnalyses = Array.from(this.analyses.values());
    return allAnalyses
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async getAnalysisStats(): Promise<{ totalScans: number; fakeCount: number; realCount: number }> {
    const allAnalyses = Array.from(this.analyses.values());
    const fakeCount = allAnalyses.filter(a => a.verdict === "fake").length;
    const realCount = allAnalyses.filter(a => a.verdict === "real").length;
    
    return {
      totalScans: allAnalyses.length,
      fakeCount,
      realCount,
    };
  }
}

export const storage = new MemStorage();
