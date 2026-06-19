import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, User, Briefcase, UserCheck, Eye, Sparkles, MessageSquare } from "lucide-react";

const IntroGate = ({ onComplete }) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [target, setTarget] = useState("");
  const [step, setStep] = useState(0); // 0: Name, 1: Role, 2: Target, 3: Final redirect

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      setStep(1);
    }
  };

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleTargetSelect = async (selectedTarget, path) => {
    setTarget(selectedTarget);
    setStep(3);

    // Kirim data lengkap ke database
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      await fetch(`${API_URL}/api/visitors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          role: role,
          target: selectedTarget,
        }),
      });
    } catch (error) {
      console.error("Gagal mencatat nama pengunjung:", error);
    }

    // Delay 2 detik agar pesan greeting terakhir terbaca
    setTimeout(() => {
      onComplete(name, path);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-50/95 backdrop-blur-sm px-4">
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
            <p className="text-xs text-blue-100/80">Interactive Assistant</p>
          </div>
        </div>

        {/* Area Percakapan */}
        <div className="p-6">
          <div className="space-y-4 min-h-[220px] max-h-[350px] overflow-y-auto pr-1">

            {/* Bubble 1: Tanya Nama */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-3"
            >
              <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-gray-100 text-gray-700 text-sm shadow-sm">
                Hello! Before entering, may I know your name?
              </div>
            </motion.div>

            {/* Bubble 2: Jawab Nama */}
            {step >= 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-3 justify-end"
              >
                <div className="px-4 py-3 rounded-2xl rounded-tr-none bg-blue-600 text-white text-sm shadow-md font-medium">
                  {name}
                </div>
              </motion.div>
            )}

            {/* Bubble 3: Tanya Status (HR / User) */}
            {step >= 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex gap-3"
              >
                <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-gray-100 text-gray-700 text-sm shadow-sm">
                  Pleased to know you, <span className="font-semibold text-blue-600">{name}</span>! Are you visiting as an HR/Recruiter or a regular visitor?
                </div>
              </motion.div>
            )}

            {/* Bubble 4: Jawab Status */}
            {step >= 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-3 justify-end"
              >
                <div className="px-4 py-3 rounded-2xl rounded-tr-none bg-blue-600 text-white text-sm shadow-md font-medium">
                  {role}
                </div>
              </motion.div>
            )}

            {/* Bubble 5: Tanya Halaman Penjelajahan */}
            {step >= 2 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex gap-3"
              >
                <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-gray-100 text-gray-700 text-sm shadow-sm">
                  {role === "HR / Recruiter" ? (
                    <span>Awesome! Which page would you like to visit first? I can redirect you straight to my <strong>Experience & Resume</strong> page or the <strong>Entire Website</strong>.</span>
                  ) : (
                    <span>Welcome! What would you like to see or explore first on my portfolio website?</span>
                  )}
                </div>
              </motion.div>
            )}

            {/* Bubble 6: Jawab Target */}
            {step >= 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-3 justify-end"
              >
                <div className="px-4 py-3 rounded-2xl rounded-tr-none bg-blue-600 text-white text-sm shadow-md font-medium">
                  {target}
                </div>
              </motion.div>
            )}

            {/* Bubble 7: Greeting Final */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex gap-3"
              >
                <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-gray-100 text-gray-700 text-sm shadow-sm">
                  Great choice! Please come in, redirecting you to your destination...
                </div>
              </motion.div>
            )}

          </div>

          {/* Area Interaksi Input / Pilihan */}
          <div className="mt-6 border-t border-gray-100 pt-4">

            {/* INPUT FORM NAMA (Step 0) */}
            {step === 0 && (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleNameSubmit}
                className="flex gap-2 items-center"
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
                    placeholder="Enter your name..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-base text-gray-800"
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

            {/* PILIHAN STATUS ROLE (Step 1) */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row gap-2.5"
              >
                <button
                  onClick={() => handleRoleSelect("HR / Recruiter")}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-orange-50 border border-orange-200 text-orange-700 hover:bg-orange-100 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-95"
                >
                  <Briefcase size={18} />
                  HR / Recruiter
                </button>
                <button
                  onClick={() => handleRoleSelect("Regular Visitor")}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-95"
                >
                  <UserCheck size={18} />
                  Regular Visitor
                </button>
              </motion.div>
            )}

            {/* PILIHAN TARGET PENJELAJAHAN (Step 2) */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-2"
              >
                {role === "HR / Recruiter" ? (
                  <>
                    <button
                      onClick={() => handleTargetSelect("Resume & Experience", "/experience")}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-orange-50 border border-orange-200 text-orange-700 hover:bg-orange-100 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-95 text-left"
                    >
                      <Briefcase size={18} className="shrink-0" />
                      Go straight to Work Experience & Resume
                    </button>
                    <button
                      onClick={() => handleTargetSelect("Entire website", "/")}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-95 text-left"
                    >
                      <Eye size={18} className="shrink-0" />
                      Explore Main Homepage (All Pages)
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleTargetSelect("Projects & Portfolio", "/experience")}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-95 text-left"
                    >
                      <Sparkles size={18} className="shrink-0" />
                      View My Projects & Portfolio
                    </button>
                    <button
                      onClick={() => handleTargetSelect("Contact Me", "/contact")}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-95 text-left"
                    >
                      <MessageSquare size={18} className="shrink-0" />
                      Get in Touch (Contact Directly)
                    </button>
                    <button
                      onClick={() => handleTargetSelect("Entire website", "/")}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-95 text-left"
                    >
                      <Eye size={18} className="shrink-0" />
                      Explore All Pages Starting from Homepage
                    </button>
                  </>
                )}
              </motion.div>
            )}

            {/* LOADING STATE PENDING REDIRECT (Step 3) */}
            {step === 3 && (
              <div className="flex justify-center py-2">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

          </div>
        </div>

        {/* Footer decoration */}
        <div className="h-1 w-full bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400"></div>
      </motion.div>
    </div>
  );
};

export default IntroGate;