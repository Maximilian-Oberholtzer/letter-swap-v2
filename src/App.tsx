import React from "react";
import { ThemeProvider } from "./theme/Theme";
import { BrowserRouter as Router } from "react-router-dom";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <div>LetterSwap 2!</div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
