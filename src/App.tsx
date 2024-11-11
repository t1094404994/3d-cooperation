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
        <Learn />
      </main>
    </>
  );
}

export default App;
