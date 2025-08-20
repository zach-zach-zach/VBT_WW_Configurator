// 'use client';

import React, { useMemo, useState, useEffect } from "react";
import { Plus, Send, Trash2, Info, X } from "lucide-react";

/**
 * Inline minimal UI primitives so we don't depend on missing
 * ./components/ui/* files. These mimic the styles/props used by the app
 * (Card, Button, Input, Textarea, Label).
 */

// ------------------
//  LIGHTWEIGHT UI PRIMITIVES (no external file imports)
// ------------------
function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

function Card({ className = "", children, ...props }) {
  return (
    <div className={cx("rounded-xl border border-slate-200", className)} {...props}>
      {children}
    </div>
  );
}
function CardHeader({ className = "", children, ...props }) {
  return (
    <div className={cx("p-4 border-b border-slate-100", className)} {...props}>
      {children}
    </div>
  );
}
function CardTitle({ className = "", children, ...props }) {
  return (
    <h2 className={cx("text-lg font-semibold", className)} {...props}>
      {children}
    </h2>
  );
}
function CardContent({ className = "", children, ...props }) {
  return (
    <div className={cx("p-4", className)} {...props}>
      {children}
    </div>
  );
}

function Button({
  children,
  variant = "default",
  size = "default",
  asChild = false,
  className = "",
  ...props
}) {
  const base = "inline-flex items-center justify-center whitespace-nowrap rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    default: "bg-slate-900 text-white hover:bg-slate-800",
    outline: "border border-slate-300 text-slate-900 bg-white hover:bg-slate-50",
    ghost: "text-slate-700 hover:bg-slate-100",
  };
  const sizes = {
    default: "h-9 px-4 py-2 text-sm",
    icon: "h-8 w-8 p-0",
  };
  const cls = cx(base, variants[variant] || variants.default, sizes[size] || sizes.default, className);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: cx(children.props.className, cls),
      ...props,
    });
  }
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}

function Input({ className = "", ...props }) {
  return (
    <input
      className={cx(
        "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-400",
        className
      )}
      {...props}
    />
  );
}

function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={cx(
        "w-full min-h-[96px] rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-400",
        className
      )}
      {...props}
    />
  );
}

function Label({ className = "", children, ...props }) {
  return (
    <label className={cx("text-sm font-medium text-slate-700", className)} {...props}>
      {children}
    </label>
  );
}

// ------------------
//  ORDERING-GUIDE DATA
// ------------------

const RSMS = [
  { label: "Charles Claussen", value: "charles.claussen@vbtech.com", last: "Claussen" },
  { label: "Wes Caudle", value: "wes.caudle@vbtech.com", last: "Caudle" },
  { label: "Ryan Carroll", value: "Ryan.Carroll@vbtech.com", last: "Carroll" },
  { label: "Brian Syzdek", value: "brian.syzdek@vbtech.com", last: "Syzdek" },
];

const SECTORS = [{ code: "WW", description: "Waterworks" }];

const MODELS = [
  { code: "EN", description: "700-SIGMA EN" },
  { code: "ES", description: "700-SIGMA ES" },
];

const SIZES_BY_MODEL = {
  EN: [
    { code: "DN40", description: '1.5"' },
    { code: "DN50", description: '2"' },
    { code: "DN80", description: '3"' },
    { code: "DN100", description: '4"' },
    { code: "DN150", description: '6"' },
    { code: "DN200", description: '8"' },
    { code: "DN250", description: '10"' },
    { code: "DN300", description: '12"' },
    { code: "DN400", description: '16"' },
  ],
  ES: [
    { code: "DN65", description: '2.5"' },
    { code: "DN80", description: '3"' },
    { code: "DN100", description: '4"' },
    { code: "DN125", description: '5"' },
    { code: "DN150", description: '6"' },
    { code: "DN200", description: '8"' },
    { code: "DN250", description: '10"' },
    { code: "DN300", description: '12"' },
    { code: "DN350", description: '14"' },
    { code: "DN400", description: '16"' },
    { code: "DN450", description: '18"' },
    { code: "DN500", description: '20"' },
    { code: "DN600", description: '24"' },
  ],
};

