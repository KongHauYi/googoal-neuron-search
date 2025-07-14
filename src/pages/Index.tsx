
import React from 'react';
import Navigation from '@/components/Navigation';
import HeroCard from '@/components/HeroCard';
import SearchSection from '@/components/SearchSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        <HeroCard />
        <SearchSection />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
