import React from "react";
import "./App.css";
import ApiCall from "./ApiCall.tsx";
import { ParentProvider } from "./DesignContext";

function App() {
  return (
    <div className="App">
      <ParentProvider>
        <section id="content" className="ac-content">
          {<ApiCall />}
        </section>
      </ParentProvider>
    </div>
  );
}

export default App;
