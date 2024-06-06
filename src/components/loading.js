import React from 'react';
import '../styles/loading.css'; // Import the loading.css file

const LoadingAnimation = () => {
  return (
    <div className="loading-container flex-col">
    <div className="border border-blue-300 shadow rounded-md p-4 max-w-sm w-full ">
  <div className="animate-pulse flex space-x-4">
    <div className="flex-1 space-y-10 py-1">
      <div className="h-20 bg-slate-200 rounded"></div>
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-4">
          <div className="h-20 bg-slate-200 rounded col-span-2"></div>
          <div className="h-20 bg-slate-200 rounded col-span-1"></div>
        </div>
        <div className="h-20 bg-slate-200 rounded"></div>
      </div>
    </div>
    </div>
  </div>
</div>
  );
};

export default LoadingAnimation;
