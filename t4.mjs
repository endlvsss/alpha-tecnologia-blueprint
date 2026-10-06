import { workflow } from "./common.mjs";

const W = 140;
workflow("4-cobro-crecimiento", "Alpha · Tramo 4 — Cobro, retención y crecimiento (etapas 17–20)", {
  phases: [
    { id: "e17", label: "17 · Cobro recurrente", fromCol: 0, toCol: 2, variant: "emphasis" },
    { id: "e18", label: "18 · Retención", fromCol: 3, toCol: 3 },
    { id: "e19", label: "19 · Venta cruzada", fromCol: 4, toCol: 4 },
    { id: "e20", label: "20 · Empresa (futuro)", fromCol: 5, toCol: 5, variant: "dashed" },
  ],
  mainPath: ["p_cobro", "q_cobro", "a_dunning", "q_gracia", "s_suspendido"],
  nodes: [
    { id: "k_mantiene", lane: "cliente", col: 0, type: "external", icon: "person", label: "Sigue protegido", sublabel: "sin hacer nada", width: W },
    { id: "k_regulariza", lane: "cliente", col: 1, type: "external", icon: "person", label: "Actualiza su pago", sublabel: "desde el link", width: W },
    { id: "k_opina", lane: "cliente", col: 3, type: "external", icon: "person", label: "Opina y reseña", sublabel: "encuesta día 30", width: W },
    { id: "k_suma", lane: "cliente", col: 4, type: "external", icon: "person", label: "Suma vehículos", sublabel: "1 → 2 → familia", width: W },
    { id: "k_pyme", lane: "cliente", col: 5, type: "security", icon: "briefcase", label: "EMPRESA / FLOTA", sublabel: "pequeña empresa", width: W },

    { id: "t_link", lane: "touch", col: 1, type: "frontend", label: "Aviso + link de pago", sublabel: "WhatsApp · email", width: W },
    { id: "t_msgs", lane: "touch", col: 3, type: "frontend", label: "Día 7 y día 30", sublabel: "WhatsApp · email", width: W },
    { id: "t_oferta", lane: "touch", col: 4, type: "frontend", label: "Oferta 2º GPS", sublabel: "descuento progresivo", width: W },

    { id: "p_cobro", lane: "plataforma", col: 0, type: "backend", label: "Cobro automático", sublabel: "Webpay · tarjeta", tag: "mensual / anual", width: W },
    { id: "p_reactiva", lane: "plataforma", col: 2, type: "backend", label: "Reactiva servicio", sublabel: "vuelve a ACTIVO", width: W },
    { id: "q_otro", lane: "plataforma", col: 4, type: "security", icon: "flag", label: "◆ ¿Otro vehículo?", sublabel: "oportunidad detectada", width: W },

    { id: "q_cobro", lane: "auto", col: 0, type: "security", icon: "flag", label: "◆ ¿Pago exitoso?", width: W },
    { id: "a_dunning", lane: "auto", col: 1, type: "messagebus", label: "Aviso + 2º intento", sublabel: "recordatorios", tag: "excepción", width: W },
    { id: "q_gracia", lane: "auto", col: 2, type: "security", icon: "flag", label: "◆ ¿Regularizó?", sublabel: "gracia ~15 días", width: W },
    { id: "a_ret", lane: "auto", col: 3, type: "messagebus", label: "Customer success", sublabel: "día 7 · día 30", tag: "automático", width: W },

    { id: "s_activo", lane: "crm", col: 0, type: "database", label: "ACTIVO", width: W },
    { id: "s_pendiente", lane: "crm", col: 1, type: "database", label: "PAGO PENDIENTE", width: W },
    { id: "s_suspendido", lane: "crm", col: 2, type: "security", label: "SUSPENDIDO", sublabel: "con aviso previo", width: W, yOffset: -46 },
    { id: "s_cancelado", lane: "crm", col: 2, type: "security", label: "CANCELADO", sublabel: "regla por definir", width: W, yOffset: 46 },

    { id: "h_b2b", lane: "humano", col: 5, type: "cloud", icon: "person", label: "Ejecutivo B2B", sublabel: "venta consultiva", tag: "otro journey", width: W },
  ],
  edges: [
    { from: "p_cobro", to: "q_cobro", variant: "emphasis" },
    { from: "q_cobro", to: "s_activo", label: "SÍ", variant: "emphasis" },
    { from: "q_cobro", to: "a_dunning", label: "NO", variant: "security", role: "error" },
    { from: "a_dunning", to: "s_pendiente" },
    { from: "a_dunning", to: "t_link", variant: "emphasis" },
    { from: "t_link", to: "k_regulariza", variant: "dashed" },
    { from: "a_dunning", to: "q_gracia", variant: "emphasis" },
    { from: "q_gracia", to: "p_reactiva", label: "SÍ", variant: "emphasis" },
    { from: "q_gracia", to: "s_suspendido", label: "NO", variant: "security", role: "error" },
    { from: "s_pendiente", to: "s_suspendido", variant: "dashed" },
    { from: "s_suspendido", to: "s_cancelado", variant: "dashed", role: "error" },
    { from: "a_ret", to: "t_msgs", variant: "emphasis", fromSide: "top", toSide: "bottom", route: "straight" },
    { from: "t_msgs", to: "k_opina", variant: "dashed", fromSide: "top", toSide: "bottom" },
    { from: "a_ret", to: "q_otro", label: "detecta" },
    { from: "q_otro", to: "t_oferta", label: "SÍ", variant: "emphasis", fromSide: "top", toSide: "bottom" },
    { from: "t_oferta", to: "k_suma", variant: "dashed", fromSide: "top", toSide: "bottom" },
    { from: "k_suma", to: "k_pyme", label: "crece", variant: "dashed" },
    { from: "k_pyme", to: "h_b2b", label: "B2B", variant: "security", role: "branch", fromSide: "bottom", toSide: "top" },
  ],
  cards: [
    { dot: "amber", title: "Cobro y morosidad", items: ["Pago falla → aviso automático + segundo intento", "Recordatorios de regularización durante ~15 días de gracia", "Aviso antes de suspender · luego SUSPENDIDO"] },
    { dot: "emerald", title: "Retención", items: ["Día 7: ¿cómo va? · ofrecer ayuda · recordar funciones", "Día 30: encuesta · reseña · beneficio de fidelización", "Campañas continuas de customer success"] },
    { dot: "slate", title: "Empresa / flota", items: ["Solo bifurcación futura: REQUIERE CUSTOMER JOURNEY B2B DIFERENTE", "Proceso consultivo con ejecutivo humano"] },
  ],
});
