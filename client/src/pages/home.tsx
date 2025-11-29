import { Link } from "wouter";
import { NewsAnalyzer } from "@/components/news-analyzer";
import { Button } from "@/components/ui/button";
import { Github, Info } from "lucide-react";
import bgImage from "@assets/generated_images/subtle_digital_news_network_background.png";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20 selection:text-primary">
      {/* Hero Background */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none">
        <img 
          src={bgImage} 
          alt="Background" 
          className="w-full h-full object-cover grayscale contrast-125"
        />
      </div>
      
      {/* Navigation */}
      <header className="relative z-10 border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-serif font-bold text-xl">V</span>
            </div>
            <span className="font-serif font-bold text-xl tracking-tight text-foreground">Veritas<span className="text-primary">AI</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Models</a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Dataset</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Github className="w-5 h-5" />
            </Button>
            <Button variant="outline" className="hidden sm:flex">
              <Info className="w-4 h-4 mr-2" />
              About Project
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            Powered by Scikit-Learn
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-black text-foreground leading-tight">
            Detect Misinformation with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Precision</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Leveraging Logistic Regression, Random Forest, and Gradient Boosting models to analyze news credibility in real-time.
          </p>
        </div>

        <NewsAnalyzer />

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="p-6 rounded-2xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors">
            <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h3 className="font-serif font-bold text-lg mb-2">98% Accuracy</h3>
            <p className="text-muted-foreground text-sm">Trained on over 40,000 verified articles from reputable and flagged sources.</p>
          </div>
          <div className="p-6 rounded-2xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors">
            <div className="h-12 w-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
            </div>
            <h3 className="font-serif font-bold text-lg mb-2">Ensemble Learning</h3>
            <p className="text-muted-foreground text-sm">Combines predictions from multiple algorithms to eliminate bias and variance.</p>
          </div>
          <div className="p-6 rounded-2xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors">
            <div className="h-12 w-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <h3 className="font-serif font-bold text-lg mb-2">Real-time Analysis</h3>
            <p className="text-muted-foreground text-sm">Instant processing of article text using optimized TF-IDF vectorization.</p>
          </div>
        </div>
      </main>

      <footer className="border-t border-border/40 bg-muted/20 mt-20 py-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 Veritas AI Research. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
