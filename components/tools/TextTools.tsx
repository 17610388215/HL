"use client";

import { Copy, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

function copyText(text: string, setCopied: (value: boolean) => void) {
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => { setCopied(true); window.setTimeout(() => setCopied(false), 1400); });
}

function WordCounter() {
  const [text, setText] = useState(""); const [copied, setCopied] = useState(false);
  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/u).length : 0;
    const sentences = trimmed ? (trimmed.match(/[^.!?]+[.!?]+|[^.!?]+$/gu) ?? []).length : 0;
    const paragraphs = trimmed ? trimmed.split(/\n\s*\n/u).filter(Boolean).length : 0;
    return { words, sentences, paragraphs, characters: [...text].length, reading: words ? Math.max(1, Math.ceil(words / 200)) : 0 };
  }, [text]);
  return <section className="tool-panel"><div className="tool-panel__header"><h2>Live text analysis</h2><span>Nothing is saved</span></div><div className="tool-stack">
    <div className="result-grid"><div className="stat"><span>Words</span><strong>{stats.words}</strong></div><div className="stat"><span>Characters</span><strong>{stats.characters}</strong></div><div className="stat"><span>Reading time</span><strong>{stats.reading} min</strong></div></div>
    <div className="field"><label htmlFor="word-counter-text">Your text</label><textarea id="word-counter-text" placeholder="Start typing or paste text here…" value={text} onChange={(e) => setText(e.target.value)} /></div>
    <div className="result-grid"><div className="stat"><span>Sentences</span><strong>{stats.sentences}</strong></div><div className="stat"><span>Paragraphs</span><strong>{stats.paragraphs}</strong></div><div className="stat"><span>Average word length</span><strong>{stats.words ? (text.replace(/\s/gu, "").length / stats.words).toFixed(1) : "0"}</strong></div></div>
    <div className="button-row"><button className="button button--secondary" type="button" onClick={() => copyText(text, setCopied)} disabled={!text}><Copy size={16} /> {copied ? "Copied" : "Copy text"}</button><button className="button button--secondary" type="button" onClick={() => setText("")} disabled={!text}><RotateCcw size={16} /> Clear</button></div>
  </div></section>;
}

function CharacterCounter() {
  const [text, setText] = useState("");
  const stats = useMemo(() => ({ characters: [...text].length, withoutSpaces: [...text.replace(/\s/gu, "")].length, letters: (text.match(/\p{L}/gu) ?? []).length, digits: (text.match(/\p{N}/gu) ?? []).length, spaces: (text.match(/\s/gu) ?? []).length, lines: text ? text.split(/\r?\n/u).length : 0, bytes: new TextEncoder().encode(text).length }), [text]);
  return <section className="tool-panel"><div className="tool-panel__header"><h2>Character analysis</h2><span>Unicode aware</span></div><div className="tool-stack"><div className="field"><label htmlFor="character-counter-text">Your text</label><textarea id="character-counter-text" placeholder="Type or paste text here…" value={text} onChange={(e) => setText(e.target.value)} /></div><div className="result-grid"><div className="stat"><span>Characters</span><strong>{stats.characters}</strong></div><div className="stat"><span>Without spaces</span><strong>{stats.withoutSpaces}</strong></div><div className="stat"><span>UTF-8 bytes</span><strong>{stats.bytes}</strong></div><div className="stat"><span>Letters</span><strong>{stats.letters}</strong></div><div className="stat"><span>Digits</span><strong>{stats.digits}</strong></div><div className="stat"><span>Lines</span><strong>{stats.lines}</strong></div></div><button className="button button--secondary" type="button" onClick={() => setText("")} disabled={!text}><RotateCcw size={16} /> Clear</button></div></section>;
}

function wordsOf(text: string) { return text.trim().split(/[^\p{L}\p{N}]+/u).filter(Boolean); }
function titleCase(text: string) { return text.toLowerCase().replace(/(^|\s|[-–—])([\p{L}\p{N}])/gu, (_, gap: string, letter: string) => gap + letter.toUpperCase()); }
function sentenceCase(text: string) { const lower = text.toLowerCase(); return lower.replace(/(^\s*\p{L}|[.!?]\s+\p{L})/gu, (match) => match.toUpperCase()); }
function convertCase(text: string, mode: string) {
  if (mode === "upper") return text.toUpperCase();
  if (mode === "lower") return text.toLowerCase();
  if (mode === "title") return titleCase(text);
  if (mode === "sentence") return sentenceCase(text);
  const words = wordsOf(text);
  if (mode === "camel") return words.map((word, index) => index ? word[0].toUpperCase() + word.slice(1).toLowerCase() : word.toLowerCase()).join("");
  return words.map((word) => word.toLowerCase()).join("-");
}

