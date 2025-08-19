
import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card.jsx";
import { Button } from "./components/ui/button.jsx";
import { Input } from "./components/ui/input.jsx";
import { Textarea } from "./components/ui/textarea.jsx";
import { Label } from "./components/ui/label.jsx";
import { Plus, Send, Trash2, Info, Mail } from "lucide-react";

// --- Data (trimmed but representative) ---
const RSMS = [
  { label: "Charles Claussen", value: "charles.claussen@vbtech.com", last: "Claussen" },
  { label: "Wes Caudle", value: "wes.caudle@vbtech.com", last: "Caudle" },
  { label: "Ryan Carroll", value: "Ryan.Carroll@vbtech.com", last: "Carroll" },
  { label: "Brian Syzdek", value: "brian.syzdek@vbtech.com", last: "Syzdek" },
];
const SECTORS = [{ code: "WW", description: "Waterworks" }];
const MODELS = [{ code: "EN", description: "700-SIGMA EN" }, { code: "ES", description: "700-SIGMA ES" }];
const SIZES_BY_MODEL = {
  EN: [{ code: "DN50", description: '2"' }, { code: "DN100", description: '4"' }, { code: "DN150", description: '6"' }, { code: "DN200", description: '8"' }],
  ES: [{ code: "DN80", description: '3"' }, { code: "DN150", description: '6"' }, { code: "DN250", description: '10"' }, { code: "DN300", description: '12"' }],
};
const PRIMARY_FEATURES = [
  { code: "700", description: "Basic Valve (Double Chamber)" },
  { code: "720", description: "Pressure Reducing Valve" },
  { code: "730", description: "Pressure Sustaining/Relief" },
  { code: "770", description: "Flow Control" },
];
const PATTERNS = [{ code: "Y", description: "Oblique Y" }];
const MATERIALS = [{ code: "C", description: "Ductile Iron" }];
const ENDS = [
  { code: "16", description: "Flanged ISO 7005 PN16" },
  { code: "A5", description: "ANSI 150 RF" },
  { code: "VI", description: "Grooved ANSI C606 (≤8\")" },
];
const COATINGS = [{ code: "EB", description: "Epoxy FB Dark Blue" }, { code: "EV", description: "Epoxy FB + UV" }, { code: "UC", description: "Uncoated" }];
const TUBING = [{ code: "NN", description: "SS316 Tubing & Fittings" }, { code: "CB", description: "Copper & Brass" }];
const SOLENOID_VOLTAGE = [
  { code: "4DC", description: "24VDC – NC" },
  { code: "4DO", description: "24VDC – NO" },
  { code: "46C", description: "24VAC/60Hz – NC" },
  { code: "46O", description: "24VAC/60Hz – NO" },
];
const ADDITIONAL_FEATURES = [
  { code: "00", description: "No Additional Feature" },
  { code: "03", description: "Closing & Opening Speed Control" },
  { code: "22", description: "Pressure Reducing" },
  { code: "33", description: "Pressure Sustaining" },
  { code: "55", description: "Solenoid Controlled" },
];
const ADDITIONAL_ATTRIBUTES = [
  { code: "E1", description: "EPDM Elastomers" },
  { code: "E2", description: "Viton Elastomers" },
  { code: "I", description: "Valve Position Indicator" },
  { code: "6", description: "Pressure Gauge" },
  { code: "66", description: "Double Pressure Gauge" },
];

// --- Helpers ---
const fmt = (o) => (o ? `${o.code} - ${o.description}` : "");
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
const PRESS_UNITS = ["psi", "bar"];
function summarizeSetpoints(l) {
  const bits = [];
  if (l.flow !== "" && l.flow != null) bits.push(`Flow ${l.flow} ${l.flowUnit || "gpm"}`);
  if (l.pUp !== "" && l.pUp != null) bits.push(`Up ${l.pUp} ${l.pUpUnit || "psi"}`);
  if (l.pDown !== "" && l.pDown != null) bits.push(`Down ${l.pDown} ${l.pDownUnit || "psi"}`);
  return bits.join(", ");
}
function pressuresInvalid(l) {
  const up = parseFloat(l.pUp), down = parseFloat(l.pDown);
  if (isNaN(up) || isNaN(down)) return false;
  return down > up;
}

