import React from "react";
import "./App.css";
import links from "./data/links.json";
import LinkBox from "./molecules/LinkBox";

function App() {
  return (
    <div className="App">
      <img src={"fotoSAPonteAhon.jpg"} className="User-Photo" alt="Mi foto" />
      <h1 className="Title"> S. A. Ponte Ahón</h1>
      <h2 className="Subtitle">Lic. Informática - Lic. Sistemas</h2>
      {links.map((link) => (
        <LinkBox key={link.name} item={link} />
      ))}
    </div>
  );
}

export default App;