const PRIMARY_FEATURES = [
  { code: "700", description: "Basic Valve (Double Chamber)" },
  { code: "705", description: "Basic Valve (Single Chamber)" },
  { code: "710", description: "Solenoid Controlled Valve" },
  { code: "718", description: "Electronic Control Valve" },
  { code: "7PM", description: "Pressure Mgmt, Flow Compensated PRV" },
  { code: "720", description: "Pressure Reducing Valve" },
  { code: "723", description: "Pressure Reducing & Sustaining" },
  { code: "726", description: "Differential Pressure Reducing" },
  { code: "727", description: "Flow Control – Constant Downstream Pressure" },
  { code: "730", description: "Pressure Sustaining/Relief" },
  { code: "73Q", description: "Pressure Relief, Quick Type" },
  { code: "730R", description: "Pressure Sustaining – Remote Sensing" },
  { code: "735", description: "Surge Anticipating" },
  { code: "736", description: "Differential Pressure Sustaining" },
  { code: "740", description: "Booster Pump Control (Double Chamber)" },
  { code: "742", description: "Booster Pump Control & PRV" },
  { code: "743", description: "Booster Pump Control & Sustaining" },
  { code: "745", description: "Deep Well Pump Electric Control" },
  { code: "747", description: "Booster Pump & Flow Control" },
  { code: "748", description: "Pump Circulation & Sustaining" },
  { code: "750", description: "Level Control" },
  { code: "753", description: "Level Control & Sustaining" },
  { code: "757", description: "Level & Flow Control" },
  { code: "75A", description: "Level Sustaining (Reservoir Outlet)" },
  { code: "770", description: "Flow Control" },
  { code: "772", description: "Flow Control & PRV" },
  { code: "773", description: "Flow Control & Sustaining" },
  { code: "775", description: "Flow Control, PRV & Sustaining" },
  { code: "790", description: "Burst Control (Excessive Flow)" },
  { code: "792", description: "Burst Control & PRV" },
  { code: "793", description: "Burst Control & Sustaining" },
  { code: "79A", description: "Safety Valve (Reservoir Outlet)" },
  { code: "70N", description: "Check Valve (Lift Type) – EN only" },
  { code: "70F", description: "Strainer – EN only" },
];

const PATTERNS = [{ code: "Y", description: "Oblique Y" }];
const MATERIALS = [{ code: "C", description: "Ductile Iron" }];

const ENDS = [
  { code: "10", description: "Flanged ISO 7005 PN10" },
  { code: "16", description: "Flanged ISO 7005 PN16" },
  { code: "25", description: "Flanged ISO 7005 PN25" },
  { code: "A5", description: "ANSI 150 RF" },
  { code: "A3", description: "ANSI 300 RF" },
  { code: "a5", description: "ANSI 150 FF" },
  { code: "a3", description: "ANSI 300 FF" },
  { code: "NP", description: 'NPT Threaded (250 psi) ≤3"' },
  { code: "NH", description: 'NPT Threaded (400 psi) ≤3"' },
  { code: "BP", description: 'BSP Threaded (250 psi) ≤3"' },
  { code: "PH", description: 'BSP Threaded (400 psi) ≤3"' },
  { code: "VI", description: 'Grooved ANSI C606 (250 psi) ≤8"' },
  { code: "V2", description: 'Grooved ANSI C606 (400 psi) ≤8"' },
];

const COATINGS = [
  { code: "EB", description: "Epoxy FB Dark Blue" },
  { code: "EV", description: "Epoxy FB Dark Blue + UV" },
  { code: "UC", description: "Uncoated" },
];

const TUBING = [
  { code: "NN", description: "SS316 Tubing & Fittings" },
  { code: "CB", description: "Copper Tubing & Brass Fittings" },
  { code: "PB", description: "Plastic Reinforced Tubing & Brass Fittings" },
];

const SOLENOID_VOLTAGE = [
  { code: "4AC", description: "24VAC/50Hz – NC" },
  { code: "4AO", description: "24VAC/50Hz – NO" },
  { code: "4AP", description: "24VAC/50Hz – Last Position" },
  { code: "46C", description: "24VAC/60Hz – NC" },
  { code: "46O", description: "24VAC/60Hz – NO" },
  { code: "46P", description: "24VAC/60Hz – Last Position" },
  { code: "4DC", description: "24VDC – NC" },
  { code: "4DO", description: "24VDC – NO" },
  { code: "4DP", description: "24VDC – Last Position" },
  { code: "4DS", description: "24VDC – Latch" },
  { code: "5AC", description: "110VAC/50–60Hz – NC" },
  { code: "5AO", description: "110VAC – NO" },
  { code: "5AP", description: "110VAC/50–60Hz – Last Position" },
  { code: "5DC", description: "110VDC – NC" },
  { code: "5DO", description: "110VDC – NO" },
  { code: "5DS", description: "110VDC – Latch" },
  { code: "2AC", description: "220VAC – NC" },
  { code: "2AO", description: "220VAC – NO" },
  { code: "2DC", description: "220VDC – NC" },
  { code: "2DO", description: "220VDC – NO" },
  { code: "2DS", description: "220VDC – Latch" },
  { code: "1DC", description: "12VDC – NC" },
  { code: "1DO", description: "12VDC – NO" },
  { code: "1DP", description: "12VDC – Last Position" },
  { code: "1DS", description: "12VDC – Latch" },
];

