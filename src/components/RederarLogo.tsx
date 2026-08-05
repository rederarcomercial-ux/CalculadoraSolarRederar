import React from "react";

interface RederarLogoProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function RederarLogo({ className = "", style }: RederarLogoProps) {
  return (
    <img
      src="/logo.jpg"
      alt="REDERAR Logo"
      className={`${className} object-contain`}
      style={{ display: "block", ...style }}
      referrerPolicy="no-referrer"
    />
  );
}

