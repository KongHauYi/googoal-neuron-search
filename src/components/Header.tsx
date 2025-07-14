
import React from 'react';

const Header = () => {
  return (
    <header className="w-full py-6 animate-fade-in-up">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-center text-4xl md:text-6xl font-bold text-white">
          Googoal — The{' '}
          <span className="highlight-yellow font-bold">Search Engine</span>{' '}
          for{' '}
          <span className="highlight-yellow font-bold">Nerds</span>
        </h1>
        <p className="text-center text-lg md:text-xl text-muted-foreground mt-4 font-mono">
          "A nerdy search engine built for actual web diggers — open-source, free, and powered by AI."
        </p>
      </div>
    </header>
  );
};

export default Header;
