import "./App.css";
import Learn from "./views/learn/Learn";
import Subject from "./views/subject/Subject";
function App() {
  return (
    <>
      <header>
        <h1>WebGL</h1>
      </header>
      <main>
        <Subject />
        <div
          style={{
            width: "300px",
            height: "240px",
            background: "linear-gradient(#ff00ff, #00ff00)",
          }}
        ></div>
        {/* <Learn /> */}
      </main>
    </>
  );
}

export default App;
