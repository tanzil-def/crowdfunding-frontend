import React from 'react';
import Hero from './Hero';
import FeaturedProjects from './FeaturedProjects';

// Note: HowItWork, Testimonials and Contact would be imported similarly
const Home = () => {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen selection:bg-emerald-500 selection:text-white">
      <Hero />
      <FeaturedProjects />
      
      {/* Placeholder sections for the rest */}
      <section className="py-20 text-center bg-slate-900/50">
        <h2 className="text-4xl font-bold mb-4">How It Works</h2>
        <p className="text-slate-400">The path to institutional real estate ownership in 3 steps.</p>
      </section>

      <section className="py-20 text-center bg-slate-950">
        <h2 className="text-4xl font-bold mb-4">Investor Success Stories</h2>
      </section>
    </div>
  );
};

export default Home;