// Start.jsx
import React from "react";
import PixelBlast from "./ReactBits/PixelBlast";
import "./Start.css";
import ASCIIText from "./ReactBits/ASCIIText";

const Start = () => {
  return (
    <div className="start-page">
      <div style={{ position: "relative", minHeight: "100vh" }}>
        {/* BACKGROUND */}
        <PixelBlast
          style={{ position: "absolute", inset: 0, zIndex: 0 }}
          variant="circle"
          pixelSize={6}
          color="#FF0000"
          patternScale={3}
          patternDensity={1.2}
          pixelSizeJitter={0.5}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          liquidRadius={1.2}
          liquidWobbleSpeed={5}
          speed={0.6}
          edgeFade={0.25}
          transparent
        />
        {/* CONTENT */}
        <div className="title-container">
          <ASCIIText
            text="WeLCoMe"
            enableWaves={true}
            asciiFontSize={6}
            color="#FFFFFF"
            sample={8}
            textFontSize={80}
            planeBaseHeight={4}
          />
        </div>
      </div>
    </div>
  );
};

export default Start;
