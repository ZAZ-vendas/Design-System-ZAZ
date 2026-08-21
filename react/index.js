/**
 * @zaz/design-system — componentes React.
 *
 * JavaScript puro (sem JSX, sem build): funciona em Vite, Next, CRA e também
 * direto no browser via esm.sh. Cada componente é uma casca fina sobre as
 * classes de css/components.css — a fonte da verdade visual continua no CSS.
 *
 *   import { Button, Card, StatusBadge } from "@zaz/design-system";
 *   import "@zaz/design-system/css";
 */
import React from "react";

const h = React.createElement;
const cx = (...v) => v.filter(Boolean).join(" ");

/* --- Tipografia --------------------------------------------------------- */
export const Eyebrow = ({ as = "p", className, ...p }) => h(as, { className: cx("zaz-eyebrow", className), ...p });
export const Heading = ({ level = 1, className, ...p }) =>
  h(`h${level}`, { className: cx(level === 1 ? "zaz-h1" : level === 2 ? "zaz-h2" : "zaz-h3", className), ...p });
export const Display = ({ as = "h1", className, ...p }) => h(as, { className: cx("zaz-display", className), ...p });
export const Muted = ({ as = "p", className, ...p }) => h(as, { className: cx("zaz-muted", className), ...p });
export const Mono = ({ className, ...p }) => h("span", { className: cx("zaz-mono", className), ...p });

/** Título de seção com a barra roxa de 4×40px à esquerda. */
export const SectionHeading = ({ children, className, ...p }) =>
  h("div", { className: cx("zaz-section-heading", className), ...p }, h("h2", { className: "zaz-h2" }, children));

/* --- Botões ------------------------------------------------------------- */
export const Button = ({ variant = "primary", size = "md", block, icon, className, children, ...p }) =>
  h(
    "button",
    { type: p.type ?? "button", className: cx("zaz-btn", `zaz-btn--${variant}`, size !== "md" && `zaz-btn--${size}`, block && "zaz-btn--block", className), ...p },
    icon ?? null,
    children
  );

/* --- Formulário --------------------------------------------------------- */
export const Field = ({ label, hint, error, htmlFor, className, children }) =>
  h(
    "div",
    { className: cx("zaz-field", error && "zaz-field--invalid", className) },
    label ? h("label", { className: "zaz-label", htmlFor }, label) : null,
    children,
    error ? h("p", { className: "zaz-error" }, error) : hint ? h("p", { className: "zaz-hint" }, hint) : null
  );

export const Input = ({ size = "md", icon, className, ...p }) => {
  const input = h("input", { className: cx("zaz-input", size === "lg" && "zaz-input--lg", className), ...p });
  if (!icon) return input;
  return h("span", { className: "zaz-input-group" }, h("span", { className: "zaz-input-group__icon" }, icon), input);
};

export const Textarea = ({ className, ...p }) => h("textarea", { className: cx("zaz-textarea", className), ...p });

export const Select = ({ options = [], className, children, ...p }) =>
  h("select", { className: cx("zaz-select", className), ...p }, children ?? options.map((o) => {
    const opt = typeof o === "string" ? { value: o, label: o } : o;
    return h("option", { key: opt.value, value: opt.value }, opt.label);
  }));

export const Checkbox = ({ label, className, ...p }) =>
  h("label", { className: cx("zaz-check", className) }, h("input", { type: "checkbox", ...p }), label);

export const Radio = ({ label, className, ...p }) =>
  h("label", { className: cx("zaz-check", className) }, h("input", { type: "radio", ...p }), label);

export const Switch = ({ label, className, ...p }) =>
  h("label", { className: cx("zaz-switch", className) }, h("input", { type: "checkbox", role: "switch", ...p }), label);

/* --- Cards -------------------------------------------------------------- */
export const Card = ({ variant, className, children, ...p }) =>
  h("section", { className: cx("zaz-card", variant && `zaz-card--${variant}`, className), ...p }, children);
export const CardHeader = ({ className, ...p }) => h("header", { className: cx("zaz-card__header", className), ...p });
export const CardBody = ({ className, ...p }) => h("div", { className: cx("zaz-card__body", className), ...p });
export const CardFooter = ({ className, ...p }) => h("footer", { className: cx("zaz-card__footer", className), ...p });

export const Metric = ({ label, value, className, children }) =>
  h("div", { className: cx("zaz-metric", className) },
    h("span", { className: "zaz-eyebrow" }, label),
    h("strong", { className: "zaz-metric__value" }, value),
    children ?? null);

/* --- Status ------------------------------------------------------------- */
export const Badge = ({ tone = "neutral", icon, className, children, ...p }) =>
  h("span", { className: cx("zaz-badge", tone !== "neutral" && `zaz-badge--${tone}`, className), ...p }, icon ?? null, children);

