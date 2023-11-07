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
        <Route path="/student" element={<StudentMain/>}/>
        <Route path="/faculty" element={<FacultMain/>}/>
        <Route path="*" element={<NotFound />} />
        {/* <Route render={({ match }) => {
          const routingPattern = /^[0-9]{2}[a-zA-Z]{3}[0-9]{3}$/;
          if (!routingPattern.test(match.params.routingString)) {
            return <Redirect to="*" />;
          }
          return null;
        }} /> */}
      </Routes>
    </div>
  );
}

export default App;
