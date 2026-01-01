import React, { useEffect } from 'react';
import { X, Github, ExternalLink, Image as ImageIcon } from 'lucide-react';

const ProjectModal = ({ project, onClose }) => {
  if (!project) return null;

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col md:flex-row animate-scaleIn" 
        onClick={e => e.stopPropagation()}
      >
        
        {/* Tombol Close Mobile (Floating) */}
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 p-2 bg-black/50 text-white rounded-full backdrop-blur-md z-50 md:hidden active:scale-90 transition"
        >
          <X size={20} />
        </button>

        {/* --- BAGIAN 1: GAMBAR & GALLERY (Atas di HP, Kiri di Desktop) --- */}
        <div className="w-full md:w-1/2 bg-gray-100 flex flex-col h-[40vh] md:h-auto overflow-hidden">
          {/* Gambar Utama */}
          <div className="w-full h-full md:h-[60%] relative bg-gray-200">
             <img 
               src={project.image} 
               alt={project.title} 
               className="w-full h-full object-cover" 
             />
          </div>

          {/* Gallery Grid (Hanya scrollable di desktop bagian bawah kiri) */}
          <div className="hidden md:block flex-1 p-4 overflow-y-auto bg-gray-50 border-t min-h-[200px]">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <ImageIcon size={14}/> Gallery ({project.gallery?.length || 0})
            </h4>
            
            {project.gallery && project.gallery.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                 {project.gallery.map((img, idx) => (
                   <img 
                     key={idx} 
                     src={img} 
                     alt={`Gallery ${idx}`} 
                     className="w-full h-24 object-cover rounded-lg border hover:opacity-80 transition cursor-pointer bg-white"
                     onClick={() => window.open(img, '_blank')}
                   />
                 ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm italic py-4 border-2 border-dashed border-gray-200 rounded-lg bg-white/50">
                <span className="text-xs">No extra images</span>
              </div>
            )}
          </div>
        </div>

        {/* --- BAGIAN 2: DETAIL INFO (Bawah di HP, Kanan di Desktop) --- */}
        <div className="w-full md:w-1/2 flex flex-col h-[60vh] md:h-auto bg-white">
            
            {/* Header Modal */}
            <div className="p-6 md:p-8 pb-0 flex justify-between items-start">
               <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 leading-tight">{project.title}</h2>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.tech.map((t, i) => (
                      <span key={i} className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] md:text-xs font-bold uppercase tracking-wide rounded-md border border-blue-100">
                        {t}
                      </span>
                    ))}
                  </div>
               </div>
               {/* Close Button Desktop */}
               <button onClick={onClose} className="hidden md:block p-2 -mr-2 -mt-2 hover:bg-gray-100 rounded-full transition text-gray-400 hover:text-gray-800">
                 <X size={24} />
               </button>
            </div>

            {/* Content Scrollable */}
            <div className="p-6 md:p-8 flex-1 overflow-y-auto">
              <div className="prose prose-sm md:prose-base text-gray-600 leading-relaxed whitespace-pre-line">
                {project.desc}
              </div>

              {/* Mobile Gallery (Muncul di bawah teks hanya di HP) */}
              <div className="md:hidden mt-8 pt-6 border-t border-gray-100">
                  <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <ImageIcon size={16}/> Gallery
                  </h4>
                  {project.gallery && project.gallery.length > 0 ? (
                    <div className="flex gap-3 overflow-x-auto pb-4 snap-x">
                      {project.gallery.map((img, idx) => (
                        <img 
                          key={idx} 
                          src={img} 
                          alt="Gallery" 
                          className="w-40 h-28 object-cover rounded-lg border flex-shrink-0 snap-center"
                          onClick={() => window.open(img, '_blank')}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic">Tidak ada gambar tambahan.</p>
                  )}
              </div>
            </div>

            {/* Footer Buttons (Sticky Bottom) */}
            <div className="p-4 md:p-6 border-t border-gray-100 bg-gray-50 md:bg-white flex gap-3 z-10">
               {project.link ? (
                 <a 
                   href={project.link} 
                   target="_blank" 
                   rel="noreferrer" 
                   className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold transition shadow-lg shadow-blue-200 text-sm md:text-base"
                 >
                   <ExternalLink size={18} /> <span className="hidden sm:inline">Kunjungi</span> Website
                 </a>
               ) : (
                  <button disabled className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 text-gray-400 rounded-xl font-semibold cursor-not-allowed text-sm md:text-base">
                    Website N/A
                  </button>
               )}

               {project.github && (
                 <a 
                   href={project.github} 
                   target="_blank" 
                   rel="noreferrer" 
                   className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 font-semibold transition shadow-lg shadow-gray-200 text-sm md:text-base"
                 >
                   <Github size={18} /> <span className="hidden sm:inline">Source</span> Code
                 </a>
               )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default ProjectModal;