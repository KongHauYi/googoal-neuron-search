
import React, { useState } from 'react';
import { Search, Sparkles, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchResult {
  aiDemo: string;
  aiSummary: string;
}

const SearchSection = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState('');
  const apiKey = "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";

  const callOpenAIAPI = async (message: string, systemPrompt: string): Promise<string> => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.2,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'Unable to generate response.';
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  };

  const generateAISummary = async (query: string): Promise<string> => {
    const systemPrompt = `You are a research assistant that creates comprehensive summaries. Research the topic from trusted sources like Wikipedia, Britannica, .gov, .edu, and .org domains. Create a detailed summary that is exactly 140-170 words. Focus on factual, accurate information from reputable sources.`;
    
    const userPrompt = `Research and summarize information about: ${query}. Provide a comprehensive summary of 140-170 words based on trusted sources.`;
    
    return await callOpenAIAPI(userPrompt, systemPrompt);
  };

  const generateAIDemo = async (query: string): Promise<string> => {
    const systemPrompt = `You are an AI assistant providing direct, accurate responses. Be informative and factual. Provide a comprehensive but concise response about the topic.`;
    
    const userPrompt = `Provide a direct, informative response about: ${query}. Be accurate and comprehensive.`;
    
    return await callOpenAIAPI(userPrompt, systemPrompt);
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    
    setIsSearching(true);
    setError('');
    setResult(null);
    
    try {
      console.log('Searching for:', query);
      
      // Generate AI demo and summary using real APIs
      const [aiDemo, aiSummary] = await Promise.all([
        generateAIDemo(query),
        generateAISummary(query)
      ]);

      const searchResult: SearchResult = {
        aiDemo,
        aiSummary
      };
      
      setResult(searchResult);
    } catch (err) {
      console.error('Search error:', err);
      setError('Search failed. Please check your API key and try again.');
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
        </div>
      )}

      {/* Search Results */}
      {result && (
        <div className="animate-fade-in-up">
          <div className="glass rounded-xl p-6 shadow-lg">
            {/* AI Demo Section */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>🤖</span> AI Demo
              </h3>
              <div className="bg-primary/10 rounded-lg p-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{result.aiDemo}</p>
              </div>
            </div>

            {/* AI Summary Section */}
            <div className="border-t border-primary/20 pt-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>📝</span> AI Summary
              </h3>
              <div className="bg-accent/10 rounded-lg p-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{result.aiSummary}</p>
              </div>
            </div>
          </div>
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
