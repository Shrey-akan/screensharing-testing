import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import { server } from "../context";

const ENDPOINT = "http://localhost:5000";

const socket = socketIOClient(ENDPOINT);

const ScreenSharing = () => {
  const [stream, setStream] = useState(null);
  const [peers, setPeers] = useState([]);

  const [path] = useState(window.location.pathname);

  console.log(path)

  const myVideoRef = useRef();

  useEffect(() => {
    
    navigator.mediaDevices
      .getDisplayMedia({ video: true })
      .then((stream) => {
        setStream(stream);
        myVideoRef.current.srcObject = stream;

        // send stream to server
        socket.emit("startStream", stream)

        
        
      })
      .catch((err) => console.log("Error Accessing user media", err));

      socket.on("stream", (stream)=>{
        const newPeer = new MediaStream()
        const video = document.createElement('video')
        video.srcObject = stream
        video.autoplay = true
        video.className = 'peer-video'
        newPeer.addTrack(video.srcObject.getVideoTracks()[0])

        setPeers(prevPeers => [...prevPeers, newPeer])
      })

      // cleanup
      return ()=>{
        stream?.getTracks().forEach(track=>track.stop())
      }
  },[]);
  return <div>
    <h1>Sharing Screen</h1>
    <div className="my-video">
      <video ref={myVideoRef} muted autoPlay />
    </div>
    <div className="peer-videos">
      {peers.map((peer, index)=>(
        <div className="peer-video-container" key={index}>
        <video ref={peerRef} autoPlay />
      </div>
      ))}
    </div>
  </div>;
};

export default ScreenSharing;
