import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CVForm from "./components/CVForm";
import CVPreview from "./components/CVPreview";

export default function App() {
  const [cvData, setCVData] = useState({});

  return (
    <BrowserRouter>
  
      <Routes>
        <Route path="/" element={<CVForm setCVData={setCVData} />} />
        <Route path="/preview" element={<CVPreview cvData={cvData} />} />
      </Routes>
    </BrowserRouter>
  );
}
