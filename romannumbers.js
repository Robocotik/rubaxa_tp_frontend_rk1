const romanToInt = roman => {
  const map = {I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000};
  let res = 0,
    prev = 0;
  for (let i = roman.length - 1; i >= 0; i--) {
    const curr = map[roman[i]];
    if (curr < prev) {
      res -= curr;
    } else {
      res += curr;
    }
    prev = curr;
  }
  return res;
};

const numberProxy = new Proxy(Number.prototype, {
  get(target, prop, receiver) {
    if (typeof prop === 'string' && /^[IVXLCDM]+$/.test(prop)) {
      const end = romanToInt(prop);
      const start = Number(receiver.valueOf());
      return Array.from({length: end - start}, (v, k) => k + start);
    }
    return Reflect.get(target, prop, receiver);
  },
});

Object.setPrototypeOf(Number.prototype, numberProxy);

console.log((0).V); // [0, 1, 2, 3, 4];
console.log((0).X); // [0, 1, 2, 3, 4, 5, 6];
console.log((1).V); // [1, 2, 3, 4];
