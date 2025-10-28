// ImageDropZone.jsx
import React, { useRef, useState } from "react";

export default function ImageDropZone({
  onFile, // (file: File) => void
  accept = "image/*", // MIME types accettati
  maxSizeMB = 20, // limite dimensione
  className = "",
}) {
  const [isOver, setIsOver] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  function handleFiles(files) {
    setError("");
    const file = files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Accetta solo immagini.");
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File troppo grande. Max ${maxSizeMB}MB.`);
      return;
    }
    onFile?.(file);
  }

  function onDrop(e) {
    e.preventDefault();
    setIsOver(false);
    handleFiles(e.dataTransfer.files);
  }

  function onPaste(e) {
    const item = Array.from(e.clipboardData.items).find((i) =>
      i.type.startsWith("image/")
    );
    if (item) handleFiles([item.getAsFile()]);
  }

  return (
    <div className={className}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) =>
          (e.key === "Enter" || e.key === " ") && inputRef.current?.click()
        }
        onDragOver={(e) => {
          e.preventDefault();
          setIsOver(true);
        }}
        onDragLeave={() => setIsOver(false)}
        onDrop={onDrop}
        onPaste={onPaste}
        style={{
          border: "2px dashed #aaa",
          borderColor: isOver ? "#555" : "#aaa",
          borderRadius: 12,
          padding: 24,
          textAlign: "center",
          cursor: "pointer",
          userSelect: "none",
        }}
        aria-label="Carica immagine con drag & drop, click o incolla"
      >
        <div style={{ fontWeight: 600, marginBottom: 6 }}>
          Trascina qui un’immagine
        </div>
        <div style={{ fontSize: 13, opacity: 0.7 }}>
          Oppure <u>clicca</u> per selezionare • Puoi anche <u>incollare</u>{" "}
          (Ctrl/⌘+V)
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={(e) => handleFiles(e.target.files)}
          style={{ display: "none" }}
        />
      </div>

      {error && (
        <div style={{ color: "#b00020", marginTop: 8, fontSize: 13 }}>
          {error}
        </div>
      )}
    </div>
  );
}
