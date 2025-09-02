import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UploadPage, ExamPage } from './pages';

function App() {
  return (
    <Router basename="/mock-examer/">
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/exam" element={<ExamPage />} />
      </Routes>
    </Router>
  );
}

export default App;
