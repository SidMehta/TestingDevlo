import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AnalysisPage from './pages/AnalysisPage';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="container">
            <h1>Robotic Advisor</h1>
            <p>Analyze and optimize your robotic automation needs</p>
          </div>
        </header>
        <main className="container">
          <Routes>
            <Route path="/" element={<AnalysisPage />} />
          </Routes>
        </main>
        <footer className="container">
          <p>&copy; {new Date().getFullYear()} Robotic Advisor. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;