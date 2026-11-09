"use client";

import { Plus, RotateCcw, Trash2 } from "lucide-react";
import { FormEvent, useState } from "react";
import {
  calculateCompoundInterest,
  calculateGpa,
  calculateLoan,
  percentageChange,
  percentageOf,
  whatPercent,
} from "@/lib/calculations";

const number = (value: string) => (value.trim() === "" ? Number.NaN : Number(value));
const currency = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);
const decimal = (value: number, digits = 6) => new Intl.NumberFormat("en-US", { maximumFractionDigits: digits }).format(value);

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="tool-panel"><div className="tool-panel__header"><h2>{title}</h2><span>Results update when you calculate</span></div>{children}</section>;
}

function PercentageCalculator() {
  const [mode, setMode] = useState("of");
  const [a, setA] = useState("15");
  const [b, setB] = useState("200");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState("");
  const submit = (event: FormEvent) => {
    event.preventDefault(); setError("");
    try {
      const first = number(a), second = number(b);
      setResult(mode === "of" ? percentageOf(first, second) : mode === "ratio" ? whatPercent(first, second) : percentageChange(first, second));
    } catch (reason) { setResult(null); setError(reason instanceof Error ? reason.message : "Unable to calculate."); }
  };
  const reset = () => { setMode("of"); setA("15"); setB("200"); setResult(null); setError(""); };
  const labels = mode === "of" ? ["Percentage", "Value"] : mode === "ratio" ? ["Part", "Whole"] : ["Original value", "New value"];
  return <Panel title="Percentage calculation"><form className="tool-stack" onSubmit={submit}>
    <div className="field"><label htmlFor="percentage-mode">Calculation</label><select id="percentage-mode" value={mode} onChange={(e) => { setMode(e.target.value); setResult(null); }}><option value="of">What is X% of Y?</option><option value="ratio">X is what percent of Y?</option><option value="change">Percentage change from X to Y</option></select></div>
    <div className="form-grid"><div className="field"><label htmlFor="percentage-a">{labels[0]}</label><input id="percentage-a" type="number" step="any" value={a} onChange={(e) => setA(e.target.value)} /></div><div className="field"><label htmlFor="percentage-b">{labels[1]}</label><input id="percentage-b" type="number" step="any" value={b} onChange={(e) => setB(e.target.value)} /></div></div>
    {error && <div className="error-box" role="alert">{error}</div>}
    {result !== null && <div className="result-box" aria-live="polite"><span className="result-box__label">Result</span><strong className="result-box__value">{decimal(result)}{mode !== "of" ? "%" : ""}</strong></div>}
    <div className="button-row"><button className="button button--primary" type="submit">Calculate</button><button className="button button--secondary" type="button" onClick={reset}><RotateCcw size={16} /> Reset</button></div>
  </form></Panel>;
}

function LoanCalculator() {
  const [principal, setPrincipal] = useState("300000"), [rate, setRate] = useState("6"), [years, setYears] = useState("30");
  const [result, setResult] = useState<ReturnType<typeof calculateLoan> | null>(null), [error, setError] = useState("");
  const submit = (event: FormEvent) => { event.preventDefault(); setError(""); try { setResult(calculateLoan(number(principal), number(rate), number(years))); } catch (reason) { setResult(null); setError(reason instanceof Error ? reason.message : "Unable to calculate."); } };
  const reset = () => { setPrincipal("300000"); setRate("6"); setYears("30"); setResult(null); setError(""); };
  return <Panel title="Fixed-rate loan estimate"><form className="tool-stack" onSubmit={submit}>
    <div className="form-grid form-grid--3"><div className="field"><label htmlFor="loan-principal">Loan amount (USD)</label><input id="loan-principal" type="number" min="0" step="0.01" value={principal} onChange={(e) => setPrincipal(e.target.value)} /></div><div className="field"><label htmlFor="loan-rate">Annual rate (%)</label><input id="loan-rate" type="number" min="0" step="0.001" value={rate} onChange={(e) => setRate(e.target.value)} /></div><div className="field"><label htmlFor="loan-years">Term (years)</label><input id="loan-years" type="number" min="0.1" step="0.1" value={years} onChange={(e) => setYears(e.target.value)} /></div></div>
    {error && <div className="error-box" role="alert">{error}</div>}
    {result && <><div className="result-box"><span className="result-box__label">Estimated monthly payment</span><strong className="result-box__value">{currency(result.monthlyPayment)}</strong></div><div className="result-grid"><div className="stat"><span>Total of payments</span><strong>{currency(result.totalPayment)}</strong></div><div className="stat"><span>Total interest</span><strong>{currency(result.totalInterest)}</strong></div><div className="stat"><span>Payments</span><strong>{result.numberOfPayments}</strong></div></div></>}
    <div className="field__hint">Assumes a fixed rate, equal monthly payments, and no taxes, insurance, fees, or prepayments.</div>
    <div className="button-row"><button className="button button--primary" type="submit">Calculate payment</button><button className="button button--secondary" type="button" onClick={reset}><RotateCcw size={16} /> Reset</button></div>
  </form></Panel>;
}

