import blackmichiestudio from "../../public/blackmichiestudio.png";
import dota2proencounters from "../../public/dota2proencounters.png";
import pcbuilder from "../../public/pcbuilder.png";
import dracingpro from "../assets/taller-monopiston.png";

export const projects = [
  {
    title: "Taller Mono Pistón",
    image: dracingpro,
    link: "https://github.com/FranciscoDastres/DRacingPro",
    preview: "https://d-racing-pro-frontend.vercel.app",
    status: "En desarrollo",
    description:
      "Plataforma de gestión de citas para un taller especializado en Honda NAVI, con autenticación Google OAuth y panel de administración.",
    technologies: ["React TS", "NestJS", "PostgreSQL", "Docker"],
  },
  {
    title: "StompTracker",
    image: dota2proencounters,
    link: "https://github.com/FranciscoDastres/dota2-pro-encounters",
    preview: "https://dota-2-pro-encounters-v2-frontend.vercel.app/",
    status: "Pre producción · Próxima producción",
    description:
      "Consume la API de Dota 2 para detectar si alguna vez jugaste contra un jugador profesional.",
    technologies: ["Node TS", "React TS", "PostgreSQL"],
  },
  {
    title: "Black Michi Estudio",
    image: blackmichiestudio,
    link: "https://github.com/FranciscoDastres/blackMichiEstudioPreProd",
    preview: "https://black-michi-estudio-pre-prod.vercel.app/",
    status: "En desarrollo etapa de producción",
    description:
      "E-commerce con inventario, carrito de compras, roles de administrador y usuarios, e integración con Google.",
    technologies: ["React TS", "Node TS", "PostgreSQL"],
  },
  {
    title: "PC Builder",
    image: pcbuilder,
    link: "https://github.com/FranciscoDastres/pc_builder_proyect",
    preview: "https://pc-builder-proyect.vercel.app",
    status: "Demo MVP funcional",
    description:
      "Aplicación para armar una PC virtual: catálogo de componentes, validación de compatibilidad y resumen de build con precios y stock.",
    technologies: ["React TS", "Vite", "Tailwind CSS"],
  },
];
