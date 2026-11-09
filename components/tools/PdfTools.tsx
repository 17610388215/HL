"use client";

import { ArrowDown, ArrowUp, Download, FilePlus2, RotateCcw, Trash2 } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { downloadBlob, formatBytes } from "@/lib/browser-files";

const titles: Record<string, string> = { "merge-pdf": "Combine PDF files", "split-pdf": "Split by page range", "rotate-pdf": "Rotate every page", "jpg-to-pdf": "Create PDF from JPG" };

function parseRanges(input: string, pageCount: number) {
  if (!input.trim()) throw new Error("Enter at least one page or page range.");
  return input.split(",").map((raw) => {
    const part = raw.trim();
    const match = part.match(/^(\d+)(?:\s*-\s*(\d+))?$/u);
    if (!match) throw new Error(`“${part}” is not a valid page range.`);
    const start = Number(match[1]), end = Number(match[2] ?? match[1]);
    if (start < 1 || end < 1 || start > end || end > pageCount) throw new Error(`Range ${part} must be between 1 and ${pageCount}.`);
    return { label: start === end ? `${start}` : `${start}-${end}`, indexes: Array.from({ length: end - start + 1 }, (_, index) => start - 1 + index) };
  });
}

export function PdfTools({ slug }: { slug: string }) {
  const [files, setFiles] = useState<File[]>([]), [pageCount, setPageCount] = useState<number | null>(null), [ranges, setRanges] = useState(""), [rotation, setRotation] = useState("90");
  const [busy, setBusy] = useState(false), [error, setError] = useState(""), [success, setSuccess] = useState("");
  const isJpg = slug === "jpg-to-pdf", multiple = slug === "merge-pdf" || isJpg;
  const reset = () => { setFiles([]); setPageCount(null); setRanges(""); setRotation("90"); setError(""); setSuccess(""); };
  const choose = async (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []); event.target.value = ""; if (!selected.length) return;
    setError(""); setSuccess("");
    try {
      for (const file of selected) {
        if (file.size > 50 * 1024 * 1024) throw new Error(`${file.name} exceeds the 50 MB limit.`);
        if (isJpg ? file.type !== "image/jpeg" : file.type !== "application/pdf") throw new Error(`${file.name} is not a supported ${isJpg ? "JPG image" : "PDF file"}.`);
      }
      const next = multiple ? [...files, ...selected] : [selected[0]]; setFiles(next);
      if (!multiple && !isJpg) {
        const { PDFDocument } = await import("pdf-lib"); const document = await PDFDocument.load(await selected[0].arrayBuffer()); const count = document.getPageCount();
        if (!count) throw new Error("The PDF has no pages."); setPageCount(count); if (slug === "split-pdf") setRanges(`1-${count}`);
      }
    } catch (reason) { setFiles([]); setPageCount(null); setError(reason instanceof Error ? reason.message : "Unable to read the selected file."); }
  };
  const move = (index: number, direction: -1 | 1) => setFiles((current) => { const target = index + direction; if (target < 0 || target >= current.length) return current; const copy = [...current]; [copy[index], copy[target]] = [copy[target], copy[index]]; return copy; });
  const remove = (index: number) => setFiles((current) => current.filter((_, itemIndex) => itemIndex !== index));
  const process = async () => {
    setError(""); setSuccess(""); setBusy(true);
    try {
      const { PDFDocument, degrees } = await import("pdf-lib");
      if (slug === "merge-pdf") {
        if (files.length < 2) throw new Error("Choose at least two PDF files to merge.");
        const output = await PDFDocument.create();
        for (const file of files) { const source = await PDFDocument.load(await file.arrayBuffer()); const pages = await output.copyPages(source, source.getPageIndices()); pages.forEach((page) => output.addPage(page)); }
        const bytes = await output.save(); downloadBlob(new Blob([Uint8Array.from(bytes)], { type: "application/pdf" }), "merged.pdf"); setSuccess(`Merged ${files.length} files into one PDF.`);
      } else if (slug === "split-pdf") {
        if (files.length !== 1 || !pageCount) throw new Error("Choose one valid PDF file first.");
        const groups = parseRanges(ranges, pageCount); const source = await PDFDocument.load(await files[0].arrayBuffer()); const outputs: { name: string; bytes: Uint8Array }[] = [];
        for (const group of groups) { const document = await PDFDocument.create(); const pages = await document.copyPages(source, group.indexes); pages.forEach((page) => document.addPage(page)); outputs.push({ name: `pages-${group.label}.pdf`, bytes: await document.save() }); }
        if (outputs.length === 1) downloadBlob(new Blob([Uint8Array.from(outputs[0].bytes)], { type: "application/pdf" }), outputs[0].name);
        else { const JSZip = (await import("jszip")).default; const zip = new JSZip(); outputs.forEach((item) => zip.file(item.name, item.bytes)); downloadBlob(await zip.generateAsync({ type: "blob" }), "split-pdf-files.zip"); }
        setSuccess(`Created ${outputs.length} PDF ${outputs.length === 1 ? "file" : "files"}.`);
      } else if (slug === "rotate-pdf") {
        if (files.length !== 1) throw new Error("Choose one PDF file first.");
        const document = await PDFDocument.load(await files[0].arrayBuffer()); const angle = Number(rotation); document.getPages().forEach((page) => page.setRotation(degrees((page.getRotation().angle + angle) % 360)));
        const bytes = await document.save(); downloadBlob(new Blob([Uint8Array.from(bytes)], { type: "application/pdf" }), "rotated.pdf"); setSuccess(`Rotated ${document.getPageCount()} pages by ${angle}°.`);
      } else {
        if (!files.length) throw new Error("Choose at least one JPG image.");
        const document = await PDFDocument.create();
        for (const file of files) { const image = await document.embedJpg(await file.arrayBuffer()); const page = document.addPage([image.width, image.height]); page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height }); }
        const bytes = await document.save(); downloadBlob(new Blob([Uint8Array.from(bytes)], { type: "application/pdf" }), "images.pdf"); setSuccess(`Created a ${files.length}-page PDF.`);
      }
    } catch (reason) { setError(reason instanceof Error ? reason.message : "The files could not be processed. They may be damaged or encrypted."); }
    finally { setBusy(false); }
  };
  return <section className="tool-panel"><div className="tool-panel__header"><h2>{titles[slug]}</h2><span>Processed locally</span></div><div className="tool-stack">
    <label className="file-drop"><input type="file" accept={isJpg ? ".jpg,.jpeg,image/jpeg" : ".pdf,application/pdf"} multiple={multiple} onChange={choose} /><span><FilePlus2 size={30} /><strong>{files.length ? `Add more ${isJpg ? "images" : "PDFs"}` : `Choose ${isJpg ? "JPG images" : multiple ? "PDF files" : "a PDF file"}`}</strong><span>{multiple ? "Select multiple files" : "One file"} · 50 MB max each</span></span></label>
    {!!files.length && <div className="file-list">{files.map((file, index) => <div className="file-row" key={`${file.name}-${file.lastModified}-${index}`}><FilePlus2 size={19} /><div className="file-row__meta"><strong>{file.name}</strong><span>{formatBytes(file.size)}{!multiple && pageCount ? ` · ${pageCount} pages` : ""}</span></div>{multiple && <div className="file-row__actions"><button className="mini-button" type="button" disabled={index === 0} onClick={() => move(index, -1)} aria-label={`Move ${file.name} up`}><ArrowUp size={15} /></button><button className="mini-button" type="button" disabled={index === files.length - 1} onClick={() => move(index, 1)} aria-label={`Move ${file.name} down`}><ArrowDown size={15} /></button></div>}<button className="mini-button" type="button" onClick={() => remove(index)} aria-label={`Remove ${file.name}`}><Trash2 size={15} /></button></div>)}</div>}
    {slug === "split-pdf" && !!files.length && <div className="field"><label htmlFor="pdf-ranges">Page ranges</label><input id="pdf-ranges" value={ranges} onChange={(e) => setRanges(e.target.value)} placeholder="1-3, 4, 5-8" /><span className="field__hint">Separate PDFs with commas. Example: 1-3, 4, 5-8.</span></div>}
    {slug === "rotate-pdf" && !!files.length && <div className="field"><label htmlFor="pdf-rotation">Clockwise rotation</label><select id="pdf-rotation" value={rotation} onChange={(e) => setRotation(e.target.value)}><option value="90">90 degrees</option><option value="180">180 degrees</option><option value="270">270 degrees</option></select></div>}
    {error && <div className="error-box" role="alert">{error}</div>}{success && <div className="success-box" role="status">{success} Your download should begin automatically.</div>}
    <div className="button-row"><button className="button button--primary" type="button" onClick={process} disabled={!files.length || busy}><Download size={17} /> {busy ? "Processing…" : slug === "merge-pdf" ? "Merge PDFs" : slug === "split-pdf" ? "Split PDF" : slug === "rotate-pdf" ? "Rotate PDF" : "Create PDF"}</button><button className="button button--secondary" type="button" onClick={reset} disabled={!files.length && !error && !success}><RotateCcw size={16} /> Reset</button></div>
  </div></section>;
}
