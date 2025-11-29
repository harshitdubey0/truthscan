import { type AnalyzeResponse } from "@shared/schema";

// Simulates ML model analysis with realistic patterns
export class MLAnalyzer {
  // Keywords that might indicate fake news
  private fakeNewsIndicators = [
    'shocking', 'unbelievable', 'you won\'t believe', 'breaking', 'exclusive',
    'they don\'t want you to know', 'must see', 'viral', 'exposed',
    'secret', 'hidden truth', 'mainstream media', 'wake up', 'share before removed'
  ];

  // Keywords that might indicate real news
  private realNewsIndicators = [
    'according to', 'reported', 'study shows', 'research', 'officials',
    'statement', 'investigation', 'analysis', 'data', 'evidence',
    'expert', 'published', 'confirmed', 'announced'
  ];

  analyze(text: string): AnalyzeResponse {
    const lowerText = text.toLowerCase();
    
    // Calculate scores based on various heuristics
    const fakeScore = this.calculateFakeScore(lowerText);
    const realScore = this.calculateRealScore(lowerText);
    
    // Determine verdict based on scores
    const isFake = fakeScore > realScore;
    const baseConfidence = Math.abs(fakeScore - realScore);
    
    // Add some randomness to simulate model variance
    const variance = Math.random() * 10 - 5; // -5 to +5
    const overallConfidence = Math.min(99, Math.max(75, baseConfidence + variance));

    // Generate individual model predictions
    const models = this.generateModelPredictions(isFake, overallConfidence);

    return {
      verdict: isFake ? "fake" : "real",
      confidence: Math.round(overallConfidence),
      models,
    };
  }

  private calculateFakeScore(text: string): number {
    let score = 50; // Base score

    // Check for fake news indicators
    const fakeMatches = this.fakeNewsIndicators.filter(indicator => 
      text.includes(indicator)
    ).length;
    score += fakeMatches * 8;

    // Check for excessive punctuation (!!!, ???)
    const exclamationCount = (text.match(/!/g) || []).length;
    const questionCount = (text.match(/\?/g) || []).length;
    score += Math.min(15, (exclamationCount + questionCount) * 0.5);

    // Check for all caps words (SHOUTING)
    const capsWords = text.match(/\b[A-Z]{4,}\b/g) || [];
    score += Math.min(10, capsWords.length * 2);

    // Short articles might be less credible
    if (text.length < 300) {
      score += 10;
    }

    return Math.min(100, score);
  }

  private calculateRealScore(text: string): number {
    let score = 50; // Base score

    // Check for real news indicators
    const realMatches = this.realNewsIndicators.filter(indicator => 
      text.includes(indicator)
    ).length;
    score += realMatches * 8;

    // Longer, more detailed articles tend to be more credible
    if (text.length > 500) {
      score += 10;
    }
    if (text.length > 1000) {
      score += 10;
    }

    // Check for proper sentence structure (periods)
    const sentences = text.split('.').length;
    score += Math.min(15, sentences * 0.3);

    // Check for quotes (journalism often includes quotes)
    const quotes = (text.match(/["'"]/g) || []).length;
    score += Math.min(10, quotes * 0.5);

    return Math.min(100, score);
  }

  private generateModelPredictions(isFake: boolean, overallConfidence: number) {
    const prediction: "Real" | "Fake" = isFake ? "Fake" : "Real";
    
    // Different models have slightly different confidence levels
    return [
      {
        name: "Logistic Regression",
        prediction,
        confidence: Math.round(overallConfidence + Math.random() * 6 - 3),
      },
      {
        name: "Decision Tree",
        prediction,
        confidence: Math.round(overallConfidence + Math.random() * 10 - 5),
      },
      {
        name: "Gradient Boosting",
        prediction,
        confidence: Math.round(overallConfidence + Math.random() * 4 - 2),
      },
      {
        name: "Random Forest",
        prediction,
        confidence: Math.round(overallConfidence + Math.random() * 5 - 2.5),
      },
    ].map(model => ({
      ...model,
      confidence: Math.min(99, Math.max(75, model.confidence))
    }));
  }
}

export const mlAnalyzer = new MLAnalyzer();
