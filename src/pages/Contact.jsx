import React from "react";
import { Linkedin, Github, Instagram } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

const Contact = () => {
  return (
    <section id="contact" className="py-20 text-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="text-3xl font-bold text-blue-900">
          Get In Touch
        </h2>

        {/* Description */}
        <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
          I’m open to discussing new projects, creative ideas, or opportunities
          to collaborate and bring your vision to life. Feel free to reach out!
        </p>

        {/* Email Button */}
        <a
          href="https://mail.google.com/mail/?view=cm&fs=1&to=rahimtahajjadanzahirhaq@gmail.com"
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg shadow-blue-200 hover:-translate-y-1"
        >
          Gmail
        </a>

        {/* Social Media Icons */}
        <div className="mt-12 flex justify-center gap-8">
          <a
            href="https://linkedin.com/in/rahimhaq"
            target="_blank"
            rel="noreferrer"
            className="text-slate-400 hover:text-blue-600 transition-colors transform hover:scale-110"
          >
            <Linkedin className="w-8 h-8" />
          </a>

          <a
            href="https://github.com/rahimhaq"
            target="_blank"
            rel="noreferrer"
            className="text-slate-400 hover:text-gray-900 transition-colors transform hover:scale-110"
          >
            <Github className="w-8 h-8" />
          </a>

          <a
            href="https://www.instagram.com/rahimhaq"
            target="_blank"
            rel="noreferrer"
            className="text-slate-400 hover:text-pink-600 transition-colors transform hover:scale-110"
          >
            <Instagram className="w-8 h-8" />
          </a>

          <a
            href="https://wa.me/6281282315552"
            target="_blank"
            rel="noreferrer"
            className="text-slate-400 hover:text-green-500 transition-colors transform hover:scale-110"
          >
            <FontAwesomeIcon icon={faWhatsapp} className="w-8 h-8" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
