"use client";

import { ArrowDownUp, Copy, RotateCcw } from "lucide-react";
import { FormEvent, useState } from "react";
import {
  convertLinear,
  convertTemperature,
  lengthUnits,
  speedUnits,
  weightUnits,
  type TemperatureUnit,
  type UnitTable,
} from "@/lib/conversions";

const format = (value: number) => {
  const magnitude = Math.abs(value);
  if ((magnitude > 0 && magnitude < 0.000001) || magnitude >= 1e12) return value.toExponential(8);
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 10 }).format(value);
};

function Converter({ title, units, initialFrom, initialTo }: { title: string; units: UnitTable; initialFrom: string; initialTo: string }) {
  const [value, setValue] = useState("1"), [from, setFrom] = useState(initialFrom), [to, setTo] = useState(initialTo);
  const [result, setResult] = useState<number | null>(null), [error, setError] = useState(""), [copied, setCopied] = useState(false);
  const submit = (event: FormEvent) => { event.preventDefault(); setError(""); try { const parsed = value.trim() === "" ? Number.NaN : Number(value); setResult(convertLinear(parsed, from, to, units)); } catch (reason) { setResult(null); setError(reason instanceof Error ? reason.message : "Unable to convert."); } };
  const swap = () => { setFrom(to); setTo(from); setResult(null); };
  const reset = () => { setValue("1"); setFrom(initialFrom); setTo(initialTo); setResult(null); setError(""); };
  const copy = async () => { if (result === null) return; await navigator.clipboard.writeText(String(result)); setCopied(true); window.setTimeout(() => setCopied(false), 1400); };
  return <section className="tool-panel"><div className="tool-panel__header"><h2>{title}</h2><span>Precise reference factors</span></div><form className="tool-stack" onSubmit={submit}>
    <div className="field"><label htmlFor="convert-value">Value</label><input id="convert-value" type="number" step="any" value={value} onChange={(e) => setValue(e.target.value)} /></div>
    <div className="form-grid"><div className="field"><label htmlFor="convert-from">From</label><select id="convert-from" value={from} onChange={(e) => { setFrom(e.target.value); setResult(null); }}>{Object.entries(units).map(([key, unit]) => <option key={key} value={key}>{unit.label}</option>)}</select></div><div className="field"><label htmlFor="convert-to">To</label><select id="convert-to" value={to} onChange={(e) => { setTo(e.target.value); setResult(null); }}>{Object.entries(units).map(([key, unit]) => <option key={key} value={key}>{unit.label}</option>)}</select></div></div>
    <div className="button-row"><button className="button button--secondary" type="button" onClick={swap}><ArrowDownUp size={16} /> Swap units</button></div>
    {error && <div className="error-box" role="alert">{error}</div>}
    {result !== null && <div className="result-box"><span className="result-box__label">Converted value</span><strong className="result-box__value">{format(result)}</strong><span className="field__hint">{units[to].label}</span></div>}
    <div className="button-row"><button className="button button--primary" type="submit">Convert</button><button className="button button--secondary" type="button" disabled={result === null} onClick={copy}><Copy size={16} /> {copied ? "Copied" : "Copy result"}</button><button className="button button--secondary" type="button" onClick={reset}><RotateCcw size={16} /> Reset</button></div>
  </form></section>;
}

const temperatureLabels: Record<TemperatureUnit, string> = { celsius: "Celsius (°C)", fahrenheit: "Fahrenheit (°F)", kelvin: "Kelvin (K)" };

function TemperatureConverter() {
  const [value, setValue] = useState("32"), [from, setFrom] = useState<TemperatureUnit>("fahrenheit"), [to, setTo] = useState<TemperatureUnit>("celsius");
  const [result, setResult] = useState<number | null>(null), [error, setError] = useState("");
  const submit = (event: FormEvent) => { event.preventDefault(); setError(""); try { setResult(convertTemperature(value.trim() === "" ? Number.NaN : Number(value), from, to)); } catch (reason) { setResult(null); setError(reason instanceof Error ? reason.message : "Unable to convert."); } };
  const swap = () => { setFrom(to); setTo(from); setResult(null); };
  const reset = () => { setValue("32"); setFrom("fahrenheit"); setTo("celsius"); setResult(null); setError(""); };
  return <section className="tool-panel"><div className="tool-panel__header"><h2>Temperature conversion</h2><span>Absolute-zero checked</span></div><form className="tool-stack" onSubmit={submit}>
    <div className="field"><label htmlFor="temperature-value">Temperature</label><input id="temperature-value" type="number" step="any" value={value} onChange={(e) => setValue(e.target.value)} /></div>
    <div className="form-grid"><div className="field"><label htmlFor="temperature-from">From</label><select id="temperature-from" value={from} onChange={(e) => { setFrom(e.target.value as TemperatureUnit); setResult(null); }}>{Object.entries(temperatureLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></div><div className="field"><label htmlFor="temperature-to">To</label><select id="temperature-to" value={to} onChange={(e) => { setTo(e.target.value as TemperatureUnit); setResult(null); }}>{Object.entries(temperatureLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></div></div>
    <div className="button-row"><button className="button button--secondary" type="button" onClick={swap}><ArrowDownUp size={16} /> Swap scales</button></div>
    {error && <div className="error-box" role="alert">{error}</div>}
    {result !== null && <div className="result-box"><span className="result-box__label">Converted temperature</span><strong className="result-box__value">{format(result)} {to === "celsius" ? "°C" : to === "fahrenheit" ? "°F" : "K"}</strong></div>}
    <div className="button-row"><button className="button button--primary" type="submit">Convert</button><button className="button button--secondary" type="button" onClick={reset}><RotateCcw size={16} /> Reset</button></div>
  </form></section>;
}

export function ConverterTools({ slug }: { slug: string }) {
  if (slug === "temperature-converter") return <TemperatureConverter />;
  if (slug === "length-converter") return <Converter title="Length conversion" units={lengthUnits} initialFrom="mile" initialTo="kilometer" />;
  if (slug === "weight-converter") return <Converter title="Weight conversion" units={weightUnits} initialFrom="pound" initialTo="kilogram" />;
  return <Converter title="Speed conversion" units={speedUnits} initialFrom="milesPerHour" initialTo="kilometersPerHour" />;
}
