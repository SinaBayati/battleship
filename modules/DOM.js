export function renderGameboard(DOMHook){
  for(let i = 0; i < 10; i++){
    for(let j = 0; j < 10; j++){
      const tile = generateTile();
      tile.dataset.coords = `${j},${i}`;
      const gameboard = document.querySelector(DOMHook);
      gameboard.append(tile);
    }
  }
}

function generateTile(){
  const tile = document.createElement("div");
  tile.dataset.state = "empty";
  return tile;
}