/** Mapa canônico de estado de tarefa → tom semântico. */
export const TASK_TONES = {
  "em fila": "neutral",
  "em andamento": "info",
  pendencia: "warning",
  atrasada: "danger",
  concluida: "success",
  suspensa: "neutral",
};
export const StatusBadge = ({ status, ...p }) =>
  h(Badge, { tone: TASK_TONES[String(status).toLowerCase()] ?? "neutral", ...p }, status);

/** Marcas parceiras: cor apenas no ponto, rótulo sempre neutro e em CAIXA ALTA. */
export const BRANDS = ["VERO", "GETNET", "GUARA", "SAFIRA", "ORIGO", "SUA LUZ", "SERENA", "TICKET", "PLUXEE"];
export const BrandTag = ({ brand, className, ...p }) =>
  h("span", { className: cx("zaz-brand-tag", className), "data-brand": String(brand).toLowerCase().replace(/\s+/g, "-"), ...p }, String(brand).toUpperCase());

export const LiveDot = ({ className, ...p }) => h("span", { className: cx("zaz-live-dot", className), "aria-hidden": "true", ...p });

export const Alert = ({ tone = "info", title, icon, className, children }) =>
  h("div", { role: "alert", className: cx("zaz-alert", `zaz-alert--${tone}`, className) },
    icon ?? null,
    h("div", null, title ? h("p", { className: "zaz-alert__title" }, title) : null, children));

/* --- Tabela ------------------------------------------------------------- */
export const Table = ({ columns = [], rows = [], empty = "Nenhum registro encontrado.", className }) =>
  h("table", { className: cx("zaz-table", className) },
    h("thead", null, h("tr", null, columns.map((c) => h("th", { key: c.key, style: c.align === "right" ? { textAlign: "right" } : null }, c.label)))),
    h("tbody", null,
      rows.length === 0
        ? h("tr", null, h("td", { colSpan: columns.length, className: "zaz-empty" }, empty))
        : rows.map((r, i) =>
            h("tr", { key: r.id ?? i }, columns.map((c) =>
              h("td", { key: c.key, className: c.align === "right" ? "zaz-num" : null }, c.render ? c.render(r) : r[c.key])
            )))));

/* --- Lista com trilha lateral ------------------------------------------ */
export const Track = ({ className, ...p }) => h("div", { className: cx("zaz-track", className), ...p });
export const TrackRow = ({ title, meta, badge, live, active, chevron, className, ...p }) =>
  h("button", { type: "button", "aria-current": active ? "true" : undefined, className: cx("zaz-track__row", className), ...p },
    live ? h(LiveDot) : null,
    h("span", { className: "zaz-track__main" },
      h("span", { className: "zaz-track__title" }, title),
      meta ? h("span", { className: "zaz-track__meta" }, meta) : null),
    badge ?? null,
    h("span", { className: "zaz-track__chevron", "aria-hidden": "true" }, chevron ?? "›"));

export const EmptyState = ({ className, children }) => h("p", { className: cx("zaz-empty", className) }, children);

/* --- Shell -------------------------------------------------------------- */
export const Shell = ({ className, ...p }) => h("div", { className: cx("zaz-shell", className), ...p });
export const Sidebar = ({ className, ...p }) => h("aside", { className: cx("zaz-sidebar", className), ...p });
export const SidebarBrand = ({ className, ...p }) => h("div", { className: cx("zaz-sidebar__brand", className), ...p });
export const SidebarNav = ({ className, ...p }) => h("nav", { className: cx("zaz-sidebar__nav", className), ...p });
export const SidebarFooter = ({ className, ...p }) => h("div", { className: cx("zaz-sidebar__footer", className), ...p });
export const Header = ({ className, ...p }) => h("header", { className: cx("zaz-header", className), ...p });
export const Main = ({ className, ...p }) => h("main", { className: cx("zaz-main", className), ...p });

export const NavItem = ({ icon, label, count, active, className, ...p }) =>
  h("button", { type: "button", "aria-current": active ? "page" : undefined, className: cx("zaz-nav-item", className), ...p },
    icon ?? null, h("span", null, label),
    count != null ? h("span", { className: "zaz-nav-item__count" }, count) : null);

export const AREAS = {
  tasklist: "Tasklist",
  rh: "RH",
  gestor: "Gestor",
  promotor: "Promotor",
  "suporte-vero": "Suporte VERO",
  agenda: "Agenda",
};
export const AreaPill = ({ area = "tasklist", icon, className, children, ...p }) =>
  h("button", { type: "button", "data-area": area, className: cx("zaz-area-pill", className), ...p }, icon ?? null, children ?? AREAS[area] ?? area);

export const Avatar = ({ name = "", className, ...p }) =>
  h("span", { className: cx("zaz-avatar", className), ...p },
    name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase());

