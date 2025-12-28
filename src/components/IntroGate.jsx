import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, User } from "lucide-react";

const IntroGate = ({ onComplete }) => {
  const [name, setName] = useState("");
  
  // State untuk tahapan percakapan (0: Bot nanya, 1: User jawab, 2: Salam kenal)
  const [step, setStep] = useState(0);
  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      setStep(2); // Pindah ke tahap salam
      // Tunggu 2 detik untuk membaca salam, lalu masuk ke portofolio
      setTimeout(() => {
        onComplete(name);
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-50/95 backdrop-blur-sm">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-xl border border-blue-100">
        {/* Header Chat */}
        <div className="flex items-center gap-3 mb-6 border-b border-blue-50 pb-4">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
            <span className="font-bold text-lg">T</span>
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Tahajjadan AI</h3>
            <p className="text-xs text-blue-500">Bot Asisten Pribadi</p>
          </div>
        </div>

        {/* Area Percakapan */}
        <div className="space-y-4 min-h-[150px]">
          {/* Pesan Bot Pertama */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="p-3 rounded-tr-xl rounded-bl-xl rounded-br-xl bg-blue-100 text-blue-900 text-sm">
              Halo! Sebelum masuk, boleh saya tahu siapa nama Anda?
            </div>
          </motion.div>

          {/* Pesan User (Muncul setelah submit) */}
          {step >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 justify-end"
            >
              <div className="p-3 rounded-tl-xl rounded-bl-xl rounded-br-xl bg-blue-600 text-white text-sm">
                {name}
              </div>
            </motion.div>
          )}

          {/* Respon Terakhir Bot */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }} // Muncul sedikit terlambat
              className="flex gap-3"
            >
              <div className="p-3 rounded-tr-xl rounded-bl-xl rounded-br-xl bg-blue-100 text-blue-900 text-sm">
                Senang berkenalan denganmu, {name}! Silakan masuk...
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Form (Hanya muncul jika belum selesai) */}
        {step < 2 && (
          <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
            <div className="relative flex-1">
              <User
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ketik nama Anda..."
                className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={!name.trim()}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Send size={18} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default IntroGate;