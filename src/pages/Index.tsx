
import React from 'react';
import Header from '@/components/Header';
import HeroCard from '@/components/HeroCard';
import SearchSection from '@/components/SearchSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroCard />
      <SearchSection />
      <Footer />
    </div>
  );
};

export default Index;
