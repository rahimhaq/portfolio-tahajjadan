// src/pages/About.jsx
import React, { useState, useEffect } from 'react';
import { GraduationCap, ArrowDownRight, ArrowRight, Briefcase, Calendar, MapPin, ExternalLink, X, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AcademicSection = () => {
  return (
    <div className="max-w-6xl mx-auto mb-32 relative">
      <div className="grid md:grid-cols-2 gap-12 items-center">

        {/* Kolom Teks Pendidikan */}
        <div className="order-2 md:order-1 space-y-10 relative z-10 mb-auto">
          <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold tracking-wide uppercase">
            Academic Background
          </span>

          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 leading-tight">
            Bachelor of Applied <br />
            <span className="text-blue-600">Computer Engineering Technology</span>
          </h2>

          <div className="flex items-center gap-4 text-lg text-slate-600 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <GraduationCap className="text-blue-600 w-8 h-8" />
            <div>
              <p className="font-bold text-slate-800">IPB University (2021 - 2025)</p>
              <p className="text-sm text-slate-500">GPA 3.59 / 4.00</p>
            </div>
          </div>

          <p className="text-slate-600 leading-relaxed text-lg">
            Focused on the convergence of Software, Embedded System and Internet of Things (IoT).
            Certified Network Administrator, Embedded System (BNSP) with research experience intern in Satellite Technology Research Center (BRIN).
          </p>

          {/* Dekorasi Panah Menunjuk ke Bawah (SVG Hand-drawn style) */}
          <div className="hidden md:block absolute -bottom-32 right-10 text-slate-300 rotate-12">
            <svg width="100" height="120" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 10 C 60 10, 80 50, 60 100" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="8,8" />
              <path d="M50 90 L 60 100 L 75 90" stroke="currentColor" strokeWidth="3" fill="none" />
              <text x="0" y="60" className="text-sm fill-current font-handwriting rotate-[-10deg]" style={{ fontSize: '14px' }}>My Journey</text>
            </svg>
          </div>
        </div>

        {/* Kolom Foto Wisuda */}
        <div className="order-1 md:order-2 relative group">
          {/* Background Blob */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-8 left-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>

          {/* Frame Foto Wisuda (Miring dikit biar ga kaku) */}
          <div className="relative transform rotate-3 hover:rotate-0 transition duration-500 ease-in-out shadow-2xl rounded-2xl overflow-hidden border-8 border-white">
            <img
              src="/assets/foto-wisuda.jpg"
              alt="Rahiim Graduation"
              className="w-full h-auto object-cover aspect-[4/5] transform group-hover:scale-105 transition duration-700"
            />
            {/* Overlay Label */}
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
              <p className="text-blue-900 font-bold text-sm">Bogor, 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ExperienceSection = () => {
  const [experiences, setExperiences] = useState([]);
  const [activeExp, setActiveExp] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await fetch(`${API_URL}/api/experiences`);
        const data = await res.json();
        setExperiences(data);
      } catch (error) {
        console.error("Gagal load experiences", error);
      }
    };
    fetchExperiences();
  }, [API_URL]);

  const openLightbox = (exp, idx) => {
    setActiveExp(exp);
    setActiveIndex(idx);
    document.body.style.overflow = 'hidden'; // Lock background scrolling
  };

  const closeLightbox = () => {
    setActiveExp(null);
    setActiveIndex(0);
    document.body.style.overflow = 'unset'; // Unlock background scrolling
  };

  const prevImage = () => {
    if (!activeExp) return;
    setActiveIndex((prev) => (prev === 0 ? activeExp.gallery.length - 1 : prev - 1));
  };

  const nextImage = () => {
    if (!activeExp) return;
    setActiveIndex((prev) => (prev === activeExp.gallery.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activeExp) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeExp]);

  if (experiences.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto mb-32 relative px-4">
      <div className="text-center mb-20">
        <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold tracking-wide uppercase mb-3">
          Career History
        </span>
        <br />
        <h3 className="text-3xl font-bold text-slate-800 relative inline-block">
          Professional Work Experience
          <div className="absolute w-full h-2 bg-blue-200 bottom-1 left-0 -z-10 opacity-60"></div>
        </h3>
      </div>

      {/* Timeline Wrapper */}
      <div className="relative border-l-2 border-blue-200 ml-2 md:ml-32 space-y-12">
        {experiences.map((exp, idx) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="relative pl-6 md:pl-12 group animate-duration-300"
          >
            {/* Timeline Connector Dot */}
            <span className="absolute -left-3.5 top-1.5 flex items-center justify-center w-7 h-7 bg-blue-600 rounded-full border-4 border-white shadow group-hover:scale-110 group-hover:bg-blue-750 transition duration-300 z-10">
              <Briefcase size={12} className="text-white" />
            </span>

            {/* Left Date Panel for Desktop */}
            <div className="hidden md:block absolute -left-36 top-2 w-28 text-right pr-4">
              <p className="font-bold text-slate-700 text-sm">{exp.startDate}</p>
              <p className="text-xs text-slate-400 font-semibold">{exp.endDate}</p>
            </div>

            {/* Experience Content Card */}
            {(() => {
              const showcaseImages = exp.gallery ? exp.gallery.filter(url => !url.toLowerCase().endsWith('.pdf')).slice(0, 3) : [];
              const additionalGallery = exp.gallery ? exp.gallery.filter(url => !showcaseImages.includes(url)) : [];

              return (
                <div className="flex flex-col lg:flex-row lg:items-center w-full relative">

                  {/* Left Side: The Main Experience Content Card */}
                  <div className="flex-1 min-w-0 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden p-6 lg:pr-[270px] flex flex-col justify-between z-10">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-350 rounded-full -mr-8 -mt-8 pointer-events-none"></div>

                    <div>
                      {/* Mobile Date Badge */}
                      <div className="inline-flex md:hidden items-center gap-1 bg-blue-50 text-blue-600 text-xs px-2.5 py-1 rounded-full font-bold mb-3">
                        <Calendar size={12} />
                        {exp.startDate} - {exp.endDate}
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                        <div>
                          <h4 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                            {exp.role}
                          </h4>
                          <div className="text-slate-500 font-semibold text-sm flex flex-wrap items-center gap-1.5 mt-0.5">
                            <span className="text-blue-600 font-bold">{exp.company}</span>
                            {exp.location && (
                              <>
                                <span className="text-slate-300">•</span>
                                <span className="inline-flex items-center gap-1 text-xs text-slate-455">
                                  <MapPin size={11} />
                                  {exp.location}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {exp.link && (
                          <a
                            href={exp.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-blue-650 hover:text-blue-800 font-bold self-start md:self-center border border-blue-200 hover:border-blue-500 px-3 py-1.5 rounded-lg bg-blue-50/50 hover:bg-blue-55 transition"
                          >
                            Visit Website
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>

                      <p className="text-slate-600 leading-relaxed text-sm mb-4 whitespace-pre-line border-l-2 border-slate-100 pl-3">
                        {exp.desc}
                      </p>

                      {/* Supplementary Documents / Certificates (Seperti PDF BNSP) */}
                      {additionalGallery.length > 0 && (
                        <div className="mt-4 mb-5 pt-4 border-t border-slate-100/60">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                              Dokumentasi & Sertifikat Tambahan
                            </span>
                            <span className="h-px bg-slate-100 flex-1"></span>
                          </div>

                          <div className="flex flex-wrap gap-4 items-center">
                            {/* Overlapping thumbnail stack with hover effects */}
                            <div className="flex items-center -space-x-3.5 hover:-space-x-1 hover:pr-4 transition-all duration-300">
                              {additionalGallery.slice(0, 4).map((imgUrl, gIdx) => {
                                const isPdf = imgUrl.toLowerCase().endsWith('.pdf');
                                const originalIdx = exp.gallery.indexOf(imgUrl);
                                return (
                                  <div
                                    key={gIdx}
                                    onClick={() => openLightbox(exp, originalIdx)}
                                    className="relative w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden border-2 border-white shadow-md hover:-translate-y-1 hover:scale-110 hover:rotate-1 hover:z-20 transition-all duration-300 cursor-pointer bg-slate-100 group/thumb flex items-center justify-center"
                                    style={{ zIndex: 10 - gIdx }}
                                  >
                                    {isPdf ? (
                                      <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 text-red-500 font-bold text-[8px] p-1 text-center leading-none">
                                        <FileText size={16} className="mb-0.5 text-red-400" />
                                        PDF
                                      </div>
                                    ) : (
                                      <img
                                        src={imgUrl}
                                        alt=""
                                        className="w-full h-full object-cover group-hover/thumb:brightness-105"
                                      />
                                    )}
                                    <div className="absolute inset-0 bg-slate-950/0 group-hover/thumb:bg-slate-950/15 flex items-center justify-center transition-colors">
                                      <span className="text-white opacity-0 group-hover/thumb:opacity-100 text-[10px] transition-opacity font-bold">🔍</span>
                                    </div>
                                  </div>
                                );
                              })}
                              {additionalGallery.length > 4 && (
                                <div
                                  onClick={() => openLightbox(exp, exp.gallery.indexOf(additionalGallery[4]))}
                                  className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center font-bold text-xs shadow-md hover:-translate-y-1 transition duration-300 border-2 border-white cursor-pointer relative z-0 group"
                                >
                                  <span className="group-hover:scale-110 transition-transform">+{additionalGallery.length - 4}</span>
                                  <span className="text-[7px] font-semibold tracking-wide uppercase text-slate-400 group-hover:text-white mt-0.5">Files</span>
                                </div>
                              )}
                            </div>

                            <button
                              onClick={() => openLightbox(exp, exp.gallery.indexOf(additionalGallery[0]))}
                              className="ml-auto inline-flex items-center gap-1.5 text-xs text-blue-650 hover:text-blue-700 font-bold bg-blue-50/50 hover:bg-blue-55 px-3 py-2 rounded-lg border border-blue-100 hover:border-blue-200 transition-all duration-200"
                            >
                              Buka Dokumen ({additionalGallery.length})
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Skills Pills */}
                    {exp.skills && exp.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-50">
                        {exp.skills.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2.5 py-1 bg-slate-50 text-slate-650 rounded-lg text-xs font-bold border border-slate-200 group-hover:bg-blue-50/60 group-hover:text-blue-700 group-hover:border-blue-100 transition-colors duration-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Side: Abstract Scattered Overlapping Polaroid Collage */}
                  {showcaseImages.length > 0 && (
                    <div className="w-full lg:w-[480px] shrink-0 flex items-center justify-center relative min-h-[260px] lg:min-h-[340px] py-6 select-none lg:self-center lg:-ml-60 z-20 mt-4 lg:mt-0">

                      {/* Collage Style based on image count */}
                      {showcaseImages.length === 1 && (
                        <div
                          onClick={() => openLightbox(exp, exp.gallery.indexOf(showcaseImages[0]))}
                          className="relative w-72 h-44 lg:w-[440px] lg:h-[280px] rounded-2xl overflow-hidden border-4 border-white shadow-xl hover:-translate-y-1 hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-pointer bg-slate-50 group/collage -rotate-3 z-10"
                        >
                          <img src={showcaseImages[0]} alt="" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-slate-950/0 group-hover/collage:bg-slate-950/20 transition-colors duration-300 flex items-center justify-center">
                            <span className="text-white opacity-0 group-hover/collage:opacity-100 bg-slate-950/40 backdrop-blur-sm px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 shadow-lg">
                              🔍 Lihat
                            </span>
                          </div>
                        </div>
                      )}

                      {showcaseImages.length === 2 && (
                        <div className="relative w-72 h-48 lg:w-[480px] lg:h-[300px] flex items-center justify-center">
                          {/* Image 2 (Back) */}
                          <div
                            onClick={() => openLightbox(exp, exp.gallery.indexOf(showcaseImages[1]))}
                            className="absolute -top-2 -right-3 lg:-top-4 lg:-right-8 w-52 h-36 lg:w-[360px] lg:h-[230px] rounded-2xl overflow-hidden border-4 border-white shadow-lg rotate-8 opacity-80 hover:opacity-100 hover:z-30 hover:scale-105 hover:rotate-0 transition-all duration-300 cursor-pointer bg-slate-50 group/collage2 z-10"
                          >
                            <img src={showcaseImages[1]} alt="" className="w-full h-full object-cover" />
                          </div>

                          {/* Image 1 (Front) */}
                          <div
                            onClick={() => openLightbox(exp, exp.gallery.indexOf(showcaseImages[0]))}
                            className="absolute -bottom-2 -left-3 lg:-bottom-4 lg:-left-8 w-56 h-40 lg:w-[380px] lg:h-[250px] rounded-2xl overflow-hidden border-4 border-white shadow-xl -rotate-6 hover:scale-105 hover:rotate-0 hover:z-30 transition-all duration-300 cursor-pointer bg-slate-50 group/collage1 z-20"
                          >
                            <img src={showcaseImages[0]} alt="" className="w-full h-full object-cover" />
                          </div>
                        </div>
                      )}

                      {showcaseImages.length >= 3 && (
                        <div className="relative w-72 h-48 lg:w-[480px] lg:h-[300px] flex items-center justify-center">
                          {/* Image 3 (Back Left) */}
                          <div
                            onClick={() => openLightbox(exp, exp.gallery.indexOf(showcaseImages[2]))}
                            className="absolute -bottom-2 -left-4 lg:-bottom-6 lg:-left-12 w-40 h-28 lg:w-[280px] lg:h-[190px] rounded-2xl overflow-hidden border-4 border-white shadow-md -rotate-12 opacity-75 hover:opacity-100 hover:z-30 hover:scale-105 hover:rotate-0 transition-all duration-300 cursor-pointer bg-slate-50 z-10"
                          >
                            <img src={showcaseImages[2]} alt="" className="w-full h-full object-cover" />
                          </div>

                          {/* Image 2 (Back Right) */}
                          <div
                            onClick={() => openLightbox(exp, exp.gallery.indexOf(showcaseImages[1]))}
                            className="absolute -top-2 -right-4 lg:-top-6 lg:-right-12 w-40 h-28 lg:w-[280px] lg:h-[190px] rounded-2xl overflow-hidden border-4 border-white shadow-md rotate-12 opacity-75 hover:opacity-100 hover:z-30 hover:scale-105 hover:rotate-0 transition-all duration-300 cursor-pointer bg-slate-50 z-10"
                          >
                            <img src={showcaseImages[1]} alt="" className="w-full h-full object-cover" />
                          </div>

                          {/* Image 1 (Front Center) */}
                          <div
                            onClick={() => openLightbox(exp, exp.gallery.indexOf(showcaseImages[0]))}
                            className="absolute w-48 h-32 lg:w-[340px] lg:h-[220px] rounded-2xl overflow-hidden border-4 border-white shadow-xl -rotate-2 hover:scale-105 hover:rotate-0 hover:z-30 transition-all duration-300 cursor-pointer bg-slate-50 z-20"
                          >
                            <img src={showcaseImages[0]} alt="" className="w-full h-full object-cover" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              );
            })()}
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeExp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 md:p-8"
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition z-55 cursor-pointer shadow-lg animate-fade-in duration-300"
              aria-label="Close"
            >
              <X size={24} />
            </button>

            {/* Nav Arrows */}
            {activeExp.gallery.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition z-55 cursor-pointer shadow-lg"
                  aria-label="Previous"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition z-55 cursor-pointer shadow-lg"
                  aria-label="Next"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Active Content Container */}
            <div className="w-full max-w-4xl max-h-[70vh] flex flex-col items-center justify-center relative select-none">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.25 }}
                className="w-full h-full flex items-center justify-center"
              >
                {activeExp.gallery[activeIndex].toLowerCase().endsWith('.pdf') ? (
                  <div className="w-full max-w-md bg-white rounded-2xl p-8 border shadow-2xl text-center flex flex-col items-center gap-4 justify-center aspect-video z-10">
                    <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center shadow-inner">
                      <FileText size={32} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg md:text-xl">PDF Document Attachment</h4>
                      <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                        This is an official document attachment (certificate or proof of internship) for your role.
                      </p>
                    </div>
                    <a
                      href={activeExp.gallery[activeIndex]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-2 text-sm text-white font-bold bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl shadow-lg hover:shadow-blue-200 transition duration-200"
                    >
                      Open PDF in New Tab
                      <ExternalLink size={14} />
                    </a>
                  </div>
                ) : (
                  <img
                    src={activeExp.gallery[activeIndex]}
                    alt={`Documentation ${activeIndex}`}
                    className="max-w-full max-h-[65vh] object-contain rounded-xl shadow-2xl border border-white/10"
                  />
                )}
              </motion.div>
            </div>

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-slate-900/75 backdrop-blur-md border border-slate-800 p-4 rounded-2xl shadow-2xl text-center z-10">
              <span className="text-[10px] md:text-xs font-bold tracking-wider text-blue-400 uppercase block mb-1">
                {activeExp.role} @ {activeExp.company}
              </span>
              <span className="text-white text-xs md:text-sm font-semibold">
                Documentation {activeIndex + 1} of {activeExp.gallery.length}
              </span>

              {/* Thumbnail Strip inside Modal */}
              {activeExp.gallery.length > 1 && (
                <div className="flex justify-center gap-2 mt-3 overflow-x-auto py-1 max-w-full">
                  {activeExp.gallery.map((img, stripIdx) => {
                    const isPdf = img.toLowerCase().endsWith('.pdf');
                    return (
                      <button
                        key={stripIdx}
                        onClick={() => setActiveIndex(stripIdx)}
                        className={`relative w-10 h-10 rounded-lg overflow-hidden border-2 transition-all flex items-center justify-center bg-slate-800 cursor-pointer ${activeIndex === stripIdx ? 'border-blue-500 scale-105 shadow-md shadow-blue-500/30' : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                      >
                        {isPdf ? (
                          <span className="text-[7px] text-red-400 font-bold uppercase">PDF</span>
                        ) : (
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const LeadershipSection = () => {
  return (
    <div className="max-w-5xl mx-auto relative">
      <div className="text-center mb-20">
        <h3 className="text-3xl font-bold text-slate-800 relative inline-block">
          Leadership & Organizational Experience
          <div className="absolute w-full h-2 bg-blue-200 bottom-1 left-0 -z-10 opacity-60"></div>
        </h3>
      </div>

      {/* Timeline Item 1: ACC SV IPB (Kiri Gambar, Kanan Teks) */}
      <div className="flex flex-col md:flex-row items-center gap-10 mb-24 group">
        <div className="w-full md:w-1/2 flex justify-center md:justify-end relative">
          <div className="relative w-72 h-52">
            <div className="w-full h-full bg-gray-200 rounded-xl shadow-lg transform -rotate-2 group-hover:rotate-0 transition duration-300 border-4 border-white overflow-hidden z-10">
              <img src="/assets/acc-ipb.jpg" alt="ACC Activity" className="w-full h-full object-cover" />
            </div>
            {/* Sticker Effect */}
            <div className="absolute -top-4 -right-4 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold border border-yellow-200 z-20 shadow-sm rotate-1 whitespace-nowrap">
              Staff - Membership & Social Media
            </div>
          </div>
          {/* Panah Konektor */}
          <ArrowDownRight className="absolute -bottom-12 -right-12 text-slate-300 w-20 h-20 hidden md:block" strokeWidth={1.5} />
        </div>
        <div className="w-full md:w-1/2 text-left">
          <h4 className="text-2xl font-bold text-blue-900">Alumni Career Center (ACC) SV IPB</h4>
          <p className="text-blue-600 font-semibold mb-3 flex items-center gap-2">
            <ArrowRight size={16} /> Feb 2024 - Now
          </p>
          <p className="text-slate-600 leading-relaxed bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
            Responsible for developing visual branding for career opportunities and managing the @acc_svipb Instagram feed to ensure high engagement with alumni.
          </p>
        </div>
      </div>

      {/* Timeline Item 2: DKM Al Ghifari (Kanan Gambar, Kiri Teks) */}
      <div className="flex flex-col md:flex-row-reverse items-center gap-10 mb-24 group">
        <div className="w-full md:w-1/2 flex justify-center md:justify-start relative">
          <div className="relative w-72 h-52">
            <div className="w-full h-full bg-gray-200 rounded-xl shadow-lg transform rotate-3 group-hover:rotate-0 transition duration-300 border-4 border-white overflow-hidden z-10">
              <img src="/assets/dkm-ghifari.jpg" alt="DKM Activity" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200 z-20 shadow-sm -rotate-6 whitespace-nowrap">
              Head of Takmir
            </div>
          </div>
          {/* Panah Konektor Balik */}
          <svg className="absolute -bottom-16 -left-12 text-slate-300 w-24 h-24 hidden md:block transform scale-x-[-1]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M7 7l10 10" />
            <path d="M17 7v10H7" />
          </svg>
        </div>
        <div className="w-full md:w-1/2 text-left md:text-right">
          <h4 className="text-2xl font-bold text-blue-900">DKM Al Ghifari Mosque IPB</h4>
          <p className="text-blue-600 font-semibold mb-3">Aug 2023 - Aug 2024</p>
          <p className="text-slate-600 leading-relaxed bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
            Led a team of 10 members in organizing major events like Ramadan and Eid al-Adha, including managing recruitment to serve 1,000+ congregants.
          </p>
        </div>
      </div>

      {/* Timeline Item 3: LDK Al Ghifari (Kiri Gambar, Kanan Teks) */}
      <div className="flex flex-col md:flex-row items-center gap-10 group">
        <div className="w-full md:w-1/2 flex justify-center md:justify-end relative">
          <div className="relative w-72 h-52">
            <div className="w-full h-full bg-gray-200 rounded-xl shadow-lg transform -rotate-2 group-hover:rotate-0 transition duration-300 border-4 border-white overflow-hidden z-10">
              <img src="/assets/ldk-activity.jpg" alt="LDK Activity" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -top-4 -left-4 bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-xs font-bold border border-purple-200 z-20 shadow-sm -rotate-6 whitespace-nowrap">
              Head of Islamic Program Departement
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 text-left">
          <h4 className="text-2xl font-bold text-blue-900">LDK Al Ghifari IPB</h4>
          <p className="text-blue-600 font-semibold mb-3">Feb 2023 - Nov 2023</p>
          <p className="text-slate-600 leading-relaxed bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
            Formulated strategic spiritual development programs for students, overseeing flagship initiatives like 'Al-Ghifari Mengaji' and daily educational content.
          </p>
        </div>
      </div>
    </div>
  );
};

const About = () => {
  return (
    <section className="bg-slate-50 min-h-screen py-20 px-4 overflow-hidden" id="about">
      <AcademicSection />
      <LeadershipSection />
    </section>
  );
};

export default About;