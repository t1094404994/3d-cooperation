import "./App.css";
import Subject from "./views/subject/Subject";
function App() {
  return (
    <>
      <header>
        <h1>WebGL</h1>
      </header>
      <main>
        {/* <Learn /> */}
        <Subject />
        <div
          style={{
            width: "300px",
            height: "240px",
            background: "linear-gradient(#ff0000, #00ff00)",
          }}
        ></div>
        {/* <Learn /> */}
      </main>
    </>
  );
}

export default App;
