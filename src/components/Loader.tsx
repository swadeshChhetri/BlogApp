import React from "react";

interface LoaderProps {
  color?: string;
}

const Loader: React.FC<LoaderProps> = ({ color = "border-blue-500" }) => {
  return (
    <div
      className={`w-5 h-5 border-2 border-t-transparent rounded-full animate-spin ${color}`}
    />
  );
};

export default Loader;

