const a = [
  [null, "sdaw"],
  [3, "sdaw"],
  ["sdaw", 5],
  [null, "ssssssssdwd", 3],
];

const b = a.filter((aa) => aa[0] !== null && aa[1] !== null && aa[2] !== null);

console.log(b);

// dentro del objeto, habra un objeto mas por cadena

obj = {
  sand: {
    symbol: "SAND",
    1: {
      address: "0x...",
    },
    137: {
      address: "0x...",
    },
  },
  uni: {
    symbol: "UNI",
    1: {
      address: "0x...",
    },
    137: {
      address: "0x...",
    },
  },
};
