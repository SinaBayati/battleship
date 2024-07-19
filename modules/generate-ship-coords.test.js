import { generateShipCoords } from "./generate-ship-coords";

test("generateShipCoords",() => {
  expect(generateShipCoords(3,"v").length).toBe(3);
});