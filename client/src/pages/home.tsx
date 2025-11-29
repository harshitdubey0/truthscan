import { Link } from "wouter";
import { NewsAnalyzer } from "@/components/news-analyzer";
import { Button } from "@/components/ui/button";
import { Github, Info, ScanLine, Activity, Radio } from "lucide-react";
import bgImage from "@assets/generated_images/subtle_digital_news_network_background.png";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20 selection:text-primary overflow-hidden">
      {/* Hero Background with "Cool" Scanning Effect */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img 
          src={bgImage} 
          alt="Background" 
          className="w-full h-full object-cover grayscale contrast-125 opacity-[0.03]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Scanning Line Animation */}
        <motion.div 
          className="absolute top-0 left-0 w-full h-1 bg-primary/30 shadow-[0_0_40px_rgba(59,130,246,0.5)] z-10"
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 10, ease: "linear", repeat: Infinity }}
        />
      </div>
      
      {/* Navigation */}
      <header className="relative z-10 border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-foreground text-background rounded-xl flex items-center justify-center shadow-lg">
              <ScanLine className="w-6 h-6" />
            </div>
            <span className="font-serif font-black text-xl tracking-tighter text-foreground">
              FAKE NEWS <span className="text-primary">DETECTOR</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
              <Activity className="w-4 h-4" /> Live Analysis
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Models</a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Dataset</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Github className="w-5 h-5" />
            </Button>
            <Button variant="outline" className="hidden sm:flex border-primary/20 hover:bg-primary/5 hover:text-primary">
              <Radio className="w-4 h-4 mr-2 animate-pulse text-rose-500" />
              System Online
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center mb-16 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4 border border-primary/20"
          >
            <span className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            AI-Powered Verification Protocol
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif font-black text-foreground leading-[0.9] tracking-tight"
          >
            TRUTH IN THE AGE OF <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-indigo-600">MISINFORMATION</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light"
          >
            Advanced machine learning algorithms working in concert to detect bias, fabrication, and manipulation in real-time.
          </motion.p>
        </div>

        <NewsAnalyzer />

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "98% Precision",
              desc: "Trained on over 40,000 verified articles from reputable and flagged sources.",
              icon: <div className="w-full h-1 bg-blue-500 mb-4 rounded-full" />, 
              color: "text-blue-600"
            },
            {
              title: "Ensemble Core",
              desc: "Combines predictions from Logistic Regression, Random Forest, and Gradient Boosting.",
              icon: <div className="w-full h-1 bg-indigo-500 mb-4 rounded-full" />,
              color: "text-indigo-600"
            },
            {
              title: "Instant Analysis",
              desc: "Real-time processing using optimized TF-IDF vectorization and semantic mapping.",
              icon: <div className="w-full h-1 bg-purple-500 mb-4 rounded-full" />,
              color: "text-purple-600"
            }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-8 rounded-3xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
            >
              {item.icon}
              <h3 className={`font-serif font-bold text-2xl mb-3 ${item.color} group-hover:translate-x-2 transition-transform duration-300`}>{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="border-t border-border/40 bg-background/50 backdrop-blur-sm mt-20 py-12 relative z-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-muted-foreground text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <p>System Operational • v2.4.0</p>
          </div>
          <p>&copy; {new Date().getFullYear()} Fake News Detector. Open Source Research Initiative.</p>
        </div>
      </footer>
    </div>
  );
}
