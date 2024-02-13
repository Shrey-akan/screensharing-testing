// App.js
import React, { useState, useEffect, useRef } from 'react';
import socketIOClient from 'socket.io-client';

const ENDPOINT = 'http://localhost:5000';
const socket = socketIOClient(ENDPOINT);

function Join() {
  const [streams, setStreams] = useState([]);

  useEffect(() => {
    socket.on('stream', (stream) => {
      displayStream(stream);
    });

    return () => {
      socket.off('stream');
    };
  }, []);

  const startStream = () => {
    navigator.mediaDevices.getDisplayMedia({ video: true })
      .then((stream) => {
        socket.emit('startStream', stream);
        displayStream(stream);
      })
      .catch((error) => console.error('Error accessing user media:', error));
  };

  const displayStream = (stream) => {
    setStreams(prevStreams => [...prevStreams, stream]);
  };

  return (
    <div className="App">
      <h1>Screen Sharing App</h1>
      <div className="controls">
        <button onClick={startStream}>Start Screen Sharing</button>
      </div>
      <div className="streams-container">
        {streams.map((stream, index) => (
          <div className="stream" key={index}>
            <video autoPlay controls src={URL.createObjectURL(stream)} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Join;
