import "./App.css";
import News from "./components/News/index";
import NavBar from "./components/Navbar/index";

function App() {
  return (
    <>
      <NavBar />
      <div className="wrapper">
        <News />
      </div>
    </>
  );
}

export default App;
