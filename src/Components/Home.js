// Home.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import DropImg from "./DropImg";
import SideBar from "./SideBar";

const Home = () => {
  // ---- Stato principale ----
  const [imgObj, setImgObj] = useState(null);

  // dimensioni griglia (celle wplace)
  const [targetW, setTargetW] = useState(64);
  const [targetH, setTargetH] = useState(64);
  const [keepAspect, setKeepAspect] = useState(true);

  // anteprima
  const [cellSize, setCellSize] = useState(10); // zoom (px per cella)
  const [showGrid, setShowGrid] = useState(true);

  // griglia (nuovo: colore + opacità)
  const [gridColor, setGridColor] = useState("#000000"); // default come prima (nero)
  const [gridOpacity, setGridOpacity] = useState(0.25); // default 0.25

  // canvas
  const hiddenCanvasRef = useRef(null); // sampling (w×h)
  const displayCanvasRef = useRef(null); // anteprima (w×h ingranditi)

  // ---- File handling dal DropImg ----
  const handleFile = (file) => {
    const url = URL.createObjectURL(file);
    const im = new Image();
    im.onload = () => {
      setImgObj(im);
      if (keepAspect) {
        const ratio = im.width / im.height;
        const base = 64;
        if (ratio >= 1) {
          setTargetW(base);
          setTargetH(Math.max(1, Math.round(base / ratio)));
        } else {
          setTargetH(base);
          setTargetW(Math.max(1, Math.round(base * ratio)));
        }
      }
    };
    im.crossOrigin = "anonymous";
    im.src = url;
  };

  // ---- Gestione dimensioni con aspect ratio ----
  function onChangeTargetW(n) {
    setTargetW(n);
    if (imgObj && keepAspect) {
      const ratio = imgObj.width / imgObj.height;
      setTargetH(Math.max(1, Math.round(n / ratio)));
    }
  }
  function onChangeTargetH(n) {
    setTargetH(n);
    if (imgObj && keepAspect) {
      const ratio = imgObj.width / imgObj.height;
      setTargetW(Math.max(1, Math.round(n * ratio)));
    }
  }

  // ---- Genera matrice pixel (w×h) ----
  const pixelMatrix = useMemo(() => {
    if (!imgObj || !targetW || !targetH) return null;

    const hc = hiddenCanvasRef.current ?? document.createElement("canvas");
    hc.width = targetW;
    hc.height = targetH;
    const hctx = hc.getContext("2d", { willReadFrequently: true });
    if (!hctx) return null;

    hctx.imageSmoothingEnabled = true;
    hctx.clearRect(0, 0, targetW, targetH);
    hctx.drawImage(imgObj, 0, 0, targetW, targetH);

    const imgData = hctx.getImageData(0, 0, targetW, targetH);
    const data = imgData.data;

    const matrix = [];
    for (let y = 0; y < targetH; y++) {
      const row = [];
      for (let x = 0; x < targetW; x++) {
        const i = (y * targetW + x) * 4;
        const r = data[i + 0];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        row.push({ r, g, b, a });
      }
      matrix.push(row);
    }
    return matrix;
  }, [imgObj, targetW, targetH]);

  // ---- Disegno anteprima ----
  useEffect(() => {
    const canvas = displayCanvasRef.current;
    if (!canvas || !pixelMatrix) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = targetW * cellSize;
    canvas.height = targetH * cellSize;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < targetH; y++) {
      for (let x = 0; x < targetW; x++) {
        const p = pixelMatrix[y][x];
        ctx.fillStyle = `rgb(${p.r}, ${p.g}, ${p.b})`;
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
    if (showGrid) {
      drawGrid(
        ctx,
        canvas.width,
        canvas.height,
        cellSize,
        gridColor,
        gridOpacity
      );
    }
  }, [
    pixelMatrix,
    cellSize,
    showGrid,
    targetW,
    targetH,
    gridColor,
    gridOpacity,
  ]);

  // ---- Export ----
  function onExportPNG() {
    const canvas = displayCanvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = `pixelized_${targetW}x${targetH}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  }

  function onExportCSV() {
    if (!pixelMatrix) return;
    let csv = "x,y,color\n";
    for (let y = 0; y < targetH; y++) {
      for (let x = 0; x < targetW; x++) {
        const p = pixelMatrix[y][x];
        csv += `${x},${y},${rgbToHex(p.r, p.g, p.b)}\n`;
      }
    }
    downloadText(csv, `pixel_plan_${targetW}x${targetH}.csv`);
  }

  function onExportJSON() {
    if (!pixelMatrix) return;
    const pixels = [];
    for (let y = 0; y < targetH; y++) {
      for (let x = 0; x < targetW; x++) {
        const p = pixelMatrix[y][x];
        pixels.push({ x, y, color: rgbToHex(p.r, p.g, p.b) });
      }
    }
    const payload = JSON.stringify(
      { width: targetW, height: targetH, pixels },
      null,
      2
    );
    downloadText(payload, `pixel_plan_${targetW}x${targetH}.json`);
  }

  // ---- Info dimensione finale ----
  const finalSize = useMemo(
    () => ({ pxWidth: targetW, pxHeight: targetH }),
    [targetW, targetH]
  );

  // ---- UI layout: Sidebar + area lavoro (Drop + Anteprima) ----
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <SideBar
        // dimensioni
        targetW={targetW}
        targetH={targetH}
        onChangeTargetW={(n) => onChangeTargetW(Number.isNaN(n) ? 1 : n)}
        onChangeTargetH={(n) => onChangeTargetH(Number.isNaN(n) ? 1 : n)}
        keepAspect={keepAspect}
        setKeepAspect={setKeepAspect}
        // anteprima
        cellSize={cellSize}
        setCellSize={setCellSize}
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        // griglia
        gridColor={gridColor}
        setGridColor={setGridColor}
        gridOpacity={gridOpacity}
        setGridOpacity={setGridOpacity}
        // export/info
        finalSize={finalSize}
        hasImage={!!imgObj}
        onExportPNG={onExportPNG}
        onExportCSV={onExportCSV}
        onExportJSON={onExportJSON}
      />

      <main style={{ flex: 1, padding: 16 }}>
        <DropImg onFile={handleFile} />
        <div style={{ marginTop: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
              fontSize: 12,
              opacity: 0.75,
            }}
          >
            <span>Anteprima</span>
            {imgObj && (
              <span>
                Sorgente: {imgObj.width}×{imgObj.height}px → Griglia: {targetW}×
                {targetH}
              </span>
            )}
          </div>
          <div style={{ overflow: "auto", maxHeight: 600 }}>
            <canvas
              ref={displayCanvasRef}
              style={{ border: "1px solid #eee", borderRadius: 8 }}
            />
          </div>
        </div>

        {/* Canvas nascosta per sampling */}
        <canvas ref={hiddenCanvasRef} style={{ display: "none" }} />
      </main>
    </div>
  );
};

export default Home;

// ==== Helpers ====
// TUA griglia, identica ma parametrica (colore + opacità)
function drawGrid(ctx, w, h, cell, color = "#000000", opacity = 0.25) {
  ctx.save();
  const rgb = hexToRgb(color) || { r: 0, g: 0, b: 0 };
  ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${opacity})`;
  ctx.lineWidth = 1;

  for (let x = 0; x <= w; x += cell) {
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, h);
    ctx.stroke();
  }
  for (let y = 0; y <= h; y += cell) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(w, y + 0.5);
    ctx.stroke();
  }
  ctx.restore();
}

function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map((v) => {
        const s = v.toString(16);
        return s.length === 1 ? "0" + s : s;
      })
      .join("")
  ).toUpperCase();
}

function hexToRgb(hex) {
  const m = hex
    .trim()
    .replace("#", "")
    .match(/^([0-9a-fA-F]{6})$/);
  if (!m) return null;
  const intVal = parseInt(m[1], 16);
  return {
    r: (intVal >> 16) & 255,
    g: (intVal >> 8) & 255,
    b: intVal & 255,
  };
}

function downloadText(text, filename) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
