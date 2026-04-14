"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error Bounday:", error);
  }, [error]);

  return (
    <html>
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-8 animate-pulse">
            <AlertCircle className="w-10 h-10 text-destructive" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-gradient mb-4">
            Something went wrong
          </h1>
          
          <p className="text-muted-foreground text-lg max-w-md mb-12 leading-relaxed">
            A critical error occurred while processing your request. Our team has been notified, and we&apos;re working to restore the MSME Hub.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => reset()} 
              className="rounded-full px-8 h-12 gap-2 shadow-glow"
            >
              <RefreshCw className="w-4 h-4" /> Try Again
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'}
              className="rounded-full px-8 h-12 gap-2"
            >
              <Home className="w-4 h-4" /> Back to Home
            </Button>
          </div>

          <div className="mt-16 pt-8 border-t border-border/50 w-full max-w-xs">
            <p className="text-[10px] uppercase font-bold tracking-widest opacity-30">
              Error Digest: {error.digest || "Internal Engine Failure"}
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
