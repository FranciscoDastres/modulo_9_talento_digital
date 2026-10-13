import { useState } from "react";

const CategoryIcons = {
  "Desarrollo de Software": (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-6 h-6 text-[var(--sec)] opacity-70"
    >
      <path d="M21 3C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H21ZM20 11H4V19H20V11ZM20 5H4V9H20V5ZM11 6V8H9V6H11ZM7 6V8H5V6H7Z"></path>
    </svg>
  ),
  "Cloud y DevOps (AWS)": (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-6 h-6 text-[var(--sec)] opacity-70"
    >
      {/* Cloud */}
      <path d="M18.5 10.5C18.16 8.07 16.09 6.25 13.5 6.25C11.42 6.25 9.61 7.47 8.78 9.25C6.7 9.44 5 11.19 5 13.31C5 15.56 6.81 17.38 9.06 17.38H18.25C20.04 17.38 21.5 15.92 21.5 14.13C21.5 12.43 20.22 11.03 18.5 10.5Z" />

      {/* Arrow up (deploy) */}
      <path d="M12 10.75C11.59 10.75 11.25 11.09 11.25 11.5V14.25H10.3C9.89 14.25 9.68 14.74 9.97 15.03L11.67 16.73C11.87 16.93 12.19 16.93 12.39 16.73L14.09 15.03C14.38 14.74 14.17 14.25 13.76 14.25H12.75V11.5C12.75 11.09 12.41 10.75 12 10.75Z" />
    </svg>
  ),
};

const SkillsList = () => {
  const [openItem, setOpenItem] = useState<string | null>(
    "Desarrollo de Software",
  );

  const skills = {
    "Desarrollo de Software": [
      "Desarrollo de aplicaciones web Full Stack",
      "Desarrollo de Single Page Applications (SPAs)",
      "Diseño e implementación de APIs REST",
      "Integración y modelado de bases de datos relacionales",
      "Arquitectura frontend y backend",
      "Optimización de rendimiento y buenas prácticas",
      "Control de versiones con Git",
      "Integración de servicios en la nube (AWS)",
      "Despliegue y configuración de aplicaciones web"
    ]
    , "Cloud y DevOps (AWS)": [
      "Despliegue de aplicaciones en la nube",
      "Configuración de servicios básicos en AWS (EC2, S3, RDS, IAM)",
      "Gestión de identidades y permisos (IAM)",
      "Arquitectura básica en la nube",
      "Automatización de despliegues",
      "Monitoreo básico de servicios"
    ]
  };

  const toggleItem = (item: string) => {
    setOpenItem(openItem === item ? null : item);
  };

  return (
    <div className="text-left pt-3 md:pt-9">
      <h3 className="text-[var(--white)] text-3xl md:text-4xl font-semibold md:mb-6">
        A qué me dedico?
      </h3>
      <ul className="space-y-4 mt-4 text-lg">
        {Object.entries(skills).map(([category, items]) => (
          <li key={category} className="w-full">
            <div
              onClick={() => toggleItem(category)}
              className="md:w-[400px] w-full bg-[#1414149c] rounded-2xl text-left hover:bg-opacity-80 transition-all border border-[var(--white-icon-tr)] cursor-pointer overflow-hidden"
            >
              <div className="flex items-center gap-3 p-4">
                {CategoryIcons[category]}
                <div className="flex items-center gap-2 flex-grow justify-between">
                  <div className="min-w-0 max-w-[200px] md:max-w-none overflow-hidden">
                    <span className="block truncate text-[var(--white)] text-lg">
                      {category}
                    </span>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={`w-6 h-6 text-[var(--white)] transform transition-transform flex-shrink-0 ${openItem === category ? "rotate-180" : ""
                      }`}
                  >
                    <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z"></path>
                  </svg>
                </div>
              </div>

              <div
                className={`transition-all duration-300 px-4 ${openItem === category
                  ? "max-h-[500px] pb-4 opacity-100"
                  : "max-h-0 opacity-0"
                  }`}
              >
                <ul className="space-y-2 text-[var(--white-icon)] text-sm">
                  {items.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="pl-1">•</span>
                      <span className="pl-3">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SkillsList;
