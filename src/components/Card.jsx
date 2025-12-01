import React from 'react';

const Card = ({ children, className = "", variant = "default", title }) => {
  const baseStyles = "rounded-2xl p-6 shadow-lg backdrop-blur-xl border transition-all duration-300";

  const variants = {
    default: "bg-[#111C44]/80 border-white/5",
    glass: "bg-white/5 border-white/10 hover:bg-white/10",
    primary: "bg-gradient-to-br from-blue-600/20 to-blue-900/20 border-blue-500/30",
    success: "bg-gradient-to-br from-green-600/20 to-green-900/20 border-green-500/30",
    warning: "bg-gradient-to-br from-yellow-600/20 to-yellow-900/20 border-yellow-500/30",
    danger: "bg-gradient-to-br from-red-600/20 to-red-900/20 border-red-500/30",
  };

  return (
    <div className={`${baseStyles} ${variants[variant] || variants.default} ${className}`}>
      {title && (
        <h3 className="text-lg font-bold text-white mb-4 tracking-tight">{title}</h3>
      )}
      {children}
    </div>
  );
};

export default Card;
