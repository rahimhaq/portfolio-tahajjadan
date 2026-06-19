import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

const Login = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (password) {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const res = await fetch(`${API_URL}/api/admin/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ adminKey: password }),
        });
        const data = await res.json();

        if (res.ok && data.success) {
          // Simpan password sementara di browser
          sessionStorage.setItem('adminKey', password);
          // Pindah ke Dashboard
          navigate('/admin/dashboard');
        } else {
          alert(data.error || "Password salah!");
        }
      } catch (error) {
        alert("Gagal terhubung ke backend server!");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full border border-blue-50">
        <div className="flex justify-center mb-6">
          <img src="/Tahajjadan.png" alt="Logo" className="h-16 w-auto" onError={(e) => e.target.style.display = 'none'} />
        </div>
        {/* <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Rahimhaq</h2> */}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1"></label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
              placeholder="Input admin password ..."
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition text-sm"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;