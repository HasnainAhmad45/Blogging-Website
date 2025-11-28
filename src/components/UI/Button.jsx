import React from "react";

export function Button({ children, className = "", onClick, size, variant }) {
  let baseClass = "bg-slate-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-slate-700 transition-colors shadow-sm";
  
  if (variant === "outline") {
    baseClass = "border border-slate-600 text-slate-600 rounded-lg px-4 py-2 font-semibold hover:bg-slate-50 transition-colors";
  }

  if (size === "sm") {
    baseClass += " text-sm px-3 py-1";
  }

  return (
    <button className={`${baseClass} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
}
