import React from "react";
import { AuthProvider } from "./contexts/AuthContext";

const App: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default App;
