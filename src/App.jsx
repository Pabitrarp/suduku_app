import React, { useState } from "react";
import SudokuSolver from "./Component/SudokuSolver";

const App = () => {
  return(
    <div className="bg-black w-full h-screen">
     
    <SudokuSolver></SudokuSolver>
    </div>
  );
};

export default App;
