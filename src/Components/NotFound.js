import { Link } from "react-router-dom";
import FuzzyText from "./ReactBits/FuzzyText";

const NotFound = () => {
  return (
    <>
      <Link to="/">
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#000",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2rem",
            }}
          >
            {/* Titolo 404 */}
            <FuzzyText color="#f0edcc" baseIntensity={0.2} hoverIntensity={0.5}>
              404
            </FuzzyText>

            {/* Sottotitolo "Not Found" */}
            <FuzzyText
              color="#f0edcc"
              baseIntensity={0.15}
              hoverIntensity={0.4}
              fontSize="clamp(1rem, 4vw, 2rem)" // più piccolo del 404
              fontWeight={700}
            >
              Not&nbsp;Found
            </FuzzyText>
            <FuzzyText
              color="#f0edcc"
              baseIntensity={0.15}
              hoverIntensity={0.4}
              fontSize="clamp(1rem, 4vw, 2rem)" // più piccolo del 404
              fontWeight={700}
            >
              Click anywhere on the page to go back
            </FuzzyText>
          </div>
        </div>
      </Link>
    </>
  );
};

export default NotFound;
