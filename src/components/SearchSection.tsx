
import React, { useState } from 'react';
import { Search, Sparkles, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchResult {
  title: string;
  url: string;
  summary: string;
  content: string;
}

const SearchSection = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setError('');
    setResults([]);
    
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data = await response.json();
      setResults(data.results || []);
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="font-mono text-sm">AI-powered web scraping</span>
          <Sparkles className="w-4 h-4 text-accent" />
        </div>
      </div>

      <div className="relative max-w-2xl mx-auto mb-8">
        <div className="glass rounded-2xl p-4 sm:p-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Enter your search query or website URL..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-transparent border-primary/30 focus:border-primary text-white placeholder:text-muted-foreground text-base sm:text-lg h-12 font-mono"
                disabled={isSearching}
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={isSearching || !query.trim()}
              className="bg-primary hover:bg-primary/80 text-white h-12 w-full sm:w-12 rounded-xl shadow-lg transition-all duration-300 hover:shadow-primary/25 hover:shadow-xl"
            >
              {isSearching ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="text-center text-red-400 mb-4">
          {error}
        </div>
      )}

      {/* Search Results */}
      {results.length > 0 && (
        <div className="space-y-6 animate-fade-in-up">
          {results.map((result, index) => (
            <div key={index} className="glass rounded-xl p-6 shadow-lg">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-white mb-2 flex-1">
                  {result.title}
                </h3>
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent/80 transition-colors ml-4"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
              <p className="text-sm text-muted-foreground mb-3 font-mono">
                {result.url}
              </p>
              <div className="text-muted-foreground mb-4">
                <h4 className="text-accent font-semibold mb-2">AI Summary:</h4>
                <p className="leading-relaxed">{result.summary}</p>
              </div>
              {result.content && (
                <div className="border-t border-primary/20 pt-4">
                  <h4 className="text-accent font-semibold mb-2">Content Preview:</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {result.content.substring(0, 500)}...
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Loading State */}
      {isSearching && (
        <div className="space-y-4 animate-fade-in-up">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-primary/20 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-muted/30 rounded w-full mb-2"></div>
              <div className="h-3 bg-muted/30 rounded w-5/6 mb-4"></div>
              <div className="h-20 bg-muted/20 rounded"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchSection;