const ADDITIONAL_FEATURES = [
  { code: "00", description: "No Additional Feature" },
  { code: "03", description: "Closing & Opening Speed Control" },
  { code: "09", description: "Hydraulic Override" },
  { code: "12", description: "High Sensitivity Pilot" },
  { code: "18", description: "Electronic Control" },
  { code: "2U", description: "Flow Control Constant Downstream Pressure" },
  { code: "20", description: "Check Feature" },
  { code: "22", description: "Pressure Reducing" },
  { code: "2S", description: "Independent Lift Check" },
  { code: "33", description: "Pressure Sustaining" },
  { code: "3Q", description: "Relief Override" },
  { code: "41", description: "Closing at Pressure Rise" },
  { code: "45", description: "Electrically Selected Multi-Level Setting" },
  { code: "48", description: "Downstream Over Pressure Guard" },
  { code: "49", description: "Closing Surge Prevention" },
  { code: "4S", description: "Motorized Pilot" },
  { code: "4R", description: "Electronic Multi-Level (water)" },
  { code: "4T", description: "Electronic Multi-Level (air)" },
  { code: "4V", description: "BEC PM1 Pressure Management Controller" },
  { code: "50", description: "2-Way Hydraulic Relay" },
  { code: "54", description: "3-Way Hydraulic Relay" },
  { code: "55", description: "Solenoid Controlled" },
  { code: "59", description: "Electric Override" },
  { code: "6E", description: "w/o Electric Float (65)" },
  { code: "6H", description: "w/o Hydraulic Float (60/67)" },
  { code: "60", description: "Modulating Horizontal Float" },
  { code: "65", description: "Bi-Level Electric Float" },
  { code: "66", description: "Bi-Level Vertical Float" },
  { code: "67", description: "Modulating Vertical Float" },
  { code: "70", description: "Bi-Directional Flow" },
  { code: "80", description: "Altitude Pilot" },
  { code: "82", description: "Modulating Altitude Pilot" },
  { code: "83", description: "Sustaining Altitude Pilot" },
  { code: "86", description: "Bi-Level Altitude Control" },
  { code: "87", description: "Altitude Control with Bi-Directional Flow" },
  { code: "85", description: "Hydraulic Positioning" },
  { code: "90", description: "Burst Control" },
  { code: "91", description: "Closing at Downstream Pressure Drop" },
  { code: "C1", description: "Single Cavitation Cage" },
  { code: "C2", description: "Double Cavitation Cage" },
  { code: "TC", description: "Triple Chamber Valve" },
  { code: "L1", description: "Panel Mounted Control" },
  { code: "2B", description: "PRV Low Flow By-Pass" },
  { code: "PD", description: "Proportional" },
];

