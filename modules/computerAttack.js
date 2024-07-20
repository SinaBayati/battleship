export function computerAttack(player){
  while(true){
    const randomCoord = getRandomCoord();
    if(isValidShot(randomCoord,player)){
      player.gameboard.receiveAttack(randomCoord);
      break;
    }
  }
}

function isValidShot(shotCoord,player){
  const shotsArray = player.gameboard.shots;
  return shotsArray.every((shot) => {
    if(shot.x !== shotCoord[0] 
    && shot.y !== shotCoord[1]){
      return true;
    }
    return false;
  });
}

function getRandomCoord(){
  const x = Math.floor(Math.random() * 10);
  const y = Math.floor(Math.random() * 10);
  return [x,y];
}