// --- UI helpers ---
function Select({ id, label, items, value, onChange }) {
  return (
    <div className="grid gap-2 w-full">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        className="border rounded px-2 py-2 w-full max-w-full"
        value={value?.code || ""}
        onChange={(e) => onChange(items.find((i) => i.code === e.target.value) || null)}
      >
        <option value="">Select…</option>
        {items.map((i) => (<option key={i.code} value={i.code}>{fmt(i)}</option>))}
      </select>
    </div>
  );
}
function MultiSelectAdd({ label, items, values, onAdd }) {
  const [input, setInput] = useState("");
  const add = () => {
    const code = input.includes(" - ") ? input.split(" - ")[0] : input;
    const found = items.find((i) => i.code === code);
    if (found && !values.some((v) => v.code === found.code)) onAdd(found);
    setInput("");
  };
  return (
    <div className="grid gap-2 w-full">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input list={`${label}-list`} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }} placeholder="Type code or select…" />
        <datalist id={`${label}-list`}>
          {items.map((s) => (<option key={s.code} value={fmt(s)} />))}
        </datalist>
        <Button onClick={add}>Add</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {values.map((v) => (<span key={v.code} className="border rounded px-2 py-1 text-xs">{fmt(v)}</span>))}
      </div>
    </div>
  );
}

