
import React from 'react';
import { Search } from 'lucide-react';

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Search className="w-8 h-8 text-primary mr-3" />
            <div>
              <h1 className="text-xl font-bold text-white">
                Googoal — The Search Engine for Nerds
              </h1>
            </div>
          </div>
          <div className="hidden md:block">
            <p className="text-sm text-muted-foreground font-mono">
              A nerdy search engine built for actual web diggers — open-source, free, and powered by AI.
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