const ADDITIONAL_ATTRIBUTES = [
  { code: "B", description: "Double Chambered – Active" },
  { code: "C", description: "In-Line Filter" },
  { code: "D", description: "SS316 Actuator Internal Assembly" },
  { code: "E1", description: "EPDM Elastomers" },
  { code: "E2", description: "Viton Elastomers" },
  { code: "F", description: "Large Control Filter" },
  { code: "F1", description: "Extra Large Control Filter" },
  { code: "FF", description: "Two Large Control Filters" },
  { code: "F1F1", description: "Two Extra Large Control Filters" },
  { code: "K", description: "High Grade Bearing & Stem" },
  { code: "G", description: "Balancing Piston Assembly" },
  { code: "I", description: "Valve Position Indicator" },
  { code: "J", description: "Junction Box" },
  { code: "L", description: "Lifting Spring" },
  { code: "M", description: "Flow Stem" },
  { code: "N", description: "SS316 All Control Accessories" },
  { code: "O", description: "Flow Over The Seat" },
  { code: "P", description: "Pressure Switch" },
  { code: "Q", description: "Valve Position Transmitter*" },
  { code: "Q2", description: "Valve Position Transmitter (Side Indicator)*" },
  { code: "R", description: "Delrin Bearing" },
  { code: "S", description: "Electric Limit Switch*" },
  { code: "S2", description: "Electric Limit Switch (Side Indicator)*" },
  { code: "SS", description: "Double Limit Switch Assy*" },
  { code: "T", description: "SS316 Internal Trim Closure & Seat" },
  { code: "U", description: "Differential Flow Sensor (Orifice)" },
  { code: "V", description: "V-Port Throttling Plug" },
  { code: "X", description: "3W Control" },
  { code: "Z", description: "3-Position Manual Selector" },
  { code: "d", description: "Pressure Separator" },
  { code: "e", description: "External Control Pressure" },
  { code: "j", description: "Pitot Tube" },
  { code: "n", description: "SS316 Small Control Accessories" },
  { code: "q", description: "Closing Spring" },
  { code: "r", description: "PVDF Bearing" },
  { code: "6", description: "Pressure Gauge" },
  { code: "66", description: "Double Pressure Gauge" },
  { code: "6n", description: "SS Pressure Gauge" },
  { code: "6n6n", description: "Double SS Pressure Gauges" },
];

// ------------------
//  HELPERS
// ------------------

const fmt = (o) => (o ? `${o.code} - ${o.description}` : "");

const orderIndexMap = (arr) => new Map(arr.map((x, i) => [x.code, i]));
const FEATURES_IDX = orderIndexMap(ADDITIONAL_FEATURES);
const ATTRS_IDX = orderIndexMap(ADDITIONAL_ATTRIBUTES);
const sortCanonically = (items, idxMap) =>
  [...items].sort((a, b) => (idxMap.get(a.code) ?? 1e9) - (idxMap.get(b.code) ?? 1e9));

function formatMDY(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  if (!y || !m || !d) return dateStr;
  return `${m}/${d}/${y}`;
}

function buildFigureString(line) {
  const parts = [];
  if (line.sector) parts.push(line.sector.code);
  if (line.size) parts.push(line.size.description);
  if (line.primary) parts.push(line.primary.code);
  if (line.model) parts.push(line.model.code);
  if (line.addFeatures?.length) parts.push(...line.addFeatures.map((f) => f.code));
  if (line.pattern) parts.push(line.pattern.code);
  if (line.material) parts.push(line.material.code);
  if (line.end) parts.push(line.end.code);
  if (line.coating) parts.push(line.coating.code);
  if (line.mainValvePos) parts.push(line.mainValvePos.code);
  if (line.tubing) parts.push(line.tubing.code);
  if (line.addAttrs?.length) parts.push(...line.addAttrs.map((a) => a.code));
  return parts.filter(Boolean).join(" ");
}

const FLOW_UNITS = ["gpm", "L/s"];
const PRESS_UNITS = ["psi", "bar", "kPa"];

function summarizeSetpoints(l) {
  const bits = [];
  if (l.flow !== undefined && l.flow !== null && `${l.flow}` !== "") bits.push(`Flow ${l.flow} ${l.flowUnit || "gpm"}`);
  if (l.pUp !== undefined && l.pUp !== null && `${l.pUp}` !== "") bits.push(`Up ${l.pUp} ${l.pUpUnit || "psi"}`);
  if (l.pDown !== undefined && l.pDown !== null && `${l.pDown}` !== "") bits.push(`Down ${l.pDown} ${l.pDownUnit || "psi"}`);
  return bits.join(", ");
}

function pressuresInvalid(l) {
  const up = parseFloat(l.pUp);
  const down = parseFloat(l.pDown);
  if (isNaN(up) || isNaN(down)) return false;
  return down > up;
}

// ------------------
//  UI HELPERS
// ------------------

function Select({ id, label, items, value, onChange }) {
  return (
    <div className="grid gap-2 w-full">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        className="border rounded px-2 py-2 w-full max-w-full bg-white"
        value={value?.code || ""}
        onChange={(e) => onChange(items.find((i) => i.code === e.target.value) || null)}
      >
        <option value="">Select…</option>
        {items.map((i) => (
          <option key={i.code} value={i.code}>{fmt(i)}</option>
        ))}
      </select>
    </div>
  );
}

/** Simple multi-select dropdown (no Add / Close / action bar).
 *  - Click the control to open/close
 *  - Click an option to toggle select/deselect
 *  - Click outside to close
 */