function CompoundCalculator() {
  const [principal, setPrincipal] = useState("10000"), [rate, setRate] = useState("5"), [years, setYears] = useState("10"), [frequency, setFrequency] = useState("12"), [monthly, setMonthly] = useState("0");
  const [result, setResult] = useState<ReturnType<typeof calculateCompoundInterest> | null>(null), [error, setError] = useState("");
  const submit = (event: FormEvent) => { event.preventDefault(); setError(""); try { setResult(calculateCompoundInterest(number(principal), number(rate), number(years), number(frequency), number(monthly))); } catch (reason) { setResult(null); setError(reason instanceof Error ? reason.message : "Unable to calculate."); } };
  const reset = () => { setPrincipal("10000"); setRate("5"); setYears("10"); setFrequency("12"); setMonthly("0"); setResult(null); setError(""); };
  return <Panel title="Compound growth projection"><form className="tool-stack" onSubmit={submit}>
    <div className="form-grid"><div className="field"><label htmlFor="compound-principal">Starting amount (USD)</label><input id="compound-principal" type="number" min="0" step="0.01" value={principal} onChange={(e) => setPrincipal(e.target.value)} /></div><div className="field"><label htmlFor="compound-rate">Annual rate (%)</label><input id="compound-rate" type="number" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} /></div><div className="field"><label htmlFor="compound-years">Years</label><input id="compound-years" type="number" min="0" step="0.1" value={years} onChange={(e) => setYears(e.target.value)} /></div><div className="field"><label htmlFor="compound-frequency">Compounding</label><select id="compound-frequency" value={frequency} onChange={(e) => setFrequency(e.target.value)}><option value="1">Annually</option><option value="4">Quarterly</option><option value="12">Monthly</option><option value="365">Daily</option></select></div><div className="field"><label htmlFor="compound-monthly">Monthly contribution (USD)</label><input id="compound-monthly" type="number" min="0" step="0.01" value={monthly} onChange={(e) => setMonthly(e.target.value)} /></div></div>
    {error && <div className="error-box" role="alert">{error}</div>}
    {result && <><div className="result-box"><span className="result-box__label">Projected future value</span><strong className="result-box__value">{currency(result.futureValue)}</strong></div><div className="result-grid"><div className="stat"><span>Total contributed</span><strong>{currency(result.totalContributions)}</strong></div><div className="stat"><span>Interest earned</span><strong>{currency(result.interestEarned)}</strong></div><div className="stat"><span>Growth multiple</span><strong>{result.totalContributions ? (result.futureValue / result.totalContributions).toFixed(2) : "—"}×</strong></div></div></>}
    <div className="field__hint">Projection only. Assumes a constant rate, end-of-month contributions, and no taxes, fees, or withdrawals.</div>
    <div className="button-row"><button className="button button--primary" type="submit">Calculate growth</button><button className="button button--secondary" type="button" onClick={reset}><RotateCcw size={16} /> Reset</button></div>
  </form></Panel>;
}

