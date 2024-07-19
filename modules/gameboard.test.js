import { gameboard } from './gameboard';

test("gameboard addShip function",() => {
  const gameboard1 = gameboard();
  gameboard1.addShip([[1,2],[1,3],[1,4]]);
  expect(gameboard1.ships[0].coords).toEqual([[1,2],[1,3],[1,4]]);
});

test("gameboard addShip function with duplicate coords",() => {
  const gameboard2 = gameboard();
  gameboard2.addShip([[2,2],[2,3],[2,4]]);
  gameboard2.addShip([[1,3],[2,3],[3,3]]);
  expect(gameboard2.ships.length).toBe(1);
});
