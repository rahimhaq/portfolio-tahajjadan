import React, { useState, useEffect } from 'react';
import { ExternalLink, Github, Loader2, AlertCircle } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- AMBIL URL API DARI ENVIRONMENT VARIABLE ---
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // ✅ GUNAKAN API_URL
        const response = await fetch(`${API_URL}/api/projects`);
        
        if (!response.ok) {
          throw new Error('Gagal menghubungkan ke server.');
        }

        const data = await response.json();
        setProjects(data);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Gagal mengambil data project.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [API_URL]);

  if (loading) {
    return (
      <div className="pt-32 flex flex-col justify-center items-center min-h-[50vh] text-blue-600">
        <Loader2 className="animate-spin w-10 h-10 mb-4" />
        <p>Memuat Projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-32 flex flex-col justify-center items-center min-h-[50vh] text-red-500 px-4 text-center">
        <AlertCircle className="w-12 h-12 mb-4" />
        <p className="font-bold">Terjadi Kesalahan</p>
        <p className="text-sm mt-2">{error}</p>
        {/* Pesan bantuan hanya muncul jika di localhost (Development) */}
        {window.location.hostname === 'localhost' && (
             <p className="text-xs text-gray-500 mt-4 bg-gray-100 p-2 rounded">
               Dev Mode Tip: Pastikan server backend jalan di port 5000.
             </p>
        )}
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-blue-900">Featured Projects</h2>
        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
          Daftar portofolio ini diambil secara realtime dari Database Neon.
        </p>
      </div>

      {!loading && projects.length === 0 && (
        <div className="text-center py-20 bg-blue-50 rounded-xl border border-dashed border-blue-200">
          <p className="text-gray-500 text-lg">Belum ada project yang ditambahkan.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((item) => (
          <div 
            key={item.id} 
            className="bg-white rounded-xl overflow-hidden shadow-lg border border-blue-50 hover:shadow-2xl hover:shadow-blue-100 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
          >
            <div className="relative h-48 overflow-hidden bg-gray-100 group">
              <img 
                src={item.image} 
                alt={item.title}
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "https://placehold.co/600x400/e2e8f0/1e293b?text=No+Image"; 
                }} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1" title={item.title}>
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                {item.desc}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {item.tech && item.tech.length > 0 ? (
                  item.tech.map((t, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs rounded-full font-medium border border-blue-100">
                      {t}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400 italic">No tech listed</span>
                )}
              </div>

              <div className="flex gap-3 mt-auto pt-4 border-t border-gray-100">
                {item.link ? (
                  <a href={item.link} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium shadow-md shadow-blue-200">
                    <ExternalLink size={16} /> Live Demo
                  </a>
                ) : (
                  <button disabled className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed text-sm">
                    <ExternalLink size={16} /> Demo N/A
                  </button>
                )}
                
                {item.github && (
                   <a href={item.github} target="_blank" rel="noreferrer" className="flex items-center justify-center p-2.5 border border-gray-200 rounded-lg hover:bg-gray-800 hover:text-white hover:border-gray-800 text-gray-600 transition-all duration-300" title="View Code">
                    <Github size={18} />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;