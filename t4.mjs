import { workflow, PD } from "./common.mjs";

const W = 140;
workflow("4-cobro-crecimiento", "Alpha · Tramo 4 — Cobro, retención y crecimiento (etapas 17–20)", {
  phases: [
    { id: "e17", label: "17 · Cobro recurrente y morosidad", fromCol: 0, toCol: 3, variant: "emphasis" },
    { id: "e18", label: "18 · Retención", fromCol: 4, toCol: 4 },
    { id: "e19", label: "19–20 · Venta cruzada · Empresa", fromCol: 5, toCol: 5, variant: "dashed" },
  ],
  mainPath: ["p_cobro", "q_cobro", "a_dunning", "a_intento", "q_gracia", "s_suspendido", "q_susp", "s_cancelado"],
  nodes: [
    { id: "k_mantiene", lane: "cliente", col: 0, type: "external", icon: "person", label: "Sigue protegido", sublabel: "sin hacer nada", width: W },
    { id: "k_regulariza", lane: "cliente", col: 1, type: "external", icon: "person", label: "Actualiza su pago", sublabel: "desde el link", width: W },
    { id: "k_opina", lane: "cliente", col: 4, type: "external", icon: "person", label: "Opina y reseña", sublabel: "encuesta día 30", width: W },
    { id: "k_suma", lane: "cliente", col: 5, type: "external", icon: "person", label: "Suma vehículos", sublabel: "misma cuenta", width: W },

    { id: "t_link", lane: "touch", col: 1, type: "frontend", label: "Avisos + link de pago", sublabel: "WhatsApp · email", tag: "incluye aviso final", width: W },
    { id: "t_msgs", lane: "touch", col: 4, type: "frontend", label: "Día 7 y día 30", sublabel: "WhatsApp · email", width: W },
    { id: "t_oferta", lane: "touch", col: 5, type: "frontend", label: "Agregar vehículo", sublabel: "checkout simplificado", tag: `descuento ${PD}`, width: W },

    { id: "p_cobro", lane: "plataforma", col: 0, type: "backend", label: "Cobro automático", sublabel: "Webpay · tarjeta", tag: "mensual / anual", width: W },
    { id: "p_reactiva", lane: "plataforma", col: 2, type: "backend", label: "Reactivación auto.", sublabel: "vuelve a ACTIVO", width: W },
    { id: "q_otro", lane: "plataforma", col: 5, type: "security", icon: "flag", label: "◆ ¿Otro vehículo?", sublabel: "oportunidad detectada", width: W },

    { id: "q_cobro", lane: "auto", col: 0, type: "security", icon: "flag", label: "◆ ¿Pago exitoso?", width: W },
    { id: "a_dunning", lane: "auto", col: 1, type: "messagebus", label: "Primer aviso", sublabel: "pago no procesado", tag: "excepción", width: W, yOffset: -46 },
    { id: "a_intento", lane: "auto", col: 1, type: "messagebus", label: "2º intento", sublabel: "+ recordatorios", width: W, yOffset: 46 },
    { id: "q_gracia", lane: "auto", col: 2, type: "security", icon: "flag", label: "◆ ¿Regularizó?", sublabel: "en período de gracia", width: W },
    { id: "q_susp", lane: "auto", col: 3, type: "security", icon: "flag", label: "◆ ¿Regulariza?", sublabel: "estando suspendido", width: W },
    { id: "a_ret", lane: "auto", col: 4, type: "messagebus", label: "Customer success", sublabel: "día 7 · día 30", tag: "automático", width: W },

    { id: "s_activo", lane: "crm", col: 0, type: "database", label: "ACTIVO", width: W },
    { id: "s_pendiente", lane: "crm", col: 1, type: "database", label: "PAGO PENDIENTE", sublabel: "gracia ~15 días", tag: "plazo REFERENCIAL", width: W },
    { id: "s_suspendido", lane: "crm", col: 3, type: "security", label: "SUSPENDIDO", sublabel: "tras aviso final", width: W },
    { id: "s_cancelado", lane: "crm", col: 4, type: "security", label: "CANCELADO", sublabel: "eventualmente", tag: `regla ${PD}`, width: W },

    { id: "h_b2b", lane: "humano", col: 5, type: "security", icon: "person", label: "EMPRESA / FLOTA", sublabel: "ejecutivo B2B", tag: "journey B2B aparte", width: W },
  ],
  edges: [
    { from: "p_cobro", to: "q_cobro", variant: "emphasis" },
    { from: "q_cobro", to: "s_activo", label: "SÍ", variant: "emphasis" },
    { from: "q_cobro", to: "a_dunning", label: "NO", variant: "security", role: "error" },
    { from: "a_dunning", to: "a_intento", variant: "security", role: "error" },
    { from: "a_intento", to: "s_pendiente" },
    { from: "a_dunning", to: "t_link", variant: "emphasis" },
    { from: "t_link", to: "k_regulariza", variant: "dashed" },
    { from: "a_intento", to: "q_gracia", variant: "security", role: "error" },
    { from: "q_gracia", to: "p_reactiva", label: "SÍ", variant: "emphasis" },
    { from: "q_gracia", to: "s_suspendido", label: "NO", variant: "security", role: "error" },
    { from: "s_suspendido", to: "q_susp", variant: "security", role: "error" },
    { from: "q_susp", to: "p_reactiva", label: "SÍ", variant: "emphasis" },
    { from: "q_susp", to: "s_cancelado", label: "NO", variant: "security", role: "error" },
    { from: "a_ret", to: "t_msgs", variant: "emphasis", fromSide: "top", toSide: "bottom", route: "straight" },
    { from: "t_msgs", to: "k_opina", variant: "dashed", fromSide: "top", toSide: "bottom" },
    { from: "a_ret", to: "q_otro", label: "detecta" },
    { from: "q_otro", to: "t_oferta", label: "SÍ", variant: "emphasis", fromSide: "top", toSide: "bottom" },
    { from: "t_oferta", to: "k_suma", variant: "dashed", fromSide: "top", toSide: "bottom" },
    { from: "q_otro", to: "h_b2b", label: "empresa", variant: "security", role: "branch", fromSide: "bottom", toSide: "top" },
  ],
  cards: [
    { dot: "rose", title: "Cobro y morosidad", items: ["Pago falla → PAGO PENDIENTE → 1er aviso + 2º intento + recordatorios", "Período de gracia ~15 días (REFERENCIAL, no definitivo) → aviso final → SUSPENDIDO", "Si regulariza (en gracia o suspendido) → reactivación automática → ACTIVO"] },
    { dot: "emerald", title: "Retención", items: ["Día 7: ¿cómo va? · ofrecer ayuda · recordar funciones", "Día 30: encuesta · reseña · beneficio de fidelización", "Cancelación voluntaria y cambio de vehículo: ver Tramo 4B"] },
    { dot: "slate", title: "Empresa / flota", items: ["Solo bifurcación: REQUIERE CUSTOMER JOURNEY B2B DIFERENTE", "Proceso consultivo con ejecutivo humano · se desarrolla aparte"] },
    { dot: "amber", title: "POR DEFINIR", items: ["Plazo exacto de gracia (hoy ~15 días referencial)", "Regla para pasar de SUSPENDIDO a CANCELADO", "Descuento o beneficio por vehículo adicional"] },
    { dot: "violet", title: "Qué medir", items: ["Activos a 30 / 60 / 90 días · churn · NPS · reseñas", "Pagos fallidos · % recuperado en gracia · suspendidos", "Segundo vehículo · upsell · referidos"] },
  ],
});
