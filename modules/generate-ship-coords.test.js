import { generateShipCoords } from "./generate-ship-coords";

test("generateShipCoords",() => {
  expect(generateShipCoords(3).length).toBe(3);
});