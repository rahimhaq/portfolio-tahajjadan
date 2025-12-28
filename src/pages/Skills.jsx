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

const Skills = () => {
  return (
    <section id="skills" className="py-24">
      {/* Title */}
      <h2 className="text-3xl font-bold text-center mb-16">
        Technical Skills
      </h2>

      <div className="max-w-6xl mx-auto">
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
