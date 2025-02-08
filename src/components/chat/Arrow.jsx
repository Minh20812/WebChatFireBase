import React from "react";

const Arrow = ({ isAtBottom, handleScroll }) => {
  return (
    !isAtBottom && (
      <button
        onClick={handleScroll}
        className="sticky bottom-0 ml-auto bg-zinc-300 hover:bg-zinc-400 transition cursor-pointer rounded-lg p-2 shadow-black/60 shadow-lg"
      >
        <img className="w-4" src="/arrow.svg" />
      </button>
    )
  );
};

export default Arrow;
