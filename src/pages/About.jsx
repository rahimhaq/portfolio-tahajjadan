// src/pages/About.jsx
import React from 'react';
import { GraduationCap, Award, ArrowDownRight, ArrowRight } from 'lucide-react';

const About = () => {
  return (
    <section className="bg-slate-50 min-h-screen py-20 px-4 overflow-hidden" id="about">
      
      {/* --- BAGIAN 1: PENDIDIKAN (HERO SECTION) --- */}
      <div className="max-w-6xl mx-auto mb-32 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Kolom Teks Pendidikan */}
          <div className="order-2 md:order-1 space-y-6 relative z-10">
            <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold tracking-wide uppercase">
              Academic Background
            </span>
            
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 leading-tight">
              Bachelor of Applied <br/>
              <span className="text-blue-600">Computer Engineering Technology</span>
            </h2>
            
            <div className="flex items-center gap-4 text-lg text-slate-600 bg-white p-4 rounded-xl shadow-sm border border-slate-100 inline-block">
              <GraduationCap className="text-blue-600 w-8 h-8" />
              <div>
                <p className="font-bold text-slate-800">IPB University (2021 - 2025)</p>
                <p className="text-sm text-slate-500">GPA 3.59 / 4.00</p>
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed text-lg">
              Focused on the convergence of Software, Networking, and Hardware. 
              Certified Network Administrator (BNSP) with research experience intern in Satellite Technology Research Center (BRIN).
            </p>
            
            {/* Dekorasi Panah Menunjuk ke Bawah (SVG Hand-drawn style) */}
            <div className="hidden md:block absolute -bottom-32 right-10 text-slate-300 rotate-12">
               <svg width="100" height="120" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 10 C 60 10, 80 50, 60 100" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="8,8" />
                  <path d="M50 90 L 60 100 L 75 90" stroke="currentColor" strokeWidth="3" fill="none" />
                  <text x="0" y="60" className="text-sm fill-current font-handwriting rotate-[-10deg]" style={{fontSize: '14px'}}>My Journey</text>
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
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 text-center hover:-translate-y-1 transition">
                <p className="font-bold text-slate-800">Network Administrator</p>
                <p className="text-xs text-slate-500 mt-1">BNSP (2025-2028)</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 text-center hover:-translate-y-1 transition">
                <p className="font-bold text-slate-800">CyberSAFE</p>
                <p className="text-xs text-slate-500 mt-1">CertNexus (2024)</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 text-center hover:-translate-y-1 transition">
                <p className="font-bold text-slate-800">Cyber Security</p>
                <p className="text-xs text-slate-500 mt-1">Bisa AI Academy (2024)</p>
            </div>
        </div>
      </div>

    </section>
  );
};

export default About;