function MultiSelectSimple({ label, items, values, onChange, idxMap }) {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const selected = useMemo(() => new Set(values.map(v => v.code)), [values]);
  const sortedItems = useMemo(() => items.slice(), [items]);

  const applyFromSet = (set) => {
    const next = items.filter(i => set.has(i.code));
    onChange(sortCanonically(next, idxMap));
  };
  const toggle = (code) => {
    const next = new Set(selected);
    next.has(code) ? next.delete(code) : next.add(code);
    applyFromSet(next);
  };

  // Close on outside click
  useEffect(() => {
    function onDocClick(e) {
      if (!anchorEl) return;
      if (!anchorEl.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open, anchorEl]);

  const displayText = values.length === 0 ? 'None selected' : values.map(v => v.code).join(', ');

  return (
    <div ref={setAnchorEl} style={{ display: 'grid', gap: 8, width: '100%', position: 'relative' }}>
      <Label>{label}</Label>

      {/* Trigger styled like a native select, no Tailwind dependency */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{
          width: '100%',
          textAlign: 'left',
          border: '1px solid #e2e8f0',
          borderRadius: 6,
          padding: '8px 12px',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer'
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayText}</span>
        <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true"><path d="M5 7l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>
      </button>

      {open && (
        <div
          role="listbox"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: 4,
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            boxShadow: '0 6px 24px rgba(15,23,42,.08)',
            maxHeight: 320,
            overflow: 'auto',
            zIndex: 1000
          }}
        >
          {sortedItems.map((i) => {
            const isChecked = selected.has(i.code);
            return (
              <button
                key={i.code}
                type="button"
                role="option"
                aria-selected={isChecked}
                onClick={() => toggle(i.code)}
                title={`${i.code} — ${i.description}`}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  fontSize: 14,
                  background: isChecked ? '#f1f5f9' : '#fff',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <input type="checkbox" readOnly checked={isChecked} />
                <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}>{i.code}</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>— {i.description}</span>
              </button>
            );
          })}
          {sortedItems.length === 0 && (
            <div style={{ padding: '8px 12px', fontSize: 14, color: '#64748b' }}>No options</div>
          )}
        </div>
      )}
    </div>
  );
}

// ------------------
//  LINE EDITOR
// ------------------

