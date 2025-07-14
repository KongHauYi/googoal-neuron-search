
import React from 'react';
import { Github, Heart, Zap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-primary/20 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-accent" />
              <span className="font-mono text-sm">Made for nerds</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span className="font-mono text-sm">Powered by AI</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="#" 
              className="text-muted-foreground hover:text-accent transition-colors duration-300 flex items-center gap-2 font-mono text-sm"
            >
              <Github className="w-4 h-4" />
              Open Source
            </a>
            <div className="text-muted-foreground font-mono text-sm">
              v1.0.0
            </div>
          </div>
        </div>
        
        <div className="text-center mt-6 pt-6 border-t border-primary/10">
          <p className="text-muted-foreground font-mono text-xs">
            © 2024 Googoal. Built with React, powered by curiosity.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