// --- Line Editor ---
function LineEditor({ line, onChange }) {
  const currentSizes = line.model ? SIZES_BY_MODEL[line.model.code] : [];
  const addFeat = (f) => onChange({ ...line, addFeatures: [...(line.addFeatures || []), f] });
  const addAttr = (a) => onChange({ ...line, addAttrs: [...(line.addAttrs || []), a] });
  const invalidPress = pressuresInvalid(line);

  return (
    <Card className="shadow-sm">
      <CardHeader><CardTitle>Build Figure String</CardTitle></CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select id="sector" label="Sector" items={SECTORS} value={line.sector} onChange={(v) => onChange({ ...line, sector: v })} />
          <Select id="model" label="Model" items={MODELS} value={line.model} onChange={(v) => onChange({ ...line, model: v, size: null })} />
          <Select id="size" label="Size" items={currentSizes} value={line.size} onChange={(v) => onChange({ ...line, size: v })} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select id="primary" label="Primary Feature" items={PRIMARY_FEATURES} value={line.primary} onChange={(v) => onChange({ ...line, primary: v })} />
          <MultiSelectAdd label="Additional Features" items={ADDITIONAL_FEATURES} values={line.addFeatures || []} onAdd={addFeat} />
          <Select id="pattern" label="Pattern" items={PATTERNS} value={line.pattern} onChange={(v) => onChange({ ...line, pattern: v })} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select id="material" label="Construction Material" items={MATERIALS} value={line.material} onChange={(v) => onChange({ ...line, material: v })} />
          <Select id="end" label="End Connection" items={ENDS} value={line.end} onChange={(v) => onChange({ ...line, end: v })} />
          <Select id="coating" label="Coating" items={COATINGS} value={line.coating} onChange={(v) => onChange({ ...line, coating: v })} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select id="mainValvePos" label="Main Valve Position" items={SOLENOID_VOLTAGE} value={line.mainValvePos} onChange={(v) => onChange({ ...line, mainValvePos: v })} />
          <Select id="tubing" label="Tubing & Fittings" items={TUBING} value={line.tubing} onChange={(v) => onChange({ ...line, tubing: v })} />
        </div>

        <MultiSelectAdd label="Additional Attributes" items={ADDITIONAL_ATTRIBUTES} values={line.addAttrs || []} onAdd={addAttr} />

        <div className="grid gap-2">
          <Label>Hydraulic Setpoints</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Label htmlFor="flow">Flow</Label>
                <Input id="flow" type="number" step="any" value={line.flow ?? ""} onChange={(e) => onChange({ ...line, flow: e.target.value })} placeholder="e.g., 800" />
              </div>
              <div>
                <Label className="invisible md:visible">Unit</Label>
                <select className="border rounded px-2 py-2" value={line.flowUnit || "gpm"} onChange={(e) => onChange({ ...line, flowUnit: e.target.value })}>
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
                <select className="border rounded px-2 py-2" value={line.pUpUnit || "psi"} onChange={(e) => onChange({ ...line, pUpUnit: e.target.value })}>
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
                <select className="border rounded px-2 py-2" value={line.pDownUnit || "psi"} onChange={(e) => onChange({ ...line, pDownUnit: e.target.value })}>
                  {PRESS_UNITS.map((u) => (<option key={u} value={u}>{u}</option>))}
                </select>
              </div>
            </div>
          </div>
          {invalidPress && (<div className="muted" style={{color:'#dc2626'}}>Downstream pressure should be ≤ Upstream pressure.</div>)}
        </div>

        <div className="grid gap-2 w-full" style={{maxWidth:'220px'}}>
          <Label htmlFor="qty">Quantity</Label>
          <Input id="qty" type="number" min={1} step={1} value={line.qty ?? 1}
            onChange={(e) => { const v = parseInt(e.target.value||"1",10); onChange({ ...line, qty: isNaN(v)||v<1 ? 1 : v }); }} />
        </div>

        <div className="rounded border p-2" style={{background:'#f8fafc', fontSize:'14px'}}>
          <span style={{display:'inline-flex',alignItems:'center',gap:'6px'}}>
            <Info size={16} /> {buildFigureString(line) || "(incomplete)"}
          </span>
          {summarizeSetpoints(line) && (<div style={{marginTop:'4px', color:'#475569'}}>{summarizeSetpoints(line)}</div>)}
          <div style={{marginTop:'4px', color:'#475569'}}>Qty {line.qty ?? 1}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function defaultLine(){
  return { sector: SECTORS[0], model:null, size:null, primary:null, addFeatures:[], pattern:PATTERNS[0], material:MATERIALS[0], end:null, coating:null, mainValvePos:null, tubing:null, addAttrs:[], flow:"", flowUnit:"gpm", pUp:"", pUpUnit:"psi", pDown:"", pDownUnit:"psi", qty:1 };
}

function mailtoLink({ projectName, rsm, customer, saved, notes }) {
  const to = "ryan.cronin@vbtech.com";
  const cc = rsm?.value ? `&cc=${encodeURIComponent(rsm.value)}` : "";
  const subject = `Engineering Review: ${projectName || customer?.jobsite || "Untitled Project"} — ${rsm?.last || "RSM N/A"}`;
  const selectionLines = saved.flatMap((ln, i) => {
    const f = buildFigureString(ln); const s = summarizeSetpoints(ln);
    return [`  ${i + 1}. ${f || "(incomplete)"}`, s ? `     - ${s}` : null, `     - Qty: ${ln.qty ?? 1}`].filter(Boolean);
  });
  const bodyLines = [
    "VBT Tools — Ordering Guide",
    "Version: v3.5", "",
    "=== Project / RSM ===",
    `Project: ${projectName || "(not provided)"}`,
    `RSM: ${rsm?.label || "(not selected)"}`, "",
    "=== Customer / Jobsite ===",
    `Company: ${customer.company || ""}`,
    `Contact: ${customer.contact || ""}`,
    `Email: ${customer.email || ""}`,
    `Phone: ${customer.phone || ""}`,
    `Jobsite: ${customer.jobsite || ""}`,
    `City/State: ${customer.city || ""}`, "",
    "=== Selections ===",
    ...selectionLines, "",
    "=== Notes ===",
    (notes || "(none)"),
  ];
  return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}${cc}&body=${encodeURIComponent(bodyLines.join("\\n"))}`;
}

export default function App(){
  const [projectName, setProjectName] = useState("");
  const [customer, setCustomer] = useState({ company: "", contact: "", email: "", phone: "", jobsite: "", city: "" });
  const [rsm, setRsm] = useState(null);
  const [notes, setNotes] = useState("");
  const [current, setCurrent] = useState(defaultLine());
  const [saved, setSaved] = useState([]);
  const addToSummary = () => { setSaved((s)=>[...s, current]); setCurrent(defaultLine()); };
  const removeSaved = (idx) => setSaved((s)=>s.filter((_,i)=>i!==idx));
  const emailHref = useMemo(()=>mailtoLink({ projectName, rsm, customer, saved, notes }),[projectName, rsm, customer, saved, notes]);

  return (
    <div className="container grid gap-6">
      <div className="flex" style={{justifyContent:'space-between', alignItems:'center'}}>
        <h1 style={{fontSize:'22px', fontWeight:800}}>VBT Tools — Configurator v3.5</h1>
        <Button asChild><a href={emailHref}><Mail style={{marginRight:6}} size={16}/>Submit for Engineering Review</a></Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Customer / Jobsite Information</CardTitle></CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grid gap-2"><Label>Project Name</Label><Input value={projectName} onChange={(e)=>setProjectName(e.target.value)} placeholder="e.g., Hillcrest Booster Station"/></div>
            <div className="grid gap-2"><Label>Company</Label><Input value={customer.company} onChange={(e)=>setCustomer({...customer, company:e.target.value})} /></div>
            <div className="grid gap-2"><Label>Primary Contact</Label><Input value={customer.contact} onChange={(e)=>setCustomer({...customer, contact:e.target.value})} /></div>
            <div className="grid gap-2"><Label>Email</Label><Input type="email" value={customer.email} onChange={(e)=>setCustomer({...customer, email:e.target.value})} /></div>
            <div className="grid gap-2"><Label>Phone</Label><Input value={customer.phone} onChange={(e)=>setCustomer({...customer, phone:e.target.value})} /></div>
            <div className="grid gap-2"><Label>Jobsite</Label><Input value={customer.jobsite} onChange={(e)=>setCustomer({...customer, jobsite:e.target.value})} /></div>
            <div className="grid gap-2"><Label>City / State</Label><Input value={customer.city} onChange={(e)=>setCustomer({...customer, city:e.target.value})} /></div>
            <div className="grid gap-2">
              <Label>RSM</Label>
              <select className="border rounded p-2 w-full" value={rsm?.value || ""} onChange={(e)=>{ const found = RSMS.find((r)=>r.value===e.target.value) || null; setRsm(found); }}>
                <option value="">Select…</option>
                {RSMS.map((r)=>(<option key={r.value} value={r.value}>{r.label}</option>))}
              </select>
            </div>
          </div>
          <div className="grid gap-2"><Label>Notes</Label><Textarea value={notes} onChange={(e)=>setNotes(e.target.value)} /></div>
        </CardContent>
      </Card>

      <LineEditor line={current} onChange={setCurrent} />
      <div><Button variant="outline" onClick={addToSummary}><Plus size={16} style={{marginRight:6}}/>Add to Summary</Button></div>

      <Card>
        <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
        <CardContent className="grid gap-2">
          {saved.length===0 && (<div className="muted">No lines added yet.</div>)}
          {saved.map((ln,i)=>(
            <div key={i} className="border" style={{borderRadius:10, padding:8}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div style={{fontFamily:'ui-monospace, SFMono-Regular, Menlo, Consolas', fontSize:13}}>{buildFigureString(ln) || "(incomplete)"}</div>
                <Button variant="outline" onClick={()=>removeSaved(i)} title="Remove"><Trash2 size={16}/></Button>
              </div>
              {summarizeSetpoints(ln) && (<div style={{marginTop:4}} className="muted">{summarizeSetpoints(ln)}</div>)}
              <div style={{marginTop:4}} className="muted">Qty {ln.qty ?? 1}</div>
            </div>
          ))}
          <div className="pt-2"><Button asChild><a href={emailHref}><Send size={16} style={{marginRight:6}}/>Submit for Engineering Review</a></Button></div>
        </CardContent>
      </Card>
    </div>
  );
}
