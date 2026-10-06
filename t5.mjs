import { writeFileSync, mkdirSync } from "node:fs";
import { es } from "./common.mjs";

const slug = "5-estados-crm";
const dir = new URL(`./${slug}/`, import.meta.url);
mkdirSync(dir, { recursive: true });

const doc = {
  schema_version: 2,
  diagram_type: "lifecycle",
  meta: {
    title: "Alpha · Estados del CRM (principal, subestado, evento) y alertas",
    locale: "es",
    translations: es,
    quality_profile: "standard",
    output: `alpha-blueprint/${slug}/${slug}.html`,
    legend: {
      mode: "auto",
      entries: {
        start: { label: "Entrada (principal)" },
        active: { label: "Estado principal" },
        waiting: { label: "Subestado" },
        neutral: { label: "Evento (registro con fecha)" },
        failure: { label: "Excepción / salida" },
      },
    },
  },
  lanes: [
    { id: "main", label: "Venta online" },
    { id: "inst", label: "Instalación y activación" },
    { id: "post", label: "Postventa y cobro" },
    { id: "terminal", label: "Salida" },
  ],
  states: [
    { id: "lead", type: "start", label: "LEAD", sublabel: "principal", lane: "main", col: 0, step: "01" },
    { id: "interesado", type: "waiting", label: "INTERESADO", sublabel: "subestado de LEAD", lane: "main", col: 1, step: "02" },
    { id: "checkout", type: "waiting", label: "CHECKOUT INICIADO", sublabel: "subestado de LEAD", lane: "main", col: 2, step: "03" },
    { id: "abandonado", type: "failure", label: "CHECKOUT ABANDONADO", sublabel: "subestado medible", lane: "main", col: 2, yOffset: 104 },
    { id: "pagado", type: "active", label: "PAGADO", sublabel: "principal", lane: "main", col: 3, step: "04" },
    { id: "cuenta", type: "neutral", label: "CUENTA CREADA", sublabel: "evento", lane: "main", col: 4, step: "05" },

    { id: "agendada", type: "active", label: "INSTALACIÓN AGENDADA", sublabel: "principal", lane: "inst", col: 4, step: "06" },
    { id: "camino", type: "waiting", label: "TÉCNICO EN CAMINO", sublabel: "subestado", lane: "inst", col: 3, step: "07" },
    { id: "eninst", type: "waiting", label: "EN INSTALACIÓN", sublabel: "subestado", lane: "inst", col: 2, step: "08" },
    { id: "incid", type: "failure", label: "INCIDENCIA INSTALACIÓN", sublabel: "subestado", lane: "inst", col: 2, yOffset: 104 },
    { id: "instalado", type: "neutral", label: "INSTALADO", sublabel: "evento", lane: "inst", col: 1, step: "09" },
    { id: "activo", type: "active", label: "ACTIVO", sublabel: "principal · vehículo activo", lane: "inst", col: 0, step: "10" },

    { id: "soporte", type: "waiting", label: "SOPORTE ABIERTO", sublabel: "subestado de ACTIVO", lane: "post", col: 0 },
    { id: "pendiente", type: "waiting", label: "PAGO PENDIENTE", sublabel: "subestado de ACTIVO", lane: "post", col: 1 },
    { id: "suspendido", type: "failure", label: "SUSPENDIDO", sublabel: "principal", lane: "post", col: 2 },

    { id: "cancelado", type: "failure", label: "CANCELADO", sublabel: "principal · final", lane: "terminal", col: 2 },
  ],
  transitions: [
    { from: "lead", to: "interesado", label: "visita" },
    { from: "interesado", to: "checkout", label: "compra" },
    { from: "checkout", to: "pagado", label: "paga" },
    { from: "checkout", to: "abandonado", variant: "security", fromSide: "bottom", toSide: "top" },
    { from: "abandonado", to: "lead", label: "recuperable", variant: "dashed", fromSide: "left", toSide: "bottom" },
    { from: "pagado", to: "cuenta", label: "acceso" },
    { from: "cuenta", to: "agendada", label: "agenda", labelDy: 25 },
    { from: "agendada", to: "camino", label: "sale" },
    { from: "camino", to: "eninst", label: "check-in" },
    { from: "eninst", to: "instalado", label: "todo OK" },
    { from: "eninst", to: "incid", variant: "security", fromSide: "bottom", toSide: "top" },
    { from: "incid", to: "agendada", label: "2ª visita", variant: "dashed", fromSide: "right", toSide: "bottom" },
    { from: "instalado", to: "activo", label: "IMEI vinculado" },
    { from: "activo", to: "soporte", label: "ticket", variant: "dashed" },
    { from: "soporte", to: "activo", label: "resuelto", variant: "emphasis" },
    { from: "activo", to: "pendiente", label: "pago falla", variant: "security" },
    { from: "pendiente", to: "activo", label: "regulariza", variant: "emphasis" },
    { from: "pendiente", to: "suspendido", label: "~15 días*", variant: "security" },
    { from: "suspendido", to: "activo", label: "reactiva", variant: "emphasis" },
    { from: "suspendido", to: "cancelado", label: "POR DEFINIR", variant: "security", labelDy: 25 },
  ],
  cards: [
    { dot: "cyan", title: "Propuesta: estados principales (6)", items: ["LEAD · PAGADO · INSTALACIÓN AGENDADA · ACTIVO · SUSPENDIDO · CANCELADO", "Son las etapas del pipeline del CRM", "Propuesta a validar con el equipo"] },
    { dot: "amber", title: "Subestados y eventos", items: ["Subestados: INTERESADO, CHECKOUT INICIADO, CHECKOUT ABANDONADO, TÉCNICO EN CAMINO, EN INSTALACIÓN, INCIDENCIA INSTALACIÓN, SOPORTE ABIERTO, PAGO PENDIENTE", "Eventos (fecha y hora, no etapa): CUENTA CREADA, INSTALADO", "Soporte detallado: ABIERTO → EN REVISIÓN → ESPERANDO CLIENTE / VISITA TÉCNICA → RESUELTO (Tramo 3B)"] },
    { dot: "rose", title: "Bot de Telegram por nivel", items: ["INFO: nueva venta · instalación agendada", "ATENCIÓN: instalación próxima · pago fallido · GPS offline persistente", "URGENTE: instalación crítica · ticket urgente · incidente de seguridad · emergencia", "Solo URGENTE notifica de inmediato; INFO puede ir en resumen para evitar exceso"] },
    { dot: "slate", title: "POR DEFINIR", items: ["*Plazo de gracia ~15 días: REFERENCIAL", "Regla para pasar de SUSPENDIDO a CANCELADO", "CANCELACIÓN SOLICITADA (antes de instalar): subestado o directo a CANCELADO"] },
  ],
};
writeFileSync(new URL("candidate.json", dir), JSON.stringify(doc, null, 2));
