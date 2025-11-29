import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const analysisHistory = pgTable("analysis_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  articleText: text("article_text").notNull(),
  verdict: text("verdict").notNull(), // "real" or "fake"
  confidence: integer("confidence").notNull(),
  modelPredictions: text("model_predictions").notNull(), // JSON string
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAnalysisSchema = createInsertSchema(analysisHistory).omit({
  id: true,
  createdAt: true,
});

export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;
export type Analysis = typeof analysisHistory.$inferSelect;

// Request/Response schemas for API
export const analyzeRequestSchema = z.object({
  text: z.string().min(50, "Article text must be at least 50 characters"),
});

export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;

export const analyzeResponseSchema = z.object({
  verdict: z.enum(["real", "fake"]),
  confidence: z.number().min(0).max(100),
  models: z.array(z.object({
    name: z.string(),
    prediction: z.enum(["Real", "Fake"]),
    confidence: z.number().min(0).max(100),
  })),
});

export type AnalyzeResponse = z.infer<typeof analyzeResponseSchema>;