const gradeOptions = [["A", 4], ["A−", 3.7], ["B+", 3.3], ["B", 3], ["B−", 2.7], ["C+", 2.3], ["C", 2], ["C−", 1.7], ["D+", 1.3], ["D", 1], ["F", 0]] as const;
type CourseRow = { id: number; name: string; credits: string; grade: string };

function GpaCalculator() {
  const [courses, setCourses] = useState<CourseRow[]>([{ id: 1, name: "Course 1", credits: "3", grade: "4" }, { id: 2, name: "Course 2", credits: "3", grade: "3.3" }]);
  const [result, setResult] = useState<{ gpa: number; totalCredits: number } | null>(null), [error, setError] = useState("");
  const update = (id: number, key: keyof Omit<CourseRow, "id">, value: string) => setCourses((rows) => rows.map((row) => row.id === id ? { ...row, [key]: value } : row));
  const submit = (event: FormEvent) => { event.preventDefault(); setError(""); try { setResult(calculateGpa(courses.map((course) => ({ credits: number(course.credits), gradePoint: number(course.grade) })))); } catch (reason) { setResult(null); setError(reason instanceof Error ? reason.message : "Unable to calculate."); } };
  const reset = () => { setCourses([{ id: 1, name: "Course 1", credits: "3", grade: "4" }, { id: 2, name: "Course 2", credits: "3", grade: "3.3" }]); setResult(null); setError(""); };
  return <Panel title="4.0 scale GPA"><form className="tool-stack" onSubmit={submit}>
    <div className="field-label">Courses</div>{courses.map((course) => <div className="course-row" key={course.id}><div className="field"><label className="sr-only" htmlFor={`course-name-${course.id}`}>Course name</label><input id={`course-name-${course.id}`} value={course.name} onChange={(e) => update(course.id, "name", e.target.value)} /></div><div className="field"><label className="sr-only" htmlFor={`course-credits-${course.id}`}>Credits</label><input id={`course-credits-${course.id}`} type="number" min="0.1" step="0.1" value={course.credits} onChange={(e) => update(course.id, "credits", e.target.value)} /></div><div className="field"><label className="sr-only" htmlFor={`course-grade-${course.id}`}>Grade</label><select id={`course-grade-${course.id}`} value={course.grade} onChange={(e) => update(course.id, "grade", e.target.value)}>{gradeOptions.map(([label, value]) => <option key={label} value={value}>{label}</option>)}</select></div><button className="mini-button" type="button" aria-label={`Remove ${course.name}`} disabled={courses.length === 1} onClick={() => setCourses((rows) => rows.filter((row) => row.id !== course.id))}><Trash2 size={16} /></button></div>)}
    <button className="button button--secondary" type="button" onClick={() => setCourses((rows) => [...rows, { id: Math.max(0, ...rows.map((row) => row.id)) + 1, name: `Course ${rows.length + 1}`, credits: "3", grade: "4" }])}><Plus size={16} /> Add course</button>
    {error && <div className="error-box" role="alert">{error}</div>}
    {result && <div className="result-box"><span className="result-box__label">Calculated GPA · {decimal(result.totalCredits, 2)} credits</span><strong className="result-box__value">{result.gpa.toFixed(2)}</strong></div>}
    <div className="field__hint">Uses a standard unweighted 4.0 scale. Your school's grade-point policy may differ.</div>
    <div className="button-row"><button className="button button--primary" type="submit">Calculate GPA</button><button className="button button--secondary" type="button" onClick={reset}><RotateCcw size={16} /> Reset</button></div>
  </form></Panel>;
}

export function CalculatorTools({ slug }: { slug: string }) {
  if (slug === "percentage-calculator") return <PercentageCalculator />;
  if (slug === "loan-calculator") return <LoanCalculator />;
  if (slug === "compound-interest-calculator") return <CompoundCalculator />;
  return <GpaCalculator />;
}
