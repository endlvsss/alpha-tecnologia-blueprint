import { writeFileSync, mkdirSync } from "node:fs";
import { es } from "./common.mjs";

const slug = "5-estados-crm";
const dir = new URL(`./${slug}/`, import.meta.url);
mkdirSync(dir, { recursive: true });

const doc = {
  schema_version: 2,
  diagram_type: "lifecycle",
  meta: {
    title: "Alpha · Estados del CRM y alertas internas",
    locale: "es",
    translations: es,
    quality_profile: "standard",
    output: `alpha-blueprint/${slug}/${slug}.html`,
    legend: {
      mode: "auto",
      entries: {
        start: { label: "Entrada" },
        active: { label: "En curso" },
        waiting: { label: "En espera" },
        decision: { label: "Punto de decisión" },
        success: { label: "Logro" },
        failure: { label: "Excepción / salida" },
      },
    },
  },
  lanes: [
    { id: "main", label: "Venta online (Tramo 1)" },
    { id: "servicio", label: "Instalación (Tramo 2)" },
    { id: "postventa", label: "Postventa y cobro (Tramos 3–4)" },
    { id: "terminal", label: "Salida" },
  ],
  states: [
    { id: "lead", type: "start", label: "LEAD", sublabel: "llega desde anuncios", lane: "main", col: 0, step: "01" },
    { id: "interesado", type: "active", label: "INTERESADO", sublabel: "explora la landing", lane: "main", col: 1, step: "02" },
    { id: "checkout", type: "decision", label: "CHECKOUT INICIADO", sublabel: "¿completa?", lane: "main", col: 2, step: "03" },
    { id: "pagado", type: "success", label: "PAGADO", sublabel: "Webpay / tarjeta", lane: "main", col: 3, step: "04" },
    { id: "agendada", type: "waiting", label: "INSTALACIÓN AGENDADA", sublabel: "técnico asignado", lane: "main", col: 4, step: "05" },

    { id: "camino", type: "active", label: "TÉCNICO EN CAMINO", sublabel: "WhatsApp al cliente", lane: "servicio", col: 4, step: "06" },
    { id: "eninst", type: "active", label: "EN INSTALACIÓN", sublabel: "check-in hecho", lane: "servicio", col: 3, step: "07" },
    { id: "instalado", type: "success", label: "INSTALADO", sublabel: "check-out + firma", lane: "servicio", col: 2, step: "08" },
    { id: "activo", type: "success", label: "ACTIVO", sublabel: "GPS en su cuenta", lane: "servicio", col: 1, step: "09" },

    { id: "soporte", type: "waiting", label: "SOPORTE", sublabel: "ticket abierto", lane: "postventa", col: 0 },
    { id: "pendiente", type: "waiting", label: "PAGO PENDIENTE", sublabel: "gracia ~15 días", lane: "postventa", col: 2 },
    { id: "suspendido", type: "failure", label: "SUSPENDIDO", sublabel: "aviso previo enviado", lane: "postventa", col: 3 },

    { id: "cancelado", type: "failure", label: "CANCELADO", sublabel: "regla por definir", lane: "terminal", col: 3 },
  ],
  transitions: [
    { from: "lead", to: "interesado", label: "visita" },
    { from: "interesado", to: "checkout", label: "compra" },
    { from: "checkout", to: "pagado", label: "paga" },
    { from: "pagado", to: "agendada", label: "agenda" },
    { from: "agendada", to: "camino", label: "sale", labelDy: 25 },
    { from: "camino", to: "eninst", label: "check-in" },
    { from: "eninst", to: "instalado", label: "check-out" },
    { from: "instalado", to: "activo", label: "activa" },
    { from: "checkout", to: "lead", label: "abandona", variant: "dashed" },
    { from: "activo", to: "soporte", label: "ticket", variant: "dashed" },
    { from: "soporte", to: "activo", label: "resuelto", variant: "emphasis" },
    { from: "activo", to: "pendiente", label: "pago falla", variant: "security" },
    { from: "pendiente", to: "activo", label: "regulariza", variant: "emphasis" },
    { from: "pendiente", to: "suspendido", label: "~15 días", variant: "security" },
    { from: "suspendido", to: "cancelado", variant: "security" },
  ],
  cards: [
    { dot: "rose", title: "Bot de Telegram (alertas internas)", items: ["Nueva venta · nueva instalación · instalación próxima", "Problema técnico · GPS offline · ticket urgente", "Pago fallido · emergencia"] },
    { dot: "cyan", title: "Principios del proceso", items: ["Automatización primero · autoservicio · baja fricción", "Intervención humana solo cuando es necesaria", "Experiencia premium · confianza · tecnología", "Soporte postventa · retención"] },
  ],
};
writeFileSync(new URL("candidate.json", dir), JSON.stringify(doc, null, 2));
