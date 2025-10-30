import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Convert from "./Components/Convert";
import Start from "./Components/Start";

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/convert" element={<Convert />} />
        <Route path="/" element={<Start />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
