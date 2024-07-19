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

test("gameboard receiveAttack function (shot missing)",() => {
  const g = gameboard();
  g.receiveAttack([1,2]);
  expect(g.shots[0]).toEqual({x:1,y:2,hit:false});
});

test("gameboard receiveAttack function (shot hitting)",() => {
  const g2 = gameboard();
  g2.addShip([[1,2],[1,3]]);
  g2.receiveAttack([1,2]);
  expect(g2.shots[0]).toEqual({x:1,y:2,hit:true});
  expect(g2.ships[0].hits).toBe(1);
});
