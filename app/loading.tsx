import * as React from "react";
import Header from "./components/Header";

export default function loading() {
  // @ts-ignore
  const arr = [...Array(13).keys()];
  arr.shift();

  return (
    <main>
      <Header />
      <div className="py-3 px-36 mt-10 flex flex-wrap justify-center">
        {arr.map((num) => (
          <div
            key={num}
            className="animate-pulse m-3 bg-slate-200 w-64 h-72 rounded overflow-hidden border cursor-pointer"
          ></div>
        ))}
      </div>
    </main>
  );
}
