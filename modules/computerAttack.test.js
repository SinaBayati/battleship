import { computerAttack } from './computerAttack';
import { player } from './player';

test("computerAttack function",() => {
  const humanPlayer = player("human");
  computerAttack(humanPlayer);
  computerAttack(humanPlayer);
  computerAttack(humanPlayer);
  expect(humanPlayer.gameboard.shots.length).toBe(3);
});