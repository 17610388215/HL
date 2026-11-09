"use client";

import { Download, ImagePlus, RotateCcw } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { canvasToBlob, downloadBlob, formatBytes, outputFilename } from "@/lib/browser-files";

type ImageMeta = { width: number; height: number };

function loadImage(source: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("The image could not be decoded. It may be damaged or unsupported."));
    image.src = source;
  });
}

const config: Record<string, { title: string; accept: string; action: string; suffix: string }> = {
  "compress-image": { title: "Compress an image", accept: "image/jpeg,image/png,image/webp", action: "Compress image", suffix: "compressed" },
  "resize-image": { title: "Resize an image", accept: "image/jpeg,image/png,image/webp", action: "Resize image", suffix: "resized" },
  "jpg-to-png": { title: "Convert JPG to PNG", accept: "image/jpeg", action: "Convert to PNG", suffix: "converted" },
  "png-to-jpg": { title: "Convert PNG to JPG", accept: "image/png", action: "Convert to JPG", suffix: "converted" },
};

export function ImageTools({ slug }: { slug: string }) {
  const settings = config[slug];
  const [file, setFile] = useState<File | null>(null), [sourceUrl, setSourceUrl] = useState(""), [meta, setMeta] = useState<ImageMeta | null>(null);
  const [width, setWidth] = useState(""), [height, setHeight] = useState(""), [locked, setLocked] = useState(true), [quality, setQuality] = useState(82);
  const [output, setOutput] = useState<{ blob: Blob; url: string; name: string } | null>(null), [busy, setBusy] = useState(false), [error, setError] = useState("");
  useEffect(() => () => { if (sourceUrl) URL.revokeObjectURL(sourceUrl); }, [sourceUrl]);
  useEffect(() => () => { if (output?.url) URL.revokeObjectURL(output.url); }, [output]);

  const clearOutput = () => { if (output?.url) URL.revokeObjectURL(output.url); setOutput(null); };
  const reset = () => { if (sourceUrl) URL.revokeObjectURL(sourceUrl); clearOutput(); setFile(null); setSourceUrl(""); setMeta(null); setWidth(""); setHeight(""); setQuality(82); setError(""); setLocked(true); };
  const choose = async (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0]; event.target.value = ""; if (!selected) return;
    setError(""); clearOutput();
    try {
      if (selected.size > 25 * 1024 * 1024) throw new Error("Choose an image smaller than 25 MB.");
      const allowed = settings.accept.split(",");
      if (!allowed.includes(selected.type)) throw new Error(`Unsupported file type. Choose ${slug === "jpg-to-png" ? "a JPG" : slug === "png-to-jpg" ? "a PNG" : "a JPG, PNG, or WebP image"}.`);
      const url = URL.createObjectURL(selected); const image = await loadImage(url);
      if (image.naturalWidth * image.naturalHeight > 40_000_000) { URL.revokeObjectURL(url); throw new Error("This image has too many pixels to process safely in the browser."); }
      if (sourceUrl) URL.revokeObjectURL(sourceUrl);
      setFile(selected); setSourceUrl(url); setMeta({ width: image.naturalWidth, height: image.naturalHeight }); setWidth(String(image.naturalWidth)); setHeight(String(image.naturalHeight));
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to open the image."); }
  };
  const changeWidth = (value: string) => { setWidth(value); clearOutput(); if (locked && meta && Number(value) > 0) setHeight(String(Math.max(1, Math.round(Number(value) * meta.height / meta.width)))); };
  const changeHeight = (value: string) => { setHeight(value); clearOutput(); if (locked && meta && Number(value) > 0) setWidth(String(Math.max(1, Math.round(Number(value) * meta.width / meta.height)))); };
  const process = async () => {
    if (!file || !sourceUrl || !meta) { setError("Choose an image first."); return; }
    setBusy(true); setError(""); clearOutput();
    try {
      const image = await loadImage(sourceUrl);
      const targetWidth = slug === "resize-image" ? Number(width) : meta.width;
      const targetHeight = slug === "resize-image" ? Number(height) : meta.height;
      if (!Number.isInteger(targetWidth) || !Number.isInteger(targetHeight) || targetWidth < 1 || targetHeight < 1) throw new Error("Width and height must be positive whole numbers.");
      if (targetWidth * targetHeight > 40_000_000) throw new Error("The requested dimensions are too large for safe browser processing.");
      const canvas = document.createElement("canvas"); canvas.width = targetWidth; canvas.height = targetHeight;
      const context = canvas.getContext("2d"); if (!context) throw new Error("Canvas processing is unavailable in this browser.");
      let outputType = "image/png", extension = "png";
      if (slug === "compress-image" || slug === "png-to-jpg") { outputType = "image/jpeg"; extension = "jpg"; }
      else if (slug === "resize-image") { outputType = file.type === "image/png" ? "image/png" : file.type === "image/webp" ? "image/webp" : "image/jpeg"; extension = outputType === "image/png" ? "png" : outputType === "image/webp" ? "webp" : "jpg"; }
      if (outputType === "image/jpeg") { context.fillStyle = "#ffffff"; context.fillRect(0, 0, targetWidth, targetHeight); }
      context.imageSmoothingEnabled = true; context.imageSmoothingQuality = "high"; context.drawImage(image, 0, 0, targetWidth, targetHeight);
      const blob = await canvasToBlob(canvas, outputType, outputType === "image/png" ? undefined : quality / 100);
      const name = outputFilename(file.name, settings.suffix, extension); setOutput({ blob, url: URL.createObjectURL(blob), name });
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to process the image."); }
    finally { setBusy(false); }
  };
  return <section className="tool-panel"><div className="tool-panel__header"><h2>{settings.title}</h2><span>Processed locally</span></div><div className="tool-stack">
    {!file ? <label className="file-drop"><input type="file" accept={settings.accept} onChange={choose} /><span><ImagePlus size={30} /><strong>Choose an image</strong><span>{slug === "jpg-to-png" ? "JPG or JPEG" : slug === "png-to-jpg" ? "PNG only" : "JPG, PNG, or WebP"} · up to 25 MB</span></span></label> : <div className="file-row"><ImagePlus size={20} /><div className="file-row__meta"><strong>{file.name}</strong><span>{formatBytes(file.size)} · {meta?.width} × {meta?.height}px</span></div><button className="button button--secondary" type="button" onClick={reset}>Change</button></div>}
    {sourceUrl && <div className="image-preview"><img alt="Selected image preview" src={sourceUrl} /></div>}
    {slug === "resize-image" && meta && <><div className="form-grid"><div className="field"><label htmlFor="resize-width">Width (px)</label><input id="resize-width" type="number" min="1" step="1" value={width} onChange={(e) => changeWidth(e.target.value)} /></div><div className="field"><label htmlFor="resize-height">Height (px)</label><input id="resize-height" type="number" min="1" step="1" value={height} onChange={(e) => changeHeight(e.target.value)} /></div></div><label className="field__hint"><input type="checkbox" checked={locked} onChange={(e) => setLocked(e.target.checked)} /> Keep original aspect ratio</label></>}
    {(slug === "compress-image" || slug === "png-to-jpg" || (slug === "resize-image" && file?.type !== "image/png")) && <div className="field"><label htmlFor="image-quality">Output quality</label><div className="range-row"><input id="image-quality" type="range" min="20" max="100" value={quality} onChange={(e) => { setQuality(Number(e.target.value)); clearOutput(); }} /><output>{quality}%</output></div></div>}
    {error && <div className="error-box" role="alert">{error}</div>}
    {output && <><div className="success-box">Ready: {output.name} · {formatBytes(output.blob.size)}{file && slug === "compress-image" ? ` · ${Math.round((1 - output.blob.size / file.size) * 100)}% ${output.blob.size <= file.size ? "smaller" : "larger"}` : ""}</div><div className="image-preview"><img alt="Processed image preview" src={output.url} /></div></>}
    <div className="button-row"><button className="button button--primary" type="button" disabled={!file || busy} onClick={process}>{busy ? "Processing…" : settings.action}</button>{output && <button className="button button--primary" type="button" onClick={() => downloadBlob(output.blob, output.name)}><Download size={17} /> Download</button>}<button className="button button--secondary" type="button" onClick={reset} disabled={!file && !error}><RotateCcw size={16} /> Reset</button></div>
  </div></section>;
}
