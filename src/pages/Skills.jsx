import {
  Cpu,
  Code,
  LayoutTemplate,
  Timer,
  Code2,
  Atom,
  Server,
  Database,
  Braces,
  Award,
  ExternalLink,
} from "lucide-react";

const SkillItem = ({ icon: Icon, name }) => (
  <div className="p-4 text-center transition-transform hover:scale-105">
    <Icon
      className="w-12 h-12 mx-auto mb-3 text-slate-500"
      strokeWidth={1.5}
    />
    <p className="text-sm font-medium text-gray-800">{name}</p>
  </div>
);

export const CertificationsSection = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h3 className="text-center text-xl font-bold text-slate-700 mb-8 flex items-center justify-center gap-2">
        <Award className="text-blue-500" /> Certifications & Competencies
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a
          href="/certificates/Network_Administrator_BNSP.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 text-center hover:-translate-y-1 hover:border-blue-400 hover:shadow-md transition flex flex-col justify-center min-h-[110px] cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-1.5 right-1.5 text-slate-300 group-hover:text-blue-500 transition-colors">
            <ExternalLink size={12} />
          </div>
          <p className="font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">Network Administrator</p>
          <p className="text-xs text-slate-500 mt-1">BNSP (2025-2028)</p>
          <span className="text-[10px] text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity mt-1 font-semibold">View Certificate →</span>
        </a>

        <a
          // href="/certificates/Embedded_System_BNSP.pdf" 
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 text-center hover:-translate-y-1 hover:border-blue-400 hover:shadow-md transition flex flex-col justify-center min-h-[110px] cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-1.5 right-1.5 text-slate-300 group-hover:text-blue-500 transition-colors">
            <ExternalLink size={12} />
          </div>
          <p className="font-bold text-slate-800 leading-tight py-1 group-hover:text-blue-600 transition-colors">Embedded System Programming Based IoT</p>
          <p className="text-xs text-slate-500 mt-1">BNSP (2026-2029)</p>
          <span className="text-[10px] text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity mt-1 font-semibold">View Certificate →</span>
        </a>

        <a
          href="/certificates/Cyber_Security_BisaAI.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 text-center hover:-translate-y-1 hover:border-blue-400 hover:shadow-md transition flex flex-col justify-center min-h-[110px] cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-1.5 right-1.5 text-slate-300 group-hover:text-blue-500 transition-colors">
            <ExternalLink size={12} />
          </div>
          <p className="font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">Cyber Security</p>
          <p className="text-xs text-slate-500 mt-1">Bisa AI Academy (2024)</p>
          <span className="text-[10px] text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity mt-1 font-semibold">View Certificate →</span>
        </a>
      </div>
    </div>
  );
};

const Skills = () => {
  return (
    <section id="skills" className="py-24">
      {/* Title */}
      <h2 className="text-3xl font-bold text-center mb-16">
        Technical Skills
      </h2>

      <div className="max-w-6xl mx-auto">
        {/* Certifications & Competencies */}
        <div className="mb-20">
          <CertificationsSection />
        </div>
        {/* Embedded Systems */}
        <div className="mb-20">
          <h3 className="text-xl font-semibold text-blue-600 mb-12 text-center">
            Embedded Systems & IoT
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12">
            <SkillItem icon={Cpu} name="STM32" />
            <SkillItem icon={Cpu} name="ESP32" />
            <SkillItem icon={Cpu} name="Arduino" />
            <SkillItem icon={Code} name="C/C++" />
            <SkillItem icon={LayoutTemplate} name="PCB Design" />
            <SkillItem icon={Timer} name="FreeRTOS" />
          </div>
        </div>

        {/* Full Stack Web */}
        <div>
          <h3 className="text-xl font-semibold text-blue-600 mb-12 text-center">
            Full-Stack Web Development
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12">
            <SkillItem icon={Code2} name="JavaScript" />
            <SkillItem icon={Atom} name="React" />
            <SkillItem icon={Server} name="Node.js" />
            <SkillItem icon={Database} name="MongoDB" />
            <SkillItem icon={Database} name="MySQL" />
            <SkillItem icon={Braces} name="REST API" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
