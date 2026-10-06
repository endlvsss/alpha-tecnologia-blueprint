import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";

export const es = JSON.parse(
  readFileSync(`${homedir()}/.claude/skills/archify/examples/locales/es.json`, "utf8"),
);

export const lanes = [
  { id: "cliente", label: "Cliente" },
  { id: "touch", label: "Touchpoint / Interfaz" },
  { id: "plataforma", label: "Plataforma Alpha" },
  { id: "auto", label: "Automatizaciones" },
  { id: "crm", label: "CRM" },
  { id: "tecnico", label: "Técnico instalador freelance" },
  { id: "humano", label: "Soporte humano (solo excepciones)", variant: "exception" },
];

export const legend = {
  mode: "all",
  entries: {
    external: { label: "Acción del cliente" },
    frontend: { label: "Touchpoint / interfaz" },
    backend: { label: "Sistema / plataforma" },
    messagebus: { label: "Automatización" },
    database: { label: "Estado CRM" },
    cloud: { label: "Acción humana (técnico / ejecutivo)" },
    security: { label: "Decisión ◆ / excepción" },
  },
};

export function workflow(slug, title, body) {
  const dir = new URL(`./${slug}/`, import.meta.url);
  mkdirSync(dir, { recursive: true });
  const doc = {
    schema_version: 2,
    diagram_type: "workflow",
    meta: {
      title,
      locale: "es",
      translations: es,
      quality_profile: "standard",
      output: `alpha-blueprint/${slug}/${slug}.html`,
      legend,
    },
    lanes,
    ...body,
  };
  writeFileSync(new URL("candidate.json", dir), JSON.stringify(doc, null, 2));
}
