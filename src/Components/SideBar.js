// SideBar.jsx
import React from "react";

/**
 * Props attese:
 * - targetW, targetH, onChangeTargetW(n), onChangeTargetH(n)
 * - keepAspect, setKeepAspect(bool)
 * - cellSize, setCellSize(n)
 * - showGrid, setShowGrid(bool)
 * - finalSize: { pxWidth, pxHeight }
 * - hasImage: boolean
 * - onExportPNG(), onExportCSV(), onExportJSON()
 */
const SideBar = ({
  targetW,
  targetH,
  onChangeTargetW,
  onChangeTargetH,
  keepAspect,
  setKeepAspect,

  cellSize,
  setCellSize,
  showGrid,
  setShowGrid,

  finalSize,
  hasImage,
  onExportPNG,
  onExportCSV,
  onExportJSON,
}) => {
  return (
    <aside
      style={{
        width: 320,
        padding: 16,
        borderRight: "1px solid #eee",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <h2 style={{ fontSize: 18, fontWeight: 700 }}>Impostazioni</h2>

      {/* Dimensioni */}
      <section
        style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}
      >
        <h3 style={{ fontWeight: 600, marginBottom: 8 }}>Dimensioni (celle)</h3>

        <label style={{ display: "block", marginBottom: 8 }}>
          <div style={{ fontSize: 12, opacity: 0.8 }}>Larghezza</div>
          <input
            type="number"
            min={1}
            value={targetW}
            onChange={(e) =>
              onChangeTargetW(parseInt(e.target.value || "1", 10))
            }
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 10,
              border: "1px solid #ddd",
            }}
          />
        </label>

        <label style={{ display: "block" }}>
          <div style={{ fontSize: 12, opacity: 0.8 }}>Altezza</div>
          <input
            type="number"
            min={1}
            value={targetH}
            onChange={(e) =>
              onChangeTargetH(parseInt(e.target.value || "1", 10))
            }
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 10,
              border: "1px solid #ddd",
            }}
          />
        </label>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 8,
          }}
        >
          <input
            type="checkbox"
            checked={keepAspect}
            onChange={(e) => setKeepAspect(e.target.checked)}
          />
          <span>Mantieni aspect ratio</span>
        </label>
      </section>

      {/* Anteprima */}
      <section
        style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}
      >
        <h3 style={{ fontWeight: 600, marginBottom: 8 }}>Anteprima</h3>

        <label style={{ display: "block", marginBottom: 6 }}>
          <div style={{ fontSize: 12, opacity: 0.8 }}>Zoom (px per cella)</div>
          <input
            type="range"
            min={4}
            max={40}
            value={cellSize}
            onChange={(e) => setCellSize(parseInt(e.target.value, 10))}
            style={{ width: "100%" }}
          />
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            checked={showGrid}
            onChange={(e) => setShowGrid(e.target.checked)}
          />
          <span>Mostra griglia</span>
        </label>
      </section>

      {/* Esporta */}
      <section
        style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}
      >
        <h3 style={{ fontWeight: 600, marginBottom: 8 }}>Esporta</h3>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            disabled={!hasImage}
            onClick={onExportPNG}
            style={btnStyle(!hasImage)}
          >
            PNG
          </button>
          <button
            disabled={!hasImage}
            onClick={onExportCSV}
            style={btnStyle(!hasImage)}
          >
            CSV (piano)
          </button>
          <button
            disabled={!hasImage}
            onClick={onExportJSON}
            style={btnStyle(!hasImage)}
          >
            JSON
          </button>
        </div>

        <div style={{ fontSize: 12, opacity: 0.8, marginTop: 10 }}>
          <strong>Dimensione finale su wplace:</strong> {finalSize?.pxWidth} ×{" "}
          {finalSize?.pxHeight} pixel
        </div>
      </section>
    </aside>
  );
};

export default SideBar;

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
