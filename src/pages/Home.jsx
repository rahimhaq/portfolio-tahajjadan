// src/pages/Home.jsx
import React from 'react';
import Hero from '../components/Hero';
import { AcademicSection, ExperienceSection, LeadershipSection } from './About';
import Projects from './Projects';
import Skills from './Skills';
import Contact from './Contact';

const Home = ({ visitorName }) => {
  return (
    <div className="overflow-x-hidden">

      {/* 1. Hero Section (Paling Atas) */}
      <Hero visitorName={visitorName} />

      {/* 2. Professional Work Experience Section */}
      {/* Soft gradient background with subtle structured grid lines overlay */}
      <section className="py-24 bg-gradient-to-tr from-slate-50 via-blue-50/20 to-slate-50 border-y border-slate-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40"></div>
        <ExperienceSection />
      </section>

      {/* 3. Featured Projects Section */}
      {/* Sleek, premium light gradient transition with warm & cool blur highlights */}
      <section className="py-24 bg-gradient-to-b from-white via-indigo-50/15 to-slate-50 relative overflow-hidden">
        <div className="absolute top-10 right-10 w-80 h-80 bg-indigo-100/30 rounded-full mix-blend-multiply filter blur-3xl opacity-80 pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-sky-100/30 rounded-full mix-blend-multiply filter blur-3xl opacity-80 pointer-events-none"></div>
        <Projects isOnlyProjects={true} />
      </section>

      {/* 4. Academic Background Section */}
      {/* Modern subtle dotted grid pattern with colorful ambient spotlights */}
      <section className="py-24 bg-white relative overflow-hidden bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px]">
        <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-blue-100/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-purple-100/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 pointer-events-none"></div>
        <AcademicSection />
      </section>

      {/* 5. Leadership & Organizational Experience Section */}
      {/* Clean high-contrast white section with modern minimal blue matrix pattern */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none bg-[radial-gradient(#3b82f6_1.5px,transparent_1.5px)] [background-size:32px_32px]"></div>
        <LeadershipSection />
      </section>

      {/* 7. Skills Section */}
      {/* Stunning high-end gradient with an immersive central ambient spotlight */}
      <section className="py-24 bg-gradient-to-b from-slate-50 via-indigo-50/20 to-white relative overflow-hidden border-t border-slate-100">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-50/30 rounded-full filter blur-3xl opacity-70 pointer-events-none"></div>
        <Skills />
      </section>

      {/* 8. Contact Section */}
      {/* Pristine minimalist finish with subtle trailing flare */}
      <section className="py-24 bg-white relative overflow-hidden border-t border-slate-100">
        <div className="absolute -bottom-10 right-10 w-72 h-72 bg-indigo-50/40 rounded-full filter blur-3xl pointer-events-none"></div>
        <Contact />
      </section>

    </div>
  );
};

export default Home;
