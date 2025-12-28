import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IntroGate from './components/IntroGate';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // Import Footer
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Skills from './pages/Skills';
import Contact from './pages/Contact';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';

function App() {
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const [visitorName, setVisitorName] = useState('');

  useEffect(() => {
    const savedName = sessionStorage.getItem('visitorName');
    if (savedName) {
      setVisitorName(savedName);
      setIsIntroComplete(true);
    }
  }, []);

  const handleIntroComplete = (name) => {
    setVisitorName(name);
    setIsIntroComplete(true);
    sessionStorage.setItem('visitorName', name);
  };

  if (!isIntroComplete) {
    return <IntroGate onComplete={handleIntroComplete} />;
  }

  return (
    <Router>
      <div className="min-h-screen font-sans  flex flex-col">
        {/* Navbar */}
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home visitorName={visitorName} />} />
            <Route path="/about" element={<div className="pt-16"><About /></div>} />
            <Route path="/projects" element={<div className="pt-16"><Projects /></div>} />
            <Route path="/skills" element={<div className="pt-16"><Skills /></div>} />
            <Route path="/contact" element={<div className="pt-16"><Contact /></div>} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
          </Routes>
        </main>

        {/* Gunakan Komponen Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;