import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Loader2, Newspaper, ShieldCheck, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { useToast } from "@/hooks/use-toast";

type AnalysisResult = {
  verdict: "real" | "fake";
  confidence: number;
  models: {
    name: string;
    prediction: "Real" | "Fake";
    confidence: number;
  }[];
};

type StatsData = {
  totalScans: number;
  fakeCount: number;
  realCount: number;
  fakePercentage: number;
  realPercentage: number;
};

export function NewsAnalyzer() {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showLiveAnalysis, setShowLiveAnalysis] = useState(false);
  const [stats, setStats] = useState<StatsData | null>(null);
  const { toast } = useToast();

  // Fetch stats when Live Analysis is shown
  useEffect(() => {
    if (showLiveAnalysis) {
      fetchStats();
    }
  }, [showLiveAnalysis, result]); // Re-fetch when a new analysis completes

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleAnalyze = async () => {
    if (!text.trim() || text.trim().length < 50) {
      toast({
        title: "Text too short",
        description: "Please provide at least 50 characters of article text.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Analysis failed');
      }

      const data = await response.json();
      setResult(data);
      
      toast({
        title: "Analysis Complete",
        description: `Article classified as ${data.verdict === 'real' ? 'Authentic' : 'Fake'} news with ${data.confidence}% confidence.`,
      });
    } catch (error: any) {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze the article. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Data for Live Analysis Chart
  const liveData = stats ? [
    { name: 'Real News', value: stats.realPercentage || 50, count: stats.realCount, color: '#10b981' },
    { name: 'Fake News', value: stats.fakePercentage || 50, count: stats.fakeCount, color: '#f43f5e' },
  ] : [
    { name: 'Real News', value: 50, count: 0, color: '#10b981' },
    { name: 'Fake News', value: 50, count: 0, color: '#f43f5e' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="bg-primary/5 border-b border-border/50 p-8">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Newspaper className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-primary">Article Analysis</h2>
             </div>
             <Button 
               variant="outline" 
               size="sm"
               onClick={() => setShowLiveAnalysis(!showLiveAnalysis)}
               className={`${showLiveAnalysis ? 'bg-primary/10 text-primary border-primary/20' : ''}`}
               data-testid="button-toggle-live-analysis"
             >
                <BarChart3 className="w-4 h-4 mr-2" />
                {showLiveAnalysis ? "Hide Live Stats" : "Live Analysis"}
             </Button>
          </div>
          <CardDescription className="text-base">
            Paste the news article content below. Our ensemble of ML models will analyze semantic patterns to determine authenticity.
          </CardDescription>
        </CardHeader>

        <AnimatePresence>
          {showLiveAnalysis && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-b border-border/50 bg-muted/10 overflow-hidden"
            >
              <div className="p-6 grid md:grid-cols-2 gap-8 items-center">
                 <div className="h-64 w-full">
                    <h3 className="text-center font-serif font-bold mb-4 text-foreground/80">Current Detection Distribution</h3>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={liveData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {liveData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                          contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                          itemStyle={{ color: 'hsl(var(--foreground))' }}
                          formatter={(value: any, name: any, props: any) => [`${props.payload.count} articles (${value}%)`, name]}
                        />
                        <Legend verticalAlign="bottom" height={36}/>
                      </PieChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="space-y-4">
                    <div className="p-4 bg-background/50 rounded-xl border border-border/50">
                       <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-muted-foreground">Active Models</span>
                          <span className="text-sm font-bold text-primary">4 Online</span>
                       </div>
                       <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                          <div className="bg-primary h-full w-full animate-pulse"></div>
                       </div>
                    </div>
                    <div className="p-4 bg-background/50 rounded-xl border border-border/50">
                       <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-muted-foreground">Total Scans</span>
                          <span className="text-sm font-bold text-primary" data-testid="text-total-scans">
                            {stats?.totalScans.toLocaleString() || 0}
                          </span>
                       </div>
                       <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full w-[75%]"></div>
                       </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <CardContent className="p-8">
          <Textarea 
            placeholder="Paste the full text of the article here..." 
            className="min-h-[200px] text-lg resize-y bg-background/50 border-border/50 focus:border-primary/50 transition-all p-4"
            value={text}
            onChange={(e) => setText(e.target.value)}
            data-testid="input-article-text"
          />
        </CardContent>
        <CardFooter className="bg-muted/30 p-6 flex justify-end">
          <Button 
            size="lg" 
            onClick={handleAnalyze} 
            disabled={!text.trim() || isAnalyzing}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-8 h-12 shadow-lg shadow-primary/20 transition-all"
            data-testid="button-analyze"
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
            <Card className={`border-l-8 overflow-hidden shadow-2xl ${result.verdict === 'real' ? 'border-l-emerald-500' : 'border-l-rose-500'}`} data-testid={`card-result-${result.verdict}`}>
              <div className={`absolute top-0 right-0 p-32 opacity-5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 ${result.verdict === 'real' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Consensus Verdict</p>
                    <h3 className={`text-4xl font-serif font-black flex items-center gap-3 ${result.verdict === 'real' ? 'text-emerald-600' : 'text-rose-600'}`} data-testid="text-verdict">
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
                    <div className="text-5xl font-bold tracking-tighter opacity-20" data-testid="text-confidence">
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
                      data-testid={`card-model-${model.name.toLowerCase().replace(/\s+/g, '-')}`}
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
