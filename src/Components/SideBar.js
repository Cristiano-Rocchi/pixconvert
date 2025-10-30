import React from "react";

/**
 * Props attese:
 * - targetW, targetH, onChangeTargetW(n), onChangeTargetH(n)
 * - keepAspect, setKeepAspect(bool)
 * - showGrid, setShowGrid(bool)
 * - gridColor, setGridColor(str "#RRGGBB")
 * - gridOpacity, setGridOpacity(number 0..1)
 * - t: oggetto traduzioni (t.sidebar.*)
 */
const SideBar = ({
  // dimensioni
  targetW,
  targetH,
  onChangeTargetW,
  onChangeTargetH,
  keepAspect,
  setKeepAspect,

  // anteprima
  showGrid,
  setShowGrid,

  // griglia
  gridColor,
  setGridColor,
  gridOpacity,
  setGridOpacity,

  // 👇 nuova prop
  t,
}) => {
  return (
    <aside
      style={{
        width: 320,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <h2 style={{ fontSize: 18, fontWeight: 700 }}>{t.sidebar.settings}</h2>

      {/* Dimensioni */}
      <section
        style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}
      >
        <h3 style={{ fontWeight: 600, marginBottom: 8 }}>
          {t.sidebar.dimensions}
        </h3>

        <label style={{ display: "block", marginBottom: 8 }}>
          <div style={{ fontSize: 12, opacity: 0.8 }}>{t.sidebar.width}</div>
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
          <div style={{ fontSize: 12, opacity: 0.8 }}>{t.sidebar.height}</div>
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
          <span>{t.sidebar.keepAspect}</span>
        </label>
      </section>

      {/* Griglia */}
      <section
        style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}
      >
        <h3 style={{ fontWeight: 600, marginBottom: 8 }}>{t.sidebar.grid}</h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: 12,
            alignItems: "center",
          }}
        >
          <div>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 8,
              }}
            >
              <input
                type="checkbox"
                checked={showGrid}
                onChange={(e) => setShowGrid(e.target.checked)}
              />
              <span>{t.sidebar.showGrid}</span>
            </label>

            <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>
              {t.sidebar.gridColor}
            </div>
            <input
              type="color"
              value={gridColor}
              onChange={(e) => setGridColor(e.target.value)}
              style={{
                width: 48,
                height: 32,
                padding: 0,
                border: "1px solid #ddd",
                borderRadius: 8,
                cursor: "pointer",
                appearance: "none",
                background: "transparent",
              }}
              title={t.sidebar.gridColor}
            />
          </div>

          <div style={{ justifySelf: "end", fontSize: 12, opacity: 0.7 }}>
            {gridColor?.toUpperCase()}
          </div>
        </div>

        <div style={{ marginTop: 10 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 12,
              opacity: 0.8,
            }}
          >
            <span>{t.sidebar.gridOpacity}</span>
            <span>{Math.round((gridOpacity || 0) * 100)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={gridOpacity}
            onChange={(e) => setGridOpacity(parseFloat(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>
      </section>
    </aside>
  );
};

export default SideBar;
