import "./styles.css";
import { player } from '../modules/player';
import { generateShipCoords } from '../modules/generate-ship-coords';
import { 
  initializeGameboard,
  renderGameboard,
  updateGameboard,
} from '../modules/DOM';
import { computerAttack } from '../modules/computerAttack';

const restartBtn = document.querySelector("#restart");
const reordertBtn = document.querySelector("#reorder");
const playBtn = document.querySelector("#play");
const computerGameboardEl = document.querySelector("#gameboard-computer");
const winnerEl = document.querySelector("#winner");

const humanPlayer = player("Human");
addShipsToGameboard(humanPlayer.gameboard);

const computerPlayer = player("Computer");
addShipsToGameboard(computerPlayer.gameboard);

renderGameboard("#gameboard-human");
initializeGameboard(humanPlayer.gameboard,"#gameboard-human");
renderGameboard("#gameboard-computer");
initializeGameboard(computerPlayer.gameboard,"#gameboard-computer");

function addShipsToGameboard(gameboard){
  while(gameboard.ships.length !== 1){
    gameboard.addShip(generateShipCoords(4));
  }
  while(gameboard.ships.length !== 2){
    gameboard.addShip(generateShipCoords(3));
  }
  while(gameboard.ships.length !== 3){
    gameboard.addShip(generateShipCoords(3));
  }
  while(gameboard.ships.length !== 4){
    gameboard.addShip(generateShipCoords(2));
  }
  while(gameboard.ships.length !== 5){
    gameboard.addShip(generateShipCoords(2));
  }
  while(gameboard.ships.length !== 6){
    gameboard.addShip(generateShipCoords(2));
  }
}

function computerPlay(){
  computerAttack(humanPlayer);
  updateGameboard(humanPlayer.gameboard,"#gameboard-human");
}

function humanPlay(event){
  const tile = event.target;
  const coordsStr = tile.dataset.coords;

  if(!isCoordStrUnique(coordsStr)){
    return;
  }

  let coordArr = coordsStr.split(",");
  coordArr = [Number(coordArr[0]),Number(coordArr[1])];

  computerPlayer.gameboard.receiveAttack(coordArr);
  updateGameboard(computerPlayer.gameboard,"#gameboard-computer");

  if(computerPlayer.gameboard.areAllShipsSunk()){
    showWinner("human");
    removeListeners();
  } else {
    computerPlay();
    if(humanPlayer.gameboard.areAllShipsSunk()){
      showWinner("computer");
      removeListeners();
    }
  }
}

const selectedCoords = [];
function isCoordStrUnique(coordStr){
  if(selectedCoords.every(c => !(c == coordStr))){
    selectedCoords.push(coordStr);
    return true;
  }
  return false;
}

function removeListeners(){
  computerGameboardEl.removeEventListener(humanPlay);
}

function showWinner(winner){
  if(winner === "human"){
    winnerEl.textContent = "Human Won!";
  } else if(winner === "computer"){
    winnerEl.textContent = "Computer Won!";
  }
}

restartBtn.addEventListener("click",() => {
  location.reload();
});

playBtn.addEventListener("click",() => {
  reordertBtn.setAttribute("disabled","true");
  playBtn.setAttribute("disabled","true");
  restartBtn.removeAttribute("disabled");
  computerGameboardEl.addEventListener("click",humanPlay);
});

reordertBtn.addEventListener("click",() => {
  location.reload();
});
