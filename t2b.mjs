import { workflow, PD } from "./common.mjs";

const W = 140;
workflow("2b-excepciones-agenda", "Alpha · Tramo 2B — Excepciones de agenda (sin cupo, reprogramar, cancelar)", {
  phases: [
    { id: "f1", label: "Sin disponibilidad compatible", fromCol: 0, toCol: 1, variant: "security" },
    { id: "f2", label: "Reprogramación", fromCol: 2, toCol: 3, variant: "emphasis" },
    { id: "f3", label: "Cancelación previa a instalación", fromCol: 4, toCol: 5, variant: "security" },
  ],
  mainPath: ["k_busca", "t_agenda", "q_compat", "s_agendada"],
  nodes: [
    // Sin disponibilidad
    { id: "k_busca", lane: "cliente", col: 0, type: "external", icon: "person", label: "Busca horario", sublabel: "en la agenda online", width: W },
    { id: "t_agenda", lane: "touch", col: 0, type: "frontend", label: "Agenda online", sublabel: "solo horarios reales", width: W },
    { id: "t_opciones", lane: "touch", col: 1, type: "frontend", label: "Opciones auto.", sublabel: "otras fechas · más rango", tag: "“Avísame cuando haya”", width: W },
    { id: "q_compat", lane: "plataforma", col: 0, type: "security", icon: "flag", label: "◆ ¿Cupo compatible?", width: W },
    { id: "q_alt", lane: "plataforma", col: 1, type: "security", icon: "flag", label: "◆ ¿Sirvió alguna?", sublabel: "opción alternativa", width: W },
    { id: "a_espera", lane: "auto", col: 1, type: "messagebus", label: "Lista de espera", sublabel: "avisa si se libera cupo", width: W },
    { id: "s_agendada", lane: "crm", col: 0, type: "database", label: "INST. AGENDADA", width: W },
    { id: "h_escala", lane: "humano", col: 1, type: "cloud", icon: "person", label: "Ejecutivo coordina", sublabel: "solo si nada funcionó", width: W },

    // Reprogramación
    { id: "k_reprog", lane: "cliente", col: 2, type: "external", icon: "person", label: "Pide reprogramar", sublabel: "elige nuevo bloque", width: W },
    { id: "k_ok", lane: "cliente", col: 3, type: "external", icon: "person", label: "Recibe confirmación", sublabel: "nueva fecha y hora", width: W },
    { id: "t_reprog", lane: "touch", col: 2, type: "frontend", label: "Reprogramar", sublabel: "horarios disponibles", width: W },
    { id: "t_conf", lane: "touch", col: 3, type: "frontend", label: "WhatsApp · email", sublabel: "cliente + técnico", width: W },
    { id: "p_reprog", lane: "plataforma", col: 2, type: "backend", label: "Valida condiciones", sublabel: "plazos · cantidad", tag: PD, width: W },
    { id: "a_reprog", lane: "auto", col: 3, type: "messagebus", label: "Libera y reserva", sublabel: "bloque viejo → nuevo", tag: "reasigna si aplica", width: W },
    { id: "s_fecha", lane: "crm", col: 3, type: "database", label: "INST. AGENDADA", sublabel: "fecha/hora actualizada", width: W },
    { id: "x_aviso", lane: "tecnico", col: 3, type: "cloud", icon: "briefcase", label: "Técnico anterior", sublabel: "recibe cancelación", width: W, yOffset: -46 },
    { id: "x_nuevo", lane: "tecnico", col: 3, type: "cloud", icon: "briefcase", label: "Técnico nuevo", sublabel: "recibe asignación", tag: "si corresponde", width: W, yOffset: 46 },

    // Cancelación previa
    { id: "k_cancela", lane: "cliente", col: 4, type: "external", icon: "person", label: "Pide cancelar", sublabel: "antes de instalar", width: W },
    { id: "t_motivo", lane: "touch", col: 4, type: "frontend", label: "Motivo de cancelación", sublabel: "formulario simple", width: W },
    { id: "q_reprog", lane: "plataforma", col: 4, type: "security", icon: "flag", label: "◆ ¿Reprograma?", sublabel: "se ofrece si aplica", width: W },
    { id: "p_politica", lane: "plataforma", col: 5, type: "backend", label: "Devolución/penalidad", sublabel: "o retención", tag: PD, width: W },
    { id: "a_libera", lane: "auto", col: 5, type: "messagebus", label: "Libera bloque", sublabel: "avisa al técnico", width: W },
    { id: "s_cancsol", lane: "crm", col: 4, type: "security", label: "CANCELACIÓN SOLIC.", sublabel: "motivo registrado", width: W },
    { id: "s_cancelado", lane: "crm", col: 5, type: "security", label: "CANCELADO", width: W },
  ],
  edges: [
    { from: "k_busca", to: "t_agenda", variant: "dashed" },
    { from: "t_agenda", to: "q_compat", variant: "emphasis" },
    { from: "q_compat", to: "s_agendada", label: "SÍ", variant: "emphasis" },
    { from: "q_compat", to: "t_opciones", label: "NO", variant: "security", role: "error" },
    { from: "t_opciones", to: "q_alt", variant: "security", role: "error" },
    { from: "q_alt", to: "s_agendada", label: "SÍ", variant: "emphasis" },
    { from: "q_alt", to: "a_espera", label: "NO", variant: "security", role: "error" },
    { from: "a_espera", to: "h_escala", label: "sin solución", variant: "security", role: "error" },

    { from: "k_reprog", to: "t_reprog", variant: "dashed" },
    { from: "t_reprog", to: "p_reprog", variant: "emphasis" },
    { from: "p_reprog", to: "a_reprog", variant: "emphasis" },
    { from: "a_reprog", to: "s_fecha", variant: "emphasis" },
    { from: "a_reprog", to: "t_conf", label: "confirma", variant: "emphasis" },
    { from: "t_conf", to: "k_ok", variant: "dashed" },
    { from: "s_fecha", to: "x_aviso", label: "aviso" },
    { from: "x_aviso", to: "x_nuevo", label: "reasigna", variant: "dashed" },

    { from: "k_cancela", to: "t_motivo", variant: "dashed" },
    { from: "t_motivo", to: "q_reprog", variant: "emphasis" },
    { from: "q_reprog", to: "t_reprog", label: "SÍ", variant: "dashed", role: "return" },
    { from: "q_reprog", to: "p_politica", label: "NO", variant: "security", role: "error" },
    { from: "q_reprog", to: "s_cancsol", label: "registra", variant: "dashed" },
    { from: "p_politica", to: "a_libera", variant: "security", role: "error" },
    { from: "a_libera", to: "s_cancelado", variant: "security", role: "error" },
    { from: "s_cancsol", to: "s_cancelado", variant: "dashed" },
  ],
  cards: [
    { dot: "cyan", title: "Sin cupo: primero autoservicio", items: ["1. Mostrar otras fechas", "2. Ampliar el rango de búsqueda", "3. Lista de espera + botón “Avísame cuando haya disponibilidad”", "Solo si nada funciona → ejecutivo humano"] },
    { dot: "violet", title: "Reprogramación paso a paso", items: ["Cliente pide cambio → ve horarios reales → elige bloque", "Se libera el bloque anterior y se reserva el nuevo", "Técnico anterior recibe cancelación; se reasigna automáticamente si corresponde", "CRM actualiza fecha/hora · confirmación a cliente y técnico"] },
    { dot: "amber", title: "POR DEFINIR", items: ["Condiciones para reprogramar (plazos, cantidad de cambios)", "Devolución, penalidad u oferta de retención al cancelar", "Cuándo usar CANCELACIÓN SOLICITADA vs CANCELADO"] },
  ],
});
