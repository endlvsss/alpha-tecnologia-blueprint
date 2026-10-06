import { workflow, PD } from "./common.mjs";

const W = 140;
workflow("3-uso-soporte", "Alpha · Tramo 3 — Onboarding, uso y soporte (etapas 13–16)", {
  phases: [
    { id: "e13", label: "13 · Onboarding", fromCol: 0, toCol: 0 },
    { id: "e14", label: "14 · Uso", fromCol: 1, toCol: 1 },
    { id: "e15", label: "15 · Soporte autoservicio", fromCol: 2, toCol: 3, variant: "emphasis" },
    { id: "e16", label: "16 · Monitoreo proactivo", fromCol: 4, toCol: 5, variant: "security" },
  ],
  mainPath: ["a_onb", "t_onb", "t_app", "p_funciones"],
  nodes: [
    { id: "k_aprende", lane: "cliente", col: 0, type: "external", icon: "person", label: "Aprende a usar", sublabel: "videos · guía en la app", width: W },
    { id: "k_usa", lane: "cliente", col: 1, type: "external", icon: "person", label: "Usa Alpha", sublabel: "mapa · recorridos · alertas", width: W },
    { id: "k_duda", lane: "cliente", col: 2, type: "external", icon: "person", label: "Tiene una duda", sublabel: "o un problema simple", width: W },
    { id: "k_informado", lane: "cliente", col: 5, type: "external", icon: "person", label: "Recibe aviso claro", sublabel: "qué pasó y qué hacer", width: W },

    { id: "t_onb", lane: "touch", col: 0, type: "frontend", label: "WhatsApp + email", sublabel: "bienvenida + tutoriales", width: W },
    { id: "t_app", lane: "touch", col: 1, type: "frontend", label: "Plataforma / app", sublabel: "ubicación en vivo", tag: "tour guiado", width: W },
    { id: "t_bot", lane: "touch", col: 2, type: "frontend", label: "Bot de soporte", sublabel: "web + plataforma", tag: "24/7", width: W },
    { id: "t_fin", lane: "touch", col: 3, type: "frontend", label: "Soporte cerrado", sublabel: "cliente resuelto", width: W },
    { id: "t_aviso", lane: "touch", col: 5, type: "frontend", label: "Aviso al cliente", sublabel: "WhatsApp · email · app", width: W },

    { id: "p_funciones", lane: "plataforma", col: 1, type: "backend", label: "Funciones", sublabel: "geocercas · sirena · corte*", width: W },
    { id: "p_kb", lane: "plataforma", col: 2, type: "backend", label: "Base de conocimiento", sublabel: "FAQ · guías · soluciones", width: W },
    { id: "q_bot", lane: "plataforma", col: 3, type: "security", icon: "flag", label: "◆ ¿Lo resolvió?", sublabel: "problema resuelto por bot", width: W },
    { id: "p_monitor", lane: "plataforma", col: 4, type: "backend", label: "GPS sin reportar", sublabel: "monitoreo 24/7", tag: "detalle en 3B", width: W },
    { id: "q_critico", lane: "plataforma", col: 5, type: "security", icon: "flag", label: "◆ ¿Qué tipo?", sublabel: "duración + contexto", tag: `umbrales ${PD}`, width: W },

    { id: "a_onb", lane: "auto", col: 0, type: "messagebus", label: "Secuencia onboarding", sublabel: "mapa · geocercas · alertas", width: W },
    { id: "a_ticket", lane: "auto", col: 3, type: "messagebus", label: "Ticket automático", sublabel: "con contexto del bot", width: W },
    { id: "a_temp", lane: "auto", col: 4, type: "messagebus", label: "OFFLINE TEMPORAL", sublabel: "registra y espera", width: W },
    { id: "a_normal", lane: "auto", col: 5, type: "messagebus", label: "OFFLINE PERSIST.", sublabel: "ticket + aviso", width: W },

    { id: "s_soporte", lane: "crm", col: 3, type: "database", label: "SOPORTE ABIERTO", width: W },
    { id: "s_soporte2", lane: "crm", col: 5, type: "database", label: "SOPORTE ABIERTO", sublabel: "estados en 3B", width: W, yOffset: -40 },
    { id: "s_activo2", lane: "crm", col: 5, type: "database", label: "ACTIVO", sublabel: "al resolverse", width: W, yOffset: 40 },

    { id: "x_visita", lane: "tecnico", col: 3, type: "cloud", icon: "briefcase", label: "Visita técnica", sublabel: "solo si se requiere", width: W },

    { id: "h_ticket", lane: "humano", col: 3, type: "cloud", icon: "person", label: "Ejecutivo resuelve", sublabel: "soporte complejo", width: W },
    { id: "h_urgente", lane: "humano", col: 4, type: "security", icon: "person", label: "EVENTO CRÍTICO", sublabel: "Telegram URGENTE", tag: "contacto rápido", width: W },
  ],
  edges: [
    { from: "a_onb", to: "t_onb", variant: "emphasis" },
    { from: "t_onb", to: "k_aprende", variant: "dashed" },
    { from: "t_onb", to: "t_app", label: "abre", variant: "emphasis" },
    { from: "t_app", to: "p_funciones", variant: "emphasis" },
    { from: "k_aprende", to: "k_usa" },
    { from: "k_usa", to: "k_duda" },
    { from: "k_usa", to: "t_app", variant: "dashed" },
    { from: "k_duda", to: "t_bot", variant: "emphasis" },
    { from: "t_bot", to: "p_kb", label: "busca", variant: "emphasis" },
    { from: "p_kb", to: "q_bot", variant: "emphasis" },
    { from: "q_bot", to: "t_fin", label: "SÍ", variant: "emphasis" },
    { from: "q_bot", to: "a_ticket", label: "NO", variant: "security", role: "error" },
    { from: "a_ticket", to: "s_soporte" },
    { from: "a_ticket", to: "h_ticket", variant: "security", role: "error" },
    { from: "h_ticket", to: "x_visita", variant: "dashed" },
    { from: "p_monitor", to: "q_critico", variant: "emphasis" },
    { from: "q_critico", to: "a_temp", label: "temporal", variant: "dashed" },
    { from: "q_critico", to: "a_normal", label: "persistente", variant: "default" },
    { from: "a_normal", to: "s_soporte2" },
    { from: "s_soporte2", to: "s_activo2", label: "resuelto", variant: "dashed" },
    { from: "q_critico", to: "t_aviso", label: "si corresponde", variant: "emphasis" },
    { from: "t_aviso", to: "k_informado", variant: "dashed" },
    { from: "q_critico", to: "h_urgente", label: "crítico", variant: "security", role: "error" },
  ],
  cards: [
    { dot: "cyan", title: "Onboarding automático", items: ["Bienvenida, tutorial de plataforma y mapa (disponible desde CUENTA CREADA)", "Ver el vehículo, recorridos, geocercas y alertas", "Funciones remotas · video o experiencia guiada"] },
    { dot: "violet", title: "Funciones previstas", items: ["Ubicación en vivo · historial de recorridos", "Geocercas · alertas · estado del vehículo", "Sirena · corte de motor solo si está validado técnicamente"] },
    { dot: "rose", title: "GPS offline: 3 niveles", items: ["TEMPORAL: registrar, esperar recuperación, aviso solo si corresponde", "PERSISTENTE: ticket automático + aviso al cliente + revisión de soporte", "CRÍTICO: prioridad alta, Telegram URGENTE, soporte humano y contacto rápido", "Umbrales de tiempo: POR DEFINIR"] },
    { dot: "emerald", title: "Qué medir", items: ["% resuelto por el bot sin humano", "Tickets abiertos · tiempo de resolución", "Eventos GPS offline por nivel · incidentes críticos"] },
  ],
});
