export function ship(length){
  let hits = 0;

  function isSunk(){
    return this.hits === this.length;
  }

  function hit(){
    this.hits += 1;
  }

  return {
    length,
    hits,
    isSunk,
    hit,
  }
}