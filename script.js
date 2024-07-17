// game module
const game = (function () {
  const row = 3;
  const col = 3;
  let board = [];

  function reset() {
    for (let i = 0; i < row; i++) {
      board[i] = [];
      for (let j = 0; j < col; j++) {
        board[i][j] = "";
      }
    }
  }
  reset();

  let player1 = {
    name: "Player 1",
    sign: "X",
  };
  let player2 = {
    name: "Player 2",
    sign: "O",
  };
  return { player1, player2, board, reset };
})();

//module for playing
const play = (function () {
  let player = game.player1;
  let flag = true;
  let winnerIS = "";
  const board = game.board;
  function turns() {
    if (player.sign == "X") {
      player = game.player2;
      // console.log(`${player.name} turn`);
    } else {
      player = game.player1;
      // console.log(`${player.name} turn`);
    }
  }
  function getTurn() {
    return player;
  }
  function showboard() {
    checkWinner();
    let tie = true;
    for (let i = 0; i < board.length; i++) {
      if (board[i][0] == "" || board[i][1] == "" || board[i][2] == "") {
        // checking if any cell is still empty
        tie = false;
      }
      // console.log(`${board[i][0]} ${board[i][1]} ${board[i][2]}`);
    }
    if (tie == true && flag == true) {
      winnerIS = "Its a tie";
      tie = false;
      player = game.player1;
      flag = false;
      return;
    } else if (tie == true) {
      tie = false;
    }
  } 
  
  function getWinner() {
    let temp = winnerIS;
    if (winnerIS != "") {
      winnerIS = "";
    }
    return temp;
  }
  function checkWinner() {
    function winner(val) {
      if (val == "X") {
        // console.log(`${game.player1.name} wins`);
        //alert(`${game.player1.name} wins`);
        winnerIS = `${game.player1.name} wins`;
      } else {
        // console.log(`${game.player2.name} wins`);
        // alert(`${game.player2.name} wins`);
        winnerIS = `${game.player2.name} wins`;
      }
      player = game.player1;
      // game.reset();
      flag = false;
    }

    for (let i = 0; i < 3; i++) {
      if (
        board[i][0] != "" &&
        board[i][0] == board[i][1] &&
        board[i][2] == board[i][0]
      ) {
        winner(board[i][0]);
        return;
      }
    }

    for (let i = 0; i < 3; i++) {
      if (
        board[0][i] != "" &&
        board[0][i] == board[1][i] &&
        board[2][i] == board[0][i]
      ) {
        winner(board[0][i]);
        return;
      }
    }
    const mid = board[1][1];
    if (mid != "") {
      if (board[0][0] == mid && board[2][2] == mid) {
        winner(mid);
      } else if (board[0][2] == mid && board[2][0] == mid) {
        winner(mid);
        return;
      }
    }
  }

  function changeValue(row, col) {
    if (row >= 3 || col >= 3 || row < 0 || col < 0 || board[row][col] != "") {
      console.log("Enter a valid location");
      return;
    } else {
      board[row][col] = player.sign;
    }
    showboard();
    if (flag) {
      turns();
    } else {
      flag = true;
    }
  }
  return { changeValue, getTurn, getWinner };
})();

//screencontroller
const screencontroller = (function () {
  const playerturn = document.querySelector(".turn");
  const btnContainer = document.querySelector(".buttons");
  const grid = document.querySelector(".grid");
  const board = game.board;
  const winner = document.querySelector(".winner");
  const playAgain = document.createElement("button");
  const name1 = document.querySelector(".name1");
  const name2 = document.querySelector(".name2");
  const change = document.querySelector(".changeName");
  playAgain.classList.add("interact");
  playAgain.textContent = "Play Again";
  function addcells() {
    board.forEach((row, index1) => {
      const div = document.createElement("div");
      grid.appendChild(div);
      div.classList.add("rows");
      row.forEach((col, index) => {
        const btn = document.createElement("button");
        btn.classList.add("cell");
        btn.dataset.col = index;
        btn.dataset.row = index1;
        btn.textContent = board[index1][index];
        div.appendChild(btn);
      });
    });
  }
  addcells();
  const cells = document.querySelectorAll(".cell");
  function updateScreen() {
    cells.forEach((cell) => {
      cell.textContent = board[cell.dataset.row][cell.dataset.col];
    });
  }
  cells.forEach((cell) => {
    cell.addEventListener("click", (e) => {
      play.changeValue(cell.dataset.row, cell.dataset.col);
      playerturn.textContent = `${play.getTurn().name}'s turn`;
      winner.textContent = play.getWinner();
      if (winner.textContent != "") {
        btnContainer.appendChild(playAgain);
        cells.forEach((cell) => {
          cell.disabled = true;
          change.disabled = true;
          playerturn.textContent = "";
        });
      }
      updateScreen();
    });
  });
  change.addEventListener("click", (e) => {
    e.preventDefault();
    if (name1.value == "" || name2.value == "") {
      alert("Enter a Valid name");
    } else {
      game.player1.name = name1.value;
      game.player2.name = name2.value;
      playerturn.textContent = `${play.getTurn().name}'s turn`;
      alert("Names changed");
    }
  });
  playAgain.addEventListener("click", () => {
    winner.textContent = "";
    game.reset();
    updateScreen();
    playerturn.textContent = `${play.getTurn().name}'s turn`;
    cells.forEach((cell) => {
      cell.disabled = false;
      change.disabled = false;
    });
    btnContainer.removeChild(playAgain);
  });
  return { updateScreen };
})();
