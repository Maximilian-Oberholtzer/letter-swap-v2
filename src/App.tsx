import React from "react";
import { ThemeProvider } from "./theme/Theme";
import { BrowserRouter as Router } from "react-router-dom";
import Main from "./main/Main";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <Main />
      </Router>
    </ThemeProvider>
  );
};

export default App;