/* --- Sobreposições ----------------------------------------------------- */
export const Modal = ({ open = true, title, onClose, footer, className, children }) =>
  !open ? null : h("div", { className: "zaz-overlay", onClick: onClose },
    h("div", { role: "dialog", "aria-modal": "true", className: cx("zaz-modal", className), onClick: (e) => e.stopPropagation() },
      h("header", { className: "zaz-modal__header" },
        h("h2", { className: "zaz-h2" }, title),
        onClose ? h(Button, { variant: "ghost", size: "sm", onClick: onClose, "aria-label": "Fechar" }, "✕") : null),
      h("div", { className: "zaz-modal__body" }, children),
      footer ? h("footer", { className: "zaz-modal__footer" }, footer) : null));

export const Drawer = ({ open = true, title, onClose, footer, className, children }) =>
  !open ? null : h("aside", { role: "dialog", "aria-modal": "false", className: cx("zaz-drawer", className) },
    h("header", { className: "zaz-drawer__header" },
      h("h2", { className: "zaz-h2" }, title),
      onClose ? h(Button, { variant: "ghost", size: "sm", onClick: onClose, "aria-label": "Fechar" }, "✕") : null),
    h("div", { className: "zaz-drawer__body" }, children),
    footer ? h("footer", { className: "zaz-drawer__footer" }, footer) : null);

export const ToastStack = ({ className, ...p }) => h("div", { className: cx("zaz-toast-stack", className), ...p });
export const Toast = ({ tone = "info", title, icon, className, children }) =>
  h("div", { role: "status", className: cx("zaz-toast", `zaz-toast--${tone}`, className) },
    icon ?? null,
    h("div", null, title ? h("p", { className: "zaz-toast__title" }, title) : null,
      children ? h("p", { className: "zaz-toast__desc" }, children) : null));

/* --- Detalhes ----------------------------------------------------------- */
export const DescriptionList = ({ items = [], className }) =>
  h("dl", { className: cx("zaz-dl", className) }, items.flatMap((it, i) => [
    h("dt", { key: `t${i}` }, it.label),
    h("dd", { key: `d${i}` }, it.value),
  ]));

/* --- Dados -------------------------------------------------------------- */
export const DATA_COLORS = ["var(--zaz-data-1)", "var(--zaz-data-2)", "var(--zaz-data-3)", "var(--zaz-data-4)", "var(--zaz-data-5)", "var(--zaz-data-6)", "var(--zaz-data-7)", "var(--zaz-data-8)"];
export const dataColor = (i) => DATA_COLORS[i % DATA_COLORS.length];

export const Legend = ({ items = [], className }) =>
  h("div", { className: cx("zaz-legend", className) }, items.map((it, i) =>
    h("span", { key: it.label ?? i, className: "zaz-legend__item" },
      h("span", { className: "zaz-legend__swatch", style: { "--_c": it.color ?? dataColor(i) } }),
      it.label)));

export const Bar = ({ value = 0, max = 100, color, className }) =>
  h("div", { className: cx("zaz-bar-track", className) },
    h("div", { className: "zaz-bar-fill", style: { width: `${Math.min(100, (value / max) * 100)}%`, "--_c": color ?? "var(--zaz-data-1)" } }));

/* --- Slides ------------------------------------------------------------- */
export const Slide = ({ layout = "content", tone, className, children, ...p }) =>
  h("section", { className: cx("zaz-slide", `zaz-slide--${layout}`, tone && `zaz-slide--${tone}`, className), ...p }, children);
export const SlideTitle = ({ className, ...p }) => h("h1", { className: cx("zaz-slide__title", className), ...p });
export const SlideHeading = ({ className, ...p }) => h("h2", { className: cx("zaz-slide__heading", className), ...p });
export const SlideSubtitle = ({ className, ...p }) => h("p", { className: cx("zaz-slide__subtitle", className), ...p });
export const SlideEyebrow = ({ className, ...p }) => h("p", { className: cx("zaz-slide__eyebrow", className), ...p });
export const SlideBody = ({ className, ...p }) => h("div", { className: cx("zaz-slide__body", className), ...p });
export const SlideRule = ({ className }) => h("span", { className: cx("zaz-slide__rule", className), "aria-hidden": "true" });
export const SlideFooter = ({ left, right, className }) =>
  h("footer", { className: cx("zaz-slide__footer", className) }, h("span", null, left ?? "ZAZ Vendas"), h("span", null, right));
export const SlideList = ({ items = [], className }) =>
  h("ul", { className: cx("zaz-slide__list", className), style: { listStyle: "none", margin: 0, padding: 0 } },
    items.map((it, i) => h("li", { key: i, className: "zaz-slide__list-item" }, it)));
export const SlideMetrics = ({ items = [], cols, className }) =>
  h("div", { className: cx("zaz-slide__metrics", className), style: cols ? { "--zaz-slide-cols": cols } : null },
    items.map((m, i) => h("div", { key: i, className: "zaz-slide__metric" },
      h("strong", { className: "zaz-slide__metric-value" }, m.value),
      h("span", { className: "zaz-slide__metric-label" }, m.label))));
