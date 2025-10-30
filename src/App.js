import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Components/Home";
import Start from "./Components/Start";
import Home2 from "./Components/Home2";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/start" element={<Start />} />
        <Route path="/2" element={<Home2 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
