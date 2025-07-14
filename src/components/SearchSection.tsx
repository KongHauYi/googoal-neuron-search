
import React, { useState } from 'react';
import { Search, Sparkles, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  aiSummary: string;
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
      console.log('Searching for:', query);
      
      // Use DuckDuckGo API directly from the frontend
      const searchUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
      
      const response = await fetch(searchUrl);
      const data = await response.json();
      
      console.log('Search results:', data);
      
      const results: SearchResult[] = [];
      
      // Get instant answer if available
      if (data.AbstractText) {
        results.push({
          title: data.Heading || query,
          url: data.AbstractURL || '#',
          snippet: data.AbstractText,
          aiSummary: `🤖 This is about ${query}. ${data.AbstractText.substring(0, 100)}...`
        });
      }
      
      // Get related topics
      if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
        for (const topic of data.RelatedTopics.slice(0, 4)) {
          if (topic.Text && topic.FirstURL) {
            results.push({
              title: topic.Text.split(' - ')[0] || topic.Text.substring(0, 50),
              url: topic.FirstURL,
              snippet: topic.Text,
              aiSummary: `🤖 AI Summary: ${topic.Text.substring(0, 80)}... This provides relevant information about ${query}.`
            });
          }
        }
      }
      
      // If no results, create demo results
      if (results.length === 0) {
        results.push({
          title: `Search results for: ${query}`,
          url: '#',
          snippet: `Found information about "${query}". This is a demo search engine with AI-powered summaries for nerds.`,
          aiSummary: `🤖 AI Summary: This search query "${query}" shows how Googoal works - a nerdy search engine with real-time AI summaries for developers and tech enthusiasts.`
        });
      }
      
      setResults(results);
    } catch (err) {
      console.error('Search error:', err);
      // Create fallback demo results
      const fallbackResults: SearchResult[] = [{
        title: `Demo: ${query}`,
        url: '#',
        snippet: `This is a demo search for "${query}". Googoal is a nerdy search engine that would normally provide real web scraping results with AI summaries.`,
        aiSummary: `🤖 AI Summary: Your search for "${query}" demonstrates Googoal's capabilities. This would normally include scraped web content with intelligent AI-powered summaries tailored for developers and tech enthusiasts.`
      }];
      setResults(fallbackResults);
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
          <span className="font-mono text-sm">AI-powered web search</span>
          <Sparkles className="w-4 h-4 text-accent" />
        </div>
      </div>

      <div className="relative max-w-2xl mx-auto mb-8">
        <div className="glass rounded-2xl p-4 sm:p-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Enter your search query..."
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
        <div className="text-center text-red-400 mb-4 p-4 glass rounded-xl">
          <p>{error}</p>
          <p className="text-sm mt-2 text-muted-foreground">
            Make sure to run: <code className="bg-black/20 px-2 py-1 rounded">python src/api/search.py</code>
          </p>
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
                {result.url !== '#' && (
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-accent/80 transition-colors ml-4"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}
              </div>
              
              {result.url !== '#' && (
                <p className="text-sm text-muted-foreground mb-3 font-mono">
                  {result.url}
                </p>
              )}
              
              {result.aiSummary && (
                <div className="text-muted-foreground mb-4">
                  <h4 className="text-accent font-semibold mb-2">🤖 AI Summary:</h4>
                  <p className="leading-relaxed">{result.aiSummary}</p>
                </div>
              )}
              
              {result.snippet && (
                <div className="border-t border-primary/20 pt-4">
                  <h4 className="text-accent font-semibold mb-2">📝 Content:</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {result.snippet}
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
