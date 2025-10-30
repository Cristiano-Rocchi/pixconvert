// Home2.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import DropImg from "./DropImg";
import SideBar from "./SideBar";
import "./Home2.css";
import engFlag from "../flag/eng.webp";
import itaFlag from "../flag/ita.webp";
import espFlag from "../flag/esp.webp";

const MAX_EXPORT_SIDE = 8192; // limite “sicuro” per lato
const EXPORT_CELL_BASE = 20; // cella base desiderata per l’export

const Home2 = () => {
  const [imgObj, setImgObj] = useState(null);

  // celle finali
  const [targetW, setTargetW] = useState(64);
  const [targetH, setTargetH] = useState(64);
  const [keepAspect, setKeepAspect] = useState(true);

  // griglia
  const [showGrid, setShowGrid] = useState(true);
  const [gridColor, setGridColor] = useState("#000000");
  const [gridOpacity, setGridOpacity] = useState(0.25);

  // canvas refs
  const hiddenCanvasRef = useRef(null);
  const displayCanvasRef = useRef(null);

  // layout sinistro
  const leftPaneRef = useRef(null);
  const [boxW, setBoxW] = useState(560);
  const [boxH, setBoxH] = useState(560);

  // file handling
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

  // box fisso con aspect dell'immagine originale
  useEffect(() => {
    if (!imgObj || !leftPaneRef.current) return;
    const availW = Math.max(200, Math.floor(leftPaneRef.current.clientWidth));
    const availH = 600;
    const scale = Math.min(availW / imgObj.width, availH / imgObj.height);
    setBoxW(Math.max(1, Math.round(imgObj.width * scale)));
    setBoxH(Math.max(1, Math.round(imgObj.height * scale)));
  }, [imgObj]);

  useEffect(() => {
    if (!leftPaneRef.current) return;
    const ro = new ResizeObserver(() => {
      if (!imgObj) return;
      const availW = Math.max(200, Math.floor(leftPaneRef.current.clientWidth));
      const availH = 600;
      const scale = Math.min(availW / imgObj.width, availH / imgObj.height);
      setBoxW(Math.max(1, Math.round(imgObj.width * scale)));
      setBoxH(Math.max(1, Math.round(imgObj.height * scale)));
    });
    ro.observe(leftPaneRef.current);
    return () => ro.disconnect();
  }, [imgObj]);

  // sampling w×h
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

    const imgData = hctx.getImageData(0, 0, targetW, targetH).data;
    const matrix = [];
    for (let y = 0; y < targetH; y++) {
      const row = [];
      for (let x = 0; x < targetW; x++) {
        const i = (y * targetW + x) * 4;
        row.push({
          r: imgData[i],
          g: imgData[i + 1],
          b: imgData[i + 2],
          a: imgData[i + 3],
        });
      }
      matrix.push(row);
    }
    return matrix;
  }, [imgObj, targetW, targetH]);

  // cella interna (solo risoluzione, NON influisce sulla misura visiva del box)
  const cell = useMemo(() => {
    if (!boxW || !boxH || !targetW || !targetH) return 1;
    return Math.max(1, Math.floor(Math.min(boxW / targetW, boxH / targetH)));
  }, [boxW, boxH, targetW, targetH]);

  // draw (preview)
  useEffect(() => {
    const canvas = displayCanvasRef.current;
    if (!canvas || !pixelMatrix) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = targetW * cell;
    canvas.height = targetH * cell;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < targetH; y++) {
      for (let x = 0; x < targetW; x++) {
        const p = pixelMatrix[y][x];
        ctx.fillStyle = `rgb(${p.r}, ${p.g}, ${p.b})`;
        ctx.fillRect(x * cell, y * cell, cell, cell);
      }
    }
    if (showGrid) {
      drawGrid(ctx, canvas.width, canvas.height, cell, gridColor, gridOpacity);
    }
  }, [pixelMatrix, cell, targetW, targetH, showGrid, gridColor, gridOpacity]);

  // export (alta risoluzione con limite di sicurezza)
  const onExportPNG = () => {
    if (!pixelMatrix) return;

    const maxDim = Math.max(targetW, targetH);
    const safeCell = Math.max(
      1,
      Math.min(EXPORT_CELL_BASE, Math.floor(MAX_EXPORT_SIDE / maxDim))
    );

    const outW = targetW * safeCell;
    const outH = targetH * safeCell;

    if (safeCell < EXPORT_CELL_BASE) {
      alert(
        `L'immagine è stata esportata a ${outW}×${outH}px per rispettare il limite massimo di ` +
          `${MAX_EXPORT_SIDE}px per lato. (Cella: ${safeCell}px)`
      );
    }

    const off = document.createElement("canvas");
    off.width = outW;
    off.height = outH;
    const ctx = off.getContext("2d");
    if (!ctx) return;

    for (let y = 0; y < targetH; y++) {
      for (let x = 0; x < targetW; x++) {
        const p = pixelMatrix[y][x];
        ctx.fillStyle = `rgb(${p.r}, ${p.g}, ${p.b})`;
        ctx.fillRect(x * safeCell, y * safeCell, safeCell, safeCell);
      }
    }
    if (showGrid) {
      drawGrid(ctx, outW, outH, safeCell, gridColor, gridOpacity);
    }

    const a = document.createElement("a");
    a.download = `pixelized_${targetW}x${targetH}.png`;
    a.href = off.toDataURL("image/png");
    a.click();
  };

  const onExportCSV = () => {
    if (!pixelMatrix) return;
    let csv = "x,y,color\n";
    for (let y = 0; y < targetH; y++)
      for (let x = 0; x < targetW; x++) {
        const p = pixelMatrix[y][x];
        csv += `${x},${y},${rgbToHex(p.r, p.g, p.b)}\n`;
      }
    downloadText(csv, `pixel_plan_${targetW}x${targetH}.csv`);
  };

  const onExportJSON = () => {
    if (!pixelMatrix) return;
    const pixels = [];
    for (let y = 0; y < targetH; y++)
      for (let x = 0; x < targetW; x++) {
        const p = pixelMatrix[y][x];
        pixels.push({ x, y, color: rgbToHex(p.r, p.g, p.b) });
      }
    downloadText(
      JSON.stringify({ width: targetW, height: targetH, pixels }, null, 2),
      `pixel_plan_${targetW}x${targetH}.json`
    );
  };

  const finalSize = useMemo(
    () => ({ pxWidth: targetW, pxHeight: targetH }),
    [targetW, targetH]
  );

  return (
    <Container fluid className="pixel-convert-page">
      <Row>
        <Col
          xs={8}
          className="d-flex justify-content-center align-items-center"
          ref={leftPaneRef}
        >
          <div className="dropping-zone" style={{ width: "100%" }}>
            {!imgObj ? (
              <>
                <h1 className="mb-5 text-center">Upload your image</h1>
                <DropImg onFile={handleFile} />
              </>
            ) : (
              <div>
                {/*  ⬇️ BLOCCO con SEZIONE ESPORTA + ANTEPRIMA  */}
                <div className="d-flex align-items-end gap-5">
                  {/* === SEZIONE ESPORTA (trasferita qui) === */}
                  <div>
                    <h3 style={{ fontWeight: 600, marginBottom: 8 }}>
                      Esporta
                    </h3>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button
                        disabled={!imgObj}
                        onClick={onExportPNG}
                        style={btnStyle(!imgObj)}
                      >
                        PNG
                      </button>
                      <button
                        disabled={!imgObj}
                        onClick={onExportCSV}
                        style={btnStyle(!imgObj)}
                      >
                        CSV (piano)
                      </button>
                      <button
                        disabled={!imgObj}
                        onClick={onExportJSON}
                        style={btnStyle(!imgObj)}
                      >
                        JSON
                      </button>
                    </div>
                    <div style={{ fontSize: 12, opacity: 0.8, marginTop: 10 }}>
                      <strong>Dimensione finale su wplace:</strong>{" "}
                      {finalSize?.pxWidth} × {finalSize?.pxHeight} pixel
                    </div>
                  </div>

                  {/* === ANTEPRIMA === */}
                  <div>
                    <div className="d-flex justify-content-between">
                      <span>Anteprima</span>
                      <span>
                        Sorgente: {imgObj.width}×{imgObj.height}px → Griglia:{" "}
                        {targetW}×{targetH}
                      </span>
                    </div>
                    <div
                      style={{
                        width: boxW,
                        height: boxH,
                        border: "1px solid #eee",
                        borderRadius: 8,
                        overflow: "hidden",
                      }}
                    >
                      <canvas
                        ref={displayCanvasRef}
                        style={{
                          width: "100%",
                          height: "100%",
                          imageRendering: "pixelated",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <canvas ref={hiddenCanvasRef} style={{ display: "none" }} />
          </div>
        </Col>

        <Col xs={3}>
          <SideBar
            targetW={targetW}
            targetH={targetH}
            onChangeTargetW={(n) => onChangeTargetW(Number.isNaN(n) ? 1 : n)}
            onChangeTargetH={(n) => onChangeTargetH(Number.isNaN(n) ? 1 : n)}
            keepAspect={keepAspect}
            setKeepAspect={setKeepAspect}
            showGrid={showGrid}
            setShowGrid={setShowGrid}
            gridColor={gridColor}
            setGridColor={setGridColor}
            gridOpacity={gridOpacity}
            setGridOpacity={setGridOpacity}
            finalSize={finalSize}
            hasImage={!!imgObj}
            // i tre handler rimangono passati anche alla sidebar:
            // se vuoi rimuovere i pulsanti dalla sidebar, te li posso togliere lì.
            onExportPNG={onExportPNG}
            onExportCSV={onExportCSV}
            onExportJSON={onExportJSON}
          />
        </Col>
        <Col xs={1}>
          <div className="flag-container">
            <img
              className="flag-img"
              src={engFlag}
              alt="English Version"
              title="Switch to English version"
              style={{
                width: 50,
                height: 40,
                cursor: "pointer",
                marginTop: 10,
                backgroundColor: "#f0edcc",
              }}
            />
            <img
              className="flag-img"
              src={itaFlag}
              alt="English Version"
              title="Switch to English version"
              style={{
                width: 50,
                height: 40,
                cursor: "pointer",
                marginTop: 10,
                backgroundColor: "#f0edcc",
              }}
            />
            <img
              className="flag-img"
              src={espFlag}
              alt="English Version"
              title="Switch to English version"
              style={{
                width: 50,
                height: 40,
                cursor: "pointer",
                marginTop: 10,
                backgroundColor: "#f0edcc",
              }}
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home2;

/* ==== Helpers ==== */
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
    "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")
  ).toUpperCase();
}
function hexToRgb(hex) {
  const m = hex
    .trim()
    .replace("#", "")
    .match(/^([0-9a-fA-F]{6})$/);
  if (!m) return null;
  const v = parseInt(m[1], 16);
  return { r: (v >> 16) & 255, g: (v >> 8) & 255, b: v & 255 };
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
function btnStyle(disabled) {
  return {
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid #ddd",
    background: disabled ? "#f3f3f3" : "#fff",
    cursor: disabled ? "not-allowed" : "pointer",
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
  };
}
