
import React from 'react';

const Header = () => {
  return (
    <header className="w-full py-12 mt-16 animate-fade-in-up">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Search the Web Like a Pro
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground font-mono">
          Get AI-powered summaries of any website or topic
        </p>
      </div>
    </header>
  );
};

export default Header;