function LineEditor({ line, onChange }) {
  const currentSizes = line.model ? SIZES_BY_MODEL[line.model.code] : [];
  const invalidPress = pressuresInvalid(line);

  return (
    <Card className="shadow-sm bg-white">
      <CardHeader>
        <CardTitle>Build Figure String</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Select id="sector" label="Sector" items={SECTORS} value={line.sector} onChange={(v) => onChange({ ...line, sector: v })} />
          <Select id="model" label="Model" items={MODELS} value={line.model} onChange={(v) => onChange({ ...line, model: v, size: null })} />
          <Select id="size" label="Size" items={currentSizes} value={line.size} onChange={(v) => onChange({ ...line, size: v })} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Select id="primary" label="Primary Feature" items={PRIMARY_FEATURES} value={line.primary} onChange={(v) => onChange({ ...line, primary: v })} />
          <MultiSelectSimple
            label="Additional Features"
            items={ADDITIONAL_FEATURES}
            values={line.addFeatures || []}
            onChange={(next) => onChange({ ...line, addFeatures: next })}
            idxMap={FEATURES_IDX}
          />
          <Select id="pattern" label="Pattern" items={PATTERNS} value={line.pattern} onChange={(v) => onChange({ ...line, pattern: v })} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Select id="material" label="Construction Material" items={MATERIALS} value={line.material} onChange={(v) => onChange({ ...line, material: v })} />
          <Select id="end" label="End Connection" items={ENDS} value={line.end} onChange={(v) => onChange({ ...line, end: v })} />
          <Select id="coating" label="Coating" items={COATINGS} value={line.coating} onChange={(v) => onChange({ ...line, coating: v })} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <Select id="mainValvePos" label="Main Valve Position" items={SOLENOID_VOLTAGE} value={line.mainValvePos} onChange={(v) => onChange({ ...line, mainValvePos: v })} />
          <Select id="tubing" label="Tubing & Fittings" items={TUBING} value={line.tubing} onChange={(v) => onChange({ ...line, tubing: v })} />
        </div>

        <MultiSelectSimple
          label="Additional Attributes"
          items={ADDITIONAL_ATTRIBUTES}
          values={line.addAttrs || []}
          onChange={(next) => onChange({ ...line, addAttrs: next })}
          idxMap={ATTRS_IDX}
        />

        <div className="grid gap-2">
          <Label>Hydraulic Setpoints</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Label htmlFor="flow">Flow</Label>
                <Input id="flow" type="number" step="any" value={line.flow ?? ""} onChange={(e) => onChange({ ...line, flow: e.target.value })} placeholder="e.g., 800" />
              </div>
              <div>
                <Label className="invisible md:visible">Unit</Label>
                <select className="border rounded px-2 py-2 bg-white" value={line.flowUnit || "gpm"} onChange={(e) => onChange({ ...line, flowUnit: e.target.value })}>
                  {FLOW_UNITS.map((u) => (<option key={u} value={u}>{u}</option>))}
                </select>
              </div>
            </div>

            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Label htmlFor="pUp">Upstream Pressure</Label>
                <Input id="pUp" type="number" step="any" value={line.pUp ?? ""} onChange={(e) => onChange({ ...line, pUp: e.target.value })} placeholder="e.g., 120" />
              </div>
              <div>
                <Label className="invisible md:visible">Unit</Label>
                <select className="border rounded px-2 py-2 bg-white" value={line.pUpUnit || "psi"} onChange={(e) => onChange({ ...line, pUpUnit: e.target.value })}>
                  {PRESS_UNITS.map((u) => (<option key={u} value={u}>{u}</option>))}
                </select>
              </div>
            </div>

            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Label htmlFor="pDown">Downstream Pressure</Label>
                <Input id="pDown" type="number" step="any" value={line.pDown ?? ""} onChange={(e) => onChange({ ...line, pDown: e.target.value })} placeholder="e.g., 80" />
              </div>
              <div>
                <Label className="invisible md:visible">Unit</Label>
                <select className="border rounded px-2 py-2 bg-white" value={line.pDownUnit || "psi"} onChange={(e) => onChange({ ...line, pDownUnit: e.target.value })}>
                  {PRESS_UNITS.map((u) => (<option key={u} value={u}>{u}</option>))}
                </select>
              </div>
            </div>
          </div>
          {invalidPress && (<div className="text-xs text-red-600">Downstream pressure should be ≤ Upstream pressure.</div>)}
        </div>

        <div className="grid gap-2 w-full max-w-xs">
          <Label htmlFor="qty">Quantity</Label>
          <Input id="qty" type="number" min={1} step={1} value={line.qty ?? 1} onChange={(e) => { const v = parseInt(e.target.value || "1", 10); onChange({ ...line, qty: isNaN(v) || v < 1 ? 1 : v }); }} />
        </div>

        <div className="rounded border p-2 bg-slate-50 text-sm">
          <Info className="inline h-4 w-4 mr-2" />
          {buildFigureString(line) || "(incomplete)"}
          {summarizeSetpoints(line) && (<div className="mt-1 text-slate-600">{summarizeSetpoints(line)}</div>)}
          <div className="mt-1 text-slate-600">Qty {line.qty ?? 1}</div>
        </div>
      </CardContent>
    </Card>
  );
}

// ------------------
//  APP
// ------------------

function defaultLine() {
  return {
    sector: SECTORS[0],
    model: null,
    size: null,
    primary: null,
    addFeatures: [],
    pattern: PATTERNS[0],
    material: MATERIALS[0],
    end: null,
    coating: null,
    mainValvePos: null,
    tubing: null,
    addAttrs: [],
    flow: "",
    flowUnit: "gpm",
    pUp: "",
    pUpUnit: "psi",
    pDown: "",
    pDownUnit: "psi",
    qty: 1,
  };
}

function formatBodyLines({ projectName, rsm, customer, saved, notes }) {
  const bidDateText = formatMDY(customer.bidDate);
  const selectionLines = saved.flatMap((ln, i) => {
    const f = buildFigureString(ln);
    const s = summarizeSetpoints(ln);
    return [`  ${i + 1}. ${f}`, s ? `     - ${s}` : null, `     - Qty: ${ln.qty ?? 1}`].filter(Boolean);
  });

  return [
    `Project: ${projectName || "(not provided)"}`,
    `RSM: ${rsm?.label || "(not selected)"}`,
    "",
    "Customer Information:",
    `  Company: ${customer.company || ""}`,
    `  Contact: ${customer.contact || ""}`,
    `  Email: ${customer.email || ""}`,
    `  Phone: ${customer.phone || ""}`,
    `  Address: ${customer.street1 || ""}${customer.street2 ? ", " + customer.street2 : ""}`,
    `  City/State/ZIP: ${customer.city || ""}${customer.state ? ", " + customer.state : ""}${customer.zip ? " " + customer.zip : ""}`,
    `  Country: ${customer.country || ""}`,
    `  Bid Date: ${bidDateText || ""}`,
    `  Requested Deliver by Date: ${formatMDY(customer.deliverBy) || ""}`,
    "",
    "Selections:",
    ...selectionLines,
    "",
    `Notes:\n${notes || ""}`,
  ];
}

