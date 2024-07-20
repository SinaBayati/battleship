export function renderGameboard(selector){
  for(let i = 0; i < 10; i++){
    for(let j = 0; j < 10; j++){
      const tile = generateTile();
      tile.dataset.coords = `${j},${i}`;
      const gameboard = document.querySelector(selector);
      gameboard.append(tile);
    }
  }
}

export function updateGameboard(gameboardObj,selector){
  gameboardObj.shots.forEach((shot) => {
    const shotStr = `${shot.x},${shot.y}`;
    const tiles = Array.from(document
    .querySelector(selector)
    .querySelectorAll(`${selector} > div`)
    );

    tiles.forEach((t) => {
      if(t.dataset.coords == shotStr){
        if(shot.hit) t.dataset.state = "hit";
        if(!shot.hit) t.dataset.state = "marked";
      }
    });
  });
}

export function initializeGameboard(gameboard,selector){
  const ships = gameboard.ships;
  ships.forEach((ship) => {
    const coordsArray = ship.coords;
    coordsArray.forEach((c) => {
      const coordStr = `${c[0]},${c[1]}`;
      const tiles = document
        .querySelector(selector)
        .querySelectorAll(`${selector} > div`);

      tiles.forEach((t) => {
        if(t.dataset.coords == coordStr){
          t.dataset.state = "ship";
        }
      });
    });
  });
}

function generateTile(){
  const tile = document.createElement("div");
  tile.dataset.state = "empty";
  return tile;
}
