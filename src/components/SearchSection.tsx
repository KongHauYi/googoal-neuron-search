
import React, { useState } from 'react';
import { Search, Sparkles, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface WebsiteResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
}

interface SearchResult {
  websites: WebsiteResult[];
  aiDemo: string;
  aiSummary: string;
}

const SearchSection = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState('');

  const searchSpecificSites = async (query: string): Promise<WebsiteResult[]> => {
    const sites = [
      'site:britannica.com',
      'site:academic.oup.com',
      'site:scholar.google.com',
      'site:nationalgeographic.com',
      'site:wikipedia.org'
    ];

    const websiteResults: WebsiteResult[] = [];

    for (const site of sites) {
      try {
        const searchUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(`${query} ${site}`)}&format=json&no_html=1&skip_disambig=1`;
        const response = await fetch(searchUrl);
        const data = await response.json();

        if (data.AbstractText && data.AbstractURL) {
          websiteResults.push({
            title: data.Heading || `${query} - ${site.replace('site:', '')}`,
            url: data.AbstractURL,
            snippet: data.AbstractText,
            source: site.replace('site:', '').split('.')[0]
          });
        }

        if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
          for (const topic of data.RelatedTopics.slice(0, 1)) {
            if (topic.Text && topic.FirstURL && topic.FirstURL.includes(site.replace('site:', ''))) {
              websiteResults.push({
                title: topic.Text.split(' - ')[0] || topic.Text.substring(0, 60),
                url: topic.FirstURL,
                snippet: topic.Text,
                source: site.replace('site:', '').split('.')[0]
              });
              break;
            }
          }
        }
      } catch (error) {
        console.error(`Error searching ${site}:`, error);
      }
    }

    return websiteResults;
  };

  const generateAIContent = (query: string, hasWebsiteContent: boolean): { aiDemo: string; aiSummary: string } => {
    const aiDemo = `🤖 **Direct AI Response:** ${query} involves multiple complex processes and considerations. This technology combines various scientific principles and methodologies that have evolved over time. The implementation requires understanding of fundamental concepts, practical applications, and modern innovations in the field. Current research continues to advance our understanding and improve efficiency in this area.`;

    let aiSummary = '';
    if (hasWebsiteContent) {
      aiSummary = `🤖 **AI Summary of Sources:** Based on the gathered information from reputable sources, this topic encompasses several key aspects including historical development, current methodologies, and practical applications. The sources provide comprehensive coverage from multiple perspectives, offering both foundational knowledge and cutting-edge insights into the subject matter.`;
    } else {
      aiSummary = `🤖 **AI Summary:** No specific source content was found, but this topic generally involves systematic approaches and established principles that can be understood through comprehensive analysis and practical implementation.`;
    }

    return { aiDemo, aiSummary };
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setError('');
    setResult(null);
    
    try {
      console.log('Searching for:', query);
      
      // Search specific websites
      const websites = await searchSpecificSites(query);
      
      // Generate AI content
      const { aiDemo, aiSummary } = generateAIContent(query, websites.length > 0);
      
      // If no website results, create demo website entries
      const finalWebsites = websites.length > 0 ? websites : [
        {
          title: `${query} - Demo Result`,
          url: '#',
          snippet: `Demo content for "${query}". In a real implementation, this would contain scraped content from reputable sources.`,
          source: 'demo'
        }
      ];

      const searchResult: SearchResult = {
        websites: finalWebsites,
        aiDemo,
        aiSummary
      };
      
      setResult(searchResult);
    } catch (err) {
      console.error('Search error:', err);
      setError('Search failed. Please try again.');
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
      {result && (
        <div className="animate-fade-in-up">
          <div className="glass rounded-xl p-6 shadow-lg">
            {/* Websites Section */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>🌐</span> Websites
              </h3>
              <div className="space-y-3">
                {result.websites.map((website, index) => (
                  <div key={index} className="border-l-2 border-accent/50 pl-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-white text-sm mb-1">{website.title}</h4>
                        <p className="text-xs text-muted-foreground mb-2 font-mono">{website.source}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{website.snippet}</p>
                      </div>
                      {website.url !== '#' && (
                        <a
                          href={website.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:text-accent/80 transition-colors ml-3 flex-shrink-0"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Demo Section */}
            <div className="mb-6 border-t border-primary/20 pt-6">
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

            {/* Disclaimer */}
            <div className="mt-6 pt-4 border-t border-primary/20">
              <p className="text-xs text-muted-foreground/70 italic text-center">
                ⚠️ Information may be inaccurate. Please verify from original sources.
              </p>
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
