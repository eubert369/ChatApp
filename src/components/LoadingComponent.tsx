import React from "react";

export default function LoadingComponent() {
  return (
    <div className="absolute z-10 h-full w-full flex items-center justify-center">
      <div className="flex gap-3 items-center">
        <div className="h-3 w-3 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-3 w-3 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-3 w-3 bg-white rounded-full animate-bounce"></div>
      </div>
    </div>
  );
}
