import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BrainCircuit, GitBranch, Network, Trees } from "lucide-react";

export function ModelsDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-3xl bg-background/95 backdrop-blur-xl border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif font-bold flex items-center gap-2">
             <Network className="w-6 h-6 text-primary" />
             Ensemble Architecture
          </DialogTitle>
          <DialogDescription>
            Our fake news detection system uses a voting ensemble of four distinct machine learning algorithms to ensure maximum accuracy and reduce bias.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Logistic Regression */}
            <div className="p-4 rounded-xl bg-muted/50 border border-border/50 hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg dark:bg-blue-900/30 dark:text-blue-400">
                        <BrainCircuit className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-lg">Logistic Regression</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    A statistical model that estimates the probability of an article being fake based on linguistic features. It serves as our baseline for linear patterns in the text.
                </p>
            </div>

            {/* Decision Tree */}
            <div className="p-4 rounded-xl bg-muted/50 border border-border/50 hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg dark:bg-emerald-900/30 dark:text-emerald-400">
                        <GitBranch className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-lg">Decision Tree</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Splits data into branches to make decisions. It captures non-linear relationships but can sometimes overfit, which is why we pair it with Random Forest.
                </p>
            </div>

            {/* Random Forest */}
            <div className="p-4 rounded-xl bg-muted/50 border border-border/50 hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg dark:bg-indigo-900/30 dark:text-indigo-400">
                        <Trees className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-lg">Random Forest</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    An ensemble of many decision trees. By averaging multiple trees, it reduces the risk of errors and provides a much more robust prediction.
                </p>
            </div>

            {/* Gradient Boosting */}
            <div className="p-4 rounded-xl bg-muted/50 border border-border/50 hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg dark:bg-purple-900/30 dark:text-purple-400">
                        <Network className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-lg">Gradient Boosting</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Builds models sequentially, with each new model correcting the errors of the previous ones. This is often our most accurate individual model.
                </p>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
