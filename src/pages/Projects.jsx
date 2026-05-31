import React, { useState, useEffect } from 'react';
import { ExternalLink, Github, Loader2, AlertCircle } from 'lucide-react';
import ProjectModal from '../components/ProjectModal';
import { ExperienceSection } from './About';

const Projects = ({ isOnlyProjects = false }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // STATE UNTUK MODAL
  const [selectedProject, setSelectedProject] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchProjects = async () => {
      try {
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

  return (
    <div className={isOnlyProjects ? "" : "pt-12 pb-12 overflow-x-hidden"}>

      {/* 1. Work Experience Section */}
      {!isOnlyProjects && (
        <section className="py-8 bg-gradient-to-tr from-slate-50 via-blue-50/15 to-slate-50 border-y border-slate-100 relative mb-12 animate-fade-in">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none"></div>
          <ExperienceSection />
        </section>
      )}

      {/* 2. Featured Projects Section */}
      <section className={isOnlyProjects ? "max-w-7xl mx-auto px-4 md:px-8" : "max-w-7xl mx-auto px-4 md:px-8 py-8"}>
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold text-slate-800">Featured Projects</h3>
          <p className="text-gray-650 text-sm md:text-base mt-2">
            A showcase of the systems and products I have developed across various technology domains.
          </p>
        </div>

        {/* Inline Loading / Error / Grid rendering */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-16 text-blue-600">
            <Loader2 className="animate-spin w-8 h-8 mb-3" />
            <p className="text-sm font-semibold">Memuat Projects...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center py-12 text-red-500 text-center">
            <AlertCircle className="w-10 h-10 mb-3" />
            <p className="font-bold text-sm">Gagal memuat projects</p>
            <p className="text-xs mt-1 text-gray-500">{error}</p>
          </div>
        ) : (
          <>
            {/* Empty State */}
            {projects.length === 0 && (
              <div className="text-center py-20 bg-blue-50/40 rounded-2xl border-2 border-dashed border-blue-200 mx-auto max-w-lg">
                <p className="text-gray-500 font-medium">Belum ada project yang ditambahkan.</p>
              </div>
            )}

            {/* Grid System: 1 Kolom (HP) -> 2 Kolom (Tablet) -> 3 Kolom (Desktop) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 animate-fade-in">
              {projects.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedProject(item)}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-blue-100/50 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer group"
                >
                  {/* Image Container */}
                  <div className="relative h-48 sm:h-52 overflow-hidden bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/600x400/e2e8f0/1e293b?text=No+Image";
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>

                  {/* Content */}
                  <div className="p-5 md:p-6 flex flex-col flex-grow">
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-605 text-sm mb-4 line-clamp-3 flex-grow leading-relaxed">
                      {item.desc}
                    </p>

                    {/* Tech Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {item.tech?.slice(0, 3).map((t, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-50 text-gray-600 text-[10px] md:text-xs font-medium rounded-md border border-gray-200">
                          {t}
                        </span>
                      ))}
                      {item.tech?.length > 3 && (
                        <span className="text-[10px] text-gray-400 px-1 py-1">+{item.tech.length - 3}</span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-auto pt-4 border-t border-gray-100">
                      {item.link ? (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 flex items-center justify-center gap-2 py-2 bg-white border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition text-xs md:text-sm font-medium"
                        >
                          <ExternalLink size={14} /> Demo
                        </a>
                      ) : (
                        <button disabled className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-50 text-gray-300 border border-gray-100 rounded-lg cursor-not-allowed text-xs md:text-sm">
                          Demo N/A
                        </button>
                      )}

                      {item.github && (
                        <a
                          href={item.github}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center justify-center p-2 border border-gray-200 rounded-lg hover:bg-gray-800 hover:text-white hover:border-gray-800 text-gray-600 transition-all"
                          title="View Code"
                        >
                          <Github size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

    </div>
  );
};

export default Projects;