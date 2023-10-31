import "./App.css";
import NavBar from "./components/Navbar";
import Home from "./components/Home";
import Footer from "./components/Footer";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route } from "react-router-dom";
import NotFound from "./components/404/NotFound";
import StudentMain from "./student";
import FacultMain from "./faculty";
import LandingPage from "./login/loginLanding";



function App() {

  


  return (
    

    <div>
      <Routes>
        <Route
          path="/"
          exact
          element={
            <>
              <div id="app" className="z-30 flex flex-col justify-between">
                <NavBar />
                <Home />
                <Footer />
              </div>
            </>
          }
        />
        <Route path="/login" element={<LandingPage/>}/>
        <Route path="/student" element={<StudentMain/>}/>
        <Route path="/faculty" element={<FacultMain/>}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
