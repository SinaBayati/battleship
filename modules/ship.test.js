import { ship } from './ship';

test("ship length",() => {
  expect(ship(4).length).toBe(4);
  expect(ship(0).length).toBe(0);
});

test("ship hits property",() => {
  expect(ship(3).hits).toBe(0);
});

test("ship hit method",() => {
  const ship1 = ship(3);
  ship1.hit();
  ship1.hit();
  expect(ship1.hits).toBe(2);
});

test("ship isSunk method",() => {
  const ship2 = ship(2);
  ship2.hit();
  ship2.hit();
  expect(ship2.isSunk()).toBe(true);
});