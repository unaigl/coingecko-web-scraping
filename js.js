const a = [
  [null, "sdaw"],
  [3, "sdaw"],
  ["sdaw", 5],
  [null, "ssssssssdwd", 3],
];

const b = a.filter((aa) => aa[0] !== null && aa[1] !== null && aa[2] !== null);

console.log(b);
