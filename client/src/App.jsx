import React from "react";
import Login from "./pages/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppValues } from "./context";
import LoadingScreen from "./components/Loading";
import ScreenSharing from "./components/ScreenSharing";

const App = () => {
  const { loading } = AppValues();
  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <Router>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/join" element={<ScreenSharing/>}/>
            <Route path="/" element={<Home />} />
          </Routes>
          <ToastContainer position="top-left" />
        </Router>
      )}
    </>
  );
};

export default App;