function CaseConverter() {
  const [input, setInput] = useState(""), [output, setOutput] = useState(""), [copied, setCopied] = useState(false);
  const apply = (mode: string) => setOutput(convertCase(input, mode));
  return <section className="tool-panel"><div className="tool-panel__header"><h2>Convert text case</h2><span>Six common styles</span></div><div className="tool-stack"><div className="field"><label htmlFor="case-input">Original text</label><textarea id="case-input" placeholder="Paste text to convert…" value={input} onChange={(e) => { setInput(e.target.value); setOutput(""); }} /></div><div className="text-actions"><button className="button button--secondary" type="button" onClick={() => apply("upper")}>UPPERCASE</button><button className="button button--secondary" type="button" onClick={() => apply("lower")}>lowercase</button><button className="button button--secondary" type="button" onClick={() => apply("title")}>Title Case</button><button className="button button--secondary" type="button" onClick={() => apply("sentence")}>Sentence case</button><button className="button button--secondary" type="button" onClick={() => apply("camel")}>camelCase</button><button className="button button--secondary" type="button" onClick={() => apply("kebab")}>kebab-case</button></div><div className="field"><label htmlFor="case-output">Converted text</label><textarea id="case-output" readOnly placeholder="Converted text appears here…" value={output} /></div><div className="button-row"><button className="button button--primary" type="button" onClick={() => copyText(output, setCopied)} disabled={!output}><Copy size={16} /> {copied ? "Copied" : "Copy result"}</button><button className="button button--secondary" type="button" onClick={() => { setInput(""); setOutput(""); }}><RotateCcw size={16} /> Reset</button></div></div></section>;
}

type DiffLine = { type: "same" | "add" | "remove"; text: string };
function compareLines(leftText: string, rightText: string): DiffLine[] {
  const left = leftText.split(/\r?\n/u), right = rightText.split(/\r?\n/u);
  if (left.length > 400 || right.length > 400) throw new Error("For responsive comparison, use 400 lines or fewer on each side.");
  const table = Array.from({ length: left.length + 1 }, () => new Uint16Array(right.length + 1));
  for (let i = left.length - 1; i >= 0; i--) for (let j = right.length - 1; j >= 0; j--) table[i][j] = left[i] === right[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
  const result: DiffLine[] = []; let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] === right[j]) { result.push({ type: "same", text: left[i] }); i++; j++; }
    else if (table[i + 1][j] >= table[i][j + 1]) { result.push({ type: "remove", text: left[i++] }); }
    else result.push({ type: "add", text: right[j++] });
  }
  while (i < left.length) result.push({ type: "remove", text: left[i++] });
  while (j < right.length) result.push({ type: "add", text: right[j++] });
  return result;
}

function TextCompare() {
  const [left, setLeft] = useState(""), [right, setRight] = useState(""), [diff, setDiff] = useState<DiffLine[] | null>(null), [error, setError] = useState("");
  const run = () => { setError(""); try { setDiff(compareLines(left, right)); } catch (reason) { setDiff(null); setError(reason instanceof Error ? reason.message : "Unable to compare."); } };
  const summary = diff ? { added: diff.filter((line) => line.type === "add").length, removed: diff.filter((line) => line.type === "remove").length, same: diff.filter((line) => line.type === "same").length } : null;
  return <section className="tool-panel"><div className="tool-panel__header"><h2>Line-by-line comparison</h2><span>Case-sensitive</span></div><div className="tool-stack"><div className="diff-grid"><div className="field"><label htmlFor="compare-original">Original text</label><textarea id="compare-original" placeholder="Paste the original text…" value={left} onChange={(e) => { setLeft(e.target.value); setDiff(null); }} /></div><div className="field"><label htmlFor="compare-revised">Revised text</label><textarea id="compare-revised" placeholder="Paste the revised text…" value={right} onChange={(e) => { setRight(e.target.value); setDiff(null); }} /></div></div><div className="button-row"><button className="button button--primary" type="button" onClick={run}>Compare text</button><button className="button button--secondary" type="button" onClick={() => { setLeft(""); setRight(""); setDiff(null); setError(""); }}><RotateCcw size={16} /> Reset</button></div>{error && <div className="error-box" role="alert">{error}</div>}{summary && <><div className="result-grid"><div className="stat"><span>Added lines</span><strong>{summary.added}</strong></div><div className="stat"><span>Removed lines</span><strong>{summary.removed}</strong></div><div className="stat"><span>Unchanged lines</span><strong>{summary.same}</strong></div></div><div className="diff-output" aria-label="Comparison results">{diff!.map((line, index) => <div className={`diff-line diff-line--${line.type}`} key={`${index}-${line.type}`}>{line.type === "add" ? "+ " : line.type === "remove" ? "− " : "  "}{line.text || " "}</div>)}</div></>}</div></section>;
}

export function TextTools({ slug }: { slug: string }) {
  if (slug === "word-counter") return <WordCounter />;
  if (slug === "character-counter") return <CharacterCounter />;
  if (slug === "case-converter") return <CaseConverter />;
  return <TextCompare />;
}
