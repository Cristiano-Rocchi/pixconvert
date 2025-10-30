import React, { useState } from "react";
import { motion } from "framer-motion";
import PixelBlast from "./ReactBits/PixelBlast";
import "./Start.css";
import RotatingText from "./ReactBits/RotatingText";
import TargetCursor from "./ReactBits/TargetCursor";
import { useNavigate } from "react-router-dom";
import Convert from "./Convert"; // 👈 underlay locale

const Start = () => {
  const navigate = useNavigate();
  const [showUnderlay, setShowUnderlay] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const handleStart = () => {
    // 1) monta Convert sotto
    setShowUnderlay(true);
    // 2) avvia animazione "serranda"
    setLeaving(true);
    // 3) naviga a fine animazione (matcha la duration sotto)
    setTimeout(() => {
      navigate("/convert");
    }, 600);
  };

  return (
    <>
      {/* UNDERLAY: Convert subito sotto Start, visibile mentre Start scorre via */}
      {showUnderlay && (
        <div style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>
          <Convert />
        </div>
      )}

      <motion.div
        className="start-page"
        initial={false}
        animate={{ y: leaving ? "-100%" : 0 }} // 👈 scorre verso l’alto
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2, // sopra l’underlay
          willChange: "transform",
          overflow: "hidden",
          background: "transparent",
        }}
      >
        <TargetCursor
          targetSelector=".start-button"
          spinDuration={2}
          hideDefaultCursor={true}
        />

        <div style={{ position: "relative", minHeight: "100vh" }}>
          <PixelBlast
            style={{ position: "absolute", inset: 0, zIndex: 0 }}
            variant="square"
            pixelSize={4}
            color="#f0edcc"
            patternScale={3}
            patternDensity={0.8}
            enableRipples
            rippleSpeed={0.4}
            rippleThickness={0.12}
            rippleIntensityScale={1.5}
            liquidRadius={0.2}
            liquidWobbleSpeed={5}
            speed={0.6}
            edgeFade={0.15}
          />

          {/* CONTENT */}
          <div className="d-flex flex-column justify-content-center align-items-center start-container">
            <div className="title-container">
              <div className="d-flex justify-content-center align-items-center">
                <span className="hero-static">
                  <h1>WELCOME</h1>
                </span>

                <RotatingText
                  texts={[
                    "Creators",
                    "Makers",
                    "Artists",
                    "Pixel Heads",
                    "Retro Lovers",
                    "Converters",
                    "Friends",
                    "Pezzidimmerda",
                  ]}
                  mainClassName="rotating-badge"
                  staggerFrom="last"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-120%" }}
                  staggerDuration={0.1}
                  splitLevelClassName="overflow-hidden"
                  transition={{ type: "spring", damping: 30, stiffness: 400 }}
                  rotationInterval={2500}
                />
              </div>

              <div className="intro-text">
                <h2>
                  Free online image-to-pixel converter. <br />
                  Upload, customize, and download your pixelated artwork in
                  seconds.
                </h2>
              </div>
            </div>

            <div className="button-container">
              {/* niente <Link>: nav dopo animazione */}
              <button className="start-button" onClick={handleStart}>
                START
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Start;
