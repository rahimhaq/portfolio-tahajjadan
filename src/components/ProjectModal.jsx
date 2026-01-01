import React, { useEffect } from 'react';
import { X, Github, ExternalLink, Image as ImageIcon } from 'lucide-react';

const ProjectModal = ({ project, onClose }) => {
  if (!project) return null;

  // Tutup modal jika tombol ESC ditekan
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose} // Klik luar untuk tutup
    >
      <div 
        className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col md:flex-row overflow-hidden" 
        onClick={e => e.stopPropagation()} // Supaya klik dalam tidak menutup modal
      >
        
        {/* Tombol Close Mobile */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-red-100 text-gray-600 hover:text-red-600 rounded-full transition z-50 md:hidden backdrop-blur-sm shadow-sm"
        >
          <X size={20} />
        </button>

        {/* --- BAGIAN KIRI: GAMBAR UTAMA & GALLERY --- */}
        <div className="w-full md:w-1/2 bg-gray-100 flex flex-col">
          {/* Gambar Utama (Cover) */}
          <div className="w-full h-64 md:h-[50%] relative bg-gray-200">
             <img 
               src={project.image} 
               alt={project.title} 
               className="w-full h-full object-cover" 
             />
          </div>

          {/* Gallery Grid (Scrollable) */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 border-t min-h-[200px]">
            <h4 className="text-sm font-bold text-gray-500 mb-3 flex items-center gap-2">
              <ImageIcon size={16}/> Gallery Project
            </h4>
            
            {project.gallery && project.gallery.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                 {project.gallery.map((img, idx) => (
                   <img 
                     key={idx} 
                     src={img} 
                     alt={`Gallery ${idx}`} 
                     className="w-full h-32 object-cover rounded-lg border hover:scale-105 transition cursor-pointer bg-white"
                     onClick={() => window.open(img, '_blank')} // Klik untuk buka tab baru (zoom)
                   />
                 ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm italic py-8 border-2 border-dashed border-gray-200 rounded-lg">
                <ImageIcon size={32} className="mb-2 opacity-50"/>
                Tidak ada gambar tambahan.
              </div>
            )}
          </div>
        </div>

        {/* --- BAGIAN KANAN: DETAIL INFO --- */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col h-full overflow-y-auto bg-white">
          
          <div className="flex justify-between items-start mb-4">
             <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{project.title}</h2>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full border border-blue-100">
                      {t}
                    </span>
                  ))}
                </div>
             </div>
             {/* Tombol Close Desktop */}
             <button onClick={onClose} className="hidden md:block p-2 hover:bg-gray-100 rounded-full transition text-gray-400 hover:text-gray-800">
               <X size={24} />
             </button>
          </div>

          <div className="prose prose-sm text-gray-600 mb-8 leading-relaxed whitespace-pre-line flex-grow">
            {project.desc}
          </div>

          {/* Footer Buttons */}
          <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
             {project.link ? (
               <a 
                 href={project.link} 
                 target="_blank" 
                 rel="noreferrer" 
                 className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold transition shadow-lg shadow-blue-200"
               >
                 <ExternalLink size={18} /> Kunjungi Website
               </a>
             ) : (
                <button disabled className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-400 rounded-xl font-semibold cursor-not-allowed">
                  <ExternalLink size={18} /> Website N/A
                </button>
             )}

             {project.github && (
               <a 
                 href={project.github} 
                 target="_blank" 
                 rel="noreferrer" 
                 className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 font-semibold transition shadow-lg shadow-gray-200"
               >
                 <Github size={18} /> Source Code
               </a>
             )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProjectModal;