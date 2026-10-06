import { workflow, PD } from "./common.mjs";

const W = 140;
workflow("2c-excepciones-visita", "Alpha · Tramo 2C — Excepciones en la visita (no-show e instalación fallida)", {
  phases: [
    { id: "g1", label: "B · Técnico no disponible", fromCol: 0, toCol: 1, variant: "security" },
    { id: "g2", label: "A · Cliente no disponible", fromCol: 2, toCol: 3, variant: "security" },
    { id: "g3", label: "Instalación fallida", fromCol: 4, toCol: 5, variant: "security" },
  ],
  mainPath: ["x_llega", "q_cli", "x_instala", "q_ok", "x_causa"],
  nodes: [
    // B · Técnico no disponible
    { id: "k_info", lane: "cliente", col: 1, type: "external", icon: "person", label: "Siempre informado", sublabel: "elige nuevo horario", width: W },
    { id: "t_avisocli", lane: "touch", col: 1, type: "frontend", label: "Aviso + nueva hora", sublabel: "WhatsApp · email", tag: "escala solo si falla", width: W },
    { id: "p_detecta", lane: "plataforma", col: 0, type: "backend", label: "Detecta el atraso", sublabel: "alerta automática", tag: "Telegram ATENCIÓN", width: W },
    { id: "q_otro", lane: "plataforma", col: 1, type: "security", icon: "flag", label: "◆ ¿Otro técnico?", sublabel: "compatible y libre", width: W },
    { id: "a_reasigna", lane: "auto", col: 1, type: "messagebus", label: "Reasigna", sublabel: "y avisa al cliente", tag: "automático", width: W },
    { id: "x_noinicia", lane: "tecnico", col: 0, type: "security", icon: "briefcase", label: "No inicia / cancela", sublabel: "trayecto no iniciado", width: W },
    { id: "x_nuevo", lane: "tecnico", col: 1, type: "cloud", icon: "briefcase", label: "Nuevo técnico", sublabel: "toma la visita", width: W },

    // A · Cliente no disponible
    { id: "k_reprog", lane: "cliente", col: 3, type: "external", icon: "person", label: "Reprograma", sublabel: "desde el link", width: W },
    { id: "t_link", lane: "touch", col: 3, type: "frontend", label: "Link reprogramar", sublabel: "WhatsApp · email", width: W },
    { id: "a_ofrece", lane: "auto", col: 3, type: "messagebus", label: "Ofrece reprogramar", sublabel: "automático", width: W },
    { id: "s_noshow", lane: "crm", col: 3, type: "security", label: "NO-SHOW CLIENTE", sublabel: "con evidencia", tag: `política ${PD}`, width: W },
    { id: "x_llega", lane: "tecnico", col: 2, type: "cloud", icon: "briefcase", label: "Llega al domicilio", sublabel: "fotos · hora · llamadas", width: W },
    { id: "q_cli", lane: "tecnico", col: 3, type: "security", icon: "flag", label: "◆ ¿Cliente y auto?", sublabel: "disponibles", width: W },
    { id: "h_sop", lane: "humano", col: 3, type: "cloud", icon: "person", label: "Soporte notificado", sublabel: "Telegram ATENCIÓN", width: W },

    // Instalación fallida
    { id: "k_sabe", lane: "cliente", col: 5, type: "external", icon: "person", label: "Sabe qué sigue", sublabel: "2ª visita o nueva fecha", width: W },
    { id: "t_aviso", lane: "touch", col: 5, type: "frontend", label: "Mensaje claro", sublabel: "qué pasó y qué sigue", width: W },
    { id: "p_prueba", lane: "plataforma", col: 4, type: "backend", label: "Prueba de enlace", sublabel: "GPS ↔ plataforma", width: W },
    { id: "a_ticket", lane: "auto", col: 5, type: "messagebus", label: "Ticket automático", sublabel: "soporte + cliente", width: W },
    { id: "s_incid", lane: "crm", col: 5, type: "security", label: "INCIDENCIA INST.", sublabel: "nunca INSTALADO aún", width: W },
    { id: "x_instala", lane: "tecnico", col: 4, type: "cloud", icon: "briefcase", label: "Check-in + instala", sublabel: "y prueba el equipo", width: W, yOffset: -58 },
    { id: "q_ok", lane: "tecnico", col: 4, type: "security", icon: "flag", label: "◆ ¿Instalación OK?", sublabel: "SÍ → check-out (T2)", width: W, yOffset: 58 },
    { id: "x_causa", lane: "tecnico", col: 5, type: "security", icon: "briefcase", label: "Clasifica la causa", sublabel: "evidencia · fotos · IMEI", width: W },
    { id: "h_rev", lane: "humano", col: 5, type: "cloud", icon: "person", label: "Soporte resuelve", sublabel: "2ª visita o reprograma", width: W },
  ],
  edges: [
    { from: "x_noinicia", to: "p_detecta", label: "sin trayecto", variant: "security", role: "error", fromSide: "top", toSide: "bottom" },
    { from: "p_detecta", to: "q_otro", variant: "emphasis" },
    { from: "q_otro", to: "a_reasigna", label: "SÍ", variant: "emphasis" },
    { from: "a_reasigna", to: "x_nuevo", variant: "emphasis" },
    { from: "q_otro", to: "t_avisocli", label: "NO", variant: "security", role: "error" },
    { from: "t_avisocli", to: "k_info", variant: "dashed" },

    { from: "x_llega", to: "q_cli", variant: "emphasis" },
    { from: "q_cli", to: "s_noshow", label: "NO", variant: "security", role: "error" },
    { from: "q_cli", to: "h_sop", variant: "security", role: "error" },
    { from: "s_noshow", to: "a_ofrece", variant: "security", role: "error" },
    { from: "a_ofrece", to: "t_link", variant: "emphasis" },
    { from: "t_link", to: "k_reprog", variant: "dashed" },
    { from: "q_cli", to: "x_instala", label: "SÍ", variant: "emphasis", toSide: "left" },

    { from: "x_instala", to: "p_prueba", label: "prueba", variant: "dashed" },
    { from: "x_instala", to: "q_ok", variant: "emphasis", fromSide: "bottom", toSide: "top" },
    { from: "q_ok", to: "x_causa", label: "NO", variant: "security", role: "error" },
    { from: "x_causa", to: "s_incid", variant: "security", role: "error" },
    { from: "x_causa", to: "h_rev", variant: "security", role: "error" },
    { from: "s_incid", to: "a_ticket", variant: "security", role: "error" },
    { from: "a_ticket", to: "t_aviso", variant: "emphasis" },
    { from: "t_aviso", to: "k_sabe", variant: "dashed" },
  ],
  cards: [
    { dot: "rose", title: "Técnico no disponible", items: ["No inicia trayecto o cancela → alerta automática", "Si hay otro técnico compatible → reasignación automática", "Si no → aviso al cliente + nuevo horario; escalar solo si es necesario", "El cliente nunca queda sin información"] },
    { dot: "orange", title: "Causas de instalación fallida", items: ["Eléctrico del vehículo · incompatibilidad · falla GPS", "Señal · plataforma · falta de componente · otro", "Se registra: evidencia, fotos, técnico, IMEI, vehículo, motivo"] },
    { dot: "amber", title: "POR DEFINIR", items: ["Política comercial del no-show del cliente (cobro de visita, límites)", "Tiempo de espera del técnico antes de marcar no-show", "Plazo máximo para la 2ª visita"] },
  ],
});
