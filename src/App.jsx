import "./App.css";
import NavBar from "./components/Navbar";
import Footer from "./components/Footer";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route } from "react-router-dom";
import NotFound from "./components/404/NotFound";
import StudentMain from "./student";
import FacultMain from "./faculty";
import LandingPage from "./login/loginLanding";
import SignIn from "./components/signinForm";
import Upload from "./components/uploadCSV"

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<SignIn/>}/>
        <Route path="/upload" element={<Upload/>}/>
        <Route path="/login" element={<LandingPage/>}/>
        <Route path="/student" element={<StudentMain/>}/>
        <Route path="/faculty" element={<FacultMain/>}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
