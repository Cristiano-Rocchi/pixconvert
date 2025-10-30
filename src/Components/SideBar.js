import React from "react";
import "./SideBar.css";

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

  // traduzioni
  t,
}) => {
  return (
    <aside className="sb">
      <h2 className="sb__title">{t.sidebar.settings}</h2>

      {/* Dimensioni */}
      <section className="sb__section">
        <h3 className="sb__section-title">{t.sidebar.dimensions}</h3>

        <label className="sb__label sb__label--block">
          <div className="sb__hint">{t.sidebar.width}</div>
          <input
            className="sb__input"
            type="number"
            min={1}
            value={targetW}
            onChange={(e) =>
              onChangeTargetW(parseInt(e.target.value || "1", 10))
            }
          />
        </label>

        <label className="sb__label sb__label--block">
          <div className="sb__hint">{t.sidebar.height}</div>
          <input
            className="sb__input"
            type="number"
            min={1}
            value={targetH}
            onChange={(e) =>
              onChangeTargetH(parseInt(e.target.value || "1", 10))
            }
          />
        </label>

        <label className="sb__row sb__row--checkbox">
          <input
            type="checkbox"
            checked={keepAspect}
            onChange={(e) => setKeepAspect(e.target.checked)}
          />
          <span>{t.sidebar.keepAspect}</span>
        </label>
      </section>

      {/* Griglia */}
      <section className="sb__section">
        <h3 className="sb__section-title">{t.sidebar.grid}</h3>

        <div className="sb__gridrow">
          <div>
            <label className="sb__row sb__row--checkbox">
              <input
                type="checkbox"
                checked={showGrid}
                onChange={(e) => setShowGrid(e.target.checked)}
              />
              <span>{t.sidebar.showGrid}</span>
            </label>

            <div className="sb__hint sb__hint--mb4">{t.sidebar.gridColor}</div>
            <input
              className="sb__color"
              type="color"
              value={gridColor}
              onChange={(e) => setGridColor(e.target.value)}
              title={t.sidebar.gridColor}
            />
          </div>

          <div className="sb__hex">{gridColor?.toUpperCase()}</div>
        </div>

        <div className="sb__range-wrap">
          <div className="sb__range-head">
            <span>{t.sidebar.gridOpacity}</span>
            <span>{Math.round((gridOpacity || 0) * 100)}%</span>
          </div>
          <input
            className="sb__range"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={gridOpacity}
            onChange={(e) => setGridOpacity(parseFloat(e.target.value))}
          />
        </div>
      </section>
    </aside>
  );
};

export default SideBar;
