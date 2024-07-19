import { ship } from "./ship";

export function gameboard(){
  const shots = [];
  const ships = [];

  function addShip(coords){
    // must receive coords in this format: [[1,2],[1,3],[1,4]] => for a vertical ship of length 3
    if(!isValidShipCoords(coords)) return;
    const newShip = ship(coords.length);
    newShip.coords = coords;
    this.ships.push(newShip);
  }

  function isValidShipCoords(inputCoords){
    let isValid = true;
    ships.forEach((s) => {
      const currentShipCoords = s.coords;
      for(let coord of inputCoords){
        if(containsCoord(currentShipCoords,coord)){
          isValid = false;
        }
      }
    });
    return isValid;
  }

  function containsCoord(shipCoords,targetCoord){
    // input formats: shipCoords => [[2,3],[2,4]]  targetCoord => [2,3]
    const stringifiedTargetCoord = targetCoord.join(",");
    for(let coord of shipCoords){
      const stringifiedShipCoord = coord.join(",");
      if(stringifiedShipCoord === stringifiedTargetCoord){
        return true;
      }
    }
    return false;
  }

  function receiveAttack(coords){
    const [x,y] = coords;
    const hit = doesHit(coords);
    shots.push({x,y,hit})
    if(hit){
      sendHitToTargetShip(coords);
    }
  }

  function sendHitToTargetShip(coords){
    for(let ship of ships){
      const currentShipCoord = ship.coords;
      if(containsCoord(currentShipCoord,coords)){
        ship.hit();
      }
    }
  }

  function doesHit(coords){
    for(let ship of ships){
      const currentShipCoord = ship.coords;
      if(containsCoord(currentShipCoord,coords)){
        return true;
      }
    }
    return false;
  }

  return {
    shots,
    ships,
    addShip,
    receiveAttack,
  };
}