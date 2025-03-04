import "./App.css";
import links from "./data/links.json";

function App() {
  console.log(links);
  return (
    <div className="App">
      <img src={"fotoSAPonteAhon.jpg"} className="User-Photo" alt="Mi foto" />
      <h1 className="Title"> S. A. Ponte Ahón</h1>
      <h2 className="Subtitle">Lic. Informática - Lic. Sistemas</h2>
    </div>
  );
}

export default App;
