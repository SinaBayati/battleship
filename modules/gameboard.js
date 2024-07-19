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
      const stringifiedTargetCoord = targetCoord.join(",");
      for(let coord of shipCoords){
        const stringifiedShipCoord = coord.join(",");
        if(stringifiedShipCoord === stringifiedTargetCoord){
          return true;
        }
      }
      return false;
    }

  return {
    shots,
    ships,
    addShip,
    isValidShipCoords,
  };
}