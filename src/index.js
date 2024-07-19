import "./styles.css";
import { player } from '../modules/player';
import { generateShipCoords } from '../modules/generate-ship-coords';
import { renderGameboard } from '../modules/DOM';

const player_1 = player("Human");
const player_2 = player("Computer");

function getRandomCoord(){
  const x = Math.floor(Math.random() * 10);
  const y = Math.floor(Math.random() * 10);
  return [x,y];
}

renderGameboard("#gameboard-1");
renderGameboard("#gameboard-2");

function getPlayerAttackCoord(){
  // TODO ...
}

function showWinner(winner){
  if(winner === "human"){
    // TODO
  } else if(winner === "computer"){
    // TODO
  }
}

// while(true){
//   player_2.gameboard.receiveAttack(getPlayerAttackCoord());
//   if(player_2.gameboard.areAllShipsSunk()){
//     showWinner("human");
//     break;
//   }
//   player_1.gameboard.receiveAttack(getRandomCoord());
//   if(player_1.gameboard.areAllShipsSunk()){
//     showWinner("computer");
//     break;
//   }
// }

