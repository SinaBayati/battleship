import { gameboard } from './gameboard';

export function player(name){
  return {
    gameboard: gameboard(),
    name,
  }
}