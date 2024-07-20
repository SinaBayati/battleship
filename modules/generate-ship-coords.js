export function generateShipCoords(shipLength){
  let coords = [];
  let orientation = randBool() ? "h" : "v";
  
  while(true){
    let x = randNum();
    let y = randNum();

    if(orientation === "h"){
      for(let i = 0; i < shipLength; i++){
        coords.push([x,y]);
        x++;
      }
    } else if(orientation === "v"){
      for(let i = 0; i < shipLength; i++){
        coords.push([x,y]);
        y++;
      }
    }
    if(validateCoords(coords)) break;
    coords = [];
  }
  return coords;
}

function randBool(){
  const randNum = Math.floor((Math.random()) * 2);
  if(randNum === 0) return false;
  return true;
}

function randNum(start = 0,end = 9){
  return Math.floor((Math.random()) * (end + 1));
}

function validateCoords(coords){
  return coords.every((c) => {
    return ((c[0] <= 9 && c[0] >= 0) && (c[1] <= 9 && c[1] >= 0));
  });
}