function mailtoLink({ projectName, rsm, customer, saved, notes }) {
  const to = "ryan.cronin@vbtech.com";
  const ccList = ["jeanne.barkley@vbtech.com", rsm?.value].filter(Boolean).join(",");
  const cc = ccList ? `&cc=${encodeURIComponent(ccList)}` : "";
  const rsmLast = rsm?.last || "";
  const bidDateText = formatMDY(customer.bidDate);
  const subjectBase = `Engineering Review Request: ${rsmLast}${rsmLast ? ", " : ""}${projectName || "Project"}`;
  const subject = bidDateText ? `${subjectBase} – Bid Date ${bidDateText}` : subjectBase;

  const bodyLines = formatBodyLines({ projectName, rsm, customer, saved, notes });
  return `mailto:${to}?subject=${encodeURIComponent(subject)}${cc}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
}

// ------------------
//  LIGHTWEIGHT SELF-TESTS (run once in the browser console)
// ------------------
function runSelfTestsOnce() {
  if (typeof window === "undefined") return;
  if (window.__VALVE_CFG_TESTED__) return;
  window.__VALVE_CFG_TESTED__ = true;

  try {
    // Test 1: pressuresInvalid
    console.assert(pressuresInvalid({ pUp: 100, pDown: 120 }) === true, "pressuresInvalid should be true when downstream > upstream");
    console.assert(pressuresInvalid({ pUp: 120, pDown: 80 }) === false, "pressuresInvalid should be false when downstream <= upstream");
    console.assert(pressuresInvalid({ pUp: "", pDown: 80 }) === false, "pressuresInvalid should be false if any is NaN");

    // Test 2: buildFigureString ordering
    const line = {
      sector: { code: "WW" },
      size: { description: '6"' },
      primary: { code: "720" },
      model: { code: "EN" },
      addFeatures: [{ code: "55" }, { code: "C1" }],
      pattern: { code: "Y" },
      material: { code: "C" },
      end: { code: "A5" },
      coating: { code: "EB" },
      mainValvePos: { code: "5AC" },
      tubing: { code: "NN" },
      addAttrs: [{ code: "B" }, { code: "E1" }],
    };
    const fig = buildFigureString(line);
    console.assert(fig === 'WW 6" 720 EN 55 C1 Y C A5 EB 5AC NN B E1', `Unexpected figure string: ${fig}`);

    // Test 3: mailtoLink basic structure
    const href = mailtoLink({ projectName: "TestProj", rsm: RSMS[0], customer: { bidDate: "2025-08-20", deliverBy: "2025-09-01" }, saved: [line], notes: "hello" });
    console.assert(href.startsWith("mailto:"), "mailtoLink should start with mailto:");
    console.assert(href.includes("subject=") && href.includes("body="), "mailtoLink should include subject and body params");

    // Test 4: summarizeSetpoints
    const s = summarizeSetpoints({ flow: 800, flowUnit: "gpm", pUp: 120, pUpUnit: "psi", pDown: 80, pDownUnit: "psi" });
    console.assert(s === "Flow 800 gpm, Up 120 psi, Down 80 psi", `Unexpected setpoints: ${s}`);

    // Test 5: fmt utility
    console.assert(fmt({ code: "A", description: "Alpha" }) === "A - Alpha", "fmt should format code - description");
    console.assert(fmt(null) === "", "fmt(null) should be empty string");

    // Test 6: formatBodyLines minimal presence
    const body = formatBodyLines({ projectName: "X", rsm: RSMS[0], customer: { bidDate: "2025-08-20", deliverBy: "2025-09-01" }, saved: [line], notes: "n" });
    console.assert(Array.isArray(body) && body.some(l => l === "Selections:"), "Body should contain Selections header");

    console.log("✔ Valve configurator self-tests passed");
  } catch (err) {
    console.error("Self-tests failed:", err);
  }
}

export default function App() {
  const [projectName, setProjectName] = useState("");
  const [customer, setCustomer] = useState({
    company: "",
    contact: "",
    email: "",
    phone: "",
    street1: "",
    street2: "",
    city: "",
    state: "",
    zip: "",
    country: "USA",
    bidDate: "",
    deliverBy: "",
  });
  const [rsm, setRsm] = useState(null);
  const [notes, setNotes] = useState("");

  const [current, setCurrent] = useState(defaultLine());
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    runSelfTestsOnce();
  }, []);

  const addToSummary = () => {
    setSaved((s) => [...s, current]);
    setCurrent(defaultLine());
  };
  const removeSaved = (idx) => setSaved((s) => s.filter((_, i) => i !== idx));

  const emailHref = useMemo(() => mailtoLink({ projectName, rsm, customer, saved, notes }), [projectName, rsm, customer, saved, notes]);

  return (
    <div className="relative min-h-screen bg-white overflow-x-hidden">
      <div className="absolute inset-0 bg-white" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-6xl p-6 grid gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">BERMAD 700 SIGMA – Configurator v3.8.2</h1>
        </div>

        {/* Customer / Project Information */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Customer / Project Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label>Project Name</Label>
                <Input value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="e.g., Hillcrest Booster Station" />
              </div>
              <div className="grid gap-2">
                <Label>Company</Label>
                <Input value={customer.company} onChange={(e) => setCustomer({ ...customer, company: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Primary Contact</Label>
                <Input value={customer.contact} onChange={(e) => setCustomer({ ...customer, contact: e.target.value })} />
              </div>

              <div className="grid gap-2">
                <Label>Email</Label>
                <Input type="email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Phone</Label>
                <Input value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
              </div>

              {/* Address Block */}
              <div className="grid gap-2 md:col-span-3">
                <Label>Street Address 1</Label>
                <Input value={customer.street1} onChange={(e) => setCustomer({ ...customer, street1: e.target.value })} />
              </div>
              <div className="grid gap-2 md:col-span-3">
                <Label>Street Address 2 (optional)</Label>
                <Input value={customer.street2} onChange={(e) => setCustomer({ ...customer, street2: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>City</Label>
                <Input value={customer.city} onChange={(e) => setCustomer({ ...customer, city: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>State / Province</Label>
                <Input value={customer.state} onChange={(e) => setCustomer({ ...customer, state: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>ZIP / Postal Code</Label>
                <Input value={customer.zip} onChange={(e) => setCustomer({ ...customer, zip: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Country</Label>
                <Input value={customer.country} onChange={(e) => setCustomer({ ...customer, country: e.target.value })} />
              </div>

              {/* Dates */}
              <div className="grid gap-2">
                <Label>Bid Date</Label>
                <Input type="date" value={customer.bidDate} onChange={(e) => setCustomer({ ...customer, bidDate: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Requested Deliver by Date</Label>
                <Input type="date" value={customer.deliverBy} onChange={(e) => setCustomer({ ...customer, deliverBy: e.target.value })} />
              </div>

              {/* RSM */}
              <div className="grid gap-2">
                <Label>RSM</Label>
                <select className="border rounded p-2 w-full bg-white" value={rsm?.value || ""} onChange={(e) => { const found = RSMS.find((r) => r.value === e.target.value) || null; setRsm(found); }}>
                  <option value="">Select…</option>
                  {RSMS.map((r) => (<option key={r.value} value={r.value}>{r.label}</option>))}
                </select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Notes</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <LineEditor line={current} onChange={setCurrent} />
        <div>
          <Button variant="outline" onClick={addToSummary}>
            <Plus className="mr-2 h-4 w-4" />Add to Summary
          </Button>
        </div>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {saved.length === 0 && (<div className="text-sm text-slate-500">No lines added yet.</div>)}
            {saved.map((ln, i) => (
              <div key={i} className="border rounded p-2">
                <div className="flex items-center justify-between">
                  <div className="font-mono text-sm">{buildFigureString(ln) || "(incomplete)"}</div>
                  <Button variant="ghost" size="icon" title="Remove" onClick={() => removeSaved(i)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {summarizeSetpoints(ln) && (<div className="mt-1 text-xs text-slate-600">{summarizeSetpoints(ln)}</div>)}
                <div className="mt-1 text-xs text-slate-600">Qty {ln.qty ?? 1}</div>
              </div>
            ))}
            <div className="pt-2">
              <Button asChild>
                <a href={emailHref}>
                  <Send className="mr-2 h-4 w-4" />Submit for Engineering Review
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
