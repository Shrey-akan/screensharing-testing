import React, { useEffect, useState } from "react";
import { AppValues, server } from "../context";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

import socketIOClient from "socket.io-client";

const ENDPOINT = "http://localhost:5000";
const socket = socketIOClient(ENDPOINT);

const Home = () => {
  const { isAuth, setIsAuth, setUser } = AppValues();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuth) return navigate("/login");
  }, [isAuth, navigate]);

  const handleLogout = async () => {
    try {
      const { data } = await axios.post(
        `${server}/api/v1/logout`,
        { userId: Cookies.get("userId") },
        {
          headers: {
            accesstoken: Cookies.get("accesstoken"),
          },
        }
      );

      toast.success(data.message);
      Cookies.remove("userId");
      Cookies.remove("accesstoken");
      setIsAuth(false);
      setUser([]);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const [stream, setStream] = useState(null);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    socket.on("stream", (stream) => {
      setStream(stream);
    });

    return () => {
      socket.off("stream");
    };
  }, []);

  const startStream = () => {
    navigator.mediaDevices
      .getDisplayMedia({ video: true })
      .then((stream) => {
        setStream(stream);
        socket.emit("startStream", stream.id); // Pass stream ID
        setIsStarted(true);
      })
      .catch((error) => console.error("Error accessing user media:", error));
  };

  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <button
        onClick={handleLogout}
        className="absolute top-0 right-0 m-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Logout
      </button>

      <div className="App">
        <h1>Screen Sharing App</h1>
        <div className="controls">
          {!isStarted && (
            <button
              style={{ borderWidth: "1px", borderColor: "black" }}
              onClick={startStream}
            >
              Start Screen Sharing
            </button>
          )}
        </div>
        <div className="streams-container">
          {stream && (
            <div className="stream">
              <video
                autoPlay
                controls
                ref={(video) => {
                  if (video && "srcObject" in video) {
                    video.srcObject = stream;
                  }else{
                    video.src = URL.createObjectURL(new Blob(stream, {type: "application/text"}))
                    
                    console.log(stream)
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
