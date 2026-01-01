// src/components/Hero.jsx
import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = ({ visitorName }) => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center w-full">
        {/* Badge */}
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
          <span className="flex h-2 w-2 bg-blue-600 rounded-full mr-2"></span>
          Hello {visitorName || "Friend"}, Welcome
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-semibold text-gray-900 tracking-tight mb-4">
          Rahiim Tahajjadan Zhaahir Haq
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-600 font-medium mb-6">
          Web Developer & Tech Enthusiast
        </p>

        {/* Description */}
        <p className="max-w-3xl mx-auto text-gray-500 mb-10 leading-relaxed">
          Frontend Developer specializing in Legacy System Migration. Building
          scalable, secure web architectures backed by a Certified Network
          Administrator background.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto px-4 sm:px-0">
          <Link
            to="/projects"
            className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
          >
            My Projects <ArrowRight size={20} />
          </Link>

          <Link
            to="/contact"
            className="w-full sm:w-auto px-8 py-3 bg-white text-blue-600 font-semibold rounded-xl border border-blue-200 hover:bg-blue-50 transition flex items-center justify-center"
          >
            Contact Me
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
