import React from 'react';
import Hero from './Hero';
import FeaturedProjects from './FeaturedProjects';
import HowItWork from './HowItWork';
import Testimonials from './Testimonials';
import Contact from './Contact';

const Home = () => {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen selection:bg-emerald-500 selection:text-white">
      <Hero />
      <FeaturedProjects />
      <HowItWork />
      <Testimonials />
      <Contact />
    </div>
  );
};

export default Home;