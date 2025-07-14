
import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const SearchSection = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    console.log('Searching for:', query);
    
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Try Now! <span className="highlight-yellow">It's free.</span>
        </h2>
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="font-mono text-sm">AI-powered web scraping</span>
          <Sparkles className="w-4 h-4 text-accent" />
        </div>
      </div>

      <div className="relative max-w-2xl mx-auto">
        <div className="glass rounded-2xl p-6 shadow-2xl">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Enter your search query..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-transparent border-primary/30 focus:border-primary text-white placeholder:text-muted-foreground text-lg h-12 font-mono"
                disabled={isSearching}
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={isSearching || !query.trim()}
              className="bg-primary hover:bg-primary/80 text-white h-12 w-12 rounded-xl p-0 shadow-lg transition-all duration-300 hover:shadow-primary/25 hover:shadow-xl"
            >
              {isSearching ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Search Results Placeholder */}
        {isSearching && (
          <div className="mt-8 space-y-4 animate-fade-in-up">
            <div className="glass rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-primary/20 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-muted/30 rounded w-full mb-2"></div>
              <div className="h-3 bg-muted/30 rounded w-5/6"></div>
            </div>
            <div className="glass rounded-xl p-6 animate-pulse" style={{ animationDelay: '200ms' }}>
              <div className="h-4 bg-primary/20 rounded w-2/3 mb-3"></div>
              <div className="h-3 bg-muted/30 rounded w-full mb-2"></div>
              <div className="h-3 bg-muted/30 rounded w-4/5"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchSection;
