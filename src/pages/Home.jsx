// src/pages/Home.jsx
import React from 'react';
import Hero from '../components/Hero';
import About from './About';
import Projects from './Projects';
import Skills from './Skills';
import Contact from './Contact';

const Home = ({ visitorName }) => {
  return (
    <div className="overflow-x-hidden">

      {/* 1. Hero Section (Paling Atas) */}
      {/* Biarkan Hero clean & fokus */}
      <Hero visitorName={visitorName} />

      {/* 2. About Section */}
      {/* Background putih + jarak besar */}
      <section className="py-0 bg-white">
        <About /> 
      </section>

      {/* 3. Skills Section */}
      {/* Dibedakan dengan abu lembut */}
      <section className="py-0 bg-gradient-to-b from-white bg-blue-50">
        <Skills />
      </section>

      {/* 4. Projects Section */}
      {/* Gradient halus biar terasa section penting */}
      <section className="py-32 bg-gradient-to-b from-blue-50 to-white">
        <Projects />
      </section>

      {/* 5. Contact Section */}
      {/* Kembali ke putih agar CTA lebih fokus */}
      <section className="py-32">
        <Contact />
      </section>

    </div>
  );
};

export default Home;
