import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import NewYorkTimes from "./components/News/NewYork/index";
import GuardianNews from "./components/News/Guardian/index";
import NewsApi from "./components/News/NewsApi/index";
import NavBar from "./components/Navbar/index";

function App() {
  console.log("App Component Loaded");
  return (
    <>
      <NavBar />
      <div className="wrapper">
        <Routes>
          <Route path="/" element={<NewYorkTimes />} />
          <Route path="/new-api" element={<NewsApi />} />
          <Route path="/guardian-news" element={<GuardianNews />} />
          <Route path="*" element={<h2 className="text-center text-red-500">404 - Page Not Found</h2>} />
        </Routes>
      </div>
    </>
  );
}

export default App;
