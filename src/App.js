import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Convert from "./Components/Convert";
import Start from "./Components/Start";
import "bootstrap/dist/css/bootstrap.min.css";
import NotFound from "./Components/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/convert" element={<Convert />} />
        <Route path="/" element={<Start />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
