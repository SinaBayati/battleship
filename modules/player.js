import { gameboard } from './gameboard';

export function player(name = "Computer"){
  return {
    gameboard: gameboard(),
    name,
  }
}