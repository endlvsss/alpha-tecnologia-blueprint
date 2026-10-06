import { workflow, PD } from "./common.mjs";

const W = 140;
workflow("1-adquisicion", "Alpha · Tramo 1 — Adquisición y compra (etapas 1–5)", {
  phases: [
    { id: "e1", label: "1 · Descubrimiento", fromCol: 0, toCol: 0 },
    { id: "e2", label: "2 · Landing", fromCol: 1, toCol: 1 },
    { id: "e3", label: "3 · Producto y plan", fromCol: 2, toCol: 2 },
    { id: "e4", label: "4 · Checkout", fromCol: 3, toCol: 3, variant: "emphasis" },
    { id: "e5", label: "5 · Pago", fromCol: 4, toCol: 5, variant: "emphasis" },
  ],
  mainPath: ["d_ve", "t_canales", "t_landing", "t_planes", "t_checkout", "q_checkout", "t_pago", "q_pago", "a_post", "p_flujo"],
  nodes: [
    { id: "d_ve", lane: "cliente", col: 0, type: "external", icon: "person", label: "Descubre Alpha", sublabel: "ve contenido o busca", width: W },
    { id: "d_explora", lane: "cliente", col: 1, type: "external", icon: "person", label: "Explora la landing", sublabel: "GPS · seguridad · FAQ", width: W },
    { id: "d_elige", lane: "cliente", col: 2, type: "external", icon: "person", label: "Elige equipo + plan", sublabel: "mensual o anual", width: W },
    { id: "d_datos", lane: "cliente", col: 3, type: "external", icon: "person", label: "Completa sus datos", sublabel: "persona · auto · dirección", width: W },
    { id: "d_paga", lane: "cliente", col: 4, type: "external", icon: "person", label: "Paga online", sublabel: "100% autoservicio", width: W },

    { id: "t_canales", lane: "touch", col: 0, type: "frontend", label: "Redes y anuncios", sublabel: "IG · TikTok · Meta · Google", width: W },
    { id: "t_landing", lane: "touch", col: 1, type: "frontend", label: "Landing Page Alpha", sublabel: "demo · precios · cotizar", tag: "autoservicio", width: W },
    { id: "t_planes", lane: "touch", col: 2, type: "frontend", label: "Comparador de planes", sublabel: "Starter · Pro · Max (provisorio)", tag: PD, width: W },
    { id: "t_checkout", lane: "touch", col: 3, type: "frontend", label: "Checkout", sublabel: "RUT · patente · vehículo", width: W },
    { id: "t_pago", lane: "touch", col: 4, type: "frontend", label: "Webpay / tarjeta", sublabel: "pasarela de pago", width: W },

    { id: "q_checkout", lane: "plataforma", col: 3, type: "security", icon: "flag", label: "◆ ¿Completó checkout?", width: W },
    { id: "q_pago", lane: "plataforma", col: 4, type: "security", icon: "flag", label: "◆ ¿Pago aprobado?", width: W },
    { id: "p_flujo", lane: "plataforma", col: 5, type: "backend", label: "Flujo de instalación", sublabel: "sigue en el Tramo 2 →", tag: "activado", width: W },

    { id: "a_lead", lane: "auto", col: 0, type: "messagebus", label: "Captura de lead", sublabel: "píxel · UTM · formulario", width: W },
    { id: "a_registra", lane: "auto", col: 3, type: "messagebus", label: "Registra abandono", sublabel: "fuente + campaña", width: W, yOffset: -46 },
    { id: "a_remarketing", lane: "auto", col: 3, type: "messagebus", label: "Recupera el lead", sublabel: "Meta · Google · email*", tag: "carrito: POR DEFINIR", width: W, yOffset: 46 },
    { id: "a_rechazo", lane: "auto", col: 4, type: "messagebus", label: "Aviso de rechazo", sublabel: "invita a reintentar", tag: "excepción", width: W },
    { id: "a_post", lane: "auto", col: 5, type: "messagebus", label: "Post-compra", tag: "automática", sublabel: "cuenta · email · WhatsApp", width: W },

    { id: "s_lead", lane: "crm", col: 0, type: "database", label: "LEAD", width: W },
    { id: "s_interesado", lane: "crm", col: 1, type: "database", label: "INTERESADO", width: W },
    { id: "s_checkout", lane: "crm", col: 3, type: "database", label: "CHECKOUT INICIADO", width: W, yOffset: -46 },
    { id: "s_abandono", lane: "crm", col: 3, type: "security", label: "CHECKOUT ABANDONADO", sublabel: "lead recuperable", tag: "subestado medible", width: W, yOffset: 46 },
    { id: "s_pagado", lane: "crm", col: 5, type: "database", label: "PAGADO", width: W, yOffset: -46 },
    { id: "s_cuenta", lane: "crm", col: 5, type: "database", label: "CUENTA CREADA", sublabel: "evento · sin GPS aún", width: W, yOffset: 46 },

    { id: "h_whatsapp", lane: "humano", col: 1, type: "cloud", icon: "person", label: "Ayuda por WhatsApp", sublabel: "solo si el cliente pide", width: W },
  ],
  edges: [
    { from: "d_ve", to: "d_explora", label: "clic" },
    { from: "d_explora", to: "d_elige" },
    { from: "d_elige", to: "d_datos" },
    { from: "d_datos", to: "d_paga" },

    { from: "d_ve", to: "t_canales", variant: "dashed" },
    { from: "d_explora", to: "t_landing", variant: "dashed" },
    { from: "d_elige", to: "t_planes", variant: "dashed" },
    { from: "d_datos", to: "t_checkout", variant: "dashed" },
    { from: "d_paga", to: "t_pago", variant: "dashed" },

    { from: "t_canales", to: "t_landing", label: "todo lleva aquí", variant: "emphasis" },
    { from: "t_landing", to: "t_planes", label: "comprar", variant: "emphasis" },
    { from: "t_planes", to: "t_checkout", variant: "emphasis" },
    { from: "t_checkout", to: "q_checkout", variant: "emphasis" },
    { from: "q_checkout", to: "t_pago", label: "SÍ", variant: "emphasis" },
    { from: "q_checkout", to: "a_registra", label: "NO", variant: "security", role: "error" },
    { from: "a_registra", to: "a_remarketing", variant: "security", role: "error" },
    { from: "t_pago", to: "q_pago", variant: "emphasis" },
    { from: "q_pago", to: "a_rechazo", label: "NO", variant: "security", role: "error" },
    { from: "q_pago", to: "a_post", label: "SÍ", variant: "emphasis" },
    { from: "a_post", to: "p_flujo", variant: "emphasis" },
    { from: "a_post", to: "s_pagado", label: "estado" },

    { from: "t_canales", to: "a_lead", variant: "dashed", fromSide: "bottom", toSide: "top" },
    { from: "a_lead", to: "s_lead", fromSide: "bottom", toSide: "top" },
    { from: "s_lead", to: "s_interesado", variant: "dashed" },
    { from: "s_checkout", to: "s_abandono", label: "no completa", variant: "security", role: "error" },
    { from: "a_registra", to: "s_abandono", variant: "security", role: "error" },
    { from: "a_remarketing", to: "t_landing", label: "vuelve", variant: "dashed", role: "return" },
    { from: "s_pagado", to: "s_cuenta", variant: "dashed" },
    { from: "t_landing", to: "h_whatsapp", label: "¿dudas?", variant: "dashed", role: "branch" },
  ],
  cards: [
    { dot: "cyan", title: "Autoservicio primero", items: ["Todo canal dirige a la landing", "El cliente compara, cotiza y compra solo", "WhatsApp humano solo si lo pide", "Checkout pide: nombre, RUT, teléfono, correo, dirección, patente, marca, modelo, año"] },
    { dot: "rose", title: "Excepciones", items: ["No completa checkout → CHECKOUT ABANDONADO (subestado medible)", "Se registra fuente/campaña y se recupera con Meta, Google y email (*solo con consentimiento)", "Sigue en el funnel como lead recuperable", "Pago rechazado → aviso y reintento"] },
    { dot: "amber", title: "POR DEFINIR", items: ["Nombres, precios y funciones de los planes", "Costo inicial de equipo + instalación · descuento anual", "Mecánica de recuperación de carrito"] },
    { dot: "emerald", title: "Qué medir", items: ["Visitas a la landing · origen · campaña · CTR a planes", "Visita → plan → checkout → pago", "Tasa de abandono de checkout y % recuperado"] },
  ],
});
