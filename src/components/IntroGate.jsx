import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, User } from "lucide-react";

const IntroGate = ({ onComplete }) => {
  const [name, setName] = useState("");
  // State: 0 = Bot Nanya, 2 = Salam & Selesai
  const [step, setStep] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      setStep(2); // Pindah ke tahap salam
      
      // Tunggu 2 detik lalu buka gerbang
      setTimeout(() => {
        onComplete(name);
      }, 2000);
    }
  };

  return (
    // Z-INDEX ditingkatkan ke 100 agar menutupi Navbar (z-50)
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-50/95 backdrop-blur-sm px-4">
      
      {/* Container: w-full tapi dibatasi max-w-md, responsif di HP */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-blue-100 overflow-hidden"
      >
        
        {/* Header Chat */}
        <div className="bg-blue-600 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-inner">
            <span className="font-bold text-lg">T</span>
          </div>
          <div>
            <h3 className="font-bold text-white leading-tight">Rahim Haq</h3>
            <p className="text-xs text-blue-100/80">Bot</p>
          </div>
        </div>

        <div className="p-6">
          {/* Area Percakapan */}
          <div className="space-y-4 min-h-[140px]">
            
            {/* Pesan Bot Pertama */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-3"
            >
              <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-gray-100 text-gray-700 text-sm shadow-sm">
                Hello! Before entering, may I know your name?
              </div>
            </motion.div>

            {/* Pesan User (Muncul setelah submit) */}
            {step >= 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-3 justify-end"
              >
                <div className="px-4 py-3 rounded-2xl rounded-tr-none bg-blue-600 text-white text-sm shadow-md">
                  {name}
                </div>
              </motion.div>
            )}

            {/* Respon Terakhir Bot */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }} // Delay sedikit agar terasa natural
                className="flex gap-3"
              >
                <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-gray-100 text-gray-700 text-sm shadow-sm">
                  Pleased to know you, <span className="font-bold text-blue-600">{name}</span>! Please come in... 
                </div>
              </motion.div>
            )}
          </div>

          {/* Input Form */}
          {step < 2 && (
            <motion.form 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onSubmit={handleSubmit} 
              className="mt-6 flex gap-2 items-center"
            >
              <div className="relative flex-1 group">
                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Type your name ..."
                  // text-base mencegah auto-zoom di iPhone
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-base text-gray-800 placeholder:text-gray-400"
                  autoFocus
                  required
                />
              </div>
              <button
                type="submit"
                disabled={!name.trim()}
                className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95"
              >
                <Send size={20} />
              </button>
            </motion.form>
          )}
        </div>
        
        {/* Footer decoration */}
        <div className="h-1 w-full bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400"></div>
      </motion.div>
    </div>
  );
};

export default IntroGate;