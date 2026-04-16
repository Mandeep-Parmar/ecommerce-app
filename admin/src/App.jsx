import React from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

const App = () => {
  return (
    <div>
      <>
        <Navbar />
        <hr className="text-gray-400" />
      </>
      <div className="flex w-full">
        <Sidebar />
      </div>
    </div>
  );
};

export default App;
