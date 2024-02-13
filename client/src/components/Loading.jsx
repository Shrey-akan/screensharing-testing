import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
      <div className="text-xl mt-4">Loading...</div>
    </div>
  );
};

export default LoadingScreen;
