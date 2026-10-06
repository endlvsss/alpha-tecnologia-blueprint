import { workflow, PD } from "./common.mjs";

const W = 140;
workflow("4b-postventa", "Alpha · Tramo 4B — Postventa: cancelación, cambio de vehículo y 2º vehículo", {
  phases: [
    { id: "i1", label: "Cancelación y retención", fromCol: 0, toCol: 1, variant: "security" },
    { id: "i2", label: "Cambio de vehículo", fromCol: 2, toCol: 3 },
    { id: "i3", label: "Segundo vehículo", fromCol: 4, toCol: 5, variant: "emphasis" },
  ],
  mainPath: ["k_cancel", "t_motivo", "t_alt", "q_insiste", "s_cancelado"],
  nodes: [
    // Cancelación y retención
    { id: "k_cancel", lane: "cliente", col: 0, type: "external", icon: "person", label: "Pide cancelar", sublabel: "servicio activo", width: W },
    { id: "t_motivo", lane: "touch", col: 0, type: "security", icon: "flag", label: "◆ ¿Motivo?", sublabel: "se pregunta en 1 clic", width: W },
    { id: "t_alt", lane: "touch", col: 1, type: "frontend", label: "Alternativa amable", sublabel: "según el motivo", tag: "sin presión", width: W },
    { id: "q_insiste", lane: "plataforma", col: 1, type: "security", icon: "flag", label: "◆ ¿Insiste?", width: W },
    { id: "a_soporte", lane: "auto", col: 0, type: "messagebus", label: "Ticket prioritario", sublabel: "soporte antes de cancelar", width: W },
    { id: "s_retenido", lane: "crm", col: 0, type: "database", label: "ACTIVO", sublabel: "cliente se queda", width: W },
    { id: "s_cancelado", lane: "crm", col: 1, type: "security", label: "CANCELADO", sublabel: "motivo + fecha", width: W },

    // Cambio de vehículo
    { id: "k_vende", lane: "cliente", col: 2, type: "external", icon: "person", label: "Vende o cambia auto", sublabel: "pide traslado", width: W },
    { id: "k_ok", lane: "cliente", col: 3, type: "external", icon: "person", label: "Auto nuevo protegido", sublabel: "misma cuenta", width: W },
    { id: "t_traslado", lane: "touch", col: 2, type: "frontend", label: "Solicitud traslado", sublabel: "patente · marca · modelo", width: W },
    { id: "t_ok", lane: "touch", col: 3, type: "frontend", label: "Confirmación", sublabel: "WhatsApp · email", width: W },
    { id: "p_cond", lane: "plataforma", col: 2, type: "backend", label: "Condiciones y costo", sublabel: "del traslado", tag: PD, width: W },
    { id: "a_tk", lane: "auto", col: 2, type: "messagebus", label: "Ticket + agenda", sublabel: "visita técnica", width: W },
    { id: "a_vinc", lane: "auto", col: 3, type: "messagebus", label: "IMEI vinculado", sublabel: "aviso automático", width: W },
    { id: "s_vinc", lane: "crm", col: 3, type: "database", label: "VEHÍCULO ACTIVO", sublabel: "nueva patente", width: W },
    { id: "x_desin", lane: "tecnico", col: 2, type: "cloud", icon: "briefcase", label: "Desinstala", sublabel: "vehículo anterior", width: W, yOffset: -46 },
    { id: "x_reins", lane: "tecnico", col: 2, type: "cloud", icon: "briefcase", label: "Reinstala", sublabel: "vehículo nuevo", width: W, yOffset: 46 },

    // Segundo vehículo
    { id: "k_resp", lane: "cliente", col: 4, type: "security", icon: "person", label: "◆ ¿Tiene otro?", sublabel: "responde el cliente", width: W },
    { id: "t_preg", lane: "touch", col: 4, type: "frontend", label: "¿Otro vehículo?", sublabel: "mensaje o banner", width: W },
    { id: "t_check2", lane: "touch", col: 5, type: "frontend", label: "Checkout simple", sublabel: "datos precargados", tag: `beneficio ${PD}`, width: W },
    { id: "p_oport", lane: "plataforma", col: 4, type: "backend", label: "Detecta oportunidad", sublabel: "cliente ACTIVO", width: W },
    { id: "p_mismo", lane: "plataforma", col: 5, type: "backend", label: "Misma cuenta", sublabel: "no crea cliente nuevo", width: W },
    { id: "a_agenda", lane: "auto", col: 5, type: "messagebus", label: "Agenda instalación", sublabel: "sigue Tramo 2", width: W },
    { id: "s_v2", lane: "crm", col: 5, type: "database", label: "INST. AGENDADA", sublabel: "vehículo 2", width: W },
  ],
  edges: [
    { from: "k_cancel", to: "t_motivo", variant: "dashed" },
        { from: "t_motivo", to: "a_soporte", label: "técnico", variant: "dashed" },
    { from: "a_soporte", to: "s_retenido", label: "resuelto", variant: "emphasis" },
    { from: "t_motivo", to: "t_alt", label: "otros", variant: "emphasis" },
    { from: "t_alt", to: "q_insiste", variant: "emphasis", fromSide: "bottom", toSide: "top" },
    { from: "q_insiste", to: "s_cancelado", label: "SÍ", variant: "security", role: "error", fromSide: "bottom", toSide: "top" },
    { from: "q_insiste", to: "s_retenido", label: "NO", variant: "emphasis" },

    { from: "k_vende", to: "t_traslado", variant: "dashed" },
    { from: "t_traslado", to: "p_cond", variant: "emphasis" },
    { from: "p_cond", to: "a_tk", variant: "emphasis" },
    { from: "a_tk", to: "x_desin", variant: "emphasis" },
    { from: "x_desin", to: "x_reins", variant: "emphasis" },
    { from: "x_reins", to: "s_vinc", variant: "emphasis" },
    { from: "s_vinc", to: "a_vinc" },
    { from: "a_vinc", to: "t_ok", variant: "emphasis" },
    { from: "t_ok", to: "k_ok", variant: "dashed" },

    { from: "p_oport", to: "t_preg", variant: "emphasis" },
    { from: "t_preg", to: "k_resp", variant: "dashed" },
    { from: "k_resp", to: "t_check2", label: "SÍ", variant: "emphasis", fromSide: "right", toSide: "top" },
    { from: "t_check2", to: "p_mismo", variant: "emphasis", fromSide: "bottom", toSide: "top" },
    { from: "p_mismo", to: "a_agenda", variant: "emphasis" },
    { from: "a_agenda", to: "s_v2" },
  ],
  cards: [
    { dot: "rose", title: "Retención no agresiva (según motivo)", items: ["Precio → ofrecer plan inferior si existe", "Problema técnico → priorizar soporte antes de cancelar", "Vendió el vehículo → ofrecer traslado · tiene otro → reasignar el servicio", "Poco uso, mala experiencia u otro → escuchar y registrar · si insiste → CANCELADO"] },
    { dot: "cyan", title: "Cambio de vehículo", items: ["Ticket con nueva patente, marca, modelo y año", "Agenda técnica: desinstalación + reinstalación", "IMEI vinculado al nuevo vehículo y CRM actualizado"] },
    { dot: "emerald", title: "Segundo vehículo", items: ["Mismo cliente y misma cuenta: nunca un cliente duplicado", "Checkout simplificado con datos precargados", "Agenda una nueva instalación (Tramo 2)"] },
    { dot: "amber", title: "POR DEFINIR", items: ["Existencia de un plan inferior", "Condiciones y costo del traslado", "Descuento o beneficio por vehículo adicional"] },
  ],
});
