import React, { useEffect, useState } from "react";

function SudokuSolver() {
 
  
   const isValid = (board, row, col, num) => {
    
    for (let i = 0; i < 9; i++) {
      if (
        (board[row][i] === num && i !== col) || 
        (board[i][col] === num && i !== row) 
      ) {
        return false;
      }
    }
  
    
    const boxStartRow = Math.floor(row / 3) * 3;
    const boxStartCol = Math.floor(col / 3) * 3;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const currentRow = boxStartRow + r;
        const currentCol = boxStartCol + c;
        if (
          board[currentRow][currentCol] === num &&
          (currentRow !== row || currentCol !== col) 
        ) {
          return false;
        }
      }
    }
  
    return true;
  };
  const generateNewBoard = () => {
    const emptyBoard = Array(9)
      .fill()
      .map(() => Array(9).fill(0));


    const fillRandomCells = (board, count) => {
      for (let i = 0; i <count; i++) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        const num = Math.floor(Math.random() * 9) + 1;

        if (board[row][col] === 0 && isValid(board, row, col, num)) {
          board[row][col] = num;
        }
      }
      return board;
    };

    return fillRandomCells(emptyBoard, 20); 
  };

  const [board, setBoard] = useState(generateNewBoard()); 
  const [solvedBoard, setSolvedBoard] = useState(null);
  const [error,seterror]=useState({rows:[],cols:[],matrix:[]});
  
  
  const handleInputChange = (row, col, value) => {
    const newBoard = board.map((r, i) =>
      r.map((c, j) => (i === row && j === col ? Number(value) || 0 : c))
    );
    setBoard(newBoard);
  };

 
  

  
  const solveSudoku = (board) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              if (solveSudoku(board)) return true;
              board[row][col] = 0; 
            }
          }
          return false; 
        }
      }
    }
    return true;
  };

  
  const handleSolve = () => {
    const newBoard = board.map((row) => [...row]); 
    if (solveSudoku(newBoard)) {
      setSolvedBoard(newBoard);
      setBoard(newBoard); 
    } else {
      alert("No solution exists!");
    }
  };

 
  const handleHint = (e) => {
    
  if (!solvedBoard) {
   
    const newBoard = board.map((row) => [...row]);
    if (solveSudoku(newBoard)) {
      setSolvedBoard(newBoard); 
    } else {
      alert("No solution exists!");
      return; 
    }
  }
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          const hintValue =solvedBoard[row][col];
        const hintBoard = board.map((r, i) =>
          r.map((c, j) => (i === row && j === col ? hintValue : c))
        );
        setBoard(hintBoard);
          // alert(`Hint: Row ${row + 1}, Column ${col + 1} = ${hintValue}`);
          return;
        }
      }
    }
  };


  const handleValidate = () => {
    const invalidrow=[];
    const invalidcol=[];
    const invalidmatrix=[];
    for (let row = 0; row <9; row++) {
      for (let col = 0; col <9; col++) {
        
        if (board[row][col] != 0 && !isValid(board, row, col, board[row][col])) {
          invalidcol.push(col);
          invalidrow.push(row);
          const start=Math.floor(row/3)*3;
          const end=Math.floor(col/3)*3;
          invalidmatrix.push(`${start}-${end}`);
          // alert(`Invalid entry at Row ${row + 1}, Column ${col + 1}`);
          seterror({
            rows:[...new Set(invalidrow)],
            cols:[...new Set(invalidcol)],
            matrix:[...new Set(invalidmatrix)],
          })
          return;
        }
      }
    }
    
  
  if(invalidcol.length==0 && invalidmatrix.length==0 && invalidrow.length==0){
     alert("the board is valid ")
     seterror({
      rows:[],
      cols:[],
      matrix:[]
     })
  }else{
    alert("error occre");
  }
  };


  const handleRefresh = () => {
    setBoard(generateNewBoard());
    setSolvedBoard(null);
  };

  return (
    <div className="flex flex-col items-center p-6 bg-black min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-white">Sudoku Solver</h1>
      <div className="grid grid-cols-9 gap-1">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
          const iserrorinrow=error&&error.rows.includes(rowIndex)
          const iserrorincol=error&&error.cols.includes(colIndex)
          const iserrorinmatrix=error&&error.matrix.includes(`${Math.floor(rowIndex/3)*3}-${Math.floor(colIndex/3)*3}`);
          const cellclass=iserrorinrow?"bg-red-400":iserrorincol?"bg-red-400":iserrorinmatrix?"bg-red-400":"bg-white"

     return  <input
     key={`${rowIndex}-${colIndex}`}
     type="number"
     min="0"
     max="9"
     value={cell==0? '' :cell}
     onChange={(e) =>
       handleInputChange(rowIndex, colIndex, e.target.value)
     }
     className={`w-12 h-12 text-center border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
       (rowIndex + 1) % 3 === 0 && rowIndex !== 8
         ? "border-b-4"
         : ""
     } ${
       (colIndex + 1) % 3 === 0 && colIndex !== 8
         ? "border-r-4"
         : ""
     } ${cellclass} rounded-lg bg-gray-300 p-2 text-lg font-bold appearance-none no-arrows`}
   />
          })
        )}
      </div>
      <div className="flex gap-4 mt-6">
       {
        error.cols.length==0&& <><button
        onClick={handleSolve}
        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded shadow hover:bg-blue-700"
      >
        Solve
      </button>
      <button
        onClick={handleHint}
        className="px-4 py-2 bg-green-600 text-white font-semibold rounded shadow hover:bg-green-700"
      >
        Hint
      </button></>
       }
        <button
          onClick={handleValidate}
          className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded shadow hover:bg-yellow-600"
        >
          Validate
        </button>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-red-600 text-white font-semibold rounded shadow hover:bg-red-700"
        >
          New Puzzel
        </button>
      </div>
    </div>
  );
}

export default SudokuSolver;
