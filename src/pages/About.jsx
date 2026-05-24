// src/pages/About.jsx
import React, { useState, useEffect } from 'react';
import { GraduationCap, Award, ArrowDownRight, ArrowRight, Briefcase, Calendar, MapPin, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
  const [experiences, setExperiences] = useState([]);
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
  }, []);

  return (
    <section className="bg-slate-50 min-h-screen py-20 px-4 overflow-hidden" id="about">

      {/* --- BAGIAN 1: PENDIDIKAN (HERO SECTION) --- */}
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
                src="/assets/foto-wisuda.jpg"  // GANTI: Pastikan ada foto ini
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

      {/* --- BAGIAN 1.5: PROFESSIONAL WORK EXPERIENCE (DYNAMIC) --- */}
      {experiences.length > 0 && (
        <div className="max-w-5xl mx-auto mb-32 relative px-4">
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
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-350 rounded-full -mr-8 -mt-8"></div>

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
                            <span className="inline-flex items-center gap-1 text-xs text-slate-450">
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

                  <p className="text-slate-600 leading-relaxed text-sm mb-5 whitespace-pre-line border-l-2 border-slate-100 pl-3">
                    {exp.desc}
                  </p>

                  {/* Skills Pills */}
                  {exp.skills && exp.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-50">
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
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* --- BAGIAN 2: PENGALAMAN ORGANISASI (ALUR CERITA) --- */}
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
            <div className="w-72 h-52 bg-gray-200 rounded-xl shadow-lg transform -rotate-2 group-hover:rotate-0 transition duration-300 border-4 border-white overflow-hidden relative z-10">
              <img src="/assets/acc-ipb.jpg" alt="ACC Activity" className="w-full h-full object-cover" /> {/* GANTI FOTO */}
            </div>
            {/* Sticker Effect */}
            <div className="absolute -top-4 -right-4 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold border border-yellow-200 z-20 shadow-sm rotate-1">
              Staff - Membership & Social Media
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
            <div className="w-72 h-52 bg-gray-200 rounded-xl shadow-lg transform rotate-3 group-hover:rotate-0 transition duration-300 border-4 border-white overflow-hidden relative z-10">
              <img src="/assets/dkm-ghifari.jpg" alt="DKM Activity" className="w-full h-full object-cover" /> {/* GANTI FOTO */}
            </div>
            <div className="absolute -bottom-4 -left-4 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200 z-20 shadow-sm -rotate-6">
              Head of Takmir
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
            <div className="w-72 h-52 bg-gray-200 rounded-xl shadow-lg transform -rotate-2 group-hover:rotate-0 transition duration-300 border-4 border-white overflow-hidden z-10">
              <img src="/assets/ldk-activity.jpg" alt="LDK Activity" className="w-full h-full object-cover" /> {/* GANTI FOTO */}
            </div>
            <div className="absolute -top-5 left-22 bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-xs font-bold border border-purple-200 z-20 shadow-sm -rotate-10">
              Head of Islamic Program Departement
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

      {/* --- BAGIAN 3: SERTIFIKASI (GRID BAWAH) --- */}
      <div className="max-w-4xl mx-auto mt-32">
        <h3 className="text-center text-xl font-bold text-slate-700 mb-8 flex items-center justify-center gap-2">
          <Award className="text-blue-500" /> Certifications & Competencies
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a
            href="/certificates/Network_Administrator_BNSP.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 text-center hover:-translate-y-1 hover:border-blue-400 hover:shadow-md transition flex flex-col justify-center min-h-[110px] cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute top-1.5 right-1.5 text-slate-300 group-hover:text-blue-500 transition-colors">
              <ExternalLink size={12} />
            </div>
            <p className="font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">Network Administrator</p>
            <p className="text-xs text-slate-500 mt-1">BNSP (2025-2028)</p>
            <span className="text-[10px] text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity mt-1 font-semibold">View Certificate →</span>
          </a>

          <a
            // href="/certificates/Embedded_System_BNSP.pdf" 
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 text-center hover:-translate-y-1 hover:border-blue-400 hover:shadow-md transition flex flex-col justify-center min-h-[110px] cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute top-1.5 right-1.5 text-slate-300 group-hover:text-blue-500 transition-colors">
              <ExternalLink size={12} />
            </div>
            <p className="font-bold text-slate-800 leading-tight py-1 group-hover:text-blue-600 transition-colors">Embedded System Programming Based IoT</p>
            <p className="text-xs text-slate-500 mt-1">BNSP (2026-2029)</p>
            <span className="text-[10px] text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity mt-1 font-semibold">View Certificate →</span>
          </a>

          <a
            href="/certificates/Cyber_Security_BisaAI.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 text-center hover:-translate-y-1 hover:border-blue-400 hover:shadow-md transition flex flex-col justify-center min-h-[110px] cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute top-1.5 right-1.5 text-slate-300 group-hover:text-blue-500 transition-colors">
              <ExternalLink size={12} />
            </div>
            <p className="font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">Cyber Security</p>
            <p className="text-xs text-slate-500 mt-1">Bisa AI Academy (2024)</p>
            <span className="text-[10px] text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity mt-1 font-semibold">View Certificate →</span>
          </a>
        </div>
      </div>

    </section>
  );
};

export default About;