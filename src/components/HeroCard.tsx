
import React from 'react';

const HeroCard = () => {
  return (
    <div className="flex justify-center items-center py-12 relative">
      {/* Floating Labels */}
      <div className="absolute left-4 md:left-12 top-1/2 transform -translate-y-1/2 opacity-30 hover:opacity-100 transition-opacity duration-300 animate-slide-in-left">
        <div className="bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-lg px-4 py-2 animate-float">
          <p className="text-sm font-mono text-accent font-semibold">Open Source</p>
          <p className="text-xs text-muted-foreground">Free to use</p>
        </div>
      </div>

      <div className="absolute right-4 md:right-12 top-1/2 transform -translate-y-1/2 opacity-30 hover:opacity-100 transition-opacity duration-300 animate-slide-in-right">
        <div className="bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-lg px-4 py-2 animate-float" style={{ animationDelay: '1s' }}>
          <p className="text-sm font-mono text-accent font-semibold">Legit</p>
          <p className="text-xs text-muted-foreground">Web Scrapper</p>
        </div>
      </div>

      {/* Main Hero Card */}
      <div className="glass rounded-2xl p-8 md:p-12 mx-4 max-w-md text-center animate-fade-in-up shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          You are on Version
        </h2>
        <div className="inline-block bg-accent text-accent-foreground px-6 py-2 rounded-full font-mono font-semibold text-lg shadow-lg animate-glow">
          v1.0.0
        </div>
      </div>
    </div>
  );
};

export default HeroCard;
