import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Loader2, Newspaper, ShieldCheck, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type AnalysisResult = {
  verdict: "real" | "fake";
  confidence: number;
  models: {
    name: string;
    prediction: "Real" | "Fake";
    confidence: number;
  }[];
};

export function NewsAnalyzer() {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = () => {
    if (!text.trim()) return;

    setIsAnalyzing(true);
    setResult(null);

    // Simulate API latency
    setTimeout(() => {
      // Simple heuristic simulation for the prototype
      // In a real app, this would call the Python backend
      const isFake = Math.random() > 0.5; 
      const confidence = Math.floor(Math.random() * 20) + 80; // 80-99%

      setResult({
        verdict: isFake ? "fake" : "real",
        confidence: confidence,
        models: [
          { name: "Logistic Regression", prediction: isFake ? "Fake" : "Real", confidence: Math.floor(Math.random() * 10) + 90 },
          { name: "Decision Tree", prediction: isFake ? "Fake" : "Real", confidence: Math.floor(Math.random() * 15) + 80 },
          { name: "Gradient Boosting", prediction: isFake ? "Fake" : "Real", confidence: Math.floor(Math.random() * 5) + 95 },
          { name: "Random Forest", prediction: isFake ? "Fake" : "Real", confidence: Math.floor(Math.random() * 8) + 92 },
        ]
      });
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="bg-primary/5 border-b border-border/50 p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Newspaper className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-primary">Article Analysis</h2>
          </div>
          <CardDescription className="text-base">
            Paste the news article content below. Our ensemble of ML models will analyze semantic patterns to determine authenticity.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <Textarea 
            placeholder="Paste the full text of the article here..." 
            className="min-h-[200px] text-lg resize-y bg-background/50 border-border/50 focus:border-primary/50 transition-all p-4"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </CardContent>
        <CardFooter className="bg-muted/30 p-6 flex justify-end">
          <Button 
            size="lg" 
            onClick={handleAnalyze} 
            disabled={!text.trim() || isAnalyzing}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-8 h-12 shadow-lg shadow-primary/20 transition-all"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing Semantic Patterns...
              </>
            ) : (
              <>
                <ShieldCheck className="mr-2 h-5 w-5" />
                Verify Authenticity
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Card className={`border-l-8 overflow-hidden shadow-2xl ${result.verdict === 'real' ? 'border-l-emerald-500' : 'border-l-rose-500'}`}>
              <div className={`absolute top-0 right-0 p-32 opacity-5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 ${result.verdict === 'real' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Consensus Verdict</p>
                    <h3 className={`text-4xl font-serif font-black flex items-center gap-3 ${result.verdict === 'real' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {result.verdict === 'real' ? (
                        <>
                          <CheckCircle2 className="w-10 h-10" />
                          Authentic News
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-10 h-10" />
                          Likely Fake News
                        </>
                      )}
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-5xl font-bold tracking-tighter opacity-20">
                      {result.confidence}%
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">Confidence Score</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {result.models.map((model, index) => (
                    <motion.div 
                      key={model.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-muted/30 rounded-xl p-4 border border-border/50"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-medium flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-muted-foreground" />
                          {model.name}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                          model.prediction === 'Real' 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                        }`}>
                          {model.prediction}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            model.prediction === 'Real' ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${model.confidence}%` }}
                        />
                      </div>
                      <div className="flex justify-end mt-1">
                        <span className="text-xs text-muted-foreground">{model.confidence}% confidence</